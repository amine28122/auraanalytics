import { NextResponse } from 'next/server';
import { runGeminiWithFailover } from '@/ai/failover';
import { HarmCategory, HarmBlockThreshold, ThinkingLevel } from '@google/genai';
import { initializeServerFirebase } from '@/firebase/server-init';
import * as admin from 'firebase-admin';
import { getEconomicCalendar, getNews } from '@/lib/actions';

// Accepts data:audio/webm;codecs=opus;base64,..., data:audio/wav;base64,..., etc.
const AUDIO_DATA_URI_RE = /^data:(audio\/[a-zA-Z0-9.+_-]+)(?:;[^,]*)?;base64,(.+)$/i;
const IMAGE_DATA_URI_RE = /^data:(image\/(?:png|jpeg|jpg|webp|gif))(?:;[^,]*)?;base64,(.+)$/i;
const MAX_HISTORY = 25;

// Cost-optimized models:
// - Chat/Vision: gemini-3.1-flash-lite (ultra-fast, lowest token usage)
// - Audio transcription: gemini-3.5-transcribe (accurate & low cost)
// - Voice reply (TTS): gemini-3.8-flash-tts (flagship human voice, with flash-lite fallback)
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-3.1-flash-lite';
const CHAT_FALLBACK_MODEL = 'gemini-4-hydrogen';
const TRANSCRIBE_MODEL = 'gemini-3.5-transcribe';
const TTS_MODELS = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];

export type AuraTradeSetup = {
  symbol: string;
  timeframe: string;
  direction: 'BUY' | 'SELL' | 'WAIT';
  entry: string;
  stopLoss: string;
  takeProfits: string[];
  riskReward: string;
  confidence: number;
  setupType?: string;
};

function normalizeAudioMime(rawMime: string): string {
  const lower = rawMime.toLowerCase().trim();
  if (lower === 'audio/x-m4a' || lower === 'audio/m4a') return 'audio/mp4';
  if (lower === 'audio/x-wav' || lower === 'audio/wave') return 'audio/wav';
  return lower;
}

function formatFriendlyAiError(err: any, lang: string): string {
  const msg = String(err?.message || err || '');
  if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('GEMINI_API_KEY is not set')) {
    return lang === 'ar'
      ? 'مفتاح Gemini API غير صالح أو غير مضبوط في إعدادات السيرفر (Settings > Secrets).'
      : 'Gemini API key is invalid or not set in server Secrets.';
  }
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.toLowerCase().includes('quota')) {
    return lang === 'ar'
      ? 'تم تجاوز حد الطلبات مؤقتاً (Quota). انتظر لحظة وحاول مجدداً.'
      : 'Rate limit reached temporarily. Please wait a moment and try again.';
  }
  return msg || (lang === 'ar' ? 'حدث خطأ مؤقت في الذكاء الاصطناعي.' : 'AI is temporarily unavailable.');
}

function normalizeTradeSetup(rawSetup: any): AuraTradeSetup | undefined {
  if (!rawSetup || typeof rawSetup !== 'object') return undefined;
  const dirUpper = String(rawSetup.direction || '').toUpperCase().trim();
  const direction: 'BUY' | 'SELL' | 'WAIT' =
    dirUpper.includes('BUY') || dirUpper.includes('LONG')
      ? 'BUY'
      : dirUpper.includes('SELL') || dirUpper.includes('SHORT')
        ? 'SELL'
        : 'WAIT';

  const entry = String(rawSetup.entry || '').trim();
  const stopLoss = String(rawSetup.stopLoss || '').trim();
  const symbol = String(rawSetup.symbol || '').trim();
  if (!symbol && !entry && !stopLoss) return undefined;

  const takeProfits = Array.isArray(rawSetup.takeProfits)
    ? rawSetup.takeProfits.map((tp: any) => String(tp).trim()).filter(Boolean).slice(0, 4)
    : [];

  const confNum = Number(rawSetup.confidence);
  const confidence = Number.isFinite(confNum) ? Math.min(99, Math.max(10, Math.round(confNum))) : 75;

  return {
    symbol: symbol || 'Chart Asset',
    timeframe: String(rawSetup.timeframe || 'Chart').trim(),
    direction,
    entry: entry || 'Market / Zone',
    stopLoss: stopLoss || 'In Chart Structure',
    takeProfits,
    riskReward: String(rawSetup.riskReward || '1 : 2+').trim(),
    confidence,
    setupType: rawSetup.setupType ? String(rawSetup.setupType).trim() : undefined,
  };
}

/** Extract JSON fields from Gemini output even when wrapped in fences */
function extractJSON(raw: string): {
  text?: string;
  spokenSummary?: string;
  transcript?: string;
  tradeSetup?: AuraTradeSetup;
} {
  try {
    const cleaned0 = (raw || '')
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const match = cleaned0.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (parsed && typeof parsed.text === 'string' && parsed.text.trim()) {
        return {
          text: parsed.text.trim(),
          spokenSummary: typeof parsed.spokenSummary === 'string' ? parsed.spokenSummary.trim() : undefined,
          transcript: typeof parsed.transcript === 'string' ? parsed.transcript.trim() : undefined,
          tradeSetup: normalizeTradeSetup(parsed.tradeSetup),
        };
      }
    }
  } catch {}

  const unesc = (s: string) =>
    s.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\\//g, '/');
  const t = (raw || '').match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  const sp = (raw || '').match(/"spokenSummary"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  const tr = (raw || '').match(/"transcript"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (t && t[1].trim()) {
    return {
      text: unesc(t[1]),
      spokenSummary: sp && sp[1].trim() ? unesc(sp[1]) : undefined,
      transcript: tr ? unesc(tr[1]) : undefined,
    };
  }
  // If model returned plain readable prose without JSON braces, use it directly
  const plain = (raw || '').trim();
  if (plain && !plain.startsWith('{') && plain.length > 5) {
    return { text: plain };
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

/** Clean text for natural human speech pronunciation without symbols or robotic acronyms */
function cleanTextForSpeech(text: string): string {
  return (text || '')
    .replace(/[*_`#|>]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\bXAU\/USD\b/gi, 'Gold')
    .replace(/\bEUR\/USD\b/gi, 'Euro Dollar')
    .replace(/\bGBP\/USD\b/gi, 'Pound Dollar')
    .replace(/\bUSD\/JPY\b/gi, 'Dollar Yen')
    .replace(/\bBTC\/USD\b/gi, 'Bitcoin')
    .replace(/\bETH\/USD\b/gi, 'Ethereum')
    .replace(/\bR:R\b/gi, 'Risk to Reward')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);
}

/** Detect dominant language for voice style guidance */
function detectSpeechLang(text: string, hintLang?: string): 'ar' | 'es' | 'en' {
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (hintLang === 'es') return 'es';
  if (hintLang === 'ar') return 'ar';
  return 'en';
}

/** Generate natural human WAV voice audio using flagship Gemini 3.8 Flash TTS (with Lite TTS fallback) */
async function synthesizeSpeechWav(
  text: string,
  hintLang?: string
): Promise<{ audioUri?: string; error?: string }> {
  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) return {};

  const detected = detectSpeechLang(cleanText, hintLang);
  const styleInstruction =
    detected === 'ar'
      ? 'Natural, warm, expressive human Arabic female voice speaking fluently with clear pronunciation, smooth pacing, and calm confidence'
      : detected === 'es'
        ? 'Natural, warm, expressive human Spanish female voice speaking fluently and conversationally with calm confidence'
        : 'Natural, warm, expressive human English female voice speaking smoothly and conversationally with calm confidence';

  let lastErrMsg = '';

  for (const ttsModel of TTS_MODELS) {
    try {
      const base64Audio = await withTimeout(
        runGeminiWithFailover(async (ai) => {
          const ttsRes = await ai.models.generateContent({
            model: ttsModel,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: cleanText,
                    speechMetadata: {
                      style: styleInstruction,
                    },
                  },
                ],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Zephyr' },
                },
              },
            },
          });
          return ttsRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        }),
        14000
      );

      if (typeof base64Audio === 'string' && base64Audio.length > 0) {
        return { audioUri: `data:audio/wav;base64,${base64Audio}` };
      }
    } catch (err: any) {
      lastErrMsg = err?.message || String(err);
      console.warn(`TTS synthesis failed on ${ttsModel}:`, lastErrMsg);
    }
  }

  return { error: lastErrMsg || undefined };
}

/** In-memory cache for live market data (2 min fresh TTL, 10 min stale-while-revalidate) */
const dataCache: {
  prices: Record<string, string>;
  upcoming: string;
  news: string;
  ts: number;
  refreshing: boolean;
} = { prices: {}, upcoming: '', news: '', ts: 0, refreshing: false };
const CACHE_TTL = 2 * 60 * 1000;
const STALE_TTL = 10 * 60 * 1000;

/** Fetch real current market prices & daily % changes */
async function fetchLivePrices(): Promise<Record<string, string>> {
  const out: Record<string, string> = {};

  const yahooTickers = [
    { key: 'DXY', ticker: 'DX-Y.NYB', dec: 2 },
    { key: 'EUR/USD', ticker: 'EURUSD=X', dec: 4 },
    { key: 'GBP/USD', ticker: 'GBPUSD=X', dec: 4 },
    { key: 'USD/JPY', ticker: 'USDJPY=X', dec: 2 },
    { key: 'XAU/USD', ticker: 'GC=F', dec: 2 },
    { key: 'WTI', ticker: 'CL=F', dec: 2 },
    { key: 'SPX', ticker: '^GSPC', dec: 2 },
    { key: 'NDX', ticker: '^IXIC', dec: 2 },
    { key: 'US10Y', ticker: '^TNX', dec: 2 },
    { key: 'BTC', ticker: 'BTC-USD', dec: 0 },
    { key: 'ETH', ticker: 'ETH-USD', dec: 0 },
  ];

  await Promise.all(
    yahooTickers.map(async (item) => {
      try {
        const res = await withTimeout(
          fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(item.ticker)}?interval=1d&range=2d`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
          ),
          1800
        );
        if (!res || !res.ok) return;
        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        const cur = meta?.regularMarketPrice;
        const prev = meta?.chartPreviousClose ?? meta?.previousClose;
        if (typeof cur === 'number' && !Number.isNaN(cur)) {
          const pct =
            typeof prev === 'number' && prev > 0
              ? (((cur - prev) / prev) * 100).toFixed(2)
              : null;
          out[item.key] = `${cur.toFixed(item.dec)}${pct !== null ? ` (${Number(pct) >= 0 ? '+' : ''}${pct}%)` : ''}`;
        }
      } catch {}
    })
  );

  return out;
}

function buildContextLines(
  prices: Record<string, string>,
  upcoming: string,
  news: string
): { pricesLine: string; contextLine: string } {
  const pricesLine =
    Object.keys(prices).length > 0
      ? `LIVE PRICES: ${JSON.stringify(prices)}`
      : 'PRICES: unavailable.';
  const contextLine = [
    pricesLine,
    upcoming ? `EVENTS: ${upcoming}` : '',
    news ? `NEWS: ${news}` : '',
  ].filter(Boolean).join(' | ');
  return { pricesLine, contextLine };
}

async function refreshLiveCacheNow() {
  if (dataCache.refreshing) return;
  dataCache.refreshing = true;
  try {
    const [prices, ecoEvents, newsFeed] = await Promise.all([
      fetchLivePrices().catch(() => ({} as Record<string, string>)),
      withTimeout(getEconomicCalendar(), 2000).catch(() => [] as any[]),
      withTimeout(getNews('en'), 2000).catch(() => ({ items: [] } as any)),
    ]);

    const upcoming = (Array.isArray(ecoEvents) ? ecoEvents : [])
      .slice(0, 4)
      .map((e: any) => `${e.title || e.event || ''}(${e.impact || '?'})`)
      .join(', ');
    const news = (((newsFeed as any)?.items) || [])
      .slice(0, 2)
      .map((n: any) => n.title || '')
      .join(' | ');

    if (Object.keys(prices).length > 0) dataCache.prices = prices;
    if (upcoming) dataCache.upcoming = upcoming;
    if (news) dataCache.news = news;
    dataCache.ts = Date.now();
  } finally {
    dataCache.refreshing = false;
  }
}

async function getLiveContext(): Promise<{ pricesLine: string; contextLine: string }> {
  const age = Date.now() - dataCache.ts;
  const hasPrices = Object.keys(dataCache.prices).length > 0;

  if (hasPrices && age < CACHE_TTL) {
    return buildContextLines(dataCache.prices, dataCache.upcoming, dataCache.news);
  }
  if (hasPrices && age < STALE_TTL) {
    void refreshLiveCacheNow();
    return buildContextLines(dataCache.prices, dataCache.upcoming, dataCache.news);
  }
  await withTimeout(refreshLiveCacheNow(), 2000);
  return buildContextLines(dataCache.prices, dataCache.upcoming, dataCache.news);
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
          hasImage: Boolean(item?.hasImage),
          ts,
        };
      }
      return {
        role: 'ai',
        text: typeof item?.text === 'string' ? item.text : '',
        spokenSummary: typeof item?.spokenSummary === 'string' ? item.spokenSummary : undefined,
        tradeSetup: normalizeTradeSetup(item?.tradeSetup),
        ts,
      };
    }).filter((m: any) => (m.text && m.text.trim()) || (m.transcript && m.transcript.trim()) || m.tradeSetup || m.hasImage);

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

    // Dedicated flagship TTS endpoint (called asynchronously after text appears)
    if (body?.ttsOnly === true && typeof body?.text === 'string' && body.text.trim()) {
      const hintLang = typeof body?.lang === 'string' ? body.lang : undefined;
      const { audioUri, error } = await synthesizeSpeechWav(body.text.trim(), hintLang);
      return NextResponse.json({ ok: true, ttsAudioUri: audioUri, ttsError: error });
    }

    const audioUri: string = typeof body?.audio === 'string' ? body.audio : '';
    const imageUri: string = typeof body?.image === 'string' ? body.image : '';
    const textInput: string = typeof body?.text === 'string' ? body.text.trim() : '';
    const lang: string = typeof body?.lang === 'string' ? body.lang : 'en';
    const userName: string = typeof body?.userName === 'string' ? body.userName : '';
    const rawUserId: string = typeof body?.userId === 'string' ? body.userId : '';

    const isAudioMode = !!audioUri;
    const isImageMode = !!imageUri;
    const isTextMode = textInput.length > 0;

    if (!isTextMode && !isAudioMode && !isImageMode) {
      return NextResponse.json({ ok: false, error: 'No input provided.' }, { status: 400 });
    }

    let audioMimeType = '';
    let audioBase64 = '';
    if (isAudioMode) {
      const match = audioUri.match(AUDIO_DATA_URI_RE);
      if (!match) {
        return NextResponse.json({ ok: false, error: 'Invalid audio data format.' }, { status: 400 });
      }
      audioMimeType = normalizeAudioMime(match[1]);
      audioBase64 = match[2];
      if (!audioBase64 || audioBase64.length < 100) {
        return NextResponse.json({ ok: false, error: 'Recorded audio is empty.' }, { status: 400 });
      }
      if (audioBase64.length > 8 * 1024 * 1024) {
        return NextResponse.json({ ok: false, error: 'Audio too large.' }, { status: 413 });
      }
    }

    let imageMimeType = '';
    let imageBase64 = '';
    if (isImageMode) {
      const match = imageUri.match(IMAGE_DATA_URI_RE);
      if (!match) {
        return NextResponse.json({ ok: false, error: 'Invalid chart image format.' }, { status: 400 });
      }
      imageMimeType = match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase();
      imageBase64 = match[2];
      if (imageBase64.length > 8 * 1024 * 1024) {
        return NextResponse.json({ ok: false, error: 'Image too large.' }, { status: 413 });
      }
    }

    const userId = await resolveAuthorizedUserId(req, rawUserId);

    const profilePromise = (async () => {
      let profile: any = { name: userName || 'friend', plan: 'Free', language: lang };
      let chat: any = { history: [] };
      if (!userId) return { profile, chat };
      try {
        const { firestore } = initializeServerFirebase();
        const [userDoc, chatDoc] = await Promise.all([
          firestore.collection('users').doc(userId).get(),
          firestore.collection('users').doc(userId).collection('chat').doc('session').get(),
        ]);
        if (userDoc.exists) {
          const u = userDoc.data();
          profile = {
            name: u?.displayName || u?.name || userName || 'friend',
            plan: u?.plan || 'Free',
            language: u?.language || lang,
            tradingBalance:
              typeof u?.tradingBalance === 'number'
                ? u.tradingBalance
                : typeof u?.simulatorBalance === 'number'
                  ? u.simulatorBalance
                  : undefined,
            pair: typeof u?.lastAnalysisPair === 'string' ? u.lastAnalysisPair : undefined,
          };
        }
        if (chatDoc.exists) chat = chatDoc.data() || {};
        if (!Array.isArray(chat.history)) chat.history = [];
      } catch (e: any) {
        console.warn('Profile load failed:', e?.message);
      }
      return { profile, chat };
    })();

    // Run profile load, live market data, AND lightweight audio transcription IN PARALLEL!
    const transcribePromise = isAudioMode
      ? withTimeout(
          runGeminiWithFailover(async (ai) => {
            const trRes = await ai.models.generateContent({
              model: TRANSCRIBE_MODEL,
              contents: {
                parts: [
                  { inlineData: { mimeType: audioMimeType, data: audioBase64 } },
                  { text: 'Transcribe this audio accurately in its original language (Arabic, Darija, English, French, or Spanish). Return ONLY the spoken words.' },
                ],
              },
            });
            return (trRes.text || '').trim();
          }),
          10000
        ).catch((trErr: any) => {
          console.warn('Transcribe step error:', trErr?.message);
          return '';
        })
      : Promise.resolve('');

    const [{ profile, chat }, { contextLine }, preTranscript] = await Promise.all([
      profilePromise,
      getLiveContext().catch(() => ({ pricesLine: '', contextLine: 'PRICES: unavailable.' })),
      transcribePromise,
    ]);

    const langName = profile.language === 'ar' ? 'Arabic' : profile.language === 'es' ? 'Spanish' : 'English';
    const recent = (chat.history as any[])
      .slice(-4)
      .map((m) => `${m.role === 'user' ? 'C' : 'A'}: ${String(m.text || m.transcript || '').slice(0, 180)}`)
      .join('\n');

    const accountRiskInfo =
      typeof profile.tradingBalance === 'number' && profile.tradingBalance > 0
        ? ` | Bal: $${profile.tradingBalance} (1%=$${(profile.tradingBalance * 0.01).toFixed(1)})`
        : '';

    // Compact token-efficient system prompt
    const systemPrompt =
      `You are AURA, an elite macro & technical trader. Give decisive numerical answers (prices, %, S/R levels, SL/TP, R:R). ` +
      `Client: ${profile.name} (${langName}${accountRiskInfo}). ` +
      `${contextLine}` +
      (recent ? `\nRecent:\n${recent}` : '') +
      `\nRules: 1) Always cite exact numbers. 2) If a chart screenshot is attached or user requests a trade setup, fill tradeSetup using chart price-axis numbers & explain Structure, Liquidity/Zones, SL/TP, R:R. ` +
      `3) Match client language/dialect strictly. 4) spokenSummary: 25-40 natural spoken words with NO English letters/symbols inside Arabic (write "الذهب","الدخول","وقف الخسارة","الهدف الأول" instead of XAU/USD/SL/TP1) so TTS sounds 100% human.`;

    const jsonSchemaInstructions =
      'Output valid JSON only: {"transcript":"<spoken words if audio else empty>","text":"<professional numerical reply, plain text>","spokenSummary":"<25-40 natural spoken words, no symbols/markdown>","tradeSetup":null}' +
      '\nIf chart attached or trade requested, set tradeSetup:{"symbol":"XAU/USD","timeframe":"M15","direction":"BUY|SELL|WAIT","entry":"...","stopLoss":"...","takeProfits":["...","..."],"riskReward":"1 : 2.5","confidence":84,"setupType":"..."}';

    const effectiveTextRequest =
      textInput ||
      preTranscript ||
      (isImageMode
        ? (profile.language === 'ar'
            ? 'حلل الشارت وأعطني صفقة احترافية بالأرقام مع الشرح.'
            : 'Analyze this chart and give a professional trade setup with exact numbers and explanation.')
        : '');

    const inputDescription = isImageMode
      ? `\nChart attached.${effectiveTextRequest ? ` Request: "${effectiveTextRequest}"` : ''}`
      : `\nRequest: "${effectiveTextRequest}"`;

    // Use cost-efficient gemini-3.1-flash-lite (MINIMAL thinking for instant low-token text, LOW thinking for chart vision)
    // Automatically fallback to CHAT_FALLBACK_MODEL if needed
    const runChatModel = async (targetModel: string, parts: any[], includeAudioInline: boolean) => {
      const modelParts = includeAudioInline
        ? [...parts, { inlineData: { mimeType: audioMimeType, data: audioBase64 } }]
        : parts;

      const isLite = targetModel.includes('lite');
      const thinkingLevel = isImageMode
        ? ThinkingLevel.LOW
        : isLite
          ? ThinkingLevel.MINIMAL
          : ThinkingLevel.LOW;

      return runGeminiWithFailover(async (ai) => {
        const res = await ai.models.generateContent({
          model: targetModel,
          contents: [{ role: 'user', parts: modelParts }],
          config: {
            systemInstruction: systemPrompt,
            thinkingConfig: { thinkingLevel },
            maxOutputTokens: 900,
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
    };

    const baseParts: any[] = [{ text: jsonSchemaInstructions + inputDescription }];
    if (isImageMode) {
      baseParts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });
    }

    // Only attach raw audio to chat model if dedicated transcription came back empty
    const needsInlineAudio = isAudioMode && !preTranscript;

    let result = '';
    let lastError: any = null;
    try {
      result = await runChatModel(CHAT_MODEL, baseParts, needsInlineAudio);
    } catch (e1: any) {
      lastError = e1;
      console.warn(`Primary model ${CHAT_MODEL} failed, trying fallback:`, e1?.message);
      try {
        result = await runChatModel(CHAT_FALLBACK_MODEL, baseParts, needsInlineAudio);
      } catch (e2: any) {
        lastError = e2;
      }
    }

    if (!result.trim()) {
      return NextResponse.json(
        { ok: false, error: formatFriendlyAiError(lastError, profile.language) },
        { status: 502 }
      );
    }

    const parsed = extractJSON(result);
    const replyText = (parsed.text || '').trim();
    const spokenSummary = (parsed.spokenSummary || '').trim();
    const tradeSetup = parsed.tradeSetup;
    const transcript = isTextMode
      ? textInput
      : (preTranscript || parsed.transcript || '').trim().slice(0, 400);

    if (!replyText) {
      const fallback =
        profile.language === 'ar'
          ? 'عذراً، تعذر فهم الرسالة. حاول التحدث بوضوح أو إرسال طلبك نصياً.'
          : 'Sorry, could not understand clearly. Please speak clearly or try typing.';
      return NextResponse.json({
        ok: true,
        text: fallback,
        spokenSummary: fallback,
        transcript: isTextMode ? textInput : transcript,
        lang: profile.language,
      });
    }

    const speechTarget = spokenSummary || replyText;

    let saved = false;
    if (userId && replyText) {
      try {
        const { firestore } = initializeServerFirebase();
        const ref = firestore.collection('users').doc(userId).collection('chat').doc('session');
        const nowIso = new Date().toISOString();

        const history = [
          ...(chat.history as any[]),
          {
            role: 'user',
            text: isTextMode ? textInput : isImageMode && !isAudioMode ? 'Chart Screenshot Analysis' : '',
            transcript,
            hasAudio: isAudioMode,
            hasImage: isImageMode,
            ts: nowIso,
          },
          {
            role: 'assistant',
            text: replyText,
            spokenSummary: speechTarget,
            ...(tradeSetup ? { tradeSetup } : {}),
            ts: nowIso,
          },
        ].slice(-(MAX_HISTORY * 2));

        await ref.set(
          {
            history,
            count: history.length,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        saved = true;
      } catch (e: any) {
        console.warn('Speak history save failed:', e?.message);
      }
    }

    return NextResponse.json({
      ok: true,
      text: replyText,
      spokenSummary: speechTarget,
      tradeSetup,
      transcript,
      lang: profile.language,
      saved,
    });
  } catch (e: any) {
    console.error('Speak route error:', e?.message);
    return NextResponse.json({ ok: false, error: formatFriendlyAiError(e, 'en') }, { status: 500 });
  }
}
