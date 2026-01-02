'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Radar as RadarIcon, ShieldCheck, Zap, Activity, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { getSharedPrices } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';

interface Signal {
    id: string;
    pair: string;
    type: 'BUY' | 'SELL';
    strength: number;
    price: number;
    time: string;
    x: number;
    y: number;
    reason: string;
}

const translations = {
    en: {
        title: 'Aura Live Radar',
        scanning: 'Scanning Markets...',
        monitoring: 'Monitoring Global Trends...',
        confidence: 'Confidence',
        marketPrice: 'Market Price',
        reason: 'Reason',
        closeSignal: 'CLOSE SIGNAL',
        feedTitle: 'Global Scanner Feed',
        awaiting: 'Awaiting market volatility signals...',
        reasons: {
            strongBullish: "Strong Bullish Breakout",
            aggBuy: "Aggressive Buy Volume",
            bullishPulse: "Bullish Momentum Pulse",
            heavySell: "Heavy Market Sell-off",
            instBearish: "Institutional Bearish Flow",
            bearishPulse: "Bearish Pressure Pulse"
        }
    },
    ar: {
        title: 'رادار أورا المباشر',
        scanning: 'جاري مسح الأسواق...',
        monitoring: 'مراقبة الاتجاهات العالمية...',
        confidence: 'نسبة الثقة',
        marketPrice: 'سعر السوق',
        reason: 'السبب',
        closeSignal: 'إغلاق الإشارة',
        feedTitle: 'شريط الرصد العالمي',
        awaiting: 'في انتظار إشارات تقلب السوق...',
        reasons: {
            strongBullish: "اختراق شرائي قوي",
            aggBuy: "زخم صعودي هجومي",
            bullishPulse: "نبض صعودي مستمر",
            heavySell: "انهيار سعري حاد",
            instBearish: "تدفق بيعي مؤسسي",
            bearishPulse: "ضغط بيعي مستمر"
        }
    }
};

const PAIRS_TO_SCAN = ['XAU/USD', 'EUR/USD', 'BTC/USD', 'GBP/USD', 'USD/JPY', 'ETH/USD', 'AUD/USD', 'USD/CAD'];

export default function AuraRadar() {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';
    const t = translations[lang] || translations.en;

    const [signals, setSignals] = useState<Signal[]>([]);
    const [lastPrices, setLastPrices] = useState<Record<string, number>>({});
    const [isScanning, setIsScanning] = useState(false);
    const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

    const performScan = async () => {
        setIsScanning(true);
        try {
            const newPrices = await getSharedPrices(PAIRS_TO_SCAN);
            const newSignals: Signal[] = [];

            PAIRS_TO_SCAN.forEach(pair => {
                const currentPrice = newPrices[pair];
                const previousPrice = lastPrices[pair];

                if (currentPrice && previousPrice) {
                    const change = ((currentPrice - previousPrice) / previousPrice) * 100;

                    if (Math.abs(change) > 0.005) {
                        const type = change > 0 ? 'BUY' : 'SELL';
                        const strength = Math.min(Math.floor(Math.abs(change) * 5000) + 60, 98);

                        let reasonKey = "";
                        if (type === 'BUY') {
                            if (strength > 85) reasonKey = "strongBullish";
                            else if (strength > 75) reasonKey = "aggBuy";
                            else reasonKey = "bullishPulse";
                        } else {
                            if (strength > 85) reasonKey = "heavySell";
                            else if (strength > 75) reasonKey = "instBearish";
                            else reasonKey = "bearishPulse";
                        }

                        const angle = (PAIRS_TO_SCAN.indexOf(pair) / PAIRS_TO_SCAN.length) * Math.PI * 2;
                        const distance = 100 - strength;

                        newSignals.push({
                            id: `${pair}-${Date.now()}`,
                            pair,
                            type,
                            strength,
                            price: currentPrice,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            x: Math.cos(angle) * distance,
                            y: Math.sin(angle) * distance,
                            reason: (t.reasons as any)[reasonKey]
                        });
                    }
                }
            });

            setLastPrices(newPrices);
            // 3. تنظيف الإشارات القديمة (التي مر عليها أكثر من 10 دقائق)
            const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
            setSignals(prev => {
                // ندمج الجديد مع القديم، ثم نصفي القديم جداً
                const combined = [...newSignals, ...prev];
                return combined.filter(s => {
                    const signalTime = parseInt(s.id.split('-')[1]);
                    return signalTime > tenMinutesAgo;
                }).slice(0, 8); // نبقي فقط أحدث 8
            });

        } catch (error) {
            console.error("Scan failed:", error);
        } finally {
            setTimeout(() => setIsScanning(false), 2000);
        }
    };

    useEffect(() => {
        performScan();
        const interval = setInterval(performScan, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* عنوان الرادار */}
            <div className="text-center mb-8 space-y-2">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent"
                >
                    {t.title}
                </motion.h2>
                <div className="w-64 h-6 flex items-center justify-center gap-2 mx-auto">
                    <Activity className={`w-4 h-4 text-primary ${isScanning ? 'animate-spin' : 'animate-pulse'}`} />
                    <span className="text-gray-400 text-sm font-medium tracking-wide">
                        {isScanning ? t.scanning : t.monitoring}
                    </span>
                </div>
            </div>

            {/* منطقة الرادار الرئيسية */}
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-primary/30 bg-black/40 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.2)]">

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-primary/10 absolute" />
                    <div className="h-full w-[1px] bg-primary/10 absolute" />
                </div>

                {[20, 40, 60, 80].map(size => (
                    <div key={size} className="absolute border border-primary/20 rounded-full" style={{ width: `${size}%`, height: `${size}%` }} />
                ))}

                {/* غواصة المسح (Sweep) - تم زيادة الإضاءة هنا */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/20 to-transparent origin-center rounded-full"
                    style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)', filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.5))' }}
                />

                <AnimatePresence>
                    {signals.map((signal) => (
                        <motion.div
                            key={signal.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => setSelectedSignal(signal)}
                            className="absolute cursor-pointer group z-20"
                            style={{
                                left: `calc(50% + ${signal.x}%)`,
                                top: `calc(50% + ${signal.y}%)`,
                            }}
                        >
                            <div className={`w-4 h-4 rounded-full ${signal.type === 'BUY' ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'} animate-pulse`} />

                            <div className="absolute hidden group-hover:block -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black border border-primary/30 px-3 py-1 rounded text-[10px] text-white z-50 shadow-xl">
                                {signal.pair} • <span className="text-primary">{signal.strength}%</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <div className="z-10 bg-primary/20 p-3 rounded-full border border-primary/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <Zap className="w-6 h-6 text-primary" />
                </div>
            </div>

            <AnimatePresence>
                {selectedSignal && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`mt-8 w-full max-w-sm bg-black/80 backdrop-blur-2xl border border-primary/20 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden text-right`}
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    >
                        <div className={`flex justify-between items-start mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <div className={lang === 'ar' ? 'text-right' : ''}>
                                <h3 className="text-2xl font-bold text-white">{selectedSignal.pair}</h3>
                                <span className={`text-xs font-black px-2 py-0.5 rounded ${selectedSignal.type === 'BUY' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                    {lang === 'ar' ? (selectedSignal.type === 'BUY' ? 'شراء فوري' : 'بيع فوري') : `REAL-TIME ${selectedSignal.type}`}
                                </span>
                            </div>
                            <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                                <div className="text-primary text-sm font-bold">{selectedSignal.strength}% {t.confidence}</div>
                                <div className="text-gray-500 text-[10px]">{selectedSignal.time}</div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 font-mono">
                            <div className={`bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <span className="text-gray-400 text-xs">{t.marketPrice}</span>
                                <span className="text-white font-black text-xl tracking-tighter">{selectedSignal.price}</span>
                            </div>
                            <div className={`bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <span className="text-gray-400 text-xs">{t.reason}</span>
                                <span className="text-primary text-xs font-bold uppercase">{selectedSignal.reason}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedSignal(null)}
                            className="w-full py-3 rounded-xl bg-primary text-white font-black text-sm hover:bg-primary/90 transition-all shadow-lg active:scale-95"
                        >
                            {t.closeSignal}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <h4 className={`col-span-full text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <RefreshCcw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} /> {t.feedTitle}
                </h4>
                {signals.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-600 italic text-sm border border-dashed border-white/5 rounded-2xl">
                        {t.awaiting}
                    </div>
                )}
                {signals.map((s) => (
                    <motion.div
                        key={s.id}
                        layout
                        initial={{ x: lang === 'ar' ? 20 : -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`bg-zinc-900/50 backdrop-blur border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                        onClick={() => setSelectedSignal(s)}
                    >
                        <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {s.type === 'BUY' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="text-sm font-black text-white">{s.pair}</div>
                                <div className="text-[10px] text-gray-500">{s.time}</div>
                            </div>
                        </div>
                        <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                            <div className="text-xs font-mono font-bold text-white">{s.price}</div>
                            <div className="text-[10px] text-primary font-bold">{s.strength}%</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
