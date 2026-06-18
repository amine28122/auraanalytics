import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeServerFirebase } from '@/firebase/server-init';

const mockSetups: Record<string, any[]> = {
  English: [
    {
      pair: "EUR/USD",
      type: "BUY",
      confidence: 85,
      entry: "1.0842",
      tp: "1.0920",
      sl: "1.0800",
      school: "ICT",
      reason: "SMC order block mitigation at 4H support with bullish shift."
    },
    {
      pair: "XAU/USD",
      type: "SELL",
      confidence: 78,
      entry: "2345.50",
      tp: "2320.00",
      sl: "2358.00",
      school: "SMC",
      reason: "Liquidity sweep at previous daily high followed by market structure shift."
    },
    {
      pair: "BTC/USD",
      type: "BUY",
      confidence: 92,
      entry: "65200",
      tp: "68500",
      sl: "64100",
      school: "Price Action",
      reason: "Clear breakout and retest of the descending wedge on high volume."
    }
  ],
  Arabic: [
    {
      pair: "EUR/USD",
      type: "BUY",
      confidence: 85,
      entry: "1.0842",
      tp: "1.0920",
      sl: "1.0800",
      school: "ICT",
      reason: "تخفيف كتلة الطلب SMC عند دعم 4 ساعات مع تحول صعودي."
    },
    {
      pair: "XAU/USD",
      type: "SELL",
      confidence: 78,
      entry: "2345.50",
      tp: "2320.00",
      sl: "2358.00",
      school: "SMC",
      reason: "سحب السيولة عند القمة اليومية السابقة متبوعاً بتحول في هيكل السوق."
    },
    {
      pair: "BTC/USD",
      type: "BUY",
      confidence: 92,
      entry: "65200",
      tp: "68500",
      sl: "64100",
      school: "Price Action",
      reason: "اختراق واضح وإعادة اختبار للوتد الهابط مع حجم تداول مرتفع."
    }
  ],
  Spanish: [
    {
      pair: "EUR/USD",
      type: "BUY",
      confidence: 85,
      entry: "1.0842",
      tp: "1.0920",
      sl: "1.0800",
      school: "ICT",
      reason: "Mitigación del bloque de orden SMC en soporte de 4H con cambio alcista."
    },
    {
      pair: "XAU/USD",
      type: "SELL",
      confidence: 78,
      entry: "2345.50",
      tp: "2320.00",
      sl: "2358.00",
      school: "SMC",
      reason: "Toma de liquidez en el máximo diario anterior seguido de un cambio estructural."
    },
    {
      pair: "BTC/USD",
      type: "BUY",
      confidence: 92,
      entry: "65200",
      tp: "68500",
      sl: "64100",
      school: "Price Action",
      reason: "Ruptura clara y retesteo de cuña descendente con alto volumen."
    }
  ]
};

export async function POST(req: Request) {
  try {
    const { lang } = await req.json();
    const language = lang === 'ar' ? 'Arabic' : lang === 'es' ? 'Spanish' : 'English';

    const todayDate = new Date();
    const dateStr = todayDate.toISOString().split('T')[0];
    const docId = `${dateStr}_${lang || 'en'}`;

    // 1. Check Firestore Cache
    let cachedSetups = null;
    let firestoreInstance = null;
    try {
      const { firestore } = initializeServerFirebase();
      firestoreInstance = firestore;
      if (firestore) {
        const cacheDoc = await firestore.collection('top_setups_cache').doc(docId).get();
        if (cacheDoc.exists) {
          cachedSetups = cacheDoc.data()?.setups;
          console.log(`[Top Setups] Loaded from cache for ${docId}`);
        }
      }
    } catch (fsError) {
      console.warn('[Top Setups] Firestore error, trying fallback to API directly:', fsError);
    }

    if (cachedSetups) {
      return NextResponse.json({ setups: cachedSetups });
    }

    // 2. Generate or fallback to Mock
    let setups = [];
    const API_KEY = process.env.GEMINI_API_KEY;

    if (API_KEY) {
      try {
        const todayText = todayDate.toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are AURA, an institutional trading analyst. Today is ${todayText}.

Generate exactly 3 trading setups for today in ${language}. Each setup should be based on realistic technical analysis using ICT/SMC concepts.

Return ONLY valid JSON array, no markdown, no explanation:

[
  {
    "pair": "EUR/USD",
    "type": "BUY",
    "confidence": 88,
    "entry": "1.0842",
    "tp": "1.0920",
    "sl": "1.0800",
    "school": "ICT",
    "reason": "Brief reason in ${language} (max 20 words)"
  }
]

Rules:
- Use realistic current-market price ranges (EUR/USD ~1.08, GBP/USD ~1.27, XAU/USD ~2300-2400, BTC ~60000-70000)
- confidence must be between 65-95
- Include: one Forex pair, Gold (XAU/USD), and one other (BTC, GBP, JPY, etc.)
- Schools: ICT, SMC, Elliott Wave, Fibonacci, or Price Action
- reason field must be in ${language}
- type must be exactly "BUY" or "SELL"
- Return ONLY the JSON array, nothing else`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('No JSON found');
        setups = JSON.parse(jsonMatch[0]);
      } catch (geminiError) {
        console.error('[Top Setups] Gemini generation failed:', geminiError);
        setups = mockSetups[language] || mockSetups.English;
      }
    } else {
      console.log('[Top Setups] No GEMINI_API_KEY found, using professional fallback');
      setups = mockSetups[language] || mockSetups.English;
    }

    // 3. Save to cache
    if (firestoreInstance && setups && setups.length > 0) {
      try {
        await firestoreInstance.collection('top_setups_cache').doc(docId).set({
          setups,
          createdAt: new Date(),
          dateStr,
          lang: lang || 'en'
        });
        console.log(`[Top Setups] Cached setups in Firestore for ${docId}`);
      } catch (cacheError) {
        console.error('[Top Setups] Failed to write to cache:', cacheError);
      }
    }

    return NextResponse.json({ setups });
  } catch (error) {
    console.error('Top setups error:', error);
    return NextResponse.json(
      { error: 'Failed to generate setups' },
      { status: 500 }
    );
  }
}
