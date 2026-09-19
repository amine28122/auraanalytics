'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Mic, Square, Loader2, Play, Pause, Volume2, UploadCloud, AlertCircle, Send } from 'lucide-react';
import { useAuth } from '@/firebase';

type Lang = 'en' | 'ar' | 'es';

type Message = {
  role: 'user' | 'ai';
  text?: string;
  audioDataUri?: string;
  transcript?: string;
  ttsAudioUri?: string;
};

const labels: Record<Lang, {
  title: string; subtitle: string; recordBtn: string; uploadBtn: string;
  aiThinking: string; playVoice: string; stopVoice: string; errorMic: string;
  errorEmpty: string; errorSend: string; empty: string; micUnsupported: string;
  micDenied: string; micTip: string; placeholder: string; sendBtn: string;
}> = {
  en: {
    title: 'Speak with AURA',
    subtitle: 'Type or speak — AURA replies like an elite pro trader.',
    recordBtn: 'Record',
    uploadBtn: 'Upload audio',
    aiThinking: 'AURA is analyzing...',
    playVoice: 'Play',
    stopVoice: 'Stop',
    errorMic: 'Microphone blocked. Click the lock icon in your browser address bar, allow Microphone, then try again.',
    micUnsupported: 'Voice recording works in Chrome or Edge. Allow the microphone in site settings, or use Upload audio.',
    micDenied: 'Microphone denied. Click the lock icon in the address bar, allow Microphone, then try again.',
    micTip: 'Tip: allow the mic once in your browser. You can also type your question or upload an audio file.',
    errorEmpty: 'No audio detected — please speak louder or longer and try again.',
    errorSend: 'Could not process your message. Please try again.',
    empty: 'No conversation yet — type a message, tap the mic, or upload audio.',
    placeholder: 'Ask AURA about a market, pair, or setup...',
    sendBtn: 'Send',
  },
  ar: {
    title: 'تحدث مع أورا',
    subtitle: 'اكتب أو تكلم — أورا ترد كمتداول محترف.',
    recordBtn: 'سجل',
    uploadBtn: 'رفع ملف صوتي',
    aiThinking: 'أورا تحلل...',
    playVoice: 'تشغيل',
    stopVoice: 'إيقاف',
    errorMic: 'المايك محظور. اضغط على أيقونة القفل في شريط العنوان، اسمح للميكروفون ثم حاول مجدداً.',
    micUnsupported: 'التسجيل يعمل في Chrome أو Edge. اسمح بالمايك أو استخدم رفع ملف صوتي.',
    micDenied: 'رفض الوصول للمايك. اضغط أيقونة القفل في شريط العنوان، اسمح بالميكروفون ثم أعد المحاولة.',
    micTip: 'نصيحة: اسمح بالمايك مرة واحدة. يمكنك أيضاً كتابة سؤالك أو رفع ملف صوتي.',
    errorEmpty: 'لم أسمع صوتاً — تحدث بصوت أعلى أو لفترة أطول وحاول مجدداً.',
    errorSend: 'تعذرت معالجة رسالتك. حاول مرة أخرى.',
    empty: 'لا توجد محادثة بعد — اكتب رسالة، أو اضغط المايك، أو ارفع ملفاً صوتياً.',
    placeholder: 'اسأل أورا عن سوق أو زوج أو إعداد...',
    sendBtn: 'إرسال',
  },
  es: {
    title: 'Habla con AURA',
    subtitle: 'Escribe o habla — AURA responde como un trader pro.',
    recordBtn: 'Grabar',
    uploadBtn: 'Subir audio',
    aiThinking: 'AURA analizando...',
    playVoice: 'Reproducir',
    stopVoice: 'Detener',
    errorMic: 'Microfono bloqueado. Haz clic en el icono de candado, permite el microfono.',
    micUnsupported: 'La grabacion funciona en Chrome o Edge. Permite el microfono o usa Subir audio.',
    micDenied: 'Microfono denegado. Haz clic en el icono de candado, permite el microfono.',
    micTip: 'Consejo: permite el mic una vez. Tambien puedes escribir tu pregunta o subir un archivo de audio.',
    errorEmpty: 'No se detecto audio — habla mas fuerte o mas tiempo.',
    errorSend: 'No se pudo procesar tu mensaje. Intentalo de nuevo.',
    empty: 'Sin conversacion — escribe un mensaje, toca el microfono o sube audio.',
    placeholder: 'Pregunta a AURA sobre un mercado, par o setup...',
    sendBtn: 'Enviar',
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
  const [textInput, setTextInput] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
      if (ttsAudioRef.current) { ttsAudioRef.current.pause(); ttsAudioRef.current = null; }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current.currentTime = 0;
      ttsAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingIndex(null);
  }, []);

  const speakFallback = useCallback((text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'ar' ? 'ar' : lang === 'es' ? 'es-ES' : 'en-US';
    utter.rate = 1.05;
    utter.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang && v.lang.startsWith(utter.lang)) || voices.find((v) => v.default);
    if (match) utter.voice = match;
    utter.onend = () => setSpeakingIndex((cur) => (cur === index ? null : cur));
    utter.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utter);
  }, [lang]);

  const playTTS = useCallback((ttsAudioUri: string | undefined, text: string, index: number) => {
    stopSpeaking();
    if (ttsAudioUri) {
      const audio = new Audio(ttsAudioUri);
      ttsAudioRef.current = audio;
      setSpeakingIndex(index);
      audio.onended = () => setSpeakingIndex((cur) => (cur === index ? null : cur));
      audio.onerror = () => { setSpeakingIndex(null); speakFallback(text, index); };
      audio.play().catch(() => speakFallback(text, index));
    } else {
      speakFallback(text, index);
    }
  }, [stopSpeaking, speakFallback]);

  const cleanupRecorder = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
  }, []);

  // Core send function — handles both text and audio
  const sendToAPI = useCallback(
    async (payload: { audio?: string; text?: string }) => {
      setIsSending(true);
      setError('');
      try {
        const res = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            lang,
            userId: user?.uid || '',
            userName: user?.displayName || '',
          }),
        });
        const data = await res.json();
        if (!data.ok) { setError(t.errorSend); return; }
        const transcript = typeof data.transcript === 'string' ? data.transcript : '';
        const ttsAudioUri: string | undefined = data.ttsAudioUri;
        let aiMsgIndex = -1;
        setMessages((prev) => {
          const next = [...prev];
          if (transcript && !payload.text) {
            const last = next[next.length - 1];
            if (last && last.role === 'user') next[next.length - 1] = { ...last, transcript };
          }
          aiMsgIndex = next.length;
          next.push({ role: 'ai', text: data.text, ttsAudioUri } as Message);
          return next;
        });
        requestAnimationFrame(() => {
          if (aiMsgIndex >= 0) playTTS(ttsAudioUri, data.text, aiMsgIndex);
        });
      } catch {
        setError(t.errorSend);
      } finally {
        setIsSending(false);
      }
    },
    [lang, playTTS, t, user]
  );

  // Send text message
  const sendText = useCallback(() => {
    const msg = textInput.trim();
    if (!msg || isSending) return;
    setTextInput('');
    stopSpeaking();
    setMessages((prev) => [...prev, { role: 'user', text: msg } as Message]);
    sendToAPI({ text: msg });
    textareaRef.current?.focus();
  }, [textInput, isSending, stopSpeaking, sendToAPI]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendText();
      }
    },
    [sendText]
  );

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setSeconds(0);
    const recorder = mediaRecorderRef.current;
    if (!recorder) { cleanupRecorder(); return; }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
      chunksRef.current = [];
      if (blob.size < 1000) { setError(t.errorEmpty); cleanupRecorder(); return; }
      const previewUrl = URL.createObjectURL(blob);
      setMessages((prev) => [...prev, { role: 'user', audioDataUri: previewUrl } as Message]);
      const fileReader = new FileReader();
      fileReader.onloadend = () => sendToAPI({ audio: fileReader.result as string });
      fileReader.readAsDataURL(blob);
      cleanupRecorder();
    };
    recorder.stop();
  }, [cleanupRecorder, t, sendToAPI]);

  const startRecording = useCallback(async () => {
    setError('');
    stopSpeaking();
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t.micUnsupported);
      return;
    }
    let micStream: MediaStream;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch (micErr: any) {
      const name = (micErr?.name || '').toLowerCase();
      const msg2 = (micErr?.message || '').toLowerCase();
      if (name === 'notallowederror' || name === 'permissiondeniederror' || msg2.includes('denied') || msg2.includes('permission')) {
        setError(t.micDenied);
      } else if (name === 'notfounderror' || msg2.includes('not found')) {
        setError(t.micUnsupported);
      } else {
        setError(t.errorMic);
      }
      return;
    }
    streamRef.current = micStream;
    const mimeType =
      MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' :
      MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' :
      MediaRecorder.isTypeSupported('audio/ogg;codecs=opus') ? 'audio/ogg;codecs=opus' : '';
    try {
      const recorder = new MediaRecorder(micStream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.start(200);
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (e: any) {
      console.error('MediaRecorder error:', e?.message);
      setError(t.errorMic);
      micStream.getTracks().forEach((tr) => tr.stop());
    }
  }, [stopSpeaking, t]);

  const onFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError('');
      setMessages((prev) => [...prev, { role: 'user', text: file.name } as Message]);
      const fileReader = new FileReader();
      fileReader.onloadend = () => sendToAPI({ audio: fileReader.result as string });
      fileReader.readAsDataURL(file);
      e.target.value = '';
    },
    [sendToAPI]
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
                  {msg.text && <p className="font-medium">{msg.text}</p>}
                  {!msg.text && msg.audioDataUri && (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="flex items-end gap-0.5">
                        {[4, 8, 6, 9, 5].map((h, i) => (
                          <span key={i} style={{ height: h }} className="w-0.5 rounded bg-foreground/70" />
                        ))}
                      </span>
                      {lang === 'ar' ? 'رسالة صوتية' : lang === 'es' ? 'Mensaje de voz' : 'Voice message'}
                    </span>
                  )}
                  {msg.audioDataUri && (
                    <audio src={msg.audioDataUri} controls className="mt-2 h-8 w-full" preload="none" />
                  )}
                  {msg.transcript && (
                    <p className="mt-1.5 text-[11px] italic text-muted-foreground/80">
                      {lang === 'ar' ? 'فهمت:' : lang === 'es' ? 'Lo que escuche:' : 'What I heard:'} {msg.transcript}
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
                        onClick={() =>
                          speakingIndex === index
                            ? stopSpeaking()
                            : playTTS(msg.ttsAudioUri, msg.text!, index)
                        }
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        {speakingIndex === index ? (
                          <><Pause className="h-3 w-3" /> {t.stopVoice}</>
                        ) : (
                          <><Play className="h-3 w-3" /> {t.playVoice}</>
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {speakingIndex === index && (
                    <div className="mt-2 flex items-center gap-1 text-primary">
                      <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                      <span className="flex items-end gap-0.5">
                        {[5, 9, 6, 8, 7, 4, 10].map((h, i) => (
                          <span
                            key={i}
                            className="w-0.5 animate-pulse rounded bg-primary"
                            style={{ height: h, animationDelay: `${i * 80}ms` }}
                          />
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {isSending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-border/60 bg-card px-4 py-3 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                {t.aiThinking}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Text input row */}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            rows={1}
            disabled={isSending || isRecording}
            dir={dir}
            className="flex-1 resize-none rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50 transition-colors"
            style={{ minHeight: '42px', maxHeight: '120px' }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 120) + 'px';
            }}
          />
          <Button
            size="icon"
            onClick={sendText}
            disabled={!textInput.trim() || isSending || isRecording}
            className="h-[42px] w-[42px] shrink-0 rounded-xl"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Voice control bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isRecording ? (
              <Button size="lg" variant="destructive" className="animate-pulse gap-2" onClick={stopRecording}>
                <Square className="h-5 w-5" />
                {fmtTime(seconds)}
              </Button>
            ) : (
              <Button size="lg" variant="outline" className="gap-2" onClick={startRecording} disabled={isSending}>
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
