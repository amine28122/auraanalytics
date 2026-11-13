import { NextResponse } from 'next/server';
import { runGeminiWithFailover } from '@/ai/failover';
import { HarmCategory, HarmBlockThreshold } from '@google/genai';
import { initializeServerFirebase } from '@/firebase/server-init';
import * as admin from 'firebase-admin';
import { getEconomicCalendar, getNews } from '@/lib/actions';

// Accepts data:audio/webm;codecs=opus;base64,... as well as standard data:audio/wav;base64,...
const DATA_URI_RE = /^data:(audio\/[a-zA-Z0-9.+_-]+)(?:;[^,]*)?;base64,(.+)$/i;
const MAX_HISTORY = 25;

function normalizeAudioMime(rawMime: string): string {
  const lower = rawMime.toLowerCase().trim();
  if (lower === 'audio/x-m4a' || lower === 'audio/m4a') return 'audio/mp4';
  if (lower === 'audio/x-wav' || lower === 'audio/wave') return 'audio/wav';
  return lower;
}

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
async function withTimeout<T>(p: Promise<T> | PromiseLike<T>, ms: number): Promise<T | undefined> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(p),
      new Promise<undefined>((resolve) => {
        timer = setTimeout(() => resolve(undefined), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Verify Bearer ID token when provided, falling back safely to supplied userId */
async function resolveAuthorizedUserId(req: Request, fallbackUserId: string): Promise<string> {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) {
      try {
        const { app } = initializeServerFirebase();
        const decoded = await admin.auth(app).verifyIdToken(token);
        if (decoded?.uid) return decoded.uid;
      } catch (err: any) {
        console.warn('Speak auth token verify skipped:', err?.message);
      }
    }
  }
  return (fallbackUserId || '').trim();
}

/** Generate natural WAV voice audio using Gemini 3.8 Flash Lite TTS */
async function synthesizeSpeechWav(text: string): Promise<string | undefined> {
  const cleanText = (text || '').trim();
  if (!cleanText) return undefined;

  try {
    const base64Audio = await withTimeout(
      runGeminiWithFailover(async (ai) => {
        const ttsRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText,
                  speechMetadata: {
                    style: 'Warm, confident, articulate female macro trader and financial advisor speaking naturally',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });
        return ttsRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      }),
      15000
    );

    if (typeof base64Audio === 'string' && base64Audio.length > 0) {
      return `data:audio/wav;base64,${base64Audio}`;
    }
  } catch (err: any) {
    console.warn('TTS synthesis failed, client will use browser speech fallback:', err?.message);
  }
  return undefined;
}

/** In-memory cache for live market data (30 min TTL) */
const dataCache: {
  prices: Record<string, string>;
  upcoming: string;
  news: string;
  ts: number;
} = { prices: {}, upcoming: '', news: '', ts: 0 };
const CACHE_TTL = 30 * 60 * 1000;

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

/** Refresh cache if stale, otherwise return cached data */
async function getLiveContext(): Promise<{ pricesLine: string; contextLine: string }> {
  const now = Date.now();
  if (now - dataCache.ts < CACHE_TTL && Object.keys(dataCache.prices).length > 0) {
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

  dataCache.prices = prices;
  dataCache.upcoming = upcoming;
  dataCache.news = news;
  dataCache.ts = now;

  return buildContextLines(prices, upcoming, news);
}

/** Load persisted chat history for the authenticated user */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const paramUid = url.searchParams.get('userId') || '';
    const userId = await resolveAuthorizedUserId(req, paramUid);

    if (!userId) {
      return NextResponse.json({ ok: true, history: [] });
    }

    const { firestore } = initializeServerFirebase();
    const chatDoc = await firestore.collection('users').doc(userId).collection('chat').doc('session').get();
    if (!chatDoc.exists) {
      return NextResponse.json({ ok: true, history: [] });
    }

    const rawHistory = Array.isArray(chatDoc.data()?.history) ? chatDoc.data()?.history : [];
    const history = rawHistory.map((item: any) => {
      const role = item?.role === 'user' ? 'user' : 'ai';
      const ts =
        typeof item?.ts === 'string'
          ? item.ts
          : item?.ts?.toDate
            ? item.ts.toDate().toISOString()
            : undefined;
      if (role === 'user') {
        const textVal = typeof item?.text === 'string' ? item.text : '';
        const transcriptVal = typeof item?.transcript === 'string' ? item.transcript : '';
        return {
          role: 'user',
          text: textVal || transcriptVal,
          transcript: item?.hasAudio && transcriptVal ? transcriptVal : undefined,
          hasAudio: Boolean(item?.hasAudio),
          ts,
        };
      }
      return {
        role: 'ai',
        text: typeof item?.text === 'string' ? item.text : '',
        ts,
      };
    }).filter((m: any) => (m.text && m.text.trim()) || (m.transcript && m.transcript.trim()));

    return NextResponse.json({ ok: true, history });
  } catch (e: any) {
    console.error('Speak GET error:', e?.message);
    return NextResponse.json({ ok: false, error: e?.message || 'Failed to load chat history.' }, { status: 500 });
  }
}

/** Clear saved chat session */
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const paramUid = url.searchParams.get('userId') || '';
    const userId = await resolveAuthorizedUserId(req, paramUid);

    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Missing user session.' }, { status: 400 });
    }

    const { firestore } = initializeServerFirebase();
    await firestore.collection('users').doc(userId).collection('chat').doc('session').set(
      { history: [], count: 0, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Speak DELETE error:', e?.message);
    return NextResponse.json({ ok: false, error: e?.message || 'Failed to clear chat.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    // On-demand TTS mode (e.g. replaying older messages loaded from Firestore history)
    if (body?.ttsOnly === true && typeof body?.text === 'string' && body.text.trim()) {
      const ttsAudioUri = await synthesizeSpeechWav(body.text.trim());
      return NextResponse.json({ ok: true, ttsAudioUri });
    }

    const dataUri: string = typeof body?.audio === 'string' ? body.audio : '';
    const textInput: string = typeof body?.text === 'string' ? body.text.trim() : '';
    const lang: string = typeof body?.lang === 'string' ? body.lang : 'en';
    const userId: string = await resolveAuthorizedUserId(req, typeof body?.userId === 'string' ? body.userId : '');
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
        return NextResponse.json({ ok: false, error: 'Invalid audio data format.' }, { status: 400 });
      }
      mimeType = normalizeAudioMime(match[1]);
      base64 = match[2];
      if (!base64 || base64.length < 100) {
        return NextResponse.json({ ok: false, error: 'Recorded audio is empty.' }, { status: 400 });
      }
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

    // -- Step 1: If audio was sent, transcribe accurately via gemini-3.5-transcribe --
    let preTranscript = '';
    if (isAudioMode) {
      try {
        const transcribed = await withTimeout(
          runGeminiWithFailover(async (ai) => {
            const trRes = await ai.models.generateContent({
              model: 'gemini-3.5-transcribe',
              contents: {
                parts: [
                  { inlineData: { mimeType, data: base64 } },
                  {
                    text: 'Transcribe this audio accurately in its original spoken language (Arabic, Moroccan Darija, English, French, or Spanish). Return ONLY the exact spoken words.',
                  },
                ],
              },
            });
            return (trRes.text || '').trim();
          }),
          12000
        );
        if (typeof transcribed === 'string' && transcribed.trim()) {
          preTranscript = transcribed.trim();
        }
      } catch (trErr: any) {
        console.warn('Dedicated audio transcription fallback to multimodal:', trErr?.message);
      }
    }

    const langName = profile.language === 'ar' ? 'Arabic' : profile.language === 'es' ? 'Spanish' : 'English';
    const recent = (chat.history as any[])
      .slice(-8)
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
      '\nLANGUAGE: match the client message language/dialect — Moroccan Darija -> Darija, Arabic -> Arabic, French -> French, Spanish -> Spanish, English -> English. Never mix unless the client mixes.' +
      '\nFORMAT: max 65 words, natural spoken sentences only, no bullet points, no markdown, no emojis.' +
      '\nOUTPUT: valid JSON only, no text outside it: {"transcript":"<what client said>","text":"<your reply>"}';

    const inputDescription = isTextMode
      ? `\n\nClient: "${textInput}"`
      : preTranscript
        ? `\n\nClient voice message transcript: "${preTranscript}" (audio also attached for tone/confirmation).`
        : '\nClient sent a voice message (attached). Transcribe what they said and reply naturally.';

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
                maxOutputTokens: 1024,
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
          await new Promise((r) => setTimeout(r, 700 * attempt));
        }
      }
      if (!out.trim() && lastErr) throw lastErr;
      return out;
    };

    const priceRules =
      '\nPRICES RULE: only quote prices from the LIVE DATA list provided above. NEVER invent a number. If the requested asset is not in that list, say you do not have the live price right now.' +
      '\nTRUTHFULNESS RULE: never invent news, figures, or events.' +
      '\nEVENTS RULE: warn the client when an upcoming high-impact event is relevant.';

    const baseParts: any[] = [{ text: rules + priceRules + inputDescription }];
    if (isAudioMode) {
      baseParts.push({ inlineData: { mimeType, data: base64 } });
    }

    let result = '';
    try {
      result = await callAI(baseParts);
    } catch (e: any) {
      console.error('AI call failed after retries:', e?.message);
      // If multimodal audio inlineData caused an issue on retry, fall back cleanly using preTranscript if available
      if (isAudioMode && preTranscript) {
        try {
          result = await callAI([{ text: rules + priceRules + `\n\nClient: "${preTranscript}"` }]);
        } catch {}
      }
      if (!result) {
        return NextResponse.json(
          { ok: false, error: e?.message || 'AI is temporarily unavailable. Please try again.' },
          { status: 502 }
        );
      }
    }

    const parsed = extractJSON(result);
    let replyText = (parsed.text || '').trim();
    let transcript = isTextMode
      ? textInput
      : (parsed.transcript || preTranscript || '').trim().slice(0, 400);

    // Retry briefly if the model returned non-JSON or empty text
    if (!replyText) {
      for (let i = 0; i < 2 && !replyText; i++) {
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
        const shortRules =
          rules +
          '\nCRITICAL: reply with ONE single line of valid JSON only. No code fences, no markdown. Keep the reply under 35 words.';
        const shortParts: any[] = [{ text: shortRules + inputDescription }];
        if (isAudioMode && !preTranscript) shortParts.push({ inlineData: { mimeType, data: base64 } });
        try {
          result = await callAI(shortParts);
        } catch {}
        const p2 = extractJSON(result);
        if (p2.text && p2.text.trim()) {
          replyText = p2.text.trim();
          transcript = isTextMode ? textInput : (p2.transcript || preTranscript || '').trim().slice(0, 400);
        }
      }
    }

    if (!replyText) {
      console.error('Empty reply text after retries. Raw:', (result || '').slice(0, 200));
      const fallback =
        profile.language === 'ar'
          ? 'عذراً، الخدمة مشغولة في هذه اللحظة. حاول إعادة إرسال سؤالك بعد ثوانٍ.'
          : profile.language === 'es'
            ? 'Disculpa, el servicio está ocupado ahora. Vuelve a intentarlo en unos segundos.'
            : 'Sorry, the service is busy at this moment. Please try again in a few seconds.';
      const ttsAudioUri = await synthesizeSpeechWav(fallback);
      return NextResponse.json({
        ok: true,
        text: fallback,
        transcript: isTextMode ? textInput : preTranscript,
        lang: profile.language,
        ttsAudioUri,
      });
    }

    // -- Step 2 & 3 in parallel: Generate natural voice audio (WAV) AND save chat history --
    const savePromise = (async (): Promise<boolean> => {
      if (!userId || !replyText) return false;
      try {
        const { firestore } = initializeServerFirebase();
        const ref = firestore.collection('users').doc(userId).collection('chat').doc('session');
        const nowIso = new Date().toISOString();

        // NOTE: Firestore does NOT allow FieldValue.serverTimestamp() inside arrays.
        // Using ISO strings inside history items prevents silent save failures.
        const history = [
          ...(chat.history as any[]),
          {
            role: 'user',
            text: isTextMode ? textInput : '',
            transcript,
            hasAudio: isAudioMode,
            ts: nowIso,
          },
          {
            role: 'assistant',
            text: replyText,
            ts: nowIso,
          },
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
                      history.slice(-6).map((h) => `${h.role === 'user' ? 'C' : 'A'}: ${h.transcript || h.text || ''}`).join('; '),
                  }],
                }],
                config: {
                  maxOutputTokens: 60,
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
          } catch {
            style = '';
          }
        }

        await ref.set(
          {
            history,
            style,
            count: history.length,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        return true;
      } catch (e: any) {
        console.warn('Speak history save failed:', e?.message);
        return false;
      }
    })();

    const [ttsAudioUri, saved] = await Promise.all([
      synthesizeSpeechWav(replyText),
      savePromise,
    ]);

    return NextResponse.json({
      ok: true,
      text: replyText,
      transcript,
      lang: profile.language,
      ttsAudioUri,
      saved,
    });
  } catch (e: any) {
    console.error('Speak route error:', e?.message);
    return NextResponse.json({ ok: false, error: e?.message || 'Something went wrong.' }, { status: 500 });
  }
}
