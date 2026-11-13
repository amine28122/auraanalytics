import { NextResponse } from 'next/server';
import { runGeminiWithFailover } from '@/ai/failover';
import { HarmCategory, HarmBlockThreshold } from '@google/genai';
import { initializeServerFirebase } from '@/firebase/server-init';
import * as admin from 'firebase-admin';
import { getEconomicCalendar, getNews } from '@/lib/actions';

// Accepts data:audio/webm;codecs=opus;base64,... as well as standard data:audio/wav;base64,...
const AUDIO_DATA_URI_RE = /^data:(audio\/[a-zA-Z0-9.+_-]+)(?:;[^,]*)?;base64,(.+)$/i;
const IMAGE_DATA_URI_RE = /^data:(image\/(?:png|jpeg|jpg|webp|gif))(?:;[^,]*)?;base64,(.+)$/i;
const MAX_HISTORY = 25;

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

/** Strip markdown symbols so TTS reads numbers & sentences cleanly */
function cleanTextForSpeech(text: string): string {
  return (text || '')
    .replace(/[*_`#|>]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 750);
}

/** Generate natural WAV voice audio using Gemini 3.8 Flash Lite TTS */
async function synthesizeSpeechWav(text: string): Promise<string | undefined> {
  const cleanText = cleanTextForSpeech(text);
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
                    style: 'Warm, confident, articulate female institutional trader speaking clearly with precise numbers',
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
      18000
    );

    if (typeof base64Audio === 'string' && base64Audio.length > 0) {
      return `data:audio/wav;base64,${base64Audio}`;
    }
  } catch (err: any) {
    console.warn('TTS synthesis failed, client will use browser speech fallback:', err?.message);
  }
  return undefined;
}

/** In-memory cache for live market data (2 min TTL for fresh numerical accuracy) */
const dataCache: {
  prices: Record<string, string>;
  upcoming: string;
  news: string;
  ts: number;
} = { prices: {}, upcoming: '', news: '', ts: 0 };
const CACHE_TTL = 2 * 60 * 1000;

/** Fetch comprehensive real current market prices & daily % changes */
async function fetchLivePrices(): Promise<Record<string, string>> {
  const out: Record<string, string> = {};

  const yahooTickers = [
    { key: 'DXY', ticker: 'DX-Y.NYB', dec: 2 },
    { key: 'EUR/USD', ticker: 'EURUSD=X', dec: 4 },
    { key: 'GBP/USD', ticker: 'GBPUSD=X', dec: 4 },
    { key: 'USD/JPY', ticker: 'USDJPY=X', dec: 2 },
    { key: 'AUD/USD', ticker: 'AUDUSD=X', dec: 4 },
    { key: 'USD/CAD', ticker: 'USDCAD=X', dec: 4 },
    { key: 'XAU/USD (Gold)', ticker: 'GC=F', dec: 2 },
    { key: 'XAG/USD (Silver)', ticker: 'SI=F', dec: 2 },
    { key: 'WTI Oil', ticker: 'CL=F', dec: 2 },
    { key: 'S&P 500', ticker: '^GSPC', dec: 2 },
    { key: 'NASDAQ', ticker: '^IXIC', dec: 2 },
    { key: 'US30 (Dow)', ticker: '^DJI', dec: 2 },
    { key: 'US10Y Yield %', ticker: '^TNX', dec: 3 },
    { key: 'BTC/USD', ticker: 'BTC-USD', dec: 0 },
    { key: 'ETH/USD', ticker: 'ETH-USD', dec: 0 },
    { key: 'SOL/USD', ticker: 'SOL-USD', dec: 2 },
  ];

  await Promise.all(
    yahooTickers.map(async (item) => {
      try {
        const res = await withTimeout(
          fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(item.ticker)}?interval=1d&range=2d`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
          ),
          3500
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
          const hi = typeof meta?.regularMarketDayHigh === 'number' ? meta.regularMarketDayHigh.toFixed(item.dec) : null;
          const lo = typeof meta?.regularMarketDayLow === 'number' ? meta.regularMarketDayLow.toFixed(item.dec) : null;
          out[item.key] = `${cur.toFixed(item.dec)}${pct !== null ? ` (${Number(pct) >= 0 ? '+' : ''}${pct}%)` : ''}${hi && lo ? ` [L:${lo} H:${hi}]` : ''}`;
        }
      } catch {}
    })
  );

  // Backup public spot feeds if Yahoo misses FX/Gold/BTC
  if (!out['XAU/USD (Gold)'] || !out['EUR/USD'] || !out['BTC/USD']) {
    const fetchJson = (url: string) =>
      withTimeout(fetch(url).then((r) => r.json()), 3500).then((v) => v ?? null).catch(() => null);
    const [fx, gold, coins] = await Promise.all([
      !out['EUR/USD'] ? fetchJson('https://open.er-api.com/v6/latest/USD') : null,
      !out['XAU/USD (Gold)'] ? fetchJson('https://api.gold-api.com/price/XAU') : null,
      !out['BTC/USD'] ? fetchJson('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd') : null,
    ]);
    const rates = fx?.rates;
    if (rates) {
      if (rates.EUR && !out['EUR/USD']) out['EUR/USD'] = (1 / rates.EUR).toFixed(4);
      if (rates.GBP && !out['GBP/USD']) out['GBP/USD'] = (1 / rates.GBP).toFixed(4);
      if (rates.JPY && !out['USD/JPY']) out['USD/JPY'] = rates.JPY.toFixed(2);
      if (rates.AUD && !out['AUD/USD']) out['AUD/USD'] = (1 / rates.AUD).toFixed(4);
    }
    if (gold?.price && !out['XAU/USD (Gold)']) out['XAU/USD (Gold)'] = gold.price.toFixed(2);
    if (coins) {
      if (coins.bitcoin?.usd && !out['BTC/USD']) out['BTC/USD'] = coins.bitcoin.usd.toFixed(0);
      if (coins.ethereum?.usd && !out['ETH/USD']) out['ETH/USD'] = coins.ethereum.usd.toFixed(0);
    }
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
      ? `LIVE PRICES & RANGES: ${JSON.stringify(prices)}`
      : 'PRICES: unavailable — do not invent live quotes.';
  const contextLine = [
    pricesLine,
    upcoming ? `UPCOMING ECONOMIC EVENTS: ${upcoming}` : '',
    news ? `NEWS HEADLINES: ${news}` : '',
  ].filter(Boolean).join(' | ');
  return { pricesLine, contextLine };
}

async function getLiveContext(): Promise<{ pricesLine: string; contextLine: string }> {
  const now = Date.now();
  if (now - dataCache.ts < CACHE_TTL && Object.keys(dataCache.prices).length > 0) {
    return buildContextLines(dataCache.prices, dataCache.upcoming, dataCache.news);
  }

  const [prices, ecoEvents, newsFeed] = await Promise.all([
    fetchLivePrices().catch(() => ({} as Record<string, string>)),
    withTimeout(getEconomicCalendar(), 4500).catch(() => [] as any[]),
    withTimeout(getNews('en'), 4500).catch(() => ({ items: [] } as any)),
  ]);

  const upcoming = (Array.isArray(ecoEvents) ? ecoEvents : [])
    .slice(0, 6)
    .map((e: any) => `${e.title || e.event || ''} (${e.currency || ''} - ${e.impact || '?'})`)
    .join(', ');
  const news = (((newsFeed as any)?.items) || [])
    .slice(0, 3)
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

    // On-demand TTS mode (e.g. replaying older messages loaded from Firestore history)
    if (body?.ttsOnly === true && typeof body?.text === 'string' && body.text.trim()) {
      const ttsAudioUri = await synthesizeSpeechWav(body.text.trim());
      return NextResponse.json({ ok: true, ttsAudioUri });
    }

    const audioUri: string = typeof body?.audio === 'string' ? body.audio : '';
    const imageUri: string = typeof body?.image === 'string' ? body.image : '';
    const textInput: string = typeof body?.text === 'string' ? body.text.trim() : '';
    const lang: string = typeof body?.lang === 'string' ? body.lang : 'en';
    const userId: string = await resolveAuthorizedUserId(req, typeof body?.userId === 'string' ? body.userId : '');
    const userName: string = typeof body?.userName === 'string' ? body.userName : '';

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
            tradingBalance:
              typeof u?.tradingBalance === 'number'
                ? u.tradingBalance
                : typeof u?.simulatorBalance === 'number'
                  ? u.simulatorBalance
                  : undefined,
            pair: typeof u?.lastAnalysisPair === 'string' ? u.lastAnalysisPair : undefined,
            schools: Array.isArray(u?.preferredAnalysisSchools) ? u.preferredAnalysisSchools : undefined,
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
                  { inlineData: { mimeType: audioMimeType, data: audioBase64 } },
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

    const { contextLine } = await getLiveContext().catch(() => ({
      pricesLine: '',
      contextLine: 'PRICES: unavailable.',
    }));

    const accountRiskInfo =
      typeof profile.tradingBalance === 'number' && profile.tradingBalance > 0
        ? ` | Client Account Balance: $${profile.tradingBalance.toLocaleString()} (1% risk = $${(profile.tradingBalance * 0.01).toFixed(2)})`
        : '';

    const schoolsInfo =
      profile.schools?.length ? ` | Preferred Schools: ${profile.schools.join(', ')}` : ' | Methodology: Institutional SMC/ICT, Market Structure, Liquidity & Price Action';

    const systemPrompt =
      'You are AURA, an elite institutional hedge fund trader and macro strategist with 20+ years across Forex, Gold, Indices, Oil, Bonds, and Crypto. ' +
      'You answer EVERY question with precision, institutional logic, and CONCRETE NUMBERS (exact prices, % moves, key support/resistance levels, ATR/ranges, risk-reward ratios, lot/risk math when balance is known). Never give vague or generic answers. ' +
      `Client: ${profile.name} | Preferred Language: ${langName} | Style: ${chat.style || 'adapt naturally to client dialect/language'}` +
      accountRiskInfo +
      schoolsInfo +
      (profile.pair ? ` | Primary market: ${profile.pair}` : '') +
      (recent ? `\nRecent conversation:\n${recent}` : '') +
      `\n\nLIVE MARKET CONTEXT: ${contextLine}` +
      '\n\nCORE RULES:' +
      '\n1. NUMBERS FIRST: Always quantify your answer with real numbers — current prices, daily highs/lows, % changes, exact key levels, targets, stops, and probabilities.' +
      '\n2. NO HALLUCINATION: For general market questions without a chart image, only cite live prices from LIVE MARKET CONTEXT. When a CHART IMAGE is attached, read the symbol, timeframe, candles, and exact price-axis numbers directly from the screenshot!' +
      '\n3. CHART ANALYSIS & TRADE SETUPS: Whenever the user attaches a chart screenshot OR asks for a trade setup ("صفقة", "trade", "setup", "تحليل", etc.):' +
      '   - Read the visible price axis carefully and extract exact Entry, Stop Loss, TP1, TP2, TP3, and Risk:Reward.' +
      '   - Fill the `tradeSetup` JSON object accurately.' +
      '   - In `text`, write a structured, professional analysis explaining: (a) Market Bias & Structure (BOS/CHoCH/Trend), (b) Liquidity & Institutional Zones (OB/FVG/S&R), (c) Exact Trade Parameters (Entry, SL, TPs, R:R, and 1% risk sizing if balance is available), and (d) Invalidation/Risk scenario.' +
      '\n4. LANGUAGE MATCH: Reply in the EXACT language/dialect of the client message (Arabic MSA -> professional Arabic, Moroccan Darija -> clear Darija with technical terms, English -> English, French -> French, Spanish -> Spanish).' +
      '\n5. SPOKEN SUMMARY (`spokenSummary`): Also write a clean 40-65 word spoken version of your core conclusion and key numbers with NO bullet points, NO asterisks, NO markdown symbols so it sounds completely natural when read aloud by voice!';

    const jsonSchemaInstructions =
      '\n\nOUTPUT STRICT VALID JSON ONLY (no text outside JSON):' +
      '\n{"transcript":"<transcribed words if client sent audio, else empty string>","text":"<complete professional numerical explanation in clean plain text with line breaks, no markdown hashtags/asterisks>","spokenSummary":"<40-65 words natural spoken summary reading the key numbers and conclusion aloud>","tradeSetup":null}' +
      '\nIf a chart screenshot is attached OR the client asks for a trade setup, replace `"tradeSetup":null` with:' +
      '\n{"symbol":"XAU/USD","timeframe":"M15","direction":"BUY","entry":"2650.50","stopLoss":"2642.00","takeProfits":["2665.00","2678.00"],"riskReward":"1 : 2.8","confidence":84,"setupType":"Liquidity Sweep + FVG"}';

    const effectiveTextRequest =
      textInput ||
      (isImageMode && !isAudioMode
        ? (profile.language === 'ar'
            ? 'حلل هذا الشارت بدقة وأعطني صفقة مكتوبة باحترافية مع الأرقام الكاملة (الدخول، وقف الخسارة، الأهداف، نسبة العائد للمخاطرة) والشرح المفصل.'
            : 'Analyze this chart screenshot thoroughly and give me a professional trade setup with exact numbers (Entry, Stop Loss, TPs, Risk:Reward) and full explanation.')
        : '');

    const inputDescription = isImageMode
      ? `\n\nClient sent a CHART SCREENSHOT (attached).` +
        (effectiveTextRequest ? `\nClient written message: "${effectiveTextRequest}"` : '') +
        (preTranscript ? `\nClient spoken voice message: "${preTranscript}"` : '')
      : isTextMode
        ? `\n\nClient question: "${textInput}"`
        : preTranscript
          ? `\n\nClient spoken voice message: "${preTranscript}" (audio attached).`
          : '\nClient sent a voice message (attached). Transcribe what they said and reply thoroughly with exact numbers.';

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
                maxOutputTokens: 2048,
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

    const baseParts: any[] = [{ text: jsonSchemaInstructions + inputDescription }];
    if (isImageMode) {
      baseParts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });
    }
    if (isAudioMode) {
      baseParts.push({ inlineData: { mimeType: audioMimeType, data: audioBase64 } });
    }

    let result = '';
    try {
      result = await callAI(baseParts);
    } catch (e: any) {
      console.error('AI call failed after retries:', e?.message);
      if (isAudioMode && preTranscript) {
        const fallbackParts: any[] = [{ text: jsonSchemaInstructions + inputDescription }];
        if (isImageMode) fallbackParts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });
        try {
          result = await callAI(fallbackParts);
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
    let spokenSummary = (parsed.spokenSummary || '').trim();
    let tradeSetup = parsed.tradeSetup;
    let transcript = isTextMode
      ? textInput
      : (parsed.transcript || preTranscript || '').trim().slice(0, 400);

    // Retry briefly if output wasn't valid JSON
    if (!replyText) {
      for (let i = 0; i < 2 && !replyText; i++) {
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
        const retryParts: any[] = [
          {
            text:
              jsonSchemaInstructions +
              '\nCRITICAL: Respond with ONE valid JSON object only. No code fences.' +
              inputDescription,
          },
        ];
        if (isImageMode) retryParts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });
        if (isAudioMode && !preTranscript) retryParts.push({ inlineData: { mimeType: audioMimeType, data: audioBase64 } });
        try {
          result = await callAI(retryParts);
        } catch {}
        const p2 = extractJSON(result);
        if (p2.text && p2.text.trim()) {
          replyText = p2.text.trim();
          spokenSummary = (p2.spokenSummary || '').trim();
          tradeSetup = p2.tradeSetup || tradeSetup;
          transcript = isTextMode ? textInput : (p2.transcript || preTranscript || '').trim().slice(0, 400);
        }
      }
    }

    if (!replyText) {
      console.error('Empty reply text after retries. Raw:', (result || '').slice(0, 200));
      const fallback =
        profile.language === 'ar'
          ? 'عذراً، الخدمة مشغولة في هذه اللحظة. حاول إعادة إرسال طلبك بعد ثوانٍ.'
          : profile.language === 'es'
            ? 'Disculpa, el servicio está ocupado ahora. Vuelve a intentarlo en unos segundos.'
            : 'Sorry, the service is busy at this moment. Please try again in a few seconds.';
      const ttsAudioUri = await synthesizeSpeechWav(fallback);
      return NextResponse.json({
        ok: true,
        text: fallback,
        spokenSummary: fallback,
        transcript: isTextMode ? textInput : preTranscript,
        lang: profile.language,
        ttsAudioUri,
      });
    }

    const speechTarget = spokenSummary || replyText;

    // -- Step 2 & 3 in parallel: Generate natural voice audio (WAV) AND save chat history --
    const savePromise = (async (): Promise<boolean> => {
      if (!userId || !replyText) return false;
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
      synthesizeSpeechWav(speechTarget),
      savePromise,
    ]);

    return NextResponse.json({
      ok: true,
      text: replyText,
      spokenSummary: speechTarget,
      tradeSetup,
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
