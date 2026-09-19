import { VoiceChat } from '@/components/dashboard/voice-chat';

const titles = {
  en: {
    title: 'Speak with Aura',
    subtitle: 'Ask anything about the markets by voice — AURA listens and replies in her own voice.',
  },
  ar: {
    title: 'تحدث مع أورا',
    subtitle: 'اسأل أورا عن الأسواق بصوتك — تسمعك وترد عليك بصوتها.',
  },
  es: {
    title: 'Habla con Aura',
    subtitle: 'Pregunta lo que quieras sobre los mercados por voz — AURA te escucha y responde con su propia voz.',
  },
};

export default async function RadarPage(props: { searchParams: Promise<{ lang?: string }> }) {
  const searchParams = await props.searchParams;
  const lang = (searchParams.lang || 'en') as 'en' | 'ar' | 'es';
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
