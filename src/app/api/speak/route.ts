import { NextResponse } from 'next/server';
import { runGeminiWithFailover } from '@/ai/failover';
import { HarmCategory, HarmBlockThreshold } from '@google/genai';
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

/** In-memory cache for live market data (30 min TTL) */
const dataCache: {
  prices: Record<string, string>;
  upcoming: string;
  news: string;
  ts: number;
} = { prices: {}, upcoming: '', news: '', ts: 0 };
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/** Fetch real current market prices from public feeds */
async function fetchLivePrices(): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const fetchJson = (url: string) =>
    withTimeout(fetch(url).then((r) => r.json()), 4000).then((v) => v ?? null).catch(() => null);
  const [fx, gold, coins] = await Promise.all([
    fetchJson('https://open.er-api.com/v6/latest/USD'),
    fetchJson('https://api.gold-api.com/price/XAU'),
    fetchJson('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'),
  ]);
  const rates = fx?.rates;
  if (rates) {
    if (rates.EUR) out['EUR/USD'] = (1 / rates.EUR).toFixed(4);
    if (rates.GBP) out['GBP/USD'] = (1 / rates.GBP).toFixed(4);
    if (rates.JPY) out['USD/JPY'] = rates.JPY.toFixed(2);
    if (rates.AUD) out['AUD/USD'] = (1 / rates.AUD).toFixed(4);
  }
  if (gold?.price) out['XAU/USD'] = gold.price.toFixed(2);
  if (coins) {
    if (coins.bitcoin?.usd) out['BTC/USD'] = coins.bitcoin.usd.toFixed(0);
    if (coins.ethereum?.usd) out['ETH/USD'] = coins.ethereum.usd.toFixed(0);
  }
  return out;
}

/** Refresh cache if stale, otherwise return cached data */
async function getLiveContext(): Promise<{ pricesLine: string; contextLine: string }> {
  const now = Date.now();
  if (now - dataCache.ts < CACHE_TTL && Object.keys(dataCache.prices).length > 0) {
    // Return cached
    return buildContextLines(dataCache.prices, dataCache.upcoming, dataCache.news);
  }

  const [prices, ecoEvents, newsFeed] = await Promise.all([
    fetchLivePrices().catch(() => ({} as Record<string, string>)),
    withTimeout(getEconomicCalendar(), 5000).catch(() => [] as any[]),
    withTimeout(getNews('en'), 5000).catch(() => ({ items: [] } as any)),
  ]);

  const upcoming = (Array.isArray(ecoEvents) ? ecoEvents : [])
    .slice(0, 5)
    .map((e: any) => `${e.title || e.event || ''} (${e.impact || '?'})`)
    .join(', ');
  const news = (((newsFeed as any)?.items) || [])
    .slice(0, 2)
    .map((n: any) => n.title || '')
    .join(' | ');

  // Update cache
  dataCache.prices = prices;
  dataCache.upcoming = upcoming;
  dataCache.news = news;
  dataCache.ts = now;

  return buildContextLines(prices, upcoming, news);
}

function buildContextLines(
  prices: Record<string, string>,
  upcoming: string,
  news: string
): { pricesLine: string; contextLine: string } {
  const pricesLine =
    Object.keys(prices).length > 0
      ? `PRICES: ${JSON.stringify(prices)}`
      : 'PRICES: unavailable — do not invent numbers.';
  const contextLine = [
    pricesLine,
    upcoming ? `UPCOMING EVENTS: ${upcoming}` : '',
    news ? `NEWS: ${news}` : '',
  ].filter(Boolean).join(' | ');
  return { pricesLine, contextLine };
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

    const model = process.env.GEMINI_AUDIO_MODEL || 'gemini-4-hydrogen';

    const { contextLine } = await getLiveContext().catch(() => ({ pricesLine: '', contextLine: 'PRICES: unavailable.' }));


    const systemPrompt =
      'You are AURA, an elite hedge fund manager and macro trader with 20+ years across Forex, crypto, commodities, and equities. ' +
      'You are this client\'s exclusive personal advisor — like Ray Dalio or Paul Tudor Jones speaking directly to them. ' +
      'You READ between the lines: you notice what they need even if they did not ask. You surface risks proactively. You give bold, well-reasoned opinions. You challenge bad ideas respectfully. You connect dots across markets. ' +
      'You NEVER give generic answers. Every reply shows mastery. ' +
      `Client: ${profile.name} | ${langName} | ${chat.style || 'adapt style from their message'}` +
      (profile.pair ? ` | Primary market: ${profile.pair}` : '') +
      (recent ? `\nRecent chat:\n${recent}` : '') +
      `\n\nLIVE DATA: ${contextLine}` +
      '\n\nBEHAVIOR: ' +
      'On greetings: reply warmly then add one sharp unprompted market observation. ' +
      'On vague messages: read the intent, ask ONE precise question. ' +
      'On market questions: lead with your conviction (bullish/bearish/neutral), cite real prices, warn about upcoming events. ' +
      'On bad ideas: challenge directly but constructively. ' +
      'Always end with either a specific action or a sharp follow-up question. ' +
      'Never start with "Of course", "Sure", "Certainly", or "As AURA". ' +
      'Speak in first person, as if physically present.';

    const rules =
      '\nLANGUAGE: match exactly — Moroccan Darija (واش/دابا/بزاف) → Darija, MSA → MSA, French → French, English → English. Never mix.' +
      '\nFORMAT: max 65 words, spoken sentences only, no bullets/markdown/emojis.' +
      '\nOUTPUT: valid JSON only, no text outside it: {"transcript":"<what client said>","text":"<your reply>"}';

    const inputDescription = isTextMode
      ? `\n\nClient: "${textInput}"`
      : '\nClient sent a voice message (attached).';



    const callAI = async (parts: any[]) => {
      let out = '';
      let lastErr: any = null;
      for (let attempt = 1; attempt <= 3 && !out.trim(); attempt++) {
        try {
          out = await runGeminiWithFailover(async (ai) => {
            const res = await ai.models.generateContent({
              model,
              contents: [{ role: 'user', parts }],
              config: {
                systemInstruction: systemPrompt,
                maxOutputTokens: 800,
                safetySettings: [
                  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                ],
              },
            });
            return res.text || '';
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
            style = await runGeminiWithFailover(async (ai) => {
              const r = await ai.models.generateContent({
                model,
                contents: [{
                  role: 'user',
                  parts: [{
                    text: 'Describe in 10 words max how this client communicates (language, dialect, tone): ' +
                      history.map((h) => `${h.role === 'user' ? 'C' : 'A'}: ${h.transcript || h.text || ''}`).join('; '),
                  }],
                }],
                config: {
                  maxOutputTokens: 40,
                  safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                  ],
                },
              });
              return (r.text || '').trim().slice(0, 120);
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
