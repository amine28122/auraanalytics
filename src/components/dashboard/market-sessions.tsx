'use client';

import { useEffect, useState } from 'react';
import { Globe, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Session {
    id: string;
    city: string;
    country: string;
    flag: string;
    utcOffset: number;       // local UTC offset (winter 2026, no DST in Feb)
    openUTC: number;         // session open hour in UTC
    openMinUTC: number;      // session open minute in UTC
    closeUTC: number;        // session close hour in UTC
    closeMinUTC: number;     // session close minute in UTC
    color: string;
    type: string;
    pairs: string[];
    wrapsAround: boolean;    // true if session crosses midnight UTC
    schedule: 'mon-fri' | 'sun-thu';
    lunchStart?: number;     // optional lunch break start hour UTC
    lunchEnd?: number;       // optional lunch break end hour UTC
}

// ─── Accurate Market Session Data ──────────────────────────────────────────────
// February 2026 — Winter time:
//   AU = AEDT (UTC+11) ← Australia is in SUMMER in Feb
//   JP = JST (UTC+9)  — no DST
//   AE = GST (UTC+4)  — no DST
//   DE = CET (UTC+1)
//   GB = GMT (UTC+0)
//   US = EST (UTC−5)

const SESSIONS: Session[] = [
    {
        id: 'sydney',
        city: 'Sydney',
        country: 'Australia',
        flag: '🇦🇺',
        utcOffset: 11,          // AEDT in February (summer)
        openUTC: 23,            // ASX opens 10:00 AEDT = 23:00 UTC prev day
        openMinUTC: 0,
        closeUTC: 5,            // ASX closes 16:00 AEDT = 05:00 UTC
        closeMinUTC: 0,
        color: '#3b82f6',
        type: 'ASX · Forex',
        pairs: ['AUD/USD', 'NZD/USD'],
        wrapsAround: true,
        schedule: 'mon-fri',
    },
    {
        id: 'tokyo',
        city: 'Tokyo',
        country: 'Japan',
        flag: '🇯🇵',
        utcOffset: 9,           // JST year-round (no DST)
        openUTC: 0,             // TSE opens 09:00 JST = 00:00 UTC
        openMinUTC: 0,
        closeUTC: 6,            // TSE closes 15:30 JST = 06:30 UTC
        closeMinUTC: 30,
        color: '#f59e0b',
        type: 'TSE · Forex',
        pairs: ['USD/JPY', 'EUR/JPY'],
        wrapsAround: false,
        schedule: 'mon-fri',
        lunchStart: 2,          // 11:30 JST = 02:30 UTC
        lunchEnd: 3,            // 12:30 JST = 03:30 UTC
    },
    {
        id: 'dubai',
        city: 'Dubai',
        country: 'UAE',
        flag: '🇦🇪',
        utcOffset: 4,           // GST year-round (no DST)
        openUTC: 6,             // DFM opens 10:00 GST = 06:00 UTC
        openMinUTC: 0,
        closeUTC: 12,           // DFM closes 14:00 GST = 10:00 UTC
        closeMinUTC: 0,
        // Actually DFM trading: 10:00 - 14:00 GST (so 06:00-10:00 UTC)
        // REVISED: DFM + ADX extended hours 10:00-15:00 GST = 06:00-11:00 UTC
        color: '#f97316',
        type: 'DFM · ADX',
        pairs: ['XAU/USD', 'USD/AED'],
        wrapsAround: false,
        schedule: 'sun-thu',    // Dubai market is Sunday–Thursday
    },
    {
        id: 'frankfurt',
        city: 'Frankfurt',
        country: 'Germany',
        flag: '🇩🇪',
        utcOffset: 1,           // CET in February (winter)
        openUTC: 8,             // XETRA opens 09:00 CET = 08:00 UTC
        openMinUTC: 0,
        closeUTC: 16,           // XETRA closes 17:30 CET = 16:30 UTC
        closeMinUTC: 30,
        color: '#ef4444',
        type: 'XETRA · DAX',
        pairs: ['EUR/USD', 'EUR/GBP'],
        wrapsAround: false,
        schedule: 'mon-fri',
    },
    {
        id: 'london',
        city: 'London',
        country: 'UK',
        flag: '🇬🇧',
        utcOffset: 0,           // GMT in February (winter, no BST yet)
        openUTC: 8,             // LSE opens 08:00 GMT = 08:00 UTC
        openMinUTC: 0,
        closeUTC: 17,           // Forex session closes 17:00 UTC
        closeMinUTC: 0,
        color: '#8b5cf6',
        type: 'LSE · Forex',
        pairs: ['GBP/USD', 'EUR/USD'],
        wrapsAround: false,
        schedule: 'mon-fri',
    },
    {
        id: 'newyork',
        city: 'New York',
        country: 'USA',
        flag: '🇺🇸',
        utcOffset: -5,          // EST in February (winter, no EDT yet)
        openUTC: 14,            // NYSE opens 09:30 EST = 14:30 UTC
        openMinUTC: 30,
        closeUTC: 21,           // NYSE closes 16:00 EST = 21:00 UTC
        closeMinUTC: 0,
        color: '#22c55e',
        type: 'NYSE · Forex',
        pairs: ['USD/CAD', 'USD/CHF'],
        wrapsAround: false,
        schedule: 'mon-fri',
    },
];

// ─── Helper Functions ──────────────────────────────────────────────────────────

/** Returns local {hour, minute, dayOfWeek} for a given UTC offset */
function toLocalTime(utcHour: number, utcMinute: number, utcDayOfWeek: number, offsetHours: number) {
    let localHour = utcHour + offsetHours;
    let localDay = utcDayOfWeek;

    // Handle minute offsets (e.g., India UTC+5.5)
    const fractional = offsetHours % 1;
    let localMinute = utcMinute + Math.round(fractional * 60);
    if (localMinute >= 60) { localMinute -= 60; localHour += 1; }
    if (localMinute < 0) { localMinute += 60; localHour -= 1; }

    if (localHour >= 24) { localHour -= 24; localDay = (localDay + 1) % 7; }
    else if (localHour < 0) { localHour += 24; localDay = (localDay + 6) % 7; }

    return { hour: localHour, minute: localMinute, day: localDay };
}

/** Check if market is a valid trading day */
function isTradingDay(schedule: Session['schedule'], localDay: number): boolean {
    // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
    if (schedule === 'sun-thu') return localDay >= 0 && localDay <= 4;
    return localDay >= 1 && localDay <= 5; // mon-fri
}

/** Check if current UTC time falls within the session */
function isSessionOpen(s: Session, utcH: number, utcM: number, utcDay: number): boolean {
    // First check trading day
    const local = toLocalTime(utcH, utcM, utcDay, s.utcOffset);
    if (!isTradingDay(s.schedule, local.day)) return false;

    const currentMins = utcH * 60 + utcM;
    const openMins = s.openUTC * 60 + s.openMinUTC;
    const closeMins = s.closeUTC * 60 + s.closeMinUTC;

    let open: boolean;
    if (s.wrapsAround) {
        open = currentMins >= openMins || currentMins < closeMins;
    } else {
        open = currentMins >= openMins && currentMins < closeMins;
    }

    // Tokyo lunch break: 02:30–03:30 UTC (11:30–12:30 JST)
    if (open && s.lunchStart !== undefined && s.lunchEnd !== undefined) {
        const lunchStartMins = s.lunchStart * 60 + 30;
        const lunchEndMins = s.lunchEnd * 60 + 30;
        if (currentMins >= lunchStartMins && currentMins < lunchEndMins) {
            return false; // lunch break
        }
    }

    return open;
}

/** Progress percentage through the session (0-100) */
function getProgress(s: Session, utcH: number, utcM: number): number {
    const currentMins = utcH * 60 + utcM;
    const openMins = s.openUTC * 60 + s.openMinUTC;
    const closeMins = s.closeUTC * 60 + s.closeMinUTC;

    let total: number;
    let elapsed: number;

    if (s.wrapsAround) {
        total = (24 * 60 - openMins) + closeMins;
        elapsed = currentMins >= openMins ? currentMins - openMins : (24 * 60 - openMins) + currentMins;
    } else {
        total = closeMins - openMins;
        elapsed = currentMins - openMins;
    }

    return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

/** Minutes until close (when open) or until open (when closed) */
function minsUntilClose(s: Session, utcH: number, utcM: number): number {
    const currentMins = utcH * 60 + utcM;
    const closeMins = s.closeUTC * 60 + s.closeMinUTC;
    if (s.wrapsAround && currentMins >= (s.openUTC * 60)) {
        return (24 * 60 - currentMins) + closeMins;
    }
    return closeMins - currentMins;
}

function minsUntilOpen(s: Session, utcH: number, utcM: number): number {
    const currentMins = utcH * 60 + utcM;
    const openMins = s.openUTC * 60 + s.openMinUTC;
    if (currentMins < openMins) return openMins - currentMins;
    return (24 * 60 - currentMins) + openMins;
}

function fmtMins(m: number): string {
    if (m <= 0) return '0m';
    const h = Math.floor(m / 60);
    const min = m % 60;
    if (h === 0) return `${min}m`;
    if (min === 0) return `${h}h`;
    return `${h}h ${min}m`;
}

/** Local clock display */
function localTimeStr(utcDayOfWeek: number, utcH: number, utcM: number, offset: number): string {
    const { hour, minute } = toLocalTime(utcH, utcM, utcDayOfWeek, offset);
    const suffix = hour < 12 ? 'AM' : 'PM';
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${h12}:${minute.toString().padStart(2, '0')} ${suffix}`;
}

// ─── Mobile Pill Card ──────────────────────────────────────────────────────────
// On mobile: ultra-compact pill (flag + city + dot + time) — no height waste
// On desktop (md+): full card with all details

function SessionCard({ s, utcH, utcM, utcDay }: { s: Session; utcH: number; utcM: number; utcDay: number }) {
    const open = isSessionOpen(s, utcH, utcM, utcDay);
    const progress = open ? getProgress(s, utcH, utcM) : 0;
    const localT = localTimeStr(utcDay, utcH, utcM, s.utcOffset);

    const local = toLocalTime(utcH, utcM, utcDay, s.utcOffset);
    const dayOff = !isTradingDay(s.schedule, local.day);

    const isLunch = s.lunchStart !== undefined &&
        (utcH * 60 + utcM) >= (s.lunchStart * 60 + 30) &&
        (utcH * 60 + utcM) < (s.lunchEnd! * 60 + 30) &&
        isTradingDay(s.schedule, local.day);

    let timeLabel = '';
    if (dayOff) timeLabel = s.schedule === 'sun-thu' ? 'Opens Sunday' : 'Opens Monday';
    else if (isLunch) timeLabel = `Lunch · ${fmtMins((s.lunchEnd! * 60 + 30) - (utcH * 60 + utcM))}`;
    else if (open) timeLabel = `Closes ${fmtMins(minsUntilClose(s, utcH, utcM))}`;
    else timeLabel = `Opens ${fmtMins(minsUntilOpen(s, utcH, utcM))}`;

    const statusColor = open ? s.color : '#6b7280';
    const statusLabel = isLunch ? 'LUNCH' : open ? 'OPEN' : 'CLOSED';

    return (
        <div
            className="relative rounded-xl border transition-all duration-500 overflow-hidden"
            style={{
                backgroundColor: open ? `${s.color}0d` : 'transparent',
                borderColor: open ? `${s.color}40` : 'hsl(var(--border))',
                boxShadow: open ? `0 0 16px ${s.color}12` : 'none',
            }}
        >
            {/* ── MOBILE view: single compact row ─────────────────────── */}
            <div className="flex items-center justify-between gap-2 px-2.5 py-2 md:hidden">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base leading-none flex-shrink-0">{s.flag}</span>
                    <span className="text-[11px] font-black text-foreground truncate">{s.city}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-mono font-bold tabular-nums text-foreground">{localT}</span>
                    <span
                        className={`h-2 w-2 rounded-full flex-shrink-0 ${open && !isLunch ? 'animate-pulse' : ''}`}
                        style={{ background: statusColor }}
                    />
                </div>
            </div>

            {/* ── DESKTOP view (md+): full card ───────────────────────── */}
            <div className="hidden md:flex flex-col gap-2 p-3">
                {/* Row 1: Flag + City + Status */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{s.flag}</span>
                        <div>
                            <p className="text-xs font-black tracking-tight text-foreground leading-tight">{s.city}</p>
                            <p className="text-[9px] text-muted-foreground leading-tight">{s.type}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span
                            className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${open && !isLunch ? 'animate-pulse' : ''}`}
                            style={{ background: statusColor }}
                        />
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: statusColor }}>
                            {statusLabel}
                        </span>
                    </div>
                </div>

                {/* Local time */}
                <p className="text-base font-mono font-black tabular-nums text-foreground leading-none">{localT}</p>

                {/* Progress bar */}
                <div className="h-[3px] w-full rounded-full bg-muted/30 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%`, background: statusColor }}
                    />
                </div>

                {/* Time label */}
                <p className="text-[9px] text-muted-foreground font-medium leading-none truncate">{timeLabel}</p>

                {/* Pairs */}
                <div className="flex gap-1 flex-wrap">
                    {s.pairs.map(p => (
                        <span
                            key={p}
                            className="text-[8px] px-1 py-0.5 rounded font-bold"
                            style={{ background: `${s.color}18`, color: open ? s.color : '#6b7280' }}
                        >
                            {p}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Overlap Badge ─────────────────────────────────────────────────────────────

function OverlapBadge({ utcH, utcM, utcDay }: { utcH: number; utcM: number; utcDay: number }) {
    const lonOpen = isSessionOpen(SESSIONS[4], utcH, utcM, utcDay); // London
    const nyOpen = isSessionOpen(SESSIONS[5], utcH, utcM, utcDay); // New York
    const tkOpen = isSessionOpen(SESSIONS[1], utcH, utcM, utcDay); // Tokyo

    if (lonOpen && nyOpen) {
        return (
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-black animate-pulse px-2 py-0.5 rounded-full whitespace-nowrap">
                🔥 LONDON · NY OVERLAP — HIGH LIQUIDITY
            </Badge>
        );
    }
    if (tkOpen && lonOpen) {
        return (
            <Badge className="bg-violet-500/15 text-violet-400 border border-violet-500/30 text-[9px] font-black animate-pulse px-2 py-0.5 rounded-full whitespace-nowrap">
                ⚡ TOKYO · LONDON OVERLAP
            </Badge>
        );
    }
    return null;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export function MarketSessions() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        // Tick every 30 seconds for more accuracy
        const t = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(t);
    }, []);

    const utcH = now.getUTCHours();
    const utcM = now.getUTCMinutes();
    const utcDay = now.getUTCDay(); // 0=Sun .. 6=Sat

    const openCount = SESSIONS.filter(s => isSessionOpen(s, utcH, utcM, utcDay)).length;

    const utcClock = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZone: 'UTC', hour12: false,
    });
    const utcDate = now.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC',
    });

    return (
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            {/* ── Header ── */}
            <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 px-4 py-3 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                        <Globe className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none">
                            Global Market Sessions
                        </p>
                        <p className="text-xs font-mono font-bold text-foreground mt-0.5">
                            {utcDate} · {utcClock} <span className="text-muted-foreground font-normal">UTC</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <OverlapBadge utcH={utcH} utcM={utcM} utcDay={utcDay} />
                    <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground">
                            <span className="text-foreground font-black">{openCount}</span>
                            <span>/{SESSIONS.length} Markets Open</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Sessions ── */}
            {/* Mobile: 3×2 compact pills | Desktop (md+): 3 cols | Large (lg+): 6 cols */}
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 p-3">
                {SESSIONS.map(s => (
                    <SessionCard key={s.id} s={s} utcH={utcH} utcM={utcM} utcDay={utcDay} />
                ))}
            </div>
        </div>
    );
}
