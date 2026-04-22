'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, Globe, ShieldAlert, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DXYAnalysisArticle() {
    const { lang } = useLanguage();
    // SSR fix for Ezoic

    return (
        <div className={cn("min-h-screen bg-background text-foreground pb-20 antialiased overflow-x-hidden", lang === 'ar' && "font-['Cairo']")} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <LandingHeader />

            <article className="container mx-auto max-w-4xl px-4 pt-44 pb-20">
                <div className="mb-12">
                    <Button variant="ghost" className="mb-8 p-0 hover:bg-transparent text-primary" asChild>
                        <Link href="/blog" className="flex items-center gap-2">
                            {lang === 'ar' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            {lang === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
                        </Link>
                    </Button>

                    <Badge className="mb-4 bg-blue-500/20 text-blue-500 border-blue-500/30 py-1 px-4">Forex</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-blue-400">
                        {lang === 'ar' ? 'مؤشر الدولار الأمريكي (DXY) 2026: هل نشهد نهاية هيمنة الدولار؟' : 'The US Dollar Index (DXY) 2026: Is the Hegemony Ending?'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2026-01-01</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>14 min read</span>
                        </div>
                        <div className="flex items-center gap-4 ms-auto">
                            <Share2 className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Facebook className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Twitter className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Linkedin className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-blue-500/20">
                    <img src="/forex_market_mastery_banner.png" alt="DXY Index Analysis 2026" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed">
                    {lang === 'ar' ? (
                        <>
                            <p className="text-xl font-medium text-foreground">بدأ الدولار الأمريكي عام 2026 بوضع مترنح عند مستويات 98.25. مع تغير موازين القوى المالية العالمية، يبدو أن العملة الخضراء بصدد الدخول في اتجاه هابط طويل الأمد.</p>

                            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl my-8">
                                <h3 className="text-red-400 mt-0 flex items-center gap-2">
                                    <TrendingDown className="h-5 w-5" /> تحديث الأسعار
                                </h3>
                                <p className="mb-0">استقر مؤشر الدخسي (DXY) عند <strong>98.25</strong>، وهو ما يعد انخفاضاً جوهرياً عن قمم عام 2024. المحللون يتوقعون كسر حاجز الـ 95 قريباً.</p>
                            </div>

                            <h2>أولاً: الأبعاد الجيوسياسية وفقدان الثقة</h2>
                            <p>لم يعد الدولار هو الخيار الوحيد للتسويات الدولية. تحركات مجموعة "بريكس" وتعزيز التبادل بالعملات المحلية أضعف الطلب الهيكلي على الدولار. هذا التحول ليس مؤقتاً، بل هو "تغيير في النظام العالمي" كما يصفه العديد من الاقتصاديين.</p>

                            <h2>ثانياً: سياسة الفيدرالي والديون السيادية</h2>
                            <p>وصلت الديون الأمريكية إلى مستويات حرجة، مما يضطر الفيدرالي للحفاظ على أسعار فائدة أقل من مستوى التضخم "لتسييل الديون". هذا يعني تآكل القوة الشرائية للدولار أمام الأصول الصلبة مثل الذهب والبتكوين.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <h4 className="text-red-500 mb-2">مستويات المقاومة (السقف)</h4>
                                    <ul className="list-disc list-inside text-sm">
                                        <li>100.00 (حاجز سيكولوجي ضخم)</li>
                                        <li>102.50 (منطقة تصريف قوية)</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <h4 className="text-emerald-500 mb-2">الدعوم والأهداف الهابطة</h4>
                                    <ul className="list-disc list-inside text-sm">
                                        <li>97.50 (الدعم القادم)</li>
                                        <li>94.00 (الهدف المتوسط لـ 2026)</li>
                                        <li>90.50 (قاع القناة الهابطة)</li>
                                    </ul>
                                </div>
                            </div>

                            <h2>ثالثاً: كيفية الاستفادة من هبوط الدولار</h2>
                            <p>في أسواق الفوركس، يعني هبوط الدولار صمود العملات المقابلة (EUR, JPY, GBP). نظام AURA للذكاء الاصطناعي يرصد حالياً تدفقات سيولة خارجة من الدولار نحو العملات السلعية (مثل الدولار الأسترالي والكندي)، مما يفتح فرص تداول طويلة المدى (Swing Trading).</p>

                            <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20 my-10">
                                <h3 className="flex items-center gap-2 mt-0"><Globe className="h-5 w-5 text-blue-400" /> نصيحة للمستثمر الذكي</h3>
                                <p className="text-sm italic mb-0">"عندما يضعف الدولار، ابحث عن الأصول التي لها عرض محدود. هذا هو الوقت الذهبي للتحوط في الأصول ذات القيمة الحقيقية."</p>
                            </div>

                            <h2>الخلاصة: هل يسقط الدولار تماماً؟</h2>
                            <p>السقوط الكامل مستبعد في 2026، ولكن فقدان "الزخم القوي" أمر واقع. نحن ندخل في حقبة "تعدد الأقطاب المالية"، حيث لن يكون الدولار هو المهيمن الوحيد، بل جزءاً من منظومة عملات متعددة.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-medium text-foreground">The US Dollar Index began 2026 on shaky ground, trading around 98.25. As global financial power shifts, the greenback appears poised to enter a structural long-term downtrend.</p>

                            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl my-8">
                                <h3 className="text-red-400 mt-0 flex items-center gap-2">
                                    <TrendingDown className="h-5 w-5" /> Current DXY Status
                                </h3>
                                <p className="mb-0">The index (DXY) is stable at <strong>98.25</strong>, a significant drop from the 2024 highs. Analysts expect a breakdown below the 95 level soon.</p>
                            </div>

                            <h2>I. Geopolitics & Erosion of Trust</h2>
                            <p>The US Dollar is no longer the "only game in town." The BRICS expansion and the proliferation of local currency settlements have weakened structural demand for the US Dollar. This isn't a temporary dip; it's a "regime shift" in the global order.</p>

                            <h2>II. Fed Policy & Sovereign Debt Reality</h2>
                            <p>US debt levels have reached critical mass, potentially forcing the Federal Reserve to keep real interest rates suppressed to service obligations. This implies a steady erosion of dollar purchasing power against hard assets like Gold and Bitcoin.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <h4 className="text-red-500 mb-2">Resistance Levels (Ceiling)</h4>
                                    <ul className="list-disc list-inside text-sm">
                                        <li>100.00 (Major Psychological Barrier)</li>
                                        <li>102.50 (Institutional Sell Zone)</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <h4 className="text-emerald-500 mb-2">Downside Supports & Targets</h4>
                                    <ul className="list-disc list-inside text-sm">
                                        <li>97.50 (Immediate Target)</li>
                                        <li>94.00 (Mid-2026 Objective)</li>
                                        <li>90.50 (Major Bearish Pivot)</li>
                                    </ul>
                                </div>
                            </div>

                            <h2>III. Capitalizing on Dollar Weakness with AURA</h2>
                            <p>In forex markets, a weakening dollar provides a tailwind for major pairs (EUR, JPY, GBP). AURA's AI system is currently tracking capital flows shifting toward commodity currencies (AUD, CAD), presenting high-probability swing trading opportunities.</p>

                            <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20 my-10">
                                <h3 className="flex items-center gap-2 mt-0"><ShieldAlert className="h-5 w-5 text-blue-400" /> Cautionary Note</h3>
                                <p className="text-sm italic mb-0">"While the DXY is in a downtrend, bear market rallies can be violent. Always wait for technical confirmation from AURA before entering long non-dollar positions."</p>
                            </div>

                            <h2>Conclusion: The End of Hegemony?</h2>
                            <p>A total collapse is unlikely in 2026, but the loss of unconditional dominance is reality. We are entering the era of "Financial Multipolarity," where the dollar is one part of a diverse currency ecosystem rather than its sole master.</p>
                        </>
                    )}
                </div>
            </article>

            <Footer />
        </div>
    );
}
