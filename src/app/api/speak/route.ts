import { NextResponse } from 'next/server';
import { runGeminiWithFailover } from '@/ai/failover';
import { initializeServerFirebase } from '@/firebase/server-init';
import * as admin from 'firebase-admin';

const DATA_URI_RE = /^data:audio\/([^;]+);base64,(.+)$/;
const MAX_HISTORY = 10;

/** Extract the first JSON object found anywhere in a string */
function extractJSON(raw: string): { text?: string; transcript?: string } {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  try {
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {}
  return {};
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

    const systemPrompt =
      'You are AURA, an elite intraday trader and financial analyst with 15+ years across Forex, crypto, indices, and commodities. ' +
      'You are the personal AI trading advisor of this client. Speak like a trusted mentor who trades for a living. ' +
      'Be direct, confident, actionable. Use trader vocabulary naturally. Never say you cannot do something.' +
      `\n\nCLIENT: Name=${profile.name}, Plan=${profile.plan}, Language=${langName}` +
      (profile.tradingBalance ? `, Balance=$${profile.tradingBalance}` : '') +
      (profile.pair ? `, Favorite pair=${profile.pair}` : '') +
      `\nStyle: ${chat.style || 'unknown yet'}` +
      `\n\nRECENT HISTORY:\n${recent || '(none)'}`;

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

    let result: string;

    if (isTextMode) {
      result = await runGeminiWithFailover(async (genAI) => {
        const m = genAI.getGenerativeModel({ model, systemInstruction: systemPrompt });
        const res = await m.generateContent({
          contents: [{ role: 'user', parts: [{ text: rules + inputDescription }] }],
          generationConfig: { temperature: 0.65, maxOutputTokens: 300 },
        });
        return res.response.text();
      });
    } else {
      result = await runGeminiWithFailover(async (genAI) => {
        const m = genAI.getGenerativeModel({ model, systemInstruction: systemPrompt });
        const res = await m.generateContent({
          contents: [{
            role: 'user',
            parts: [
              { text: rules + inputDescription },
              { inlineData: { mimeType, data: base64 } },
            ],
          }],
          generationConfig: { temperature: 0.65, maxOutputTokens: 300 },
        });
        return res.response.text();
      });
    }

    const parsed = extractJSON(result);
    const replyText = (parsed.text || '').trim();
    const transcript = isTextMode ? textInput : (parsed.transcript || '').trim().slice(0, 300);

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
