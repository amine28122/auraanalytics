'use client';

import AuraRadar from '@/components/dashboard/AuraRadar';
import { useSearchParams } from 'next/navigation';

export default function RadarPage() {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';

    const translations = {
        en: {
            howItWorksTitle: 'How AURA Radar Works',
            desc: 'The **Aura Radar** is a sophisticated monitoring system that tracks live institutional order flow and market imbalances across global currency and commodity markets.',
            li1Title: 'Live Monitoring',
            li1Desc: 'It scans major liquid pairs every 30 seconds for sudden price shifts.',
            li2Title: 'Momentum Engine',
            li2Desc: 'It identifies high-volatility breakouts by comparing real-time candle data.',
            li3Title: 'Automated Hub',
            li3Desc: 'Opportunities are pinpointed on the radar the moment they emerge, requiring no manual action.',
            footer: 'Professional Market Scanning Infrastructure'
        },
        ar: {
            howItWorksTitle: 'كيف يعمل رادار أورا',
            desc: 'نظام **رادار أورا** هو نظام مراقبة متطور يتتبع تدفق الأوامر المؤسسية واختلالات السوق الحية عبر أسواق العملات والسلع العالمية.',
            li1Title: 'مراقبة حية',
            li1Desc: 'يقوم بمسح الأزواج الرئيسية ذات السيولة العالية كل 30 ثانية بحثاً عن تحركات مفاجئة.',
            li2Title: 'محرك الزخم',
            li2Desc: 'يحدد الاختراقات السعرية عالية التقلب من خلال مقارنة بيانات الشموع في الوقت الفعلي.',
            li3Title: 'مركز تلقائي',
            li3Desc: 'يتم تحديد الفرص فور ظهورها على الرادار، ولا يتطلب أي تدخل يدوي.',
            footer: 'بنية تحتية احترافية لمسح السوق'
        }
    };

    const t = translations[lang] || translations.en;

    return (
        <div className={`min-h-screen bg-black pt-20 pb-12 overflow-hidden ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* تأثيرات خلفية فنية */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <AuraRadar />

                <div className="mt-16 max-w-2xl mx-auto p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 backdrop-blur-md text-center shadow-2xl">
                    <h3 className="text-primary font-bold text-xl mb-4 flex items-center justify-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                        {t.howItWorksTitle}
                    </h3>
                    <div className={`space-y-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {lang === 'ar' ? (
                                <>
                                    نظام <span className='font-bold text-primary'>رادار أورا</span> هو نظام مراقبة متطور يتتبع تدفق الأوامر وتغيرات السوق عبر العالم.
                                </>
                            ) : (
                                <>
                                    The <span className='font-bold text-primary'>Aura Radar</span> is a sophisticated monitoring system that tracks live institutional order flow and market imbalances across global currency and commodity markets.
                                </>
                            )}
                        </p>
                        <ul className="text-gray-400 text-xs space-y-2 list-disc list-inside">
                            <li><span className="text-white font-bold">{t.li1Title}:</span> {t.li1Desc}</li>
                            <li><span className="text-white font-bold">{t.li2Title}:</span> {t.li2Desc}</li>
                            <li><span className="text-white font-bold">{t.li3Title}:</span> {t.li3Desc}</li>
                        </ul>
                        <div className="pt-2 border-t border-white/5 text-center text-[10px] text-primary/50 uppercase tracking-widest font-bold">
                            {t.footer}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
