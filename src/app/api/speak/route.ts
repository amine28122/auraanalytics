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
    const textInput: string = typeof body?.text === 'string' ? body.text.trim() : '';
    const lang: string = typeof body?.lang === 'string' ? body.lang : 'en';
    const userId: string = typeof body?.userId === 'string' ? body.userId : '';
    const userName: string = typeof body?.userName === 'string' ? body.userName : '';

    // Must have either audio OR text
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
        return NextResponse.json({ ok: false, error: 'Audio is too large (keep it under ~2 minutes).' }, { status: 413 });
      }
    }

    // -- Load profile + conversation memory from Firestore --
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

    const model = process.env.GEMINI_AUDIO_MODEL || 'gemini-2.5-flash';

    const systemPrompt =
      'You are AURA — a razor-sharp, elite intraday trader and financial analyst with 15+ years of experience across Forex, crypto, indices, and commodities. ' +
      'You are the personal AI trading advisor of this specific client. You know their profile, their history, and you speak to them as a trusted mentor who trades for a living. ' +
      '\n\nYOUR TRADING PERSONALITY:' +
      '\n- You speak like a seasoned pro: direct, confident, no fluff. You cut through noise instantly.' +
      '\n- You give real, actionable insights: entry zones, key levels, momentum reads, risk management tips — not generic advice.' +
      '\n- You use trader vocabulary naturally (support/resistance, breakout, liquidity grab, confluence, risk:reward, etc.).' +
      '\n- You are warm and personal with this client — you know their name, their balance, their style.' +
      '\n- You never say "I cannot" — you always give your best analysis and flag uncertainty when needed.' +
      `\n\nCLIENT PROFILE:\n- Name: ${profile.name}\n- Plan: ${profile.plan}\n- Preferred language: ${langName}` +
      (profile.tradingBalance ? `\n- Trading balance: $${profile.tradingBalance}` : '') +
      (profile.pair ? `\n- Last analyzed pair / favorite market: ${profile.pair}` : '') +
      `\n- Their communication style: ${chat.style || 'not known yet — detect it from their message'}` +
      `\n\nRECENT CONVERSATION:\n${recent || '(none yet)'}`;

    const strictRules =
      '\n\nSTRICT RULES:\n' +
      '1. Detect the EXACT language AND dialect. If Moroccan Darija, reply in perfect Darija (واش، دابا، بزاف، صح، شحال — real street Darija with French loanwords). If MSA reply MSA. If French reply French. Never mix.\n' +
      '2. Reply in the EXACT same language/dialect — zero exceptions.\n' +
      '3. Be brief and punchy: MAX 50 words. No markdown, no bullet points, no emojis. Just clean spoken sentences.\n' +
      '4. Sound like their personal trader, not a chatbot. Be confident, direct, and sharp.\n' +
      '5. If they ask about a market/pair/price/setup — give your actual read: trend, key level, bias, and a quick action tip.\n' +
      '6. If off-topic from trading, answer briefly then bring it back to markets if natural.\n';

    let result: string;

    if (isTextMode) {
      // TEXT mode: no audio, just text conversation
      const textPrompt =
        systemPrompt +
        `\n\nNEW TEXT MESSAGE from the client: "${textInput}"` +
        strictRules +
        '\nRespond with STRICT JSON only — no extra text:\n{"transcript": "(repeat exactly what the client wrote)", "text": "(your spoken reply, max 50 words, in their exact language/dialect)"}';

      result = await runGeminiWithFailover(async (genAI) => {
        const modelInstance = genAI.getGenerativeModel({ model });
        const res = await modelInstance.generateContent({
          contents: [{ role: 'user', parts: [{ text: textPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 400, responseMimeType: 'application/json' },
        });
        return res.response.text();
      });
    } else {
      // AUDIO mode: send audio inline
      const audioPrompt =
        systemPrompt +
        '\n\nNEW VOICE MESSAGE from the client (audio attached).' +
        strictRules +
        '\nRespond with STRICT JSON only — no extra text:\n{"transcript": "(<= 60 words: exactly what the client said, in their language)", "text": "(your spoken reply, max 50 words, in their exact language/dialect)"}';

      result = await runGeminiWithFailover(async (genAI) => {
        const modelInstance = genAI.getGenerativeModel({ model });
        const res = await modelInstance.generateContent({
          contents: [
            {
              role: 'user',
              parts: [
                { text: audioPrompt },
                { inlineData: { mimeType, data: base64 } },
              ],
            },
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 400, responseMimeType: 'application/json' },
        });
        return res.response.text();
      });
    }

    let parsed: { text?: string; transcript?: string } = {};
    try {
      const cleaned = result.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { text: result };
    }
    const replyText = (parsed.text || result || '').trim();
    const transcript = isTextMode ? textInput : (parsed.transcript || '').trim().slice(0, 300);

    // -- Save history + detect communication style --
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
      { ok: false, error: e?.message || 'Something went wrong.' },
      { status: 500 }
    );
  }
}
