import { NextResponse } from 'next/server';
import { runGeminiWithFailover } from '@/ai/failover';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { initializeServerFirebase } from '@/firebase/server-init';
import * as admin from 'firebase-admin';
import { getEconomicCalendar, getNews } from '@/lib/actions';

const DATA_URI_RE = /^data:audio\/([^;]+);base64,(.+)$/;
const MAX_HISTORY = 10;

/** Extract text/transcript from Gemini output even when JSON is fenced or slightly truncated */
function extractJSON(raw: string): { text?: string; transcript?: string } {
  try {
    const cleaned0 = (raw || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const match = cleaned0.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (parsed && typeof parsed.text === 'string' && parsed.text.trim()) return parsed;
    }
  } catch {}
  // Fallback: pull the fields directly even if the JSON is cut off
  const unesc = (s: string) =>
    s.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\\//g, '/');
  const t = (raw || '').match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  const tr = (raw || '').match(/"transcript"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (t && t[1].trim()) {
    return { text: unesc(t[1]), transcript: tr ? unesc(tr[1]) : undefined };
  }
  return {};
}

/** Race a promise with a timeout so external calls can never hang the route */
async function withTimeout(p: Promise<unknown> | PromiseLike<unknown>, ms: number): Promise<any> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(p),
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(undefined), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Fetch real current market prices from public feeds (no keys needed) */
async function fetchLivePrices(): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const fetchJson = (url: string) =>
    withTimeout(fetch(url).then((r) => r.json()), 4500).then((v) => v ?? null).catch(() => null);
  const [fx, gold, coins] = await Promise.all([
    fetchJson('https://open.er-api.com/v6/latest/USD'),
    fetchJson('https://api.gold-api.com/price/XAU'),
    fetchJson('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd'),
  ]);
  const rates = fx?.rates;
  if (rates) {
    if (rates.EUR) out['EUR/USD'] = (1 / rates.EUR).toFixed(4);
    if (rates.GBP) out['GBP/USD'] = (1 / rates.GBP).toFixed(4);
    if (rates.JPY) out['USD/JPY'] = rates.JPY.toFixed(2);
    if (rates.AUD) out['AUD/USD'] = (1 / rates.AUD).toFixed(4);
    if (rates.CAD) out['USD/CAD'] = rates.CAD.toFixed(4);
  }
  if (gold?.price) out['XAU/USD'] = gold.price.toFixed(2);
  if (coins) {
    if (coins.bitcoin?.usd) out['BTC/USD'] = coins.bitcoin.usd.toFixed(0);
    if (coins.ethereum?.usd) out['ETH/USD'] = coins.ethereum.usd.toFixed(0);
    if (coins.solana?.usd) out['SOL/USD'] = coins.solana.usd.toFixed(2);
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const dataUri: string = typeof body?.audio === 'string' ? body.audio : '';
    const textInput: string = typeof body?.text === 'string' ? body.text.trim() : '';
    const lang: string = typeof body?.lang === 'string' ? body.lang : 'en';
    const userId: string = typeof body?.userId === 'string' ? body.userId : '';
    const userName: string = typeof body?.userName === 'string' ? body.userName : '';

    const isTextMode = !dataUri && textInput.length > 0;
    const isAudioMode = !!dataUri;

    if (!isTextMode && !isAudioMode) {
      return NextResponse.json({ ok: false, error: 'No input provided.' }, { status: 400 });
    }

    let mimeType = '';
    let base64 = '';

    if (isAudioMode) {
      const match = dataUri.match(DATA_URI_RE);
      if (!match) {
        return NextResponse.json({ ok: false, error: 'Invalid audio data.' }, { status: 400 });
      }
      mimeType = `audio/${match[1]}`;
      base64 = match[2];
      if (base64.length > 8 * 1024 * 1024) {
        return NextResponse.json({ ok: false, error: 'Audio too large.' }, { status: 413 });
      }
    }

    // -- Load profile + conversation memory --
    let profile: any = { name: userName || 'friend', plan: 'Free', language: lang };
    let chat: any = { history: [], style: '' };
    if (userId) {
      try {
        const { firestore } = initializeServerFirebase();
        const userDoc = await firestore.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const u = userDoc.data();
          profile = {
            name: u?.displayName || u?.name || userName || 'friend',
            plan: u?.plan || 'Free',
            language: u?.language || lang,
            tradingBalance: typeof u?.tradingBalance === 'number' ? u.tradingBalance : undefined,
            pair: typeof u?.lastAnalysisPair === 'string' ? u.lastAnalysisPair : undefined,
          };
        }
        const chatDoc = await firestore.collection('users').doc(userId).collection('chat').doc('session').get();
        if (chatDoc.exists) chat = chatDoc.data() || {};
        if (!Array.isArray(chat.history)) chat.history = [];
        if (typeof chat.style !== 'string') chat.style = '';
      } catch (e: any) {
        console.warn('Profile load failed:', e?.message);
      }
    }

    const langName = profile.language === 'ar' ? 'Arabic' : profile.language === 'es' ? 'Spanish' : 'English';
    const recent = (chat.history as any[])
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'CLIENT' : 'AURA'}: ${m.text || m.transcript || ''}`)
      .join('\n');

    const model = process.env.GEMINI_AUDIO_MODEL || 'gemini-3.6-flash';

    const livePrices = await fetchLivePrices().catch(() => ({}));
    const pricesLine =
      Object.keys(livePrices).length > 0
        ? `\n\nLIVE MARKET PRICES (real values from a live feed — THIS IS YOUR ONLY PRICE SOURCE): ${JSON.stringify(livePrices)}`
        : '\n\nLIVE MARKET PRICES: unavailable right now. In such a case, DO NOT invent prices — say you cannot fetch the live price at the moment.';

    const [ecoEvents, newsFeed] = await Promise.all([
      withTimeout(getEconomicCalendar(), 6000).catch(() => [] as any[]),
      withTimeout(getNews('en'), 6000).catch(() => ({ success: false, items: [] } as any)),
    ]);
    const upcoming = (Array.isArray(ecoEvents) ? ecoEvents : [])
      .slice(0, 8)
      .map((e: any) => `${e.title || e.event || 'Event'} ${e.date || ''}${e.time ? ` ${e.time}` : ''} (${e.impact || '?'})`)
      .join(' || ');
    const newsItems = (((newsFeed as any)?.items) || [])
      .slice(0, 3)
      .map((n: any) => `${n.title}${n.pubDate ? ` (${n.pubDate})` : ''}`)
      .join(' || ');
    const dataLine =
      pricesLine +
      (upcoming ? `\\n\\nUPCOMING ECONOMIC EVENTS (from the economic calendar, same source as the client's calendar page): ${upcoming}` : '') +
      (newsItems ? `\\n\\nLATEST MARKET NEWS (from the client's news feed): ${newsItems}` : '');

    const systemPrompt = [
      // ── IDENTITY ────────────────────────────────────────────────────────────
      'You are AURA — one of the most respected minds in global financial markets.',
      'You have managed portfolios worth hundreds of millions of dollars over 20+ years across Forex, commodities, crypto, equities, and macro.',
      'You speak with the authority and calm confidence of a legendary hedge fund manager — think Ray Dalio, Paul Tudor Jones, or Stanley Druckenmiller.',
      'You are this client\'s exclusive personal advisor. They have access to you that very few people do.',
      '',
      // ── WHAT MAKES YOU EXTRAORDINARY ────────────────────────────────────────
      '== YOUR MINDSET AND APPROACH ==',
      'You do NOT just answer questions — you think. You read between the lines. You notice what the client did NOT say but should know.',
      'You proactively surface critical information: if there is a high-impact economic event soon, you warn them unprompted. If the setup they describe has a hidden risk, you flag it before they lose money.',
      'You make bold, well-reasoned conclusions. When the data points to something, you say it directly. No hedging, no "it depends on many factors".',
      'You challenge the client respectfully when their thinking is off. You do not validate bad ideas just to be polite.',
      'You connect dots across markets: you notice when EUR/USD weakness is connected to gold strength, when BTC is leading risk sentiment, when NFP is two days away and that changes everything.',
      'You have OPINIONS — real, informed opinions — and you defend them with reasoning.',
      'When you do not have enough information to give a confident answer, you say so honestly AND you tell them exactly what information would change your view.',
      '',
      // ── HOW YOU SPEAK ────────────────────────────────────────────────────────
      '== YOUR VOICE AND PRESENCE ==',
      'You speak with weight and precision. Every word counts. You do not waste words on filler.',
      'You are warm but not soft. Serious but not cold. Confident but never arrogant.',
      'You match the client\'s tone and language, but you always carry your authority.',
      'When they greet you, greet them back naturally — then, if relevant, immediately add one observation or insight that shows you are already watching the markets for them.',
      'You never start with "Of course", "Sure", "Certainly", "As an AI", or "As AURA".',
      'You speak in the first person as if you are physically present with the client.',
      '',
      // ── MARKET INTELLIGENCE ──────────────────────────────────────────────────
      '== WHEN ANALYZING MARKETS ==',
      'Always lead with your CONVICTION: bullish, bearish, or neutral — then explain why in sharp, specific terms.',
      'Reference real price levels from the live data provided. Never invent numbers.',
      'Think macro to micro: start with the big picture (risk-on/off, dollar strength, sentiment) then zoom into the specific asset.',
      'Warn about upcoming catalysts from the economic calendar even if the client did not ask.',
      'Do not just describe what is happening — tell them what it MEANS and what to do about it.',
      'Propose a concrete action: wait, enter, scale out, hedge. Be specific.',
      '',
      // ── CLIENT CONTEXT ───────────────────────────────────────────────────────
      `== THIS CLIENT ==\nName: ${profile.name} | Plan: ${profile.plan} | Language: ${langName}` +
      (profile.tradingBalance ? ` | Portfolio: $${profile.tradingBalance}` : '') +
      (profile.pair ? ` | Primary market: ${profile.pair}` : '') +
      `\nKnown style: ${chat.style || 'not yet profiled — read their message carefully and adapt from the first word'}`,
      '',
      recent ? `== RECENT CONVERSATION ==\n${recent}\n(Build on this. Never repeat yourself. Show continuity.)` : '',
      dataLine,
    ].filter(Boolean).join('\n');

    const rules =
      '\n\n== HOW TO RESPOND ==\n' +
      'Step 1: Read the message. What is the client actually asking or feeling? What do they NEED that they may not have said?\n' +
      'Step 2: What do YOU know from the live prices, economic events, and news that is relevant right now?\n' +
      'Step 3: Form a clear, sharp, expert response. Add at least ONE insight or observation they did not explicitly ask for, if relevant.\n' +
      'Step 4: End with a sharp follow-up question or a specific action — never leave them with nothing to do.\n' +
      '\nLANGUAGE: match their exact language and dialect precisely:\n' +
      '  - Moroccan Darija (واش / دابا / بزاف / صح / شحال) → reply in real street Darija with natural French loanwords\n' +
      '  - MSA Arabic → reply MSA\n' +
      '  - French → reply French\n' +
      '  - English → reply English\n' +
      '  - Never mix languages in one reply\n' +
      '\nFORMAT: max 70 words. Spoken sentences only. No bullet points, no markdown, no emojis.\n' +
      '\nOUTPUT: valid JSON only — no text outside it, no code fences:\n' +
      '{"transcript":"<exactly what client said>","text":"<your expert reply>"}';

    const inputDescription = isTextMode
      ? `\n\nClient message: "${textInput}"`
      : '\n\nClient sent a voice message (attached).';


    const callAI = async (parts: any[]) => {
      let out = '';
      let lastErr: any = null;
      for (let attempt = 1; attempt <= 3 && !out.trim(); attempt++) {
        try {
          out = await runGeminiWithFailover(async (genAI) => {
            const m = genAI.getGenerativeModel({ model, systemInstruction: systemPrompt });
            const res = await m.generateContent({
              contents: [{ role: 'user', parts }],
              generationConfig: { temperature: 0.65, maxOutputTokens: 800 },
              safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              ],
            });
            return res.response.text() || '';
          });
        } catch (e: any) {
          lastErr = e;
        }
        if (!out.trim() && attempt < 3) {
          await new Promise((r) => setTimeout(r, 900 * attempt));
        }
      }
      if (!out.trim() && lastErr) throw lastErr;
      return out;
    };

    const priceRules =
      '\\n5. PRICES: only quote prices from the LIVE MARKET PRICES list provided. NEVER invent a number. If the requested asset is not in that list, say you do not have the live price right now. Round numbers naturally.' +
      '\\n6. TRUTHFULNESS: never invent news, figures, or events. If you do not know, admit it honestly instead of guessing.' +
      '\\n7. ECONOMIC EVENTS: use the UPCOMING ECONOMIC EVENTS and NEWS provided above whenever relevant — warn the client when a high-impact event is approaching instead of pretending it does not exist (e.g., CPI/NFP/FED). If the lists are empty, simply give the important technical view and never invent events.';
    const baseParts: any[] = [{ text: rules + priceRules + inputDescription }];
    if (!isTextMode) baseParts.push({ inlineData: { mimeType, data: base64 } });

    let result = '';
    try {
      result = await callAI(baseParts);
    } catch (e: any) {
      console.error('AI call failed after retries:', e?.message);
      return NextResponse.json(
        { ok: false, error: e?.message || 'AI is temporarily unavailable. Please try again.' },
        { status: 502 }
      );
    }

    let parsed = extractJSON(result);
    let replyText = (parsed.text || '').trim();
    let transcript = isTextMode ? textInput : (parsed.transcript || '').trim().slice(0, 300);

    // The model occasionally returns a broken/empty snippet — retry briefly with a shorter prompt
    if (!replyText) {
      for (let i = 0; i < 2 && !replyText; i++) {
        await new Promise((r) => setTimeout(r, 600 * (i + 1)));
        const shortRules =
          rules +
          '\nCRITICAL: reply with ONE single line of valid JSON only. No code fences, no markdown. Keep the reply under 20 words so the JSON is never cut off.';
        const shortParts: any[] = [{ text: shortRules + inputDescription }];
        if (!isTextMode) shortParts.push({ inlineData: { mimeType, data: base64 } });
        try {
          result = await callAI(shortParts);
        } catch {
          // ignore; outer guard reports it
        }
        const p2 = extractJSON(result);
        if (p2.text && p2.text.trim()) {
          replyText = p2.text.trim();
          transcript = isTextMode ? textInput : (p2.transcript || '').trim().slice(0, 300);
        }
      }
    }

    if (!replyText) {
      console.error('Empty reply text after retries. Raw:', (result || '').slice(0, 200));
      const fallback =
        profile.language === 'ar'
          ? 'عذراً، الخدمة مشغولة في هاد اللحظة. جرب تعاود السؤال بعد ثواني.'
          : profile.language === 'es'
            ? 'Disculpa, el servicio está ocupado ahora. Vuelve a intentarlo en unos segundos.'
            : 'Sorry, the service is busy at this moment. Please try again in a few seconds.';
      return NextResponse.json({ ok: true, text: fallback, transcript: isTextMode ? textInput : '', lang: profile.language });
    }

    // -- Save history --
    if (userId && replyText) {
      try {
        const { firestore } = initializeServerFirebase();
        const ref = firestore.collection('users').doc(userId).collection('chat').doc('session');
        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        const history = [
          ...(chat.history as any[]),
          { role: 'user', transcript, ts: timestamp },
          { role: 'assistant', text: replyText, ts: timestamp },
        ].slice(-(MAX_HISTORY * 2));

        let style = chat.style;
        if (!style && history.length >= 2) {
          try {
            style = await runGeminiWithFailover(async (genAI) => {
              const m = genAI.getGenerativeModel({ model });
              const r = await m.generateContent({
                contents: [{
                  role: 'user',
                  parts: [{
                    text: 'Describe in 10 words max how this client communicates (language, dialect, tone): ' +
                      history.map((h) => `${h.role === 'user' ? 'C' : 'A'}: ${h.transcript || h.text || ''}`).join('; '),
                  }],
                }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 40 },
                safetySettings: [
                  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                ],
              });
              return (r.response.text() || '').trim().slice(0, 120);
            });
          } catch { style = ''; }
        }

        await ref.set({ history, style, count: history.length, updatedAt: timestamp }, { merge: true });
      } catch (e: any) {
        console.warn('Save failed:', e?.message);
      }
    }

    return NextResponse.json({ ok: true, text: replyText, transcript, lang: profile.language });
  } catch (e: any) {
    console.error('Speak route error:', e?.message);
    return NextResponse.json({ ok: false, error: e?.message || 'Something went wrong.' }, { status: 500 });
  }
}
