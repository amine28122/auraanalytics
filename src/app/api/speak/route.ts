import { NextResponse } from 'next/server';
import { runGeminiWithFailover } from '@/ai/failover';
import { initializeServerFirebase } from '@/firebase/server-init';
import * as admin from 'firebase-admin';

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

/** Fetch real current market prices from public feeds (no keys needed) */
async function fetchLivePrices(): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  try {
    const [fx, gold, coins] = await Promise.allSettled([
      fetch('https://open.er-api.com/v6/latest/USD').then((r) => r.json()),
      fetch('https://api.gold-api.com/price/XAU').then((r) => r.json()),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd').then((r) => r.json()),
    ]);
    if (fx.status === 'fulfilled') {
      const rates = (fx.value as any)?.rates;
      if (rates) {
        if (rates.EUR) out['EUR/USD'] = (1 / rates.EUR).toFixed(4);
        if (rates.GBP) out['GBP/USD'] = (1 / rates.GBP).toFixed(4);
        if (rates.JPY) out['USD/JPY'] = rates.JPY.toFixed(2);
        if (rates.AUD) out['AUD/USD'] = (1 / rates.AUD).toFixed(4);
        if (rates.CAD) out['USD/CAD'] = rates.CAD.toFixed(4);
      }
    }
    if (gold.status === 'fulfilled' && (gold.value as any)?.price) {
      out['XAU/USD'] = (gold.value as any).price.toFixed(2);
    }
    if (coins.status === 'fulfilled' && (coins.value as any)) {
      const c = coins.value as any;
      if (c.bitcoin?.usd) out['BTC/USD'] = c.bitcoin.usd.toFixed(0);
      if (c.ethereum?.usd) out['ETH/USD'] = c.ethereum.usd.toFixed(0);
      if (c.solana?.usd) out['SOL/USD'] = c.solana.usd.toFixed(2);
    }
  } catch {}
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

    const systemPrompt =
      'You are AURA, an elite intraday trader and financial analyst with 15+ years across Forex, crypto, indices, and commodities. ' +
      'You are the personal AI trading advisor of this client. Speak like a trusted mentor who trades for a living. ' +
      'Be direct, confident, actionable. Use trader vocabulary naturally. Never say you cannot do something.' +
      `\n\nCLIENT: Name=${profile.name}, Plan=${profile.plan}, Language=${langName}` +
      (profile.tradingBalance ? `, Balance=$${profile.tradingBalance}` : '') +
      (profile.pair ? `, Favorite pair=${profile.pair}` : '') +
      `\nStyle: ${chat.style || 'unknown yet'}` +
      `\n\nRECENT HISTORY:\n${recent || '(none)'}` +
      pricesLine;

    const rules =
      '\n\nRULES (follow exactly):' +
      '\n1. Detect and match the exact language/dialect of the client. Moroccan Darija -> reply in Darija. MSA -> MSA. French -> French. Never mix.' +
      '\n2. Reply in the SAME language/dialect. Zero exceptions.' +
      '\n3. Max 50 words. No markdown, no lists, no emojis. Plain spoken sentences only.' +
      '\n4. Give real trader insights: trend, key level, bias, action tip. Be specific and sharp.' +
      '\n\nYou MUST respond with valid JSON only, nothing else. Format:\n{"transcript":"<what client said>","text":"<your reply>"}';

    const inputDescription = isTextMode
      ? `\n\nClient text message: "${textInput}"`
      : '\n\nClient sent a voice message (audio attached).';

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
      '\\n6. TRUTHFULNESS: never invent news, figures, or events. If you do not know, admit it honestly instead of guessing.';
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
      console.error('Empty reply text. Raw result:', result.slice(0, 200));
      return NextResponse.json({ ok: false, error: 'Empty response from AI.' }, { status: 500 });
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
