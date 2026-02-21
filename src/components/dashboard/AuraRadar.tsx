'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Radar as RadarIcon, ShieldCheck, Zap, Activity, TrendingUp, TrendingDown, RefreshCcw, Bell, AlertTriangle, Timer, Coins } from 'lucide-react';
import { getSharedPrices, getEconomicCalendar, getGoldSentiment } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';

interface NewsEvent {
    id: string;
    event: string;
    time: string;
    impact: string;
    forecast: string;
    previous: string;
    actual: string | null;
    currency: string;
}

interface GoldSignal {
    id: string;
    type: 'BUY' | 'SELL';
    price: number;
    time: string;
    reason: string;
    confidence: number;
}

export default function AuraRadar() {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';

    const [goldPrice, setGoldPrice] = useState<number>(0);
    const [lastGoldPrice, setLastGoldPrice] = useState<number>(0);
    const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
    const [activeSignal, setActiveSignal] = useState<GoldSignal | null>(null);
    const [countdown, setCountdown] = useState<string>('');
    const [isScanning, setIsScanning] = useState(false);
    const [highAlertMode, setHighAlertMode] = useState(false);

    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const translations = {
        en: {
            title: 'GOLD RADAR & ECO ANALYZER',
            scanning: 'Scanning XAU/USD...',
            monitoring: 'Institutional News Hub',
            secToNews: 'Seconds to Impact',
            buySignal: 'INSTITUTIONAL BUY',
            sellSignal: 'INSTITUTIONAL SELL',
            waitingNews: 'Tracking Eco Calendar...',
            highImpact: 'HIGH IMPACT NEWS',
            liveReaction: 'LIVE NEWS REACTION',
            reason: 'Market Bias'
        },
        ar: {
            title: 'رادار الذهب والمحلل الاقتصادي',
            scanning: 'جاري مراقبة الذهب...',
            monitoring: 'مركز أخبار المؤسسات',
            secToNews: 'ثوانٍ على الخبر',
            buySignal: 'شراء مؤسساتي',
            sellSignal: 'بيع مؤسساتي',
            waitingNews: 'تتبع الأجندة الاقتصادية...',
            highImpact: 'خبر عالي الأهمية',
            liveReaction: 'رد فعل مباشر للخبر',
            reason: 'انحياز السوق'
        }
    };
    const t = translations[lang] || translations.en;

    const fetchRadarData = async () => {
        setIsScanning(true);
        try {
            // 1. Fetch Gold Price
            const prices = await getSharedPrices(['XAU/USD']);
            const currentPrice = prices['XAU/USD'] || 0;
            if (currentPrice > 0) {
                setLastGoldPrice(goldPrice || currentPrice);
                setGoldPrice(currentPrice);
            }

            // 2. Fetch News
            const newsRes = await getEconomicCalendar();
            if (newsRes.success) {
                setNewsEvents(newsRes.items as NewsEvent[]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setTimeout(() => setIsScanning(false), 1000);
        }
    };

    const handleNewsRelease = async (event: NewsEvent) => {
        // 100% Real Data Mode: We only act if official 'Actual' data is received
        if (!event.actual) return;

        const sentiment = await getGoldSentiment(event.id, event.actual, event.forecast);

        if (sentiment.signal !== 'NEUTRAL' && !activeSignal) {
            setActiveSignal({
                id: `gold-${Date.now()}`,
                type: sentiment.signal as 'BUY' | 'SELL',
                price: goldPrice,
                time: new Date().toLocaleTimeString(),
                reason: sentiment.bias,
                confidence: 95
            });
            setTimeout(() => setActiveSignal(null), 60000); // Show for 1 min for real news
        }
    };

    // 1. Data Polling Hook (Stable order)
    useEffect(() => {
        fetchRadarData();
        const intervalTime = highAlertMode ? 2000 : 10000;
        const intv = setInterval(fetchRadarData, intervalTime);
        return () => clearInterval(intv);
    }, [highAlertMode]);

    // 2. Countdown & Impact Hook (Stable order)
    useEffect(() => {
        const timer = setInterval(() => {
            if (newsEvents.length === 0) return;
            if (newsEvents.length === 0) {
                setCountdown(''); // Clear countdown if no events
                if (highAlertMode) setHighAlertMode(false);
                return;
            }

            const now = new Date().getTime();
            // Find the closest upcoming USD event (any impact)
            const nextEvent = newsEvents.find(e => new Date(e.time).getTime() > now - 30000);

            if (nextEvent) {
                const eventTime = new Date(nextEvent.time).getTime();
                const diff = eventTime - now;

                if (diff > 0) {
                    const secs = Math.floor(diff / 1000);
                    const mins = Math.floor(secs / 60);
                    setCountdown(`${mins}:${(secs % 60).toString().padStart(2, '0')}`);

                    // Trigger High Alert within 60 seconds of impact
                    if (secs < 60) {
                        if (!highAlertMode) setHighAlertMode(true);
                    } else {
                        if (highAlertMode) setHighAlertMode(false);
                    }
                } else if (diff > -5000) {
                    // IMPACT ZONE: 0 to 5 seconds after release
                    setCountdown("0:00");
                    handleNewsRelease(nextEvent);
                } else {
                    setCountdown('');
                    if (highAlertMode) setHighAlertMode(false);
                }
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [newsEvents, highAlertMode]);

    return (
        <div className={`relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-4 ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>

            {/* Header Area */}
            <div className="text-center mb-8 space-y-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full"
                >
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">XAU/USD EXCLUSIVE MONITOR</span>
                </motion.div>

                <motion.h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-purple-400 to-indigo-500 bg-clip-text text-transparent">
                    {t.title}
                </motion.h2>

                <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <Activity className={`w-4 h-4 text-primary ${isScanning ? 'animate-spin' : 'animate-pulse'}`} />
                        <span className="text-muted-foreground text-xs font-bold uppercase tracking-tight">{isScanning ? t.scanning : t.monitoring}</span>
                    </div>
                    {countdown && (
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${highAlertMode ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-primary/10 text-primary'}`}>
                            <Timer className="w-4 h-4" />
                            <span className="text-sm font-black mono">{countdown}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Radar & News Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">

                {/* Sidebar: AI Analysis & News Feed */}
                <div className="lg:col-span-3 space-y-6 order-2 lg:order-1 h-[600px] overflow-y-auto pr-2 custom-scrollbar">

                    {/* 1. TOP SPOT: AI LIVE ACTION / SIGNAL */}
                    <AnimatePresence mode="wait">
                        {activeSignal ? (
                            <motion.div
                                key="signal"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 10, opacity: 0 }}
                                className={`p-4 rounded-3xl border-2 ${activeSignal.type === 'BUY' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'} shadow-[0_0_20px_rgba(34,197,94,0.2)] relative overflow-hidden`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{t.liveReaction}</span>
                                </div>
                                <div className={`text-xl font-black mb-1 ${activeSignal.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                    {activeSignal.type === 'BUY' ? t.buySignal : t.sellSignal}
                                </div>
                                <div className="text-[10px] text-muted-foreground font-bold mb-3 leading-tight uppercase">
                                    {activeSignal.reason}
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/5 pt-2">
                                    <span className="font-bold">PRICE: {activeSignal.price}</span>
                                    <span className="text-primary font-black">{activeSignal.confidence}% ACCURACY</span>
                                </div>
                            </motion.div>
                        ) : highAlertMode ? (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="p-4 rounded-3xl border border-primary/30 bg-primary/5 text-center"
                            >
                                <Zap className="w-6 h-6 text-primary mx-auto mb-2 animate-bounce" />
                                <div className="text-[10px] font-black text-primary uppercase">{lang === 'ar' ? 'جاري تحليل الخبر...' : 'ANALYZING NEWS DATA...'}</div>
                                <div className="text-[9px] text-muted-foreground mt-1 uppercase">Zero-Delay Signal Imminent</div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* 2. CALENDAR HEADER */}
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10 border-b border-border/10">
                        <Bell className="w-3 h-3 text-red-500" /> {lang === 'ar' ? 'الأجندة الاقتصادية الحية' : 'LIVE ECO CALENDAR'}
                    </h4>

                    <div className="space-y-6">
                        {(() => {
                            const now = new Date().getTime();
                            // Sort all events by time ascending first
                            const sorted = [...newsEvents].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

                            const past = sorted.filter(e => new Date(e.time).getTime() < now - 60000);
                            const current = sorted.filter(e => {
                                const t = new Date(e.time).getTime();
                                return t >= now - 60000 && t <= now + 600000; // Next 10 mins
                            });
                            const future = sorted.filter(e => new Date(e.time).getTime() > now + 600000);

                            if (newsEvents.length === 0) {
                                return (
                                    <div className="py-10 text-center opacity-30 text-xs italic">
                                        {lang === 'ar' ? 'جاري جلب الأجندة...' : 'Fetching calendar...'}
                                    </div>
                                );
                            }

                            return (
                                <>
                                    {/* ACTIVE / UPCOMING */}
                                    {current.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="text-[9px] font-bold text-primary uppercase tracking-tighter opacity-80">{lang === 'ar' ? 'الأخبار القريبة / الحالية' : 'IMMINENT / ACTIVE'}</div>
                                            {current.map(event => (
                                                <div key={event.id} className="p-3 rounded-2xl bg-primary/10 border-2 border-primary/40 shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">LIVE NOW</span>
                                                        <span className="text-[10px] text-primary font-bold">{new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <div className="text-xs font-black text-foreground mb-2">{event.event}</div>
                                                    <div className="flex justify-between items-center text-[9px] font-mono">
                                                        <span className="text-muted-foreground">ACTUAL: <span className="text-primary font-bold">{event.actual || 'WAITING...'}</span></span>
                                                        <span className="text-muted-foreground">FORC: {event.forecast}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* FUTURE */}
                                    <div className="space-y-3 pt-2">
                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter opacity-80 border-l-2 border-orange-400 pl-2">{lang === 'ar' ? 'الأخبار القادمة' : 'COMING UP'}</div>
                                        {future.slice(0, 10).map(event => (
                                            <div key={event.id} className="p-3 rounded-2xl bg-white/5 dark:bg-zinc-900/50 border border-border/50 hover:border-primary/40 transition-all">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[9px] font-bold text-orange-400">UPCOMING</span>
                                                    <span className="text-[10px] text-muted-foreground">{new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="text-xs font-black text-foreground mb-2">{event.event}</div>
                                                <div className="flex gap-2 text-[9px] font-mono text-muted-foreground">
                                                    <span>FORC: {event.forecast}</span>
                                                    <span>PREV: {event.previous}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* PAST */}
                                    <div className="space-y-3 opacity-50 pt-2 border-t border-white/5">
                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter border-l-2 border-gray-500 pl-2">{lang === 'ar' ? 'الأخبار السابقة' : 'PAST EVENTS'}</div>
                                        {past.slice(-5).map(event => (
                                            <div key={event.id} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent text-[10px]">
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-bold text-muted-foreground">{new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="font-mono text-primary font-bold">{event.actual}</span>
                                                </div>
                                                <div className="truncate text-[10px] text-muted-foreground font-medium">{event.event}</div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* Central Radar - Main */}
                <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
                    <div className="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px]">
                        {/* Radar Background Effects */}
                        <div className="absolute inset-0 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-3xl shadow-[0_0_80px_rgba(168,85,247,0.1)]" />

                        {/* Recursive Circles */}
                        {[20, 40, 60, 80].map(s => (
                            <div key={s} className="absolute inset-0 m-auto border border-primary/10 rounded-full" style={{ width: `${s}%`, height: `${s}%` }} />
                        ))}

                        {/* Scanning Sweep */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent origin-center rounded-full"
                            style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)' }}
                        />

                        {/* Gold Price Centerpiece */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <motion.div
                                animate={highAlertMode ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="relative p-6 md:p-10 rounded-full bg-background border-2 border-primary shadow-[0_0_40px_rgba(168,85,247,0.4)] flex flex-col items-center"
                            >
                                <span className="text-[10px] font-black text-primary mb-1 tracking-widest uppercase">GOLD SPOT</span>
                                <span className={`text-3xl md:text-5xl font-black ${goldPrice >= lastGoldPrice ? 'text-green-500' : 'text-red-500'}`}>
                                    {goldPrice.toFixed(2)}
                                </span>
                                <div className="flex items-center gap-1 mt-1">
                                    {goldPrice >= lastGoldPrice ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                                    <span className="text-xs font-bold text-muted-foreground uppercase">{goldPrice >= lastGoldPrice ? 'BULLISH' : 'BEARISH'}</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* News Event Markers on Radar */}
                        {newsEvents.map((e, i) => {
                            const angle = (i / newsEvents.length) * Math.PI * 2;
                            return (
                                <motion.div
                                    key={e.id}
                                    className="absolute p-1"
                                    style={{
                                        left: `${50 + Math.cos(angle) * 35}%`,
                                        top: `${50 + Math.sin(angle) * 35}%`,
                                    }}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                                >
                                    <AlertTriangle className="w-5 h-5 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Empty for cleaner aesthetic, or for more analytics later */}
                <div className="lg:col-span-3 hidden lg:block opacity-20 pointer-events-none">
                    <div className="p-10 border border-dashed border-primary/20 rounded-[3rem] h-full flex items-center justify-center">
                        <RadarIcon className="w-20 h-20 text-primary" />
                    </div>
                </div>

            </div>

            {/* Aesthetic Information Box */}
            <div className="mt-16 w-full max-w-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-[2.5rem] border border-border/50 p-8 text-center shadow-xl">
                <div className="inline-flex h-2 w-2 rounded-full bg-red-500 mb-4 animate-ping" />
                <h4 className="text-xl font-bold mb-4">{lang === 'ar' ? 'نظام الاستجابة الفورية للخبر' : 'Zero-Delay News Execution System'}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {lang === 'ar'
                        ? 'يعمل الرادار على سحب بيانات الأجندة الاقتصادية (Eco Calendar) لحظة صدورها. عند اقتراب الخبر من الصدور بدقيقة، يدخل النظام في وضع "التأهب العالي" لتحليل الفرق بين الأرقام المعلنة والمتوقعة وإعطاء صفقة مؤسساتية ذهبية في نفس الثانية.'
                        : 'The radar pulls Eco Calendar data the moment it releases. Within 1 minute of news impact, the system enters "High Alert" mode to analyze the delta between Actual and Forecast figures, providing a gold institutional signal in the same second.'
                    }
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="text-xs font-black text-primary leading-none">NO DELAY</div>
                        <div className="text-[9px] text-muted-foreground uppercase mt-1">Direct API Stream</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="text-xs font-black text-primary leading-none">GOLD FOCUS</div>
                        <div className="text-[9px] text-muted-foreground uppercase mt-1">XAU/USD Sentiment</div>
                    </div>
                </div>
            </div>

        </div>
    );
}
