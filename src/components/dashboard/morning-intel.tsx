'use client';

import { useEffect, useState, useCallback } from 'react';
import { Brain, RefreshCw, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Lang = 'en' | 'ar' | 'es';

const labels: Record<Lang, {
  title: string; subtitle: string; refresh: string;
  generated: string; loading: string; error: string;
  noNews: string;
}> = {
  en: {
    title: 'AURA Morning News',
    subtitle: 'Real-time financial market updates',
    refresh: 'Refresh',
    generated: 'Updated',
    loading: 'Fetching market intelligence…',
    error: 'News feed currently unavailable. Tap to retry.',
    noNews: 'No recent market updates available.',
  },
  ar: {
    title: 'أخبار AURA الصباحية',
    subtitle: 'موجز تحليلات وأخبار الأسواق الحية',
    refresh: 'تحديث',
    generated: 'تحديث في',
    loading: 'جاري جلب أخبار الأسواق الحية…',
    error: 'أخبار السوق غير متاحة حالياً. اضغط تحديث.',
    noNews: 'لا توجد أخبار سوقية متاحة حالياً.',
  },
  es: {
    title: 'Noticias Matutinas AURA',
    subtitle: 'Actualizaciones de mercado en tiempo real',
    refresh: 'Actualizar',
    generated: 'Actualizado',
    loading: 'Obteniendo noticias del mercado…',
    error: 'Noticias no disponibles. Toca actualizar.',
    noNews: 'No hay noticias de mercado disponibles.',
  },
};

export function MorningIntel({ lang = 'en' }: { lang?: Lang }) {
  const [news, setNews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [generatedAt, setGeneratedAt] = useState('');
  const t = labels[lang] ?? labels.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/morning-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setNews(data.items || []);
      setCurrentIndex(0);
      setGeneratedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      setError(true);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (news.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [news]);

  return (
    <div
      dir={dir}
      className="relative rounded-2xl border border-violet-500/25 bg-[radial-gradient(ellipse_at_top_left,_hsl(270_60%_10%/0.4),_transparent_60%)] bg-card overflow-hidden"
    >
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-violet-600/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-purple-500/8 blur-2xl" />

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-4 pt-3 pb-2 border-b border-violet-500/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-600/20 border border-violet-500/30 shadow-[0_0_12px_hsl(270_80%_60%/0.15)]">
            <Brain className="h-3.5 w-3.5 text-violet-300" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              {t.title}
              <Sparkles className="h-2.5 w-2.5 text-violet-400 fill-violet-400/30" />
            </p>
            <p className="text-[9px] font-medium text-violet-400/70 tracking-wide">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {generatedAt && !loading && !error && (
            <span className="hidden sm:flex items-center gap-1 text-[9px] text-muted-foreground/40 font-mono">
              <Clock className="h-2 w-2" />
              {t.generated} {generatedAt}
            </span>
          )}
          <Button
            size="sm" variant="ghost" onClick={load} disabled={loading}
            className="h-6 w-6 p-0 rounded-lg text-muted-foreground hover:text-violet-300 hover:bg-violet-500/10 transition-all"
          >
            <RefreshCw className={`h-2.5 w-2.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="relative z-10 px-4 py-3 min-h-[90px]">
        {loading ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500" />
              </span>
              <p className="text-xs text-muted-foreground/60 italic animate-pulse">{t.loading}</p>
            </div>
            <div className="space-y-1.5 pt-0.5">
              {[95, 80, 88, 65].map((w, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full bg-violet-500/8 animate-pulse"
                  style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex items-start gap-2.5 py-0.5">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500/60 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground/50">{t.error}</p>
          </div>
        ) : news.length === 0 ? (
          <div className="flex items-start gap-2.5 py-0.5">
            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/40 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground/50">{t.noNews}</p>
          </div>
        ) : (
          <div className="relative overflow-hidden min-h-[75px]">
            {news.map((item: any, i: number) => {
              const isActive = i === currentIndex;
              return (
                <div
                  key={i}
                  className={`flex flex-col gap-0.5 text-xs transition-all duration-500 ${
                    isActive
                      ? 'opacity-100 translate-y-0 pointer-events-auto relative'
                      : 'opacity-0 translate-y-2 pointer-events-none absolute inset-0'
                  }`}
                >
                  <h3 className="font-bold text-foreground leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground/80 leading-relaxed line-clamp-2 mt-0.5">
                    {item.contentSnippet}
                  </p>
                  {item.pubDate && (
                    <span className="text-[10px] text-muted-foreground/40 mt-1">
                      {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
    </div>
  );
}
