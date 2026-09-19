import { NextResponse } from 'next/server';
import { runGeminiWithFailover } from '@/ai/failover';

const DATA_URI_RE = /^data:audio\/([^;]+);base64,(.+)$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const dataUri: string = typeof body?.audio === 'string' ? body.audio : '';
    const lang: string = typeof body?.lang === 'string' ? body.lang : 'en';

    const match = dataUri.match(DATA_URI_RE);
    if (!match) {
      return NextResponse.json({ ok: false, error: 'Invalid audio data.' }, { status: 400 });
    }

    const mimeType = `audio/${match[1]}`;
    const base64 = match[2];

    if (base64.length > 8 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: 'Audio is too large (keep it under ~2 minutes).' }, { status: 413 });
    }

    const model = process.env.GEMINI_AUDIO_MODEL || 'gemini-3.1-flash-lite';
    const langName = lang === 'ar' ? 'Arabic' : lang === 'es' ? 'Spanish' : 'English';

    const systemPrompt =
      'You are AURA, the friendly voice assistant of AURA Analytics, a financial market intelligence platform. ' +
      'A user just spoke to you in a voice message. They may speak ANY language or dialect — including Moroccan Darija, Modern Standard Arabic, French, English or Spanish. ' +
      'STEP 1: Listen carefully to the audio and detect the EXACT language/dialect they used. ' +
      `STEP 2: Reply in THAT SAME language/dialect — always match them. Only if you truly cannot detect the language, fall back to ${langName}. ` +
      'Reply conversationally as if speaking out loud: short, natural, spoken-style, MAXIMUM 40 words, NO markdown, NO bullet lists, NO emojis. ' +
      'If they ask about markets or trading, give a concise, practical and useful answer. Otherwise answer briefly, warmly and helpfully.';

    const result = await runGeminiWithFailover(async (genAI) => {
      const modelInstance = genAI.getGenerativeModel({ model });
      const res = await modelInstance.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { inlineData: { mimeType, data: base64 } },
            ],
          },
        ],
        generationConfig: { temperature: 0.6, maxOutputTokens: 200 },
      });
      return res.response.text();
    });

    return NextResponse.json({ ok: true, text: result, lang });
  } catch (e: any) {
    console.error('Speak route error:', e?.message);
    return NextResponse.json(
      { ok: false, error: e?.message || 'Something went wrong while processing your voice message.' },
      { status: 500 }
    );
  }
}