'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BrainCircuit, Mic, Square, Loader2, Play, Pause, Volume2, VolumeX,
  UploadCloud, AlertCircle, Send, Trash2
} from 'lucide-react';
import { useAuth } from '@/firebase';
import { useLanguage } from '@/context/LanguageContext';

type Lang = 'en' | 'ar' | 'es';

type Message = {
  role: 'user' | 'ai';
  text?: string;
  audioDataUri?: string;
  hasAudio?: boolean;
  transcript?: string;
  ttsAudioUri?: string;
  ts?: string;
};

// Tiny valid silent WAV used to unlock HTMLAudioElement inside user gesture handlers
const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

const labels: Record<Lang, {
  title: string; subtitle: string; recordBtn: string; stopRecBtn: string; uploadBtn: string;
  aiThinking: string; playVoice: string; stopVoice: string; loadingVoice: string;
  errorMic: string; errorEmpty: string; errorSend: string; empty: string;
  micUnsupported: string; micDenied: string; micTip: string; placeholder: string;
  sendBtn: string; clearChat: string; voiceOn: string; voiceOff: string;
  savedLabel: string; voiceMsgLabel: string; heardLabel: string; loadingChat: string;
}> = {
  en: {
    title: 'Speak with AURA',
    subtitle: 'Type or speak — AURA replies like an elite pro trader.',
    recordBtn: 'Record Voice',
    stopRecBtn: 'Stop & Send',
    uploadBtn: 'Upload audio',
    aiThinking: 'AURA is analyzing...',
    playVoice: 'Play',
    stopVoice: 'Stop',
    loadingVoice: 'Loading voice...',
    errorMic: 'Microphone blocked. Allow Microphone permission in your browser address bar, then try again.',
    micUnsupported: 'Voice recording is not supported in this browser. Try Chrome/Edge or use Upload audio.',
    micDenied: 'Microphone denied. Click the lock/mic icon in the address bar, allow Microphone, then try again.',
    micTip: 'Chat history is saved automatically. Allow the mic once to send voice messages — AURA listens and replies in her own voice.',
    errorEmpty: 'Recording was too short or silent — please speak clearly and try again.',
    errorSend: 'Could not process your message. Please try again.',
    empty: 'No conversation yet — type a message, tap Record Voice, or upload audio.',
    placeholder: 'Ask AURA about a market, pair, or setup...',
    sendBtn: 'Send',
    clearChat: 'New Chat',
    voiceOn: 'Auto-Voice On',
    voiceOff: 'Auto-Voice Off',
    savedLabel: 'Saved',
    voiceMsgLabel: 'Voice message',
    heardLabel: 'What I heard:',
    loadingChat: 'Loading conversation...',
  },
  ar: {
    title: 'تحدث مع أورا',
    subtitle: 'اكتب أو تكلم — أورا تسمعك وترد عليك بصوتها كمتداول محترف.',
    recordBtn: 'تسجيل صوتي',
    stopRecBtn: 'إيقاف وإرسال',
    uploadBtn: 'رفع ملف صوتي',
    aiThinking: 'أورا تفكر وتحضر الرد الصوتي...',
    playVoice: 'استماع',
    stopVoice: 'إيقاف',
    loadingVoice: 'جاري تحميل الصوت...',
    errorMic: 'تعذر تشغيل الميكروفون. تأكد من السماح بالمايك من أيقونة المتصفح وحاول مجدداً.',
    micUnsupported: 'التسجيل الصوتي غير مدعوم في هذا المتصفح. استخدم Chrome أو Edge أو ارفع ملفاً صوتياً.',
    micDenied: 'تم رفض إذن الميكروفون. اضغط على أيقونة القفل/المايك بجانب الرابط، اسمح بالمايك ثم أعد المحاولة.',
    micTip: 'يتم حفظ المحادثة تلقائياً. اسمح بالميكروفون لإرسال رسائل صوتية وستسمعك أورا وترد عليك بصوتها.',
    errorEmpty: 'التسجيل قصير جداً أو بدون صوت — تحدث بوضوح لفترة أطول ثم أعد المحاولة.',
    errorSend: 'تعذرت معالجة رسالتك. حاول مرة أخرى.',
    empty: 'لا توجد محادثة بعد — اكتب رسالة، أو اضغط تسجيل صوتي، أو ارفع ملفاً صوتياً.',
    placeholder: 'اسأل أورا عن سوق أو زوج أو صفقة...',
    sendBtn: 'إرسال',
    clearChat: 'محادثة جديدة',
    voiceOn: 'الصوت التلقائي: مفعل',
    voiceOff: 'الصوت التلقائي: صامت',
    savedLabel: 'محفوظة',
    voiceMsgLabel: 'رسالة صوتية',
    heardLabel: 'ما سمعته أورا:',
    loadingChat: 'جاري تحميل المحادثة المحفوظة...',
  },
  es: {
    title: 'Habla con AURA',
    subtitle: 'Escribe o habla — AURA te escucha y responde con su voz.',
    recordBtn: 'Grabar voz',
    stopRecBtn: 'Detener y enviar',
    uploadBtn: 'Subir audio',
    aiThinking: 'AURA está analizando...',
    playVoice: 'Escuchar',
    stopVoice: 'Detener',
    loadingVoice: 'Cargando voz...',
    errorMic: 'Micrófono bloqueado. Permite el acceso al micrófono en tu navegador e inténtalo de nuevo.',
    micUnsupported: 'La grabación no es compatible aquí. Usa Chrome/Edge o Subir audio.',
    micDenied: 'Micrófono denegado. Permite el micrófono en la barra de direcciones e inténtalo de nuevo.',
    micTip: 'El chat se guarda automáticamente. Permite el micrófono para enviar notas de voz.',
    errorEmpty: 'Grabación demasiado corta o vacía — habla más claro e inténtalo de nuevo.',
    errorSend: 'No se pudo procesar tu mensaje. Inténtalo de nuevo.',
    empty: 'Sin conversación — escribe un mensaje, graba voz o sube un audio.',
    placeholder: 'Pregunta a AURA sobre un mercado, par o setup...',
    sendBtn: 'Enviar',
    clearChat: 'Nuevo chat',
    voiceOn: 'Voz auto: Activa',
    voiceOff: 'Voz auto: Silencio',
    savedLabel: 'Guardado',
    voiceMsgLabel: 'Mensaje de voz',
    heardLabel: 'Lo que escuché:',
    loadingChat: 'Cargando conversación...',
  },
};

function pickRecorderMimeType(): string {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}

export function VoiceChat({ lang: propLang }: { lang?: Lang }) {
  const { lang: contextLang } = useLanguage();
  const lang: Lang = propLang || (contextLang as Lang) || 'en';
  const t = labels[lang] ?? labels.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [error, setError] = useState('');
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [loadingTtsIndex, setLoadingTtsIndex] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [textInput, setTextInput] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordStartMsRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const storageKey = user?.uid ? `aura_voice_chat_${user.uid}` : null;

  // Prime persistent HTMLAudioElement inside user gesture handlers so async TTS playback isn't blocked by browser autoplay rules
  const unlockAudioPlayback = useCallback(() => {
    const el = audioElRef.current;
    if (!el) return;
    try {
      el.pause();
      el.src = SILENT_WAV;
      el.volume = 0;
      const p = el.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          el.pause();
          el.volume = 1;
        }).catch(() => {
          el.volume = 1;
        });
      } else {
        el.volume = 1;
      }
    } catch {
      el.volume = 1;
    }
  }, []);

  // Persist local lightweight copy of chat messages (without massive base64 audio URIs)
  useEffect(() => {
    if (!storageKey) return;
    try {
      const compact = messages.slice(-50).map((m) => ({
        role: m.role,
        text: m.text,
        hasAudio: m.hasAudio || Boolean(m.audioDataUri),
        transcript: m.transcript,
        ts: m.ts,
      }));
      localStorage.setItem(storageKey, JSON.stringify(compact));
    } catch {
      // Ignore quota errors
    }
  }, [messages, storageKey]);

  // Load persisted conversation from localStorage + Firestore on mount / user change
  useEffect(() => {
    let cancelled = false;
    if (!user?.uid) {
      setLoadingHistory(false);
      return;
    }

    if (storageKey) {
      try {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch {}
    }

    (async () => {
      setLoadingHistory(true);
      try {
        const token = await user.getIdToken().catch(() => '');
        const res = await fetch(`/api/speak?userId=${encodeURIComponent(user.uid)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (!cancelled && data?.ok && Array.isArray(data.history)) {
          if (data.history.length > 0) {
            setMessages(data.history);
          }
        }
      } catch (err) {
        console.warn('Failed to load chat history:', err);
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, storageKey]);

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
      if (audioElRef.current) {
        audioElRef.current.pause();
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      try {
        audioElRef.current.currentTime = 0;
      } catch {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingIndex(null);
  }, []);

  const speakFallback = useCallback((text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'ar' ? 'ar-SA' : lang === 'es' ? 'es-ES' : 'en-US';
    utter.rate = 1.02;
    utter.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const prefix = lang === 'ar' ? 'ar' : lang === 'es' ? 'es' : 'en';
    const match =
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix)) ||
      voices.find((v) => v.default);
    if (match) utter.voice = match;
    utter.onend = () => setSpeakingIndex((cur) => (cur === index ? null : cur));
    utter.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utter);
  }, [lang]);

  const playTTS = useCallback(
    async (ttsAudioUri: string | undefined, text: string, index: number) => {
      stopSpeaking();
      let audioUri = ttsAudioUri;

      // On-demand synthesis for older messages loaded from Firestore history
      if (!audioUri && text) {
        setLoadingTtsIndex(index);
        try {
          const token = user ? await user.getIdToken().catch(() => '') : '';
          const res = await fetch('/api/speak', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ ttsOnly: true, text, lang }),
          });
          const data = await res.json();
          if (data?.ok && typeof data.ttsAudioUri === 'string' && data.ttsAudioUri) {
            audioUri = data.ttsAudioUri;
            setMessages((prev) =>
              prev.map((m, idx) => (idx === index ? { ...m, ttsAudioUri: audioUri } : m))
            );
          }
        } catch {
          // Fall back to browser speech below
        } finally {
          setLoadingTtsIndex((cur) => (cur === index ? null : cur));
        }
      }

      if (audioUri && audioElRef.current) {
        const el = audioElRef.current;
        el.src = audioUri;
        el.volume = 1;
        setSpeakingIndex(index);
        el.onended = () => setSpeakingIndex((cur) => (cur === index ? null : cur));
        el.onerror = () => {
          setSpeakingIndex(null);
          speakFallback(text, index);
        };
        try {
          await el.play();
        } catch {
          speakFallback(text, index);
        }
      } else {
        speakFallback(text, index);
      }
    },
    [stopSpeaking, speakFallback, user, lang]
  );

  const cleanupStreams = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      cleanupStreams();
    };
  }, [cleanupStreams]);

  // Core send function — handles both text and audio
  const sendToAPI = useCallback(
    async (payload: { audio?: string; text?: string }) => {
      setIsSending(true);
      setError('');
      try {
        const token = user ? await user.getIdToken().catch(() => '') : '';
        const res = await fetch('/api/speak', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            ...payload,
            lang,
            userId: user?.uid || '',
            userName: user?.displayName || '',
          }),
        });
        const data = await res.json();
        if (!data.ok) {
          setError(typeof data.error === 'string' && data.error ? data.error : t.errorSend);
          return;
        }
        const transcript = typeof data.transcript === 'string' ? data.transcript : '';
        const ttsAudioUri: string | undefined =
          typeof data.ttsAudioUri === 'string' && data.ttsAudioUri ? data.ttsAudioUri : undefined;

        let aiMsgIndex = -1;
        setMessages((prev) => {
          const next = [...prev];
          if (transcript && !payload.text) {
            const last = next[next.length - 1];
            if (last && last.role === 'user') {
              next[next.length - 1] = { ...last, transcript, hasAudio: true };
            }
          }
          aiMsgIndex = next.length;
          next.push({
            role: 'ai',
            text: data.text,
            ttsAudioUri,
            ts: new Date().toISOString(),
          });
          return next;
        });

        if (autoSpeak && data.text) {
          requestAnimationFrame(() => {
            if (aiMsgIndex >= 0) {
              playTTS(ttsAudioUri, data.text, aiMsgIndex);
            }
          });
        }
      } catch {
        setError(t.errorSend);
      } finally {
        setIsSending(false);
      }
    },
    [lang, playTTS, autoSpeak, t, user]
  );

  // Send text message
  const sendText = useCallback(() => {
    const msg = textInput.trim();
    if (!msg || isSending || isRecording) return;
    unlockAudioPlayback();
    setTextInput('');
    stopSpeaking();
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: msg, ts: new Date().toISOString() },
    ]);
    sendToAPI({ text: msg });
    textareaRef.current?.focus();
  }, [textInput, isSending, isRecording, unlockAudioPlayback, stopSpeaking, sendToAPI]);

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
    unlockAudioPlayback();
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSeconds(0);

    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      cleanupStreams();
      return;
    }

    try {
      recorder.stop();
    } catch {
      cleanupStreams();
      setError(t.errorSend);
    }
  }, [unlockAudioPlayback, cleanupStreams, t]);

  const startRecording = useCallback(async () => {
    setError('');
    stopSpeaking();
    unlockAudioPlayback();

    if (
      typeof window === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      setError(t.micUnsupported);
      return;
    }

    let micStream: MediaStream;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (micErr: any) {
      const name = (micErr?.name || '').toLowerCase();
      const msg2 = (micErr?.message || '').toLowerCase();
      if (
        name === 'notallowederror' ||
        name === 'permissiondeniederror' ||
        msg2.includes('denied') ||
        msg2.includes('permission')
      ) {
        setError(t.micDenied);
      } else if (name === 'notfounderror' || msg2.includes('not found')) {
        setError(t.micUnsupported);
      } else {
        setError(t.errorMic);
      }
      return;
    }

    streamRef.current = micStream;
    chunksRef.current = [];

    try {
      const preferredMime = pickRecorderMimeType();
      const recorder = preferredMime
        ? new MediaRecorder(micStream, { mimeType: preferredMime })
        : new MediaRecorder(micStream);

      const baseMime = (recorder.mimeType || preferredMime || 'audio/webm').split(';')[0].trim() || 'audio/webm';

      recorder.ondataavailable = (ev: BlobEvent) => {
        if (ev.data && ev.data.size > 0) {
          chunksRef.current.push(ev.data);
        }
      };

      recorder.onerror = () => {
        setIsRecording(false);
        setError(t.errorMic);
        cleanupStreams();
      };

      recorder.onstop = () => {
        const durationMs = Date.now() - recordStartMsRef.current;
        const recordedChunks = [...chunksRef.current];
        cleanupStreams();

        const blob = new Blob(recordedChunks, { type: baseMime });
        if (durationMs < 400 || blob.size < 400) {
          setError(t.errorEmpty);
          return;
        }

        const previewUrl = URL.createObjectURL(blob);
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            audioDataUri: previewUrl,
            hasAudio: true,
            ts: new Date().toISOString(),
          },
        ]);

        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          const dataUrl = typeof fileReader.result === 'string' ? fileReader.result : '';
          if (!dataUrl || !dataUrl.includes(',')) {
            setError(t.errorSend);
            return;
          }
          sendToAPI({ audio: dataUrl });
        };
        fileReader.onerror = () => setError(t.errorSend);
        fileReader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recordStartMsRef.current = Date.now();
      recorder.start(250);
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (e: any) {
      console.error('MediaRecorder start error:', e?.message);
      setError(t.errorMic);
      cleanupStreams();
    }
  }, [stopSpeaking, unlockAudioPlayback, t, cleanupStreams, sendToAPI]);

  const onFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      unlockAudioPlayback();
      stopSpeaking();
      setError('');

      const previewUrl = URL.createObjectURL(file);
      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          text: file.name,
          audioDataUri: previewUrl,
          hasAudio: true,
          ts: new Date().toISOString(),
        },
      ]);

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const resultStr = typeof fileReader.result === 'string' ? fileReader.result : '';
        if (!resultStr) {
          setError(t.errorSend);
          return;
        }
        sendToAPI({ audio: resultStr });
      };
      fileReader.onerror = () => setError(t.errorSend);
      fileReader.readAsDataURL(file);
      e.target.value = '';
    },
    [unlockAudioPlayback, stopSpeaking, sendToAPI, t]
  );

  const handleClearChat = useCallback(async () => {
    if (isClearing || isSending || isRecording) return;
    stopSpeaking();
    setIsClearing(true);
    setError('');
    try {
      if (user?.uid) {
        const token = await user.getIdToken().catch(() => '');
        await fetch(`/api/speak?userId=${encodeURIComponent(user.uid)}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      }
      if (storageKey) localStorage.removeItem(storageKey);
      setMessages([]);
    } catch {
      setError(t.errorSend);
    } finally {
      setIsClearing(false);
    }
  }, [isClearing, isSending, isRecording, stopSpeaking, user, storageKey, t]);

  const fmtTime = (total: number) =>
    `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;

  return (
    <Card className="card-glow mx-auto w-full max-w-2xl">
      <CardContent className="flex flex-col gap-4 p-4 sm:p-6" dir={dir}>
        {/* Hidden persistent audio element for reliable TTS playback */}
        <audio ref={audioElRef} className="hidden" preload="auto" />

        {/* Top status & action bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-[11px] font-medium">
              <BrainCircuit className="h-3.5 w-3.5 text-primary" />
              AURA Live Advisor
            </Badge>
            {messages.length > 0 && (
              <span className="text-[11px] text-emerald-500/90 font-medium">
                • {t.savedLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={autoSpeak ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => {
                if (autoSpeak) stopSpeaking();
                setAutoSpeak((v) => !v);
              }}
              className="h-7 gap-1.5 px-2.5 text-xs"
            >
              {autoSpeak ? <Volume2 className="h-3.5 w-3.5 text-primary" /> : <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />}
              {autoSpeak ? t.voiceOn : t.voiceOff}
            </Button>

            {messages.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                disabled={isClearing || isSending || isRecording}
                className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                {isClearing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                {t.clearChat}
              </Button>
            )}
          </div>
        </div>

        {/* Conversation area */}
        <div
          ref={scrollRef}
          className="flex max-h-[55vh] min-h-[280px] flex-col gap-3 overflow-y-auto rounded-xl border border-border/50 bg-muted/30 p-3 custom-scrollbar"
        >
          {loadingHistory && messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center text-xs text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>{t.loadingChat}</span>
            </div>
          ) : messages.length === 0 && !isSending ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <BrainCircuit className="h-7 w-7 text-primary" />
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">{t.empty}</p>
            </div>
          ) : null}

          {messages.map((msg, index) =>
            msg.role === 'user' ? (
              <div key={index} className="flex justify-end">
                <div className="max-w-[82%] rounded-2xl rounded-br-sm bg-primary/15 px-4 py-2.5 text-sm">
                  {msg.text && <p className="font-medium">{msg.text}</p>}
                  {!msg.text && (msg.audioDataUri || msg.hasAudio) && (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="flex items-end gap-0.5">
                        {[4, 8, 6, 9, 5].map((h, i) => (
                          <span key={i} style={{ height: h }} className="w-0.5 rounded bg-foreground/70" />
                        ))}
                      </span>
                      {t.voiceMsgLabel}
                    </span>
                  )}
                  {msg.audioDataUri && (
                    <audio src={msg.audioDataUri} controls className="mt-2 h-8 w-full min-w-[210px]" preload="metadata" />
                  )}
                  {msg.transcript && (
                    <p className="mt-1.5 text-[11px] italic text-muted-foreground/90">
                      {t.heardLabel} {msg.transcript}
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
                        disabled={loadingTtsIndex === index}
                        onClick={() =>
                          speakingIndex === index
                            ? stopSpeaking()
                            : playTTS(msg.ttsAudioUri, msg.text!, index)
                        }
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50"
                      >
                        {loadingTtsIndex === index ? (
                          <><Loader2 className="h-3 w-3 animate-spin" /> {t.loadingVoice}</>
                        ) : speakingIndex === index ? (
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
                <Square className="h-4 w-4 fill-current" />
                <span>{t.stopRecBtn} ({fmtTime(seconds)})</span>
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
