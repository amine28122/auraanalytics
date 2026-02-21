'use client';

import AuraRadar from '@/components/dashboard/AuraRadar';
import { useSearchParams } from 'next/navigation';

export default function RadarPage() {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';

    const translations = {
        en: {
            howItWorksTitle: 'AURA Gold Radar Logic',
            desc: 'The **Aura Radar** has been recalibrated to focus exclusively on Gold (XAU/USD). It synchronizes with the Global Economic Calendar to hunt for volatility during high-impact news releases.',
            li1Title: 'Gold Spot Tracking',
            li1Desc: 'Real-time monitoring of Gold price action and institutional liquidity flows.',
            li2Title: 'Eco Calendar Sync',
            li2Desc: 'Direct integration with USD high-impact news (NFP, CPI, Fed Rates) for immediate reaction.',
            li3Title: 'Zero-Delay Execution',
            li3Desc: 'The system analyzes news results the millisecond they release and issues a BUY or SELL signal for Gold.',
            footer: 'Elite Gold Analysis Infrastructure'
        },
        ar: {
            howItWorksTitle: 'منطق رادار أورا للذهب',
            desc: 'تمت إعادة معايرة **رادار أورا** ليركز حصرياً على الذهب (XAU/USD). يتزامن مع الأجندة الاقتصادية العالمية لاصطياد التقلبات أثناء صدور الأخبار عالية التأثير.',
            li1Title: 'تتبع سعر الذهب',
            li1Desc: 'مراقبة فورية لحركة سعر الذهب وتدفقات السيولة المؤسسية.',
            li2Title: 'تزامن الأجندة الاقتصادية',
            li2Desc: 'تكامل مباشر مع أخبار الدولار عالية التأثير (الوظائف، التضخم، الفائدة) للرد الفوري.',
            li3Title: 'تنفيذ بدون تأخير',
            li3Desc: 'يقوم النظام بتحليل نتائج الأخبار في ملي ثانية من صدورها ويعطي إشارة شراء أو بيع للذهب.',
            footer: 'بنية تحتية احترافية لتحليل الذهب'
        }
    };

    const t = translations[lang] || translations.en;

    return (
        <div className={`min-h-screen bg-background pt-20 pb-12 overflow-hidden ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* تأثيرات خلفية فنية */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <AuraRadar />

                <div className="mt-16 max-w-2xl mx-auto p-8 rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50 border border-border/50 backdrop-blur-md text-center shadow-xl dark:shadow-2xl">
                    <h3 className="text-primary font-bold text-xl mb-4 flex items-center justify-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                        {t.howItWorksTitle}
                    </h3>
                    <div className={`space-y-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <p className="text-muted-foreground text-sm leading-relaxed">
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
                        <ul className="text-muted-foreground text-xs space-y-2 list-disc list-inside">
                            <li><span className="text-foreground font-bold">{t.li1Title}:</span> {t.li1Desc}</li>
                            <li><span className="text-foreground font-bold">{t.li2Title}:</span> {t.li2Desc}</li>
                            <li><span className="text-foreground font-bold">{t.li3Title}:</span> {t.li3Desc}</li>
                        </ul>
                        <div className="pt-2 border-t border-border/50 text-center text-[10px] text-primary/50 uppercase tracking-widest font-bold">
                            {t.footer}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
