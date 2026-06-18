import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { lang } = await req.json();
    const language = lang === 'ar' ? 'Arabic' : lang === 'es' ? 'Spanish' : 'English';

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are AURA, an institutional trading analyst. Today is ${today}.

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

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON found');

    const setups = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ setups });
  } catch (error) {
    console.error('Top setups error:', error);
    return NextResponse.json(
      { error: 'Failed to generate setups' },
      { status: 500 }
    );
  }
}
