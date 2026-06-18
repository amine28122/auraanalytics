'use client';

import { useEffect, useState, useCallback } from 'react';
import { Brain, RefreshCw, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Lang = 'en' | 'ar' | 'es';

const labels: Record<Lang, {
  title: string; subtitle: string; refresh: string;
  generated: string; loading: string; error: string;
}> = {
  en: {
    title: 'AURA Morning Intel',
    subtitle: 'AI-generated daily market briefing',
    refresh: 'Refresh',
    generated: 'Generated',
    loading: 'Analyzing global markets…',
    error: 'Briefing unavailable. Tap refresh to retry.',
  },
  ar: {
    title: 'تقرير AURA الصباحي',
    subtitle: 'تقرير السوق اليومي بالذكاء الاصطناعي',
    refresh: 'تحديث',
    generated: 'تم في',
    loading: 'جاري تحليل الأسواق العالمية…',
    error: 'التقرير غير متاح. اضغط تحديث للمحاولة.',
  },
  es: {
    title: 'Intel Matutino AURA',
    subtitle: 'Informe diario generado por IA',
    refresh: 'Actualizar',
    generated: 'Generado',
    loading: 'Analizando mercados globales…',
    error: 'Informe no disponible. Toca actualizar.',
  },
};

async function fetchMorningIntel(lang: Lang): Promise<string> {
  const res = await fetch('/api/morning-intel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lang }),
  });
  if (!res.ok) throw new Error('Failed');
  const data = await res.json();
  return data.brief as string;
}

export function MorningIntel({ lang = 'en' }: { lang?: Lang }) {
  const [brief, setBrief] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [generatedAt, setGeneratedAt] = useState('');
  const t = labels[lang] ?? labels.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const text = await fetchMorningIntel(lang);
      setBrief(text);
      setGeneratedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      setError(true);
      setBrief('');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => { load(); }, [load]);

  const lines = brief
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  return (
    <div
      dir={dir}
      className="relative rounded-2xl border border-violet-500/25 bg-[radial-gradient(ellipse_at_top_left,_hsl(270_60%_10%/0.4),_transparent_60%)] bg-card overflow-hidden"
    >
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-violet-600/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-purple-500/8 blur-2xl" />

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 pt-4 pb-3.5 border-b border-violet-500/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-purple-600/20 border border-violet-500/30 shadow-[0_0_16px_hsl(270_80%_60%/0.15)]">
            <Brain className="h-4.5 w-4.5 text-violet-300" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              {t.title}
              <Sparkles className="h-3 w-3 text-violet-400 fill-violet-400/30" />
            </p>
            <p className="text-[10px] font-medium text-violet-400/70 tracking-wide">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {generatedAt && !loading && !error && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground/40 font-mono">
              <Clock className="h-2.5 w-2.5" />
              {t.generated} {generatedAt}
            </span>
          )}
          <Button
            size="sm" variant="ghost" onClick={load} disabled={loading}
            className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-violet-300 hover:bg-violet-500/10 transition-all"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="relative z-10 px-5 py-5 min-h-[120px]">
        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </span>
              <p className="text-sm text-muted-foreground/60 italic animate-pulse">{t.loading}</p>
            </div>
            <div className="space-y-2 pt-1">
              {[100, 85, 92, 70].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded-full bg-violet-500/8 animate-pulse"
                  style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 py-1">
            <AlertCircle className="h-4 w-4 text-amber-500/60 mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground/50">{t.error}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {lines.map((line, i) => {
              const isBullet = /^[•\-\*]/.test(line) || /^\d+[\.\)]/.test(line);
              const isBold = /^\*\*.*\*\*$/.test(line);
              const clean = line
                .replace(/^[•\-\*\d]+[\.\)]\s*/, '')
                .replace(/^\*\*(.+)\*\*$/, '$1');

              if (i === 0 || isBold) {
                return (
                  <p key={i} className="text-sm font-bold text-foreground/90 leading-snug">
                    {clean}
                  </p>
                );
              }
              if (isBullet) {
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500/50" />
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{clean}</p>
                  </div>
                );
              }
              return (
                <p key={i} className="text-[13px] text-muted-foreground leading-relaxed">{line}</p>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
    </div>
  );
}
