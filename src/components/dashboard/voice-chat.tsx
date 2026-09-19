'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Mic, Square, Loader2, Play, Pause, Volume2, UploadCloud, AlertCircle } from 'lucide-react';
import { useAuth } from '@/firebase';

type Lang = 'en' | 'ar' | 'es';

type Message = {
  role: 'user' | 'ai';
  text?: string;
  audioDataUri?: string;
  transcript?: string;
};

function pcmToWav(pcm: Int16Array, sampleRate: number): Uint8Array {
  const n = pcm.length;
  const dataSize = n * 2;
  const buf = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buf);
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);
  for (let i = 0; i < n; i++) view.setInt16(44 + i * 2, pcm[i], true);
  return new Uint8Array(buf);
}

const labels: Record<Lang, {
  title: string;
  subtitle: string;
  recordBtn: string;
  sending: string;
  uploadBtn: string;
  aiThinking: string;
  playVoice: string;
  stopVoice: string;
  errorMic: string;
  errorEmpty: string;
  errorSend: string;
  empty: string;
  micUnsupported: string;
  micDenied: string;
  micTip: string;
}> = {
  en: {
    title: 'Speak with Aura',
    subtitle: 'Tap the mic and ask about the markets — AURA listens and answers with her own voice.',
    recordBtn: 'Record',
    sending: 'Listening…',
    uploadBtn: 'Upload audio',
    aiThinking: 'AURA is thinking…',
    playVoice: 'Play voice',
    stopVoice: 'Stop voice',
    errorMic: 'Microphone access could not be started. Make sure Chrome/Edge can access the microphone.',
    micUnsupported: 'Voice recording works in Google Chrome or Microsoft Edge. Allow the microphone in the site settings, or use "Upload audio" instead.',
    micDenied: 'You denied microphone access. Click the mic icon (🔒/🎙) in the address bar, allow the microphone, then try again.',
    micTip: '🎙 Tip: allow the microphone once in your browser (or OS). Otherwise upload an audio file.',
    errorEmpty: 'I could not hear your voice — please speak a little longer and try again.',
    errorSend: 'Sorry, I could not process that audio. Please try again or upload a shorter clip.',
    empty: 'No conversation yet — tap the mic or upload audio to begin.',
  },
  ar: {
    title: 'تحدث مع أورا',
    subtitle: 'اضغط المايك واسأل عن الأسواق — أورا تسمعك وترد عليك بصوتها.',
    recordBtn: 'سجّل',
    sending: 'أنا أستمع إليك…',
    uploadBtn: 'رفع ملف صوتي',
    aiThinking: 'أورا تفكر…',
    playVoice: 'تشغيل الصوت',
    stopVoice: 'إيقاف الصوت',
    errorMic: 'تعذر تشغيل المايك. تأكد من أن Chrome/Edge يصل إلى الميكروفون.',
    micUnsupported: 'التسجيل الصوتي يعمل في Google Chrome أو Microsoft Edge. اسمح بالمايك في إعدادات الموقع، أو استخدم «رفع ملف صوتي».',
    micDenied: 'رفضت الوصول إلى المايك. اضغط أيقونة المايك (🔒/🎙) في أعلى المتصفح واسمح بالميكروفون ثم أعد المحاولة.',
    micTip: '🎙 نصيحة: اسمح بالمايك مرة واحدة في المتصفح (أو نظام التشغيل). وإلا ارفع ملفاً صوتياً.',
    errorEmpty: 'لم أسمع صوتك جيداً — تحدث قليلاً أطول وحاول مجدداً.',
    errorSend: 'عذراً، لم أستطع معالجة ذلك الصوت. حاول مرة أخرى أو ارفع مقطعاً أقصر.',
    empty: 'لا توجد محادثة بعد — ابدأ بالضغط على المايك أو رفع ملف صوتي.',
  },
  es: {
    title: 'Habla con Aura',
    subtitle: 'Toca el micrófono y pregunta sobre los mercados — AURA te escucha y responde con su propia voz.',
    recordBtn: 'Grabar',
    sending: 'Escuchándote…',
    uploadBtn: 'Subir audio',
    aiThinking: 'AURA está pensando…',
    playVoice: 'Reproducir voz',
    stopVoice: 'Detener voz',
    errorMic: 'No se pudo iniciar el micrófono. Asegúrate de que Chrome/Edge tenga acceso al micrófono.',
    micUnsupported: 'La grabación por voz funciona en Google Chrome o Microsoft Edge. Permite el micrófono en la configuración del sitio o usa «Subir audio».',
    micDenied: 'Denegaste el acceso al micrófono. Toca el icono del micrófono (🔒/🎙) en la barra de direcciones, permite el micrófono e inténtalo de nuevo.',
    micTip: '🎙 Consejo: permite el micrófono una vez en tu navegador (o SO). Si no, sube un archivo de audio.',
    errorEmpty: 'No pude escucharte bien — habla un poco más y vuelve a intentarlo.',
    errorSend: 'Lo siento, no pude procesar ese audio. Inténtalo de nuevo o sube un clip más corto.',
    empty: 'Aún no hay conversación: toca el micrófono o sube audio para empezar.',
  },
};

export function VoiceChat({ lang = 'en' }: { lang?: Lang }) {
  const t = labels[lang] ?? labels.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<any>(null);
  const sourceRef = useRef<any>(null);
  const sinkRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const load = () => window.speechSynthesis.getVoices();
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingIndex(null);
  }, []);

  const pickReplyLang = useCallback(
    (text: string) =>
      /[\u0600-\u06FF]/.test(text) ? 'ar' : lang === 'ar' ? 'ar' : lang === 'es' ? 'es' : 'en',
    [lang]
  );

  const speak = useCallback(
    (text: string, index: number, voiceLang?: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const target = voiceLang || lang;
      utter.lang = target === 'ar' ? 'ar' : target === 'es' ? 'es-ES' : 'en-US';
      utter.rate = 1;
      utter.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang && v.lang.startsWith(utter.lang)) || voices.find((v) => v.default);
      if (match) utter.voice = match;
      utter.onend = () => setSpeakingIndex((cur) => (cur === index ? null : cur));
      utter.onerror = () => setSpeakingIndex(null);
      setSpeakingIndex(index);
      window.speechSynthesis.speak(utter);
    },
    [lang]
  );

  const cleanupRecorder = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      if (sinkRef.current) sinkRef.current.disconnect();
    } catch {}
    try {
      if (sourceRef.current) sourceRef.current.stop();
    } catch {}
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    try {
      if (audioCtxRef.current?.close) audioCtxRef.current.close();
    } catch {}
    audioCtxRef.current = null;
    sourceRef.current = null;
    sinkRef.current = null;
  }, []);

  const sendData = useCallback(
    async (dataUri: string) => {
      setIsSending(true);
      setError('');
      try {
        const res = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: dataUri, lang, userId: user?.uid || '', userName: user?.displayName || '' }),
        });
        const data = await res.json();
        if (!data.ok) {
          setError(t.errorSend);
          return;
        }
        const aiIndex = messages.length;
        const replyVoice = pickReplyLang(data.text);
        const transcript = typeof data.transcript === 'string' ? data.transcript : '';
        setMessages((prev) => {
          const next = [...prev];
          if (transcript) {
            const last = next[next.length - 1];
            if (last && last.role === 'user') {
              next[next.length - 1] = { ...last, transcript };
            }
          }
          next.push({ role: 'ai', text: data.text } as Message);
          return next;
        });
        requestAnimationFrame(() => speak(data.text, aiIndex, replyVoice));
      } catch {
        setError(t.errorSend);
      } finally {
        setIsSending(false);
      }
    },
    [lang, messages.length, speak, t, pickReplyLang, user]
  );

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSeconds(0);

    const sink = sinkRef.current;
    if (!sink) {
      cleanupRecorder();
      return;
    }

    try {
      const samples = sink.getSamples(0) as any;
      const sampleRate = sink.sampleRate || sourceRef.current?.sampleRate || 48000;
      const n = samples?.length || 0;
      if (n < sampleRate / 2) {
        setError(t.errorEmpty);
        cleanupRecorder();
        return;
      }
      const pcm = new Int16Array(n);
      for (let i = 0; i < n; i++) {
        const v = samples.getFloat(i) as number;
        const c = v !== v ? 0 : Math.max(-1, Math.min(1, v));
        pcm[i] = Math.round(c * 32767);
      }
      const wav = pcmToWav(pcm, sampleRate);
      const blob = new Blob([wav.buffer as ArrayBuffer], { type: 'audio/wav' });
      if (blob.size < 2000) {
        setError(t.errorEmpty);
        cleanupRecorder();
        return;
      }
      const previewUrl = URL.createObjectURL(blob);
      setMessages((prev) => [...prev, { role: 'user', audioDataUri: previewUrl } as Message]);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        sendData(fileReader.result as string);
      };
      fileReader.readAsDataURL(blob);
    } catch {
      setError(t.errorSend);
    } finally {
      cleanupRecorder();
    }
  }, [cleanupRecorder, t, sendData]);

  const startRecording = useCallback(async () => {
    setError('');
    stopSpeaking();
    const AudioCtx = (window as any).AudioContext;
    let micStream: MediaStream | null = null;
    let micError = '';
    if (!navigator.mediaDevices?.getUserMedia || typeof AudioCtx === 'undefined') {
      micError = t.micUnsupported;
    } else {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = micStream;
      } catch (micErr: any) {
        const detail = `${micErr?.name || ''} ${micErr?.message || ''}`.toLowerCase();
        micError =
          detail.includes('denied') || detail.includes('notallowed') || detail.includes('permission')
            ? t.micDenied
            : detail.includes('busy')
              ? t.errorMic
              : t.micUnsupported;
      }
    }
    if (micError) {
      setError(micError);
      cleanupRecorder();
      return;
    }

    try {
      const ctx: any = new AudioCtx();
      audioCtxRef.current = ctx;
      if (typeof ctx.resume === 'function') ctx.resume();

      const source: any = await ctx.createMediaStreamSource(micStream!);
      sourceRef.current = source;
      const gain: any = ctx.createGainer();
      const sink: any = await ctx.createAudioStreamSink(2);
      sinkRef.current = sink;
      sink.addConsumer(() => {});

      try {
        source.connect(gain).connect(sink);
      } catch {
        const dest: any = await ctx.createAudioStreamProcessor();
        sinkRef.current = await ctx.createAudioStreamSink(2);
        sinkRef.current.addConsumer(() => {});
        source.connect(gain).connect(dest).connect(sinkRef.current);
      }

      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (e: any) {
      console.error('Mic graph error:', e?.message || e);
      setError(t.errorMic);
      cleanupRecorder();
    }
  }, [stopSpeaking, t, cleanupRecorder, t.errorMic]);

  const onFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError('');
      setMessages((prev) => [...prev, { role: 'user', text: file.name } as Message]);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        sendData(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
      e.target.value = '';
    },
    [sendData]
  );

  const fmtTime = (total: number) =>
    `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;

  return (
    <Card className="card-glow mx-auto w-full max-w-2xl">
      <CardContent className="flex flex-col gap-4 p-4 sm:p-6" dir={dir}>
        {/* Conversation area */}
        <div
          ref={scrollRef}
          className="flex max-h-[55vh] min-h-[280px] flex-col gap-3 overflow-y-auto rounded-xl border border-border/50 bg-muted/30 p-3 custom-scrollbar"
        >
          {messages.length === 0 && !isSending && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <BrainCircuit className="h-7 w-7 text-primary" />
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">{t.empty}</p>
            </div>
          )}

          {messages.map((msg, index) =>
            msg.role === 'user' ? (
              <div key={index} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary/15 px-4 py-2.5 text-sm">
                  {msg.text ? (
                    <p className="font-medium">{msg.text}</p>
                  ) : (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="flex items-end gap-0.5">
                        {[4, 8, 6, 9, 5].map((h, i) => (
                          <span key={i} style={{ height: h }} className="w-0.5 rounded bg-foreground/70" />
                        ))}
                      </span>
                      {lang === 'ar' ? 'رسالة صوتية' : lang === 'es' ? 'Mensaje de voz' : 'Voice message'}
                    </span>
                  )}
                  <audio src={msg.audioDataUri} controls className="mt-2 h-8 w-full" preload="none" />
                  {msg.transcript && (
                    <p className="mt-1.5 text-[11px] italic text-muted-foreground/80">
                      {lang === 'ar' ? '🗣 فهمتُ:' : lang === 'es' ? '🗣 Lo que escuché:' : '🗣 What I heard:'} {msg.transcript}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div key={index} className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border/60 bg-card px-4 py-3 shadow-sm">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1 text-[10px]">
                      <BrainCircuit className="h-3 w-3" /> AURA
                    </Badge>
                    {msg.text && (
                      <button
                        type="button"
                        onClick={() => (speakingIndex === index ? stopSpeaking() : speak(msg.text!, index, pickReplyLang(msg.text!)))}
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-primary/50 hover:text-primary"
                      >
                        {speakingIndex === index ? (
                          <>
                            <Pause className="h-3 w-3" /> {t.stopVoice}
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3" /> {t.playVoice}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {speakingIndex === index && (
                    <div className="mt-2 flex items-center gap-1 text-primary">
                      <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                      <span className="flex items-end gap-0.5">
                        {[5, 9, 6, 8, 7].map((h, i) => (
                          <span
                            key={i}
                            className="w-0.5 animate-pulse rounded bg-primary"
                            style={{ height: h, animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Control bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isRecording ? (
              <Button size="lg" variant="destructive" className="animate-pulse gap-2" onClick={stopRecording}>
                <Square className="h-5 w-5" />
                {fmtTime(seconds)}
              </Button>
            ) : (
              <Button size="lg" className="gap-2" onClick={startRecording} disabled={isSending}>
                <Mic className="h-5 w-5" />
                {t.recordBtn}
              </Button>
            )}

            <label className="relative inline-flex">
              <Button variant="outline" size="lg" asChild disabled={isSending || isRecording}>
                <span className="cursor-pointer gap-2">
                  <UploadCloud className="h-5 w-5" />
                  {t.uploadBtn}
                </span>
              </Button>
              <input
                type="file"
                accept="audio/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={onFileSelected}
                disabled={isSending || isRecording}
              />
            </label>
          </div>

          {isSending && (
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.aiThinking}
            </div>
          )}
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground/70">{t.micTip}</p>
      </CardContent>
    </Card>
  );
}