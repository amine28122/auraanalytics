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

    const prompt = `You are AURA, a professional institutional market analyst. Today is ${today}.

Generate a concise, professional morning market briefing in ${language}. 

Structure your response with:
1. One opening line about overall market sentiment (bullish/bearish/mixed)
2. 3-4 bullet points covering: DXY (US Dollar), Gold (XAU/USD), EUR/USD or GBP/USD, and one crypto insight
3. One closing strategic insight

Keep it under 150 words total. Use professional trading terminology (ICT, SMC, institutional flow, liquidity, etc.). 
Do NOT use markdown headers, just plain text with bullet points using •.
Write in ${language} only.`;

    const result = await model.generateContent(prompt);
    const brief = result.response.text();

    return NextResponse.json({ brief });
  } catch (error) {
    console.error('Morning intel error:', error);
    return NextResponse.json(
      { error: 'Failed to generate briefing' },
      { status: 500 }
    );
  }
}
