'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Terminal, RefreshCw } from 'lucide-react';

const translations = {
    en: {
        live: 'LIVE',
        updates: [
            "ICT 2024 Algorithm optimized for institutional liquidity.",
            "SMC Order Block detection precision improved to 98%.",
            "Strategy Update: Elliott Wave v4.2 active on all timeframes.",
            "Fixed: Real-time price feed latency reduced to 50ms.",
            "Enhanced: Technical analysis now includes macro-economic correlations.",
            "Update: Gold & BTC volatility models successfully updated.",
            "System: New multi-confluence scanning logic deployed."
        ]
    },
    ar: {
        live: 'مباشر',
        updates: [
            "تم تحسين خوارزمية ICT 2024 للسيولة المؤسساتية.",
            "تطوير دقة اكتشاف كتل الأوامر (SMC) لتصل إلى 98%.",
            "تحديث الاستراتيجية: موجات إليوت v4.2 نشطة على جميع الفريمات.",
            "إصلاح: تقليل وقت استجابة أسعار السوق إلى 50 ملي ثانية.",
            "تحسين: التحليل الفني يشمل الآن الارتباطات الاقتصادية الكلية.",
            "تحديث: تم تحديث نماذج التقلب للذهب والبيتكوين بنجاح.",
            "النظام: نشر منطق المسح المتعدد للتوافق (Multi-confluence)."
        ]
    }
};

export function AILiveStatus() {
    const [index, setIndex] = useState(0);
    const [lang, setLang] = useState<'en' | 'ar'>('en');

    useEffect(() => {
        // Basic language detection from URL or document dir
        const isAr = document.documentElement.dir === 'rtl' || window.location.search.includes('lang=ar');
        setLang(isAr ? 'ar' : 'en');

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % translations[isAr ? 'ar' : 'en'].updates.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const t = translations[lang];

    return (
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.05)] max-w-full overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/40 blur-sm rounded-full animate-ping" />
                    <div className="relative h-2 w-2 rounded-full bg-primary" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">{t.live}</span>
            </div>

            <div className="h-4 w-px bg-primary/20 shrink-0" />

            <div className="relative flex-1 overflow-hidden h-4 flex items-center min-w-[200px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${lang}-${index}`}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex items-center gap-2 whitespace-nowrap"
                    >
                        <Terminal className="h-3 w-3 text-muted-foreground opacity-50 shrink-0" />
                        <span className="text-[10px] font-medium text-foreground/80 tracking-tight">
                            {t.updates[index]}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            <RefreshCw className="h-3 w-3 text-primary/30 animate-spin-slow shrink-0 hidden sm:block" />
        </div>
    );
}
