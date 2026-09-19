import { NextResponse } from 'next/server';
import { runGeminiWithFailover } from '@/ai/failover';
import { initializeServerFirebase } from '@/firebase/server-init';
import * as admin from 'firebase-admin';

const DATA_URI_RE = /^data:audio\/([^;]+);base64,(.+)$/;
const MAX_HISTORY = 10;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const dataUri: string = typeof body?.audio === 'string' ? body.audio : '';
    const lang: string = typeof body?.lang === 'string' ? body.lang : 'en';
    const userId: string = typeof body?.userId === 'string' ? body.userId : '';
    const userName: string = typeof body?.userName === 'string' ? body.userName : '';

    const match = dataUri.match(DATA_URI_RE);
    if (!match) {
      return NextResponse.json({ ok: false, error: 'Invalid audio data.' }, { status: 400 });
    }

    const mimeType = `audio/${match[1]}`;
    const base64 = match[2];
    if (base64.length > 8 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: 'Audio is too large (keep it under ~2 minutes).' }, { status: 413 });
    }

    // ── Load the client's profile + conversation memory from Firestore ──
    let profile: any = { name: userName || 'friend', plan: 'Free', language: lang, tradingBalance: undefined };
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
        console.warn('Speak profile load failed:', e?.message);
      }
    }

    const langName = profile.language === 'ar' ? 'Arabic' : profile.language === 'es' ? 'Spanish' : 'English';
    const recent = (chat.history as any[])
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'CLIENT' : 'AURA'}: ${m.text || m.transcript || ''}`)
      .join('\n');

    const model = process.env.GEMINI_AUDIO_MODEL || 'gemini-3.1-flash-lite';

    const prompt =
      'You are AURA, the personal voice assistant of AURA Analytics. You know this client personally — you have their profile and your shared conversation history. ' +
      `\n\nCLIENT PROFILE:\n- Name: ${profile.name}\n- Plan: ${profile.plan}\n- Preferred language: ${langName}` +
      (profile.tradingBalance ? `\n- Trading balance: $${profile.tradingBalance}` : '') +
      (profile.pair ? `\n- Last analyzed pair: ${profile.pair}` : '') +
      `\n- Their usual communication style: ${chat.style || 'not known yet (detect it from their new voice message)'}` +
      `\n\nRECENT CONVERSATION:\n${recent || '(none yet)'}\n\nNEW VOICE MESSAGE from the client (the audio).` +
      '\n\nRULES:\n' +
      '1. Listen carefully and detect the EXACT language AND dialect of the new voice message. If they speak **Moroccan Darija**, reply in PERFECT natural Moroccan Darija (use real Darija words and French loanwords the way Moroccans actually talk: "واش", "شحال", "صح", "بزاف", "بلاصة", "دابا" ...).\n' +
      '2. Reply in the SAME language/dialect they just used — never switch to another language.\n' +
      '3. Speak like someone who knows them: personal, warm, brief (MAX ~45 words), NO markdown, NO bullet lists, NO emojis.\n' +
      '4. Match their tone and typical way of speaking, based on their known style and the recent conversation.\n' +
      '5. If they ask about markets/prices/trading on their account, answer usefully and concisely.\n' +
      '\nRespond with STRICT JSON only: {"transcript": "...(<=60 words: what the client literally said, written in the client\'s language)", "text": "...(your spoken reply in the client\'s exact language/dialect)"}';

    const result = await runGeminiWithFailover(async (genAI) => {
      const modelInstance = genAI.getGenerativeModel({ model });
      const res = await modelInstance.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { mimeType, data: base64 } },
            ],
          },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 400, responseMimeType: 'application/json' },
      });
      return res.response.text();
    });

    let parsed: { text?: string; transcript?: string } = {};
    try {
      const cleaned = result.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { text: result };
    }
    const replyText = (parsed.text || result || '').trim();
    const transcript = (parsed.transcript || '').trim().slice(0, 300);

    // ── Save the client's data: history + detected communication style ──
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
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        text:
                          'Describe in at most 12 words how this client speaks (language/dialect, tone, style): ' +
                          history.map((h) => `${h.role === 'user' ? 'C' : 'A'}: ${h.transcript || h.text || ''}`).join('; '),
                      },
                    ],
                  },
                ],
                generationConfig: { temperature: 0.2, maxOutputTokens: 60 },
              });
              return ((r.response.text() || '').trim().slice(0, 120));
            });
          } catch {
            style = '';
          }
        }

        await ref.set(
          { history, style, count: history.length, updatedAt: timestamp },
          { merge: true }
        );
      } catch (e: any) {
        console.warn('Speak memory save failed:', e?.message);
      }
    }

    return NextResponse.json({ ok: true, text: replyText, transcript, lang: profile.language });
  } catch (e: any) {
    console.error('Speak route error:', e?.message);
    return NextResponse.json(
      { ok: false, error: e?.message || 'Something went wrong while processing your voice message.' },
      { status: 500 }
    );
  }
}