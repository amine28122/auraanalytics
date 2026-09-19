'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import RecordRTC from 'recordrtc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Mic, Square, Loader2, Play, Pause, Volume2, UploadCloud, AlertCircle } from 'lucide-react';

type Lang = 'en' | 'ar' | 'es';

type Message = {
  role: 'user' | 'ai';
  text?: string;
  audioDataUri?: string;
};

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
  errorSend: string;
  empty: string;
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
    errorMic: 'Microphone access is required. Allow it in your browser or upload an audio file instead.',
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
    errorMic: 'يجب السماح بالوصول إلى المايك للتسجيل. اسمح به في المتصفح أو ارفع ملفاً صوتياً بدلاً منه.',
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
    errorMic: 'Se necesita acceso al micrófono. Permítelo en el navegador o sube un archivo de audio.',
    errorSend: 'Lo siento, no pude procesar ese audio. Inténtalo de nuevo o sube un clip más corto.',
    empty: 'Aún no hay conversación: toca el micrófono o sube audio para empezar.',
  },
};

export function VoiceChat({ lang = 'en' }: { lang?: Lang }) {
  const t = labels[lang] ?? labels.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
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

  const speak = useCallback(
    (text: string, index: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === 'ar' ? 'ar' : lang === 'es' ? 'es-ES' : 'en-US';
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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    if (recorderRef.current) {
      recorderRef.current.destroy();
      recorderRef.current = null;
    }
  }, []);

  const sendData = useCallback(
    async (dataUri: string) => {
      setIsSending(true);
      setError('');
      try {
        const res = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: dataUri, lang }),
        });
        const data = await res.json();
        if (!data.ok) {
          setError(t.errorSend);
          return;
        }
        const aiIndex = messages.length;
        setMessages((prev) => [...prev, { role: 'ai', text: data.text } as Message]);
        requestAnimationFrame(() => speak(data.text, aiIndex));
      } catch {
        setError(t.errorSend);
      } finally {
        setIsSending(false);
      }
    },
    [lang, messages.length, speak, t]
  );

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSeconds(0);

    const recorder = recorderRef.current;
    if (!recorder) {
      cleanupRecorder();
      return;
    }

    recorder.stopRecording(() => {
      try {
        const blob = recorder.getBlob();
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          const dataUri = fileReader.result as string;
          setMessages((prev) => [...prev, { role: 'user', audioDataUri: dataUri } as Message]);
          sendData(dataUri);
        };
        fileReader.readAsDataURL(blob);
      } catch {
        setError(t.errorSend);
      } finally {
        cleanupRecorder();
      }
    });
  }, [cleanupRecorder, t, sendData]);

  const startRecording = useCallback(async () => {
    setError('');
    stopSpeaking();
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t.errorMic);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new RecordRTC(stream, {
        type: 'audio',
        recorderType: RecordRTC.StereoAudioRecorder,
        sampleRate: 16000,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        disableLogs: true,
      });
      recorderRef.current = recorder;
      recorder.startRecording();
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError(t.errorMic);
    }
  }, [stopSpeaking, t]);

  const sendData = useCallback(
    async (dataUri: string) => {
      setIsSending(true);
      setError('');
      try {
        const res = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: dataUri, lang }),
        });
        const data = await res.json();
        if (!data.ok) {
          setError(t.errorSend);
          return;
        }
        const aiIndex = messages.length;
        setMessages((prev) => [...prev, { role: 'ai', text: data.text } as Message]);
        requestAnimationFrame(() => speak(data.text, aiIndex));
      } catch {
        setError(t.errorSend);
      } finally {
        setIsSending(false);
      }
    },
    [lang, messages.length, speak, t]
  );

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
                        onClick={() => (speakingIndex === index ? stopSpeaking() : speak(msg.text!, index))}
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
      </CardContent>
    </Card>
  );
}