'use client';

import { Gem } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FoundersStrategy() {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto relative overflow-hidden rounded-3xl p-8 md:p-16 text-center bg-gradient-to-tr from-blue-900/80 via-black to-purple-900/80 border border-primary/30">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(100,116,220,0.2)_0%,_rgba(0,0,0,0)_60%)]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Gem className="h-16 w-16 text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300">{t.strategy_title}</h2>
          <p className="text-lg md:text-xl text-neutral-200 max-w-3xl">
            {t.founders_note}
          </p>
        </div>
      </div>
    </section>
  );
}
