'use client';

import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

type Lang = 'en' | 'ar' | 'es';

const labels: Record<Lang, { title: string; fear: string; greed: string }> = {
  en:  { title: 'Market Pulse', fear: 'Fear', greed: 'Greed' },
  ar:  { title: 'نبض السوق',   fear: 'خوف',  greed: 'طمع'  },
  es:  { title: 'Pulso del Mercado', fear: 'Miedo', greed: 'Codicia' },
};

const zones = [
  { max: 20,  label: { en: 'Extreme Fear', ar: 'خوف شديد',    es: 'Miedo Extremo'    }, color: '#ef4444', arc: '#ef4444' },
  { max: 40,  label: { en: 'Fear',         ar: 'خوف',          es: 'Miedo'            }, color: '#f97316', arc: '#f97316' },
  { max: 60,  label: { en: 'Neutral',      ar: 'محايد',        es: 'Neutral'          }, color: '#eab308', arc: '#eab308' },
  { max: 80,  label: { en: 'Greed',        ar: 'طمع',          es: 'Codicia'          }, color: '#22c55e', arc: '#22c55e' },
  { max: 100, label: { en: 'Extreme Greed',ar: 'طمع شديد',     es: 'Codicia Extrema'  }, color: '#16a34a', arc: '#16a34a' },
];

function getZone(score: number) {
  return zones.find(z => score <= z.max) ?? zones[zones.length - 1];
}

function dailyScore(): number {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return Math.round(30 + (Math.abs(Math.sin(seed) * 10000) % 51));
}

// SVG arc helpers
const CX = 90, CY = 90, R = 66;
const A0 = -215, A1 = 35; // start / end angles of the gauge arc
const TOTAL = A1 - A0;

function polar(deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

function arcD(from: number, to: number) {
  const s = polar(from), e = polar(to);
  return `M${s.x},${s.y} A${R},${R} 0 ${to - from > 180 ? 1 : 0},1 ${e.x},${e.y}`;
}

export function MarketPulse({ lang = 'en' }: { lang?: Lang }) {
  const [score, setScore] = useState(0);
  const [animated, setAnimated] = useState(false);
  const t = labels[lang] ?? labels.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const target = dailyScore();
    const id = setTimeout(() => { setScore(target); setAnimated(true); }, 400);
    return () => clearTimeout(id);
  }, []);

  const zone = getZone(score);
  const needleAngle = A0 + (TOTAL * score) / 100;
  const needleTip = polar(animated ? needleAngle : A0);

  // Split arc into 5 coloured segments
  const segmentAngles = zones.map((z, i) => ({
    from: A0 + (TOTAL * (i === 0 ? 0 : zones[i - 1].max)) / 100,
    to:   A0 + (TOTAL * z.max) / 100,
    color: z.arc,
  }));

  return (
    <div
      dir={dir}
      className="relative rounded-2xl border border-cyan-500/20 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(185_60%_8%/0.5),_transparent_60%)] bg-card overflow-hidden flex flex-col"
    >
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-cyan-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-4 pb-3.5 border-b border-cyan-500/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600/30 to-teal-600/20 border border-cyan-500/30 shadow-[0_0_16px_hsl(185_80%_50%/0.12)]">
          <Activity className="h-4.5 w-4.5 text-cyan-300" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-foreground tracking-tight">{t.title}</p>
          <p className="text-[10px] font-medium text-cyan-400/70 tracking-wide">AI Sentiment Index</p>
        </div>
      </div>

      {/* Gauge */}
      <div className="relative z-10 flex flex-col items-center px-4 py-5 flex-1">
        <svg width="180" height="118" viewBox="0 0 180 118" className="overflow-visible">
          {/* Track */}
          <path d={arcD(A0, A1)} fill="none" stroke="hsl(var(--muted)/0.15)" strokeWidth="11" strokeLinecap="round" />

          {/* Coloured segments */}
          {segmentAngles.map((seg, i) => (
            <path
              key={i}
              d={arcD(seg.from, seg.to)}
              fill="none"
              stroke={seg.color}
              strokeWidth="11"
              strokeLinecap={i === 0 ? 'round' : i === segmentAngles.length - 1 ? 'round' : 'butt'}
              opacity="0.55"
            />
          ))}

          {/* Active glow arc */}
          <path
            d={arcD(A0, animated ? needleAngle : A0)}
            fill="none"
            stroke={zone.arc}
            strokeWidth="11"
            strokeLinecap="round"
            opacity="0.9"
            style={{ transition: 'all 1.3s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 6px ${zone.arc}88)` }}
          />

          {/* Needle shadow */}
          <line
            x1={CX} y1={CY}
            x2={animated ? needleTip.x : polar(A0).x}
            y2={animated ? needleTip.y : polar(A0).y}
            stroke="black" strokeWidth="4" strokeLinecap="round" opacity="0.3"
            style={{ transition: 'all 1.3s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
          {/* Needle */}
          <line
            x1={CX} y1={CY}
            x2={animated ? needleTip.x : polar(A0).x}
            y2={animated ? needleTip.y : polar(A0).y}
            stroke="white" strokeWidth="2.5" strokeLinecap="round"
            style={{ transition: 'all 1.3s cubic-bezier(0.34,1.56,0.64,1)' }}
          />

          {/* Center hub */}
          <circle cx={CX} cy={CY} r="8" fill={zone.arc} style={{ filter: `drop-shadow(0 0 8px ${zone.arc}aa)` }} />
          <circle cx={CX} cy={CY} r="3.5" fill="white" />

          {/* Score */}
          <text x={CX} y={CY + 30} textAnchor="middle"
            style={{ fontSize: '26px', fontWeight: 900, fill: 'white', letterSpacing: '-1px' }}>
            {score}
          </text>
        </svg>

        {/* Zone label */}
        <p className="text-base font-black -mt-1 tracking-tight" style={{ color: zone.arc }}>
          {zone.label[lang] ?? zone.label.en}
        </p>

        {/* Fear ←→ Greed bar */}
        <div className="w-full mt-4 flex items-center gap-2">
          <span className="text-[9px] font-bold tracking-widest uppercase text-red-400">{t.fear}</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted/20">
            <div className="h-full w-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 opacity-60 rounded-full" />
          </div>
          <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-400">{t.greed}</span>
        </div>

        {/* Zone pills */}
        <div className="w-full grid grid-cols-5 gap-1 mt-3">
          {zones.map((z, i) => {
            const isActive = getZone(score) === z;
            return (
              <div
                key={i}
                className="flex flex-col items-center py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-wider transition-all"
                style={{
                  borderColor: isActive ? `${z.color}50` : 'transparent',
                  backgroundColor: isActive ? `${z.color}12` : 'transparent',
                  color: isActive ? z.color : 'hsl(var(--muted-foreground)/0.3)',
                }}
              >
                {z.label[lang]?.split(' ')[0] ?? z.label.en.split(' ')[0]}
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </div>
  );
}
