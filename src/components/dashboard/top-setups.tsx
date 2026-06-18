'use client';

import { useEffect, useState, useCallback } from 'react';
import { Target, TrendingUp, TrendingDown, RefreshCw, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Lang = 'en' | 'ar' | 'es';

export type Setup = {
  pair: string;
  type: 'BUY' | 'SELL';
  confidence: number;
  entry: string;
  tp: string;
  sl: string;
  school: string;
  reason: string;
};

const labels: Record<Lang, {
  title: string; subtitle: string; refresh: string;
  loading: string; confidence: string; entry: string;
  tp: string; sl: string; by: string; empty: string;
}> = {
  en: {
    title: "Today's Top Setups",
    subtitle: 'Pre-analyzed by AURA AI every morning',
    refresh: 'Refresh',
    loading: 'Scanning markets…',
    confidence: 'Confidence',
    entry: 'Entry',
    tp: 'TP',
    sl: 'SL',
    by: 'via',
    empty: 'No setups available right now.',
  },
  ar: {
    title: 'أفضل إعدادات اليوم',
    subtitle: 'تحليل مسبق بواسطة AURA AI كل صباح',
    refresh: 'تحديث',
    loading: 'جاري مسح الأسواق…',
    confidence: 'الثقة',
    entry: 'دخول',
    tp: 'هدف',
    sl: 'وقف',
    by: 'عبر',
    empty: 'لا توجد إعدادات متاحة الآن.',
  },
  es: {
    title: 'Mejores Setups de Hoy',
    subtitle: 'Pre-analizados por AURA AI cada mañana',
    refresh: 'Actualizar',
    loading: 'Escaneando mercados…',
    confidence: 'Confianza',
    entry: 'Entrada',
    tp: 'TP',
    sl: 'SL',
    by: 'via',
    empty: 'No hay setups disponibles ahora.',
  },
};

async function fetchTopSetups(lang: Lang): Promise<Setup[]> {
  const res = await fetch('/api/top-setups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lang }),
  });
  if (!res.ok) throw new Error('Failed');
  const data = await res.json();
  return data.setups as Setup[];
}

function ConfidenceRing({ value }: { value: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const color = value >= 85 ? '#22c55e' : value >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="44" height="44" className="shrink-0 -rotate-90">
      <circle cx="22" cy="22" r={r} fill="none" stroke="hsl(var(--muted)/0.3)" strokeWidth="3.5" />
      <circle
        cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - value / 100)}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      <text
        x="22" y="22"
        textAnchor="middle" dominantBaseline="central"
        className="rotate-90"
        style={{ fontSize: '9px', fontWeight: 800, fill: color, transform: 'rotate(90deg)', transformOrigin: '22px 22px' }}
      >
        {value}%
      </text>
    </svg>
  );
}

export function TopSetups({ lang = 'en' }: { lang?: Lang }) {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const t = labels[lang] ?? labels.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setSetups(await fetchTopSetups(lang));
    } catch {
      setError(true);
      setSetups([]);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => { load(); }, [load]);

  return (
    <div
      dir={dir}
      className="relative rounded-2xl border border-blue-500/20 bg-[radial-gradient(ellipse_at_top_right,_hsl(220_60%_10%/0.4),_transparent_60%)] bg-card overflow-hidden flex flex-col"
    >
      <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-3.5 border-b border-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/30 to-cyan-600/20 border border-blue-500/30 shadow-[0_0_16px_hsl(220_80%_60%/0.15)]">
            <Target className="h-4.5 w-4.5 text-blue-300" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              {t.title}
              <Zap className="h-3 w-3 text-blue-400 fill-blue-400/30" />
            </p>
            <p className="text-[10px] font-medium text-blue-400/70 tracking-wide">{t.subtitle}</p>
          </div>
        </div>
        <Button
          size="sm" variant="ghost" onClick={load} disabled={loading}
          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-blue-300 hover:bg-blue-500/10"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Body */}
      <div className="relative z-10 px-5 py-4 flex flex-col gap-3 flex-1">
        {loading ? (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[90px] rounded-2xl bg-muted/10 border border-muted/20 animate-pulse" style={{ animationDelay: `${(i - 1) * 100}ms` }} />
            ))}
          </>
        ) : error || setups.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <AlertCircle className="h-7 w-7 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground/40">{error ? 'Could not load setups.' : t.empty}</p>
          </div>
        ) : (
          setups.map((s, i) => {
            const isBuy = s.type === 'BUY';
            return (
              <div
                key={i}
                className={`group relative rounded-2xl border p-4 flex items-center gap-4 transition-all duration-200 hover:scale-[1.015] ${
                  isBuy
                    ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/8 hover:border-emerald-500/35 hover:shadow-[0_0_24px_hsl(142_76%_36%/0.1)]'
                    : 'border-red-500/20 bg-red-500/5 hover:bg-red-500/8 hover:border-red-500/35 hover:shadow-[0_0_24px_hsl(0_72%_51%/0.1)]'
                }`}
              >
                {/* Direction pill */}
                <div className={`flex flex-col items-center justify-center h-10 w-16 rounded-xl font-black text-[11px] tracking-widest ${
                  isBuy ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-red-500/15 text-red-400 border border-red-500/25'
                }`}>
                  {isBuy ? <TrendingUp className="h-3.5 w-3.5 mb-0.5" /> : <TrendingDown className="h-3.5 w-3.5 mb-0.5" />}
                  {s.type}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-black text-sm text-foreground">{s.pair}</span>
                    <span className="text-[9px] text-muted-foreground/50 bg-muted/30 px-1.5 py-0.5 rounded-full font-medium">{s.school}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono mb-1.5">
                    <span className="text-muted-foreground/60">{t.entry} <span className="text-foreground font-bold">{s.entry}</span></span>
                    <span className="text-emerald-400">{t.tp} <span className="font-bold">{s.tp}</span></span>
                    <span className="text-red-400">{t.sl} <span className="font-bold">{s.sl}</span></span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 leading-relaxed line-clamp-1">{s.reason}</p>
                </div>

                {/* Confidence ring */}
                <ConfidenceRing value={s.confidence} />
              </div>
            );
          })
        )}
      </div>

      <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    </div>
  );
}
