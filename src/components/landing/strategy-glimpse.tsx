'use client';

import { BrainCircuit, Cpu, Eye, TrendingUp, Waves, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function StrategyGlimpse() {
    const { t } = useLanguage();

    const analysisSchools = [
        { name: t.school_elliott, icon: Waves },
        { name: t.school_ict, icon: Cpu },
        { name: t.school_fib, icon: Zap },
        { name: t.school_candles, icon: TrendingUp },
        { name: t.school_patterns, icon: BrainCircuit },
        { name: t.school_quant, icon: Eye }
    ];

    return (
        <section className="py-20 px-4 text-center">
            <div className="container mx-auto">
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 italic">{t.strategy_title}</h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                    {t.strategy_desc}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {analysisSchools.map(school => (
                        <div key={school.name} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-muted border border-border/50 transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                            <school.icon className="h-10 w-10 text-primary" />
                            <p className="font-semibold text-sm text-center text-foreground">{school.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
