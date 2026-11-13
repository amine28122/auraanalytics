'use client';

import { useSearchParams } from 'next/navigation';
import { VoiceChat } from '@/components/dashboard/voice-chat';
import { useLanguage } from '@/context/LanguageContext';

const titles = {
  en: {
    title: 'Speak with Aura',
    subtitle: 'Ask anything about the markets by voice or text — AURA listens and replies in her own voice.',
  },
  ar: {
    title: 'تحدث مع أورا',
    subtitle: 'اسأل أورا عن الأسواق بالصوت أو الكتابة — تسمعك وترد عليك بصوتها وتحفظ محادثتك.',
  },
  es: {
    title: 'Habla con Aura',
    subtitle: 'Pregunta lo que quieras sobre los mercados por voz o texto — AURA te escucha y responde con su propia voz.',
  },
};

export default function RadarPage() {
  const searchParams = useSearchParams();
  const { lang: contextLang } = useLanguage();
  const urlLang = searchParams.get('lang');
  const lang = (urlLang === 'en' || urlLang === 'ar' || urlLang === 'es'
    ? urlLang
    : contextLang || 'en') as 'en' | 'ar' | 'es';
  const t = titles[lang] ?? titles.en;

  return (
    <div
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-6"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold uppercase tracking-tighter">{t.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
      </div>

      <VoiceChat lang={lang} />
    </div>
  );
}
