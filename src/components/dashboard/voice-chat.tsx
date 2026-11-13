'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BrainCircuit, Mic, Square, Loader2, Play, Pause, Volume2, VolumeX,
  UploadCloud, AlertCircle, Send, Trash2, Camera, ImagePlus, X,
  TrendingUp, TrendingDown, ShieldAlert, Target, Sparkles
} from 'lucide-react';
import { useAuth } from '@/firebase';
import { useLanguage } from '@/context/LanguageContext';

type Lang = 'en' | 'ar' | 'es';

export type AuraTradeSetup = {
  symbol: string;
  timeframe: string;
  direction: 'BUY' | 'SELL' | 'WAIT';
  entry: string;
  stopLoss: string;
  takeProfits: string[];
  riskReward: string;
  confidence: number;
  setupType?: string;
};

type Message = {
  role: 'user' | 'ai';
  text?: string;
  spokenSummary?: string;
  audioDataUri?: string;
  imageDataUri?: string;
  hasAudio?: boolean;
  hasImage?: boolean;
  transcript?: string;
  ttsAudioUri?: string;
  tradeSetup?: AuraTradeSetup;
  ts?: string;
};

// Tiny valid silent WAV used to unlock HTMLAudioElement inside user gesture handlers
const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

const labels: Record<Lang, {
  recordBtn: string; stopRecBtn: string; uploadAudioBtn: string;
  captureChartBtn: string; uploadChartBtn: string; analyzeChartNow: string;
  aiThinking: string; playVoice: string; stopVoice: string; loadingVoice: string;
  errorMic: string; errorEmpty: string; errorSend: string; empty: string;
  micUnsupported: string; micDenied: string; captureDenied: string;
  micTip: string; placeholder: string; clearChat: string;
  voiceOn: string; voiceOff: string; savedLabel: string; voiceMsgLabel: string;
  chartMsgLabel: string; heardLabel: string; loadingChat: string;
  entryLabel: string; slLabel: string; tpLabel: string; rrLabel: string; confLabel: string;
}> = {
  en: {
    recordBtn: 'Voice',
    stopRecBtn: 'Stop & Send',
    uploadAudioBtn: 'Audio file',
    captureChartBtn: 'Capture Chart',
    uploadChartBtn: 'Chart Image',
    analyzeChartNow: 'Analyze Chart & Give Setup',
    aiThinking: 'AURA is calculating numbers & setup...',
    playVoice: 'Play',
    stopVoice: 'Stop',
    loadingVoice: 'Loading voice...',
    errorMic: 'Microphone blocked. Allow Microphone permission in your browser address bar, then try again.',
    micUnsupported: 'Voice recording is not supported in this browser. Try Chrome/Edge or use Audio file.',
    micDenied: 'Microphone denied. Click the lock/mic icon in the address bar, allow Microphone, then try again.',
    captureDenied: 'Screen capture was cancelled or blocked here. Use "Chart Image" or paste any screenshot directly with Ctrl+V.',
    micTip: 'Ask any question for exact numerical insights, or capture / upload / paste (Ctrl+V) a chart screenshot to receive a complete trade setup with full explanation.',
    errorEmpty: 'Recording was too short or silent — please speak clearly and try again.',
    errorSend: 'Could not process your request. Please try again.',
    empty: 'Ask AURA anything with live numbers, or attach/capture a chart screenshot for a full trade setup.',
    placeholder: 'Ask about any market, or paste (Ctrl+V) a chart screenshot and ask for a setup...',
    clearChat: 'New Chat',
    voiceOn: 'Auto-Voice On',
    voiceOff: 'Auto-Voice Off',
    savedLabel: 'Saved',
    voiceMsgLabel: 'Voice message',
    chartMsgLabel: 'Chart screenshot attached',
    heardLabel: 'What I heard:',
    loadingChat: 'Loading conversation...',
    entryLabel: 'Entry',
    slLabel: 'Stop Loss',
    tpLabel: 'Targets',
    rrLabel: 'R : R',
    confLabel: 'Confidence',
  },
  ar: {
    recordBtn: 'رسالة صوتية',
    stopRecBtn: 'إيقاف وإرسال',
    uploadAudioBtn: 'ملف صوتي',
    captureChartBtn: 'لقطة شاشة للشارت',
    uploadChartBtn: 'صورة شارت',
    analyzeChartNow: 'تحليل الشارت واستخراج الصفقة الآن',
    aiThinking: 'أورا تحسب الأرقام وتحلل الصفقة...',
    playVoice: 'استماع',
    stopVoice: 'إيقاف',
    loadingVoice: 'جاري تحميل الصوت...',
    errorMic: 'تعذر تشغيل الميكروفون. تأكد من السماح بالمايك من أيقونة المتصفح وحاول مجدداً.',
    micUnsupported: 'التسجيل الصوتي غير مدعوم في هذا المتصفح. استخدم Chrome أو Edge أو ارفع ملفاً صوتياً.',
    micDenied: 'تم رفض إذن الميكروفون. اضغط على أيقونة القفل/المايك بجانب الرابط، اسمح بالمايك ثم أعد المحاولة.',
    captureDenied: 'تم إلغاء التقاط الشاشة أو حظره في هذا الإطار. يمكنك رفع صورة الشارت مباشرة أو لصقها بـ Ctrl+V.',
    micTip: 'اسأل أورا أي سؤال لتعطيك إجابة بالأرقام الدقيقة، أو التقط لقطة شاشة / ارفع صورة / الصق (Ctrl+V) للشارت لتستخرج لك صفقة مكتوبة باحترافية مع الشرح وتقرأها بصوتها.',
    errorEmpty: 'التسجيل قصير جداً أو بدون صوت — تحدث بوضوح لفترة أطول ثم أعد المحاولة.',
    errorSend: 'تعذرت معالجة طلبك. حاول مرة أخرى.',
    empty: 'اسأل أورا عن أي سوق أو سعر، أو أرسل لقطة شاشة للشارت لتعطيك صفقة احترافية بالأرقام مع الشرح.',
    placeholder: 'اسأل عن أي سوق بالأرقام، أو الصق لقطة شاشة للشارت (Ctrl+V) واطلب صفقة...',
    clearChat: 'محادثة جديدة',
    voiceOn: 'الصوت التلقائي: مفعل',
    voiceOff: 'الصوت التلقائي: صامت',
    savedLabel: 'محفوظة',
    voiceMsgLabel: 'رسالة صوتية',
    chartMsgLabel: 'تم إرفاق لقطة شارت',
    heardLabel: 'ما سمعته أورا:',
    loadingChat: 'جاري تحميل المحادثة المحفوظة...',
    entryLabel: 'الدخول',
    slLabel: 'وقف الخسارة',
    tpLabel: 'الأهداف',
    rrLabel: 'العائد / المخاطرة',
    confLabel: 'الثقة',
  },
  es: {
    recordBtn: 'Grabar voz',
    stopRecBtn: 'Detener y enviar',
    uploadAudioBtn: 'Subir audio',
    captureChartBtn: 'Capturar gráfico',
    uploadChartBtn: 'Subir gráfico',
    analyzeChartNow: 'Analizar gráfico y dar setup',
    aiThinking: 'AURA está calculando números y setup...',
    playVoice: 'Escuchar',
    stopVoice: 'Detener',
    loadingVoice: 'Cargando voz...',
    errorMic: 'Micrófono bloqueado. Permite el acceso al micrófono en tu navegador e inténtalo de nuevo.',
    micUnsupported: 'La grabación no es compatible aquí. Usa Chrome/Edge o Subir audio.',
    micDenied: 'Micrófono denegado. Permite el micrófono en la barra de direcciones e inténtalo de nuevo.',
    captureDenied: 'Captura cancelada o bloqueada. Usa "Subir gráfico" o pega una captura con Ctrl+V.',
    micTip: 'Pregunta cualquier cosa para recibir cifras reales, o captura / sube / pega (Ctrl+V) un gráfico para recibir un setup completo.',
    errorEmpty: 'Grabación demasiado corta o vacía — habla más claro e inténtalo de nuevo.',
    errorSend: 'No se pudo procesar tu solicitud. Inténtalo de nuevo.',
    empty: 'Pregunta a AURA con datos reales o adjunta una captura de gráfico para un setup profesional.',
    placeholder: 'Pregunta por un mercado o pega (Ctrl+V) un gráfico para pedir un setup...',
    clearChat: 'Nuevo chat',
    voiceOn: 'Voz auto: Activa',
    voiceOff: 'Voz auto: Silencio',
    savedLabel: 'Guardado',
    voiceMsgLabel: 'Mensaje de voz',
    chartMsgLabel: 'Captura de gráfico adjunta',
    heardLabel: 'Lo que escuché:',
    loadingChat: 'Cargando conversación...',
    entryLabel: 'Entrada',
    slLabel: 'Stop Loss',
    tpLabel: 'Objetivos',
    rrLabel: 'R : B',
    confLabel: 'Confianza',
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

/** Downscale large chart images smoothly so upload is fast and crystal-clear for Gemini Vision */
async function compressChartImage(dataUrl: string, maxWidth = 1600): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      if (img.width <= maxWidth && dataUrl.length < 1_500_000) {
        resolve(dataUrl);
        return;
      }
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function TradeSetupCard({ setup, t }: { setup: AuraTradeSetup; t: typeof labels['en'] }) {
  const isBuy = setup.direction === 'BUY';
  const isSell = setup.direction === 'SELL';
  const badgeColor = isBuy
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    : isSell
      ? 'bg-red-500/15 text-red-400 border-red-500/30'
      : 'bg-amber-500/15 text-amber-400 border-amber-500/30';

  return (
    <div className="my-2.5 rounded-xl border border-primary/25 bg-background/70 p-3 text-xs shadow-inner">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`gap-1 font-bold ${badgeColor}`}>
            {isBuy ? <TrendingUp className="h-3.5 w-3.5" /> : isSell ? <TrendingDown className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
            {setup.direction}
          </Badge>
          <span className="font-bold text-sm tracking-tight text-foreground">{setup.symbol}</span>
          <Badge variant="secondary" className="text-[10px] font-mono">{setup.timeframe}</Badge>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-muted-foreground">{t.confLabel}: <strong className="text-primary">{setup.confidence}%</strong></span>
          <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[10px]">
            {t.rrLabel}: {setup.riskReward}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-muted/40 p-2">
          <span className="block text-[10px] text-muted-foreground">{t.entryLabel}</span>
          <span className="font-mono font-bold text-foreground">{setup.entry}</span>
        </div>
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2">
          <span className="block text-[10px] text-red-400">{t.slLabel}</span>
          <span className="font-mono font-bold text-red-400">{setup.stopLoss}</span>
        </div>
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2">
          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Target className="h-3 w-3" /> {t.tpLabel}
          </span>
          <div className="font-mono font-bold text-emerald-400 space-y-0.5">
            {setup.takeProfits.length > 0 ? (
              setup.takeProfits.map((tp, i) => (
                <div key={i}>TP{i + 1}: {tp}</div>
              ))
            ) : (
              <div>1:2+ Structure</div>
            )}
          </div>
        </div>
      </div>

      {setup.setupType && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary shrink-0" />
          <span>{setup.setupType}</span>
        </div>
      )}
    </div>
  );
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
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [error, setError] = useState('');
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [loadingTtsIndex, setLoadingTtsIndex] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [pendingChartImage, setPendingChartImage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordStartMsRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pendingChartRef = useRef<string | null>(null);

  useEffect(() => {
    pendingChartRef.current = pendingChartImage;
  }, [pendingChartImage]);

  const storageKey = user?.uid ? `aura_voice_chat_${user.uid}` : null;

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

  // Persist local lightweight copy of chat messages
  useEffect(() => {
    if (!storageKey) return;
    try {
      const compact = messages.slice(-50).map((m) => ({
        role: m.role,
        text: m.text,
        spokenSummary: m.spokenSummary,
        hasAudio: m.hasAudio || Boolean(m.audioDataUri),
        hasImage: m.hasImage || Boolean(m.imageDataUri),
        transcript: m.transcript,
        tradeSetup: m.tradeSetup,
        ts: m.ts,
      }));
      localStorage.setItem(storageKey, JSON.stringify(compact));
    } catch {}
  }, [messages, storageKey]);

  // Load persisted conversation from localStorage + Firestore on mount
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
        if (!cancelled && data?.ok && Array.isArray(data.history) && data.history.length > 0) {
          setMessages(data.history);
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
      if (audioElRef.current) audioElRef.current.pause();
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
    async (ttsAudioUri: string | undefined, speechText: string, index: number) => {
      stopSpeaking();
      let audioUri = ttsAudioUri;

      if (!audioUri && speechText) {
        setLoadingTtsIndex(index);
        try {
          const token = user ? await user.getIdToken().catch(() => '') : '';
          const res = await fetch('/api/speak', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ ttsOnly: true, text: speechText, lang }),
          });
          const data = await res.json();
          if (data?.ok && typeof data.ttsAudioUri === 'string' && data.ttsAudioUri) {
            audioUri = data.ttsAudioUri;
            setMessages((prev) =>
              prev.map((m, idx) => (idx === index ? { ...m, ttsAudioUri: audioUri } : m))
            );
          }
        } catch {
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
          speakFallback(speechText, index);
        };
        try {
          await el.play();
        } catch {
          speakFallback(speechText, index);
        }
      } else {
        speakFallback(speechText, index);
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

  // Core send function — handles text, audio, chart image, or combinations
  const sendToAPI = useCallback(
    async (payload: { audio?: string; text?: string; image?: string }) => {
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
        const spokenSummary = typeof data.spokenSummary === 'string' ? data.spokenSummary : undefined;
        const ttsAudioUri: string | undefined =
          typeof data.ttsAudioUri === 'string' && data.ttsAudioUri ? data.ttsAudioUri : undefined;
        const tradeSetup: AuraTradeSetup | undefined = data.tradeSetup || undefined;

        let aiMsgIndex = -1;
        setMessages((prev) => {
          const next = [...prev];
          if (transcript && !payload.text) {
            const last = next[next.length - 1];
            if (last && last.role === 'user') {
              next[next.length - 1] = { ...last, transcript, hasAudio: Boolean(payload.audio) };
            }
          }
          aiMsgIndex = next.length;
          next.push({
            role: 'ai',
            text: data.text,
            spokenSummary,
            ttsAudioUri,
            tradeSetup,
            ts: new Date().toISOString(),
          });
          return next;
        });

        const speechTarget = spokenSummary || data.text;
        if (autoSpeak && speechTarget) {
          requestAnimationFrame(() => {
            if (aiMsgIndex >= 0) {
              playTTS(ttsAudioUri, speechTarget, aiMsgIndex);
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

  // Send text (and optional attached chart screenshot) OR analyze attached chart directly
  const sendMessage = useCallback(() => {
    const msg = textInput.trim();
    const img = pendingChartImage;
    if ((!msg && !img) || isSending || isRecording) return;

    unlockAudioPlayback();
    stopSpeaking();
    setTextInput('');
    setPendingChartImage(null);

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: msg || undefined,
        imageDataUri: img || undefined,
        hasImage: Boolean(img),
        ts: new Date().toISOString(),
      },
    ]);

    sendToAPI({
      ...(msg ? { text: msg } : {}),
      ...(img ? { image: img } : {}),
    });
    textareaRef.current?.focus();
  }, [textInput, pendingChartImage, isSending, isRecording, unlockAudioPlayback, stopSpeaking, sendToAPI]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // Support Ctrl+V / Cmd+V screenshot paste anywhere in the composer
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
          const rawUrl = typeof reader.result === 'string' ? reader.result : '';
          if (rawUrl) {
            const compressed = await compressChartImage(rawUrl);
            setPendingChartImage(compressed);
            setError('');
          }
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  }, []);

  // Capture screenshot of any open chart tab/window using browser Screen Capture
  const handleCaptureChart = useCallback(async () => {
    setError('');
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
      setError(t.captureDenied);
      return;
    }

    setIsCapturing(true);
    let displayStream: MediaStream | null = null;
    try {
      displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const track = displayStream.getVideoTracks()[0];
      if (!track) throw new Error('No video track');

      const video = document.createElement('video');
      video.srcObject = displayStream;
      video.muted = true;
      await video.play();

      // Wait briefly so the captured frame renders cleanly
      await new Promise((r) => setTimeout(r, 150));

      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      const scale = Math.min(1, 1600 / w);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const snapshotDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setPendingChartImage(snapshotDataUrl);
      textareaRef.current?.focus();
    } catch {
      setError(t.captureDenied);
    } finally {
      if (displayStream) {
        displayStream.getTracks().forEach((tr) => tr.stop());
      }
      setIsCapturing(false);
    }
  }, [t]);

  const onChartImageSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const rawUrl = typeof reader.result === 'string' ? reader.result : '';
      if (rawUrl) {
        const compressed = await compressChartImage(rawUrl);
        setPendingChartImage(compressed);
        textareaRef.current?.focus();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

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

        const attachedImg = pendingChartRef.current;
        if (attachedImg) setPendingChartImage(null);

        const previewUrl = URL.createObjectURL(blob);
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            audioDataUri: previewUrl,
            imageDataUri: attachedImg || undefined,
            hasAudio: true,
            hasImage: Boolean(attachedImg),
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
          sendToAPI({
            audio: dataUrl,
            ...(attachedImg ? { image: attachedImg } : {}),
          });
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

  const onAudioFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      unlockAudioPlayback();
      stopSpeaking();
      setError('');

      const attachedImg = pendingChartRef.current;
      if (attachedImg) setPendingChartImage(null);

      const previewUrl = URL.createObjectURL(file);
      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          text: file.name,
          audioDataUri: previewUrl,
          imageDataUri: attachedImg || undefined,
          hasAudio: true,
          hasImage: Boolean(attachedImg),
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
        sendToAPI({
          audio: resultStr,
          ...(attachedImg ? { image: attachedImg } : {}),
        });
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
    <Card className="card-glow mx-auto w-full max-w-3xl" onPaste={handlePaste}>
      <CardContent className="flex flex-col gap-4 p-4 sm:p-6" dir={dir}>
        {/* Hidden persistent audio element for reliable TTS playback */}
        <audio ref={audioElRef} className="hidden" preload="auto" />

        {/* Top status & action bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-[11px] font-medium">
              <BrainCircuit className="h-3.5 w-3.5 text-primary" />
              AURA Institutional AI
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
          className="flex max-h-[58vh] min-h-[300px] flex-col gap-3 overflow-y-auto rounded-xl border border-border/50 bg-muted/30 p-3 custom-scrollbar"
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
              <p className="max-w-md text-sm text-muted-foreground">{t.empty}</p>
            </div>
          ) : null}

          {messages.map((msg, index) =>
            msg.role === 'user' ? (
              <div key={index} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary/15 px-4 py-2.5 text-sm space-y-2">
                  {msg.imageDataUri && (
                    <img
                      src={msg.imageDataUri}
                      alt="Chart Screenshot"
                      className="max-h-52 w-auto rounded-lg border border-border/60 object-contain"
                    />
                  )}
                  {!msg.imageDataUri && msg.hasImage && (
                    <div className="flex items-center gap-1.5 text-xs text-primary/80">
                      <Camera className="h-3.5 w-3.5" />
                      <span>{t.chartMsgLabel}</span>
                    </div>
                  )}
                  {msg.text && <p className="font-medium whitespace-pre-wrap">{msg.text}</p>}
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
                    <audio src={msg.audioDataUri} controls className="h-8 w-full min-w-[210px]" preload="metadata" />
                  )}
                  {msg.transcript && (
                    <p className="text-[11px] italic text-muted-foreground/90">
                      {t.heardLabel} {msg.transcript}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div key={index} className="flex justify-start">
                <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-border/60 bg-card px-4 py-3 shadow-sm">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1 text-[10px]">
                      <BrainCircuit className="h-3 w-3" /> AURA
                    </Badge>
                    {(msg.spokenSummary || msg.text) && (
                      <button
                        type="button"
                        disabled={loadingTtsIndex === index}
                        onClick={() =>
                          speakingIndex === index
                            ? stopSpeaking()
                            : playTTS(msg.ttsAudioUri, msg.spokenSummary || msg.text!, index)
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

                  {msg.tradeSetup && <TradeSetupCard setup={msg.tradeSetup} t={t} />}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

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

        {/* Attached Chart Screenshot Preview */}
        {pendingChartImage && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-2.5">
            <div className="flex items-center gap-3">
              <img
                src={pendingChartImage}
                alt="Pending Chart"
                className="h-16 w-28 rounded-lg border border-border object-cover"
              />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">{t.chartMsgLabel}</p>
                <Button
                  type="button"
                  size="sm"
                  onClick={sendMessage}
                  disabled={isSending || isRecording}
                  className="h-7 gap-1.5 text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {t.analyzeChartNow}
                </Button>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setPendingChartImage(null)}
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Text input row */}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
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
            onClick={sendMessage}
            disabled={(!textInput.trim() && !pendingChartImage) || isSending || isRecording}
            className="h-[42px] w-[42px] shrink-0 rounded-xl"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Voice + Chart Screenshot Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {isRecording ? (
              <Button size="sm" variant="destructive" className="animate-pulse gap-2 h-9 px-3.5" onClick={stopRecording}>
                <Square className="h-4 w-4 fill-current" />
                <span>{t.stopRecBtn} ({fmtTime(seconds)})</span>
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="gap-2 h-9 px-3.5" onClick={startRecording} disabled={isSending}>
                <Mic className="h-4 w-4 text-primary" />
                {t.recordBtn}
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-2 h-9 px-3.5"
              onClick={handleCaptureChart}
              disabled={isSending || isRecording || isCapturing}
            >
              {isCapturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4 text-primary" />}
              {t.captureChartBtn}
            </Button>

            <label className="relative inline-flex">
              <Button variant="outline" size="sm" asChild disabled={isSending || isRecording} className="h-9 px-3.5">
                <span className="cursor-pointer gap-2">
                  <ImagePlus className="h-4 w-4 text-primary" />
                  {t.uploadChartBtn}
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={onChartImageSelected}
                disabled={isSending || isRecording}
              />
            </label>

            <label className="relative inline-flex">
              <Button variant="outline" size="sm" asChild disabled={isSending || isRecording} className="h-9 px-3.5">
                <span className="cursor-pointer gap-2">
                  <UploadCloud className="h-4 w-4" />
                  {t.uploadAudioBtn}
                </span>
              </Button>
              <input
                type="file"
                accept="audio/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={onAudioFileSelected}
                disabled={isSending || isRecording}
              />
            </label>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground/70">{t.micTip}</p>
      </CardContent>
    </Card>
  );
}
