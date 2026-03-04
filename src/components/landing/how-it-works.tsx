'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Upload, BrainCircuit, Zap, Target, ShieldCheck, Activity, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

const MockupChart = () => (
    <div className="relative w-full h-32 bg-black/40 rounded-lg overflow-hidden border border-white/5 mt-4 p-2">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg className="w-full h-full" viewBox="0 0 100 50">
            <motion.path
                d="M0 45 L10 40 L20 42 L30 35 L40 38 L50 25 L60 28 L70 15 L80 18 L90 5 L100 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </svg>
        <motion.div
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-[2px] bg-primary/50 shadow-[0_0_10px_#8b5cf6]"
        />
        <div className="absolute top-2 right-2"><Search className="w-3 h-3 text-primary animate-pulse" /></div>
    </div>
);

const MockupNeural = () => (
    <div className="relative w-full h-32 bg-black/40 rounded-lg overflow-hidden border border-white/5 mt-4 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-2 p-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                    key={i}
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.9, 1.1, 0.9]
                    }}
                    transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                    className="h-4 w-4 rounded-full bg-purple-500/40 border border-purple-500/60"
                />
            ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-primary/20 animate-ping absolute" />
            <Activity className="w-6 h-6 text-primary" />
        </div>
    </div>
);

const MockupSignal = () => (
    <div className="relative w-full h-32 bg-black/40 rounded-lg overflow-hidden border border-white/5 mt-4 p-3 font-mono text-[10px]">
        <div className="space-y-2">
            <div className="flex justify-between items-center text-green-400">
                <span>ENTRY_ZONE</span>
                <span className="bg-green-500/20 px-1 rounded">5,137.80</span>
            </div>
            <div className="flex justify-between items-center text-red-400">
                <span>STOP_LOSS</span>
                <span className="bg-red-500/20 px-1 rounded">5,125.20</span>
            </div>
            <div className="flex justify-between items-center text-blue-400">
                <span>TARGET_3</span>
                <span className="bg-blue-500/20 px-1 rounded">5,180.00</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    transition={{ duration: 1.5 }}
                />
            </div>
        </div>
        <ShieldCheck className="absolute bottom-2 right-2 w-4 h-4 text-primary opacity-50" />
    </div>
);

export default function HowItWorks() {
    const { lang, t } = useLanguage();
    const isAr = lang === 'ar';
    const containerRef = useRef(null);

    const steps = [
        {
            title: t.step_upload_title,
            desc: t.step_upload_desc,
            icon: Upload,
            mockup: <MockupChart />,
            color: "from-blue-600/20 to-cyan-600/20",
            accent: "text-blue-400",
            delay: 0.1,
        },
        {
            title: t.step_analyze_title,
            desc: t.step_analyze_desc,
            icon: BrainCircuit,
            mockup: <MockupNeural />,
            color: "from-purple-600/20 to-pink-600/20",
            accent: "text-purple-400",
            delay: 0.3,
        },
        {
            title: t.step_trade_title,
            desc: t.step_trade_desc,
            icon: Target,
            mockup: <MockupSignal />,
            color: "from-amber-600/20 to-orange-600/20",
            accent: "text-amber-400",
            delay: 0.5,
        },
    ];

    return (
        <section ref={containerRef} className="py-32 relative overflow-hidden px-4">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)]" />

            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.3em] text-primary"
                    >
                        Institutional Pipeline
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold mb-6 tracking-tight max-w-4xl leading-[1.1]"
                    >
                        {t.how_it_works}
                    </motion.h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        {isAr ? "تحليل فني مؤسساتي مدعوم بالذكاء الاصطناعي، يختصر عليك ساعات من التدقيق اليدوي." : "Experience a revolutionary workflow that converts raw visual data into high-probability execution plans."}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: isAr ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: step.delay, duration: 0.8, ease: "circOut" }}
                            className="group relative"
                        >
                            <div className={cn(
                                "absolute -inset-1 rounded-[2rem] bg-gradient-to-br opacity-0 group-hover:opacity-100 blur transition duration-500",
                                step.color.replace('/20', '')
                            )} />

                            <Card className="relative h-full bg-[#050505] border-white/5 p-10 flex flex-col items-start text-left rounded-[2rem] overflow-hidden group-hover:border-primary/50 transition-all duration-500 shadow-2xl shadow-black">
                                {/* Visual Accent */}
                                <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl blur-[60px] opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40", step.color)} />

                                <div className="flex items-center gap-4 mb-8">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-500",
                                        isAr ? "order-last" : "order-first"
                                    )}>
                                        <step.icon className={cn("w-7 h-7 transition-transform duration-500 group-hover:scale-110", step.accent)} />
                                    </div>
                                    <span className="text-5xl font-black text-white/5 italic">0{index + 1}</span>
                                </div>

                                <div className={cn("w-full mb-6", isAr ? "text-right" : "text-left")}>
                                    <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>

                                <div className="w-full mt-auto">
                                    {step.mockup}
                                </div>

                                {/* Modern Indicator */}
                                <div className={cn(
                                    "absolute bottom-0 h-[2px] bg-primary transition-all duration-500 ease-in-out",
                                    isAr ? "right-0 group-hover:w-full w-0" : "left-0 group-hover:w-full w-0"
                                )} />
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.04)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
        }
      `}</style>
        </section>
    );
}
