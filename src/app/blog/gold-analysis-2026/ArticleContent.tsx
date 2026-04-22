'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GoldAnalysisArticle() {
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Markets</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-amber-500">
                        {lang === 'ar' ? 'تحليل أسعار الذهب 2026: الطريق نحو 5,000 دولار للأونصة' : 'Gold Price Analysis 2026: The Roadmap to $5,000 per Ounce'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2026-01-01</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>15 min read</span>
                        </div>
                        <div className="flex items-center gap-4 ms-auto">
                            <Share2 className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Facebook className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Twitter className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Linkedin className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-amber-500/20">
                    <img src="/stock_indices_mastery_banner.png" alt="Gold Markets 2026" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed">
                    {lang === 'ar' ? (
                        <>
                            <p className="text-xl font-medium text-foreground">مع دخولنا عام 2026، يظل الذهب هو الملاذ الآمن الأول وسط تقلبات الأسواق العالمية. في هذا التقرير الشامل، سنقوم بتحليل العوامل التقنية والأساسية التي تدفع المعدن الأصفر نحو مستويات قياسية جديدة غير مسبوقة.</p>

                            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl my-8">
                                <h3 className="text-amber-500 mt-0 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" /> السعر الحالي والوضع السوقي
                                </h3>
                                <p className="mb-0">يتداول الذهب حالياً عند مستويات <strong>4,400 دولار للأونصة</strong>، مكملاً مسيرة الصعود القوية التي بدأت في أواخر عام 2024. التوقعات تشير إلى استمرار هذا الزخم ليصل إلى 5,000 دولار بحلول نهاية العام.</p>
                            </div>

                            <h2>أولاً: الدوافع الأساسية للصعود (Fundamental Drivers)</h2>
                            <h3>1. مشتريات البنوك المركزية</h3>
                            <p>استمرت البنوك المركزية العالمية في زيادة احتياطياتها من الذهب بمعدلات تاريخية. الصين والهند والعديد من دول الأسواق الناشئة تسعى لتقليل الاعتماد على الدولار الأمريكي، مما يخلق طلباً دائماً وقوياً يرفع الأسعار.</p>

                            <h3>2. تحولات السياسة النقدية</h3>
                            <p>مع استمرار تحول الفيدرالي الأمريكي نحو سياسة تيسيرية وانخفاض أسعار الفائدة الحقيقية، يصبح الذهب أكثر جاذبية للمستثمرين لأنه لا يدر فائدة، وبالتالي تنخفض "تكلفة الفرصة البديلة" لحيازته.</p>

                            <h2>ثانياً: التحليل التقني والأهداف السعرية</h2>
                            <p>من الناحية التقنية، اخترق الذهب قناة صاعدة كبرى كانت تحكم حركته لسنوات. هذا الاختراق يشير إلى دخولنا في "مرحلة اكتشاف السعر" (Price Discovery Phase).</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <h4 className="text-emerald-500 mb-2">مستويات الدعم الرئيسية</h4>
                                    <ul className="list-disc list-inside text-sm">
                                        <li>4,330 دولار (دعم قريب)</li>
                                        <li>4,200 دولار (مستوى نفسي قوي)</li>
                                        <li>4,050 دولار (الارتكاز القديم)</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <h4 className="text-red-500 mb-2">الأهداف والمقاومات</h4>
                                    <ul className="list-disc list-inside text-sm">
                                        <li>4,550 دولار (الهدف الأول)</li>
                                        <li>4,800 دولار (منطقة جني أرباح)</li>
                                        <li>5,100 دولار (الهدف الاستراتيجي 2026)</li>
                                    </ul>
                                </div>
                            </div>

                            <h2>ثالثاً: كيفية التداول مع AURA</h2>
                            <p>برنامج AURA للتحليل الذكي يوفر لك تنبيهات دقيقة عند اقتراب السعر من مناطق العرض والطلب (Supply & Demand). ننصح المتداولين بمراقبة شارت 4 ساعات للحصول على أفضل نقاط الدخول المتوافقة مع الاتجاه الصاعد العام.</p>

                            <blockquote>
                                "الذهب ليس مجرد معدن، بل هو العملة الوحيدة التي لم تفقد قيمتها عبر آلاف السنين."
                            </blockquote>

                            <h2>الخلاصة: هل فاتتك الفرصة؟</h2>
                            <p>بالتأكيد لا. نحن حالياً في بداية موجة صاعدة ثالثة حسب تحليل موجات إليوت، مما يعني أن هناك متسعاً من الوقت لبناء مراكز شرائية مع إدارة مخاطر صارمة.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-medium text-foreground">As we enter 2026, Gold remains the premier safe-haven asset amidst global market volatility. In this comprehensive report, we analyze the technical and fundamental factors driving the yellow metal toward unprecedented record highs.</p>

                            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl my-8">
                                <h3 className="text-amber-500 mt-0 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" /> Current Price & Market Status
                                </h3>
                                <p className="mb-0">Gold is currently trading around <strong>$4,400 per ounce</strong>, maintaining the strong upward momentum that began in late 2024. Forecasts suggest this rally could hit $5,000 by year-end.</p>
                            </div>

                            <h2>I. Fundamental Drivers of the Rally</h2>
                            <h3>1. Central Bank Accumulation</h3>
                            <p>Global central banks have continued to increase their gold reserves at historic rates. China, India, and many emerging market nations are seeking to de-dollarize, creating permanent and strong demand that pushes prices higher.</p>

                            <h3>2. Monetary Policy Shifts</h3>
                            <p>As the US Federal Reserve moves toward an accommodative policy and real interest rates decline, Gold becomes more attractive. Since it yields no interest, the "opportunity cost" of holding it decreases in a low-rate environment.</p>

                            <h2>II. Technical Analysis & Price Targets</h2>
                            <p>Technically, Gold has broken out of a major ascending channel that governed its movement for years. This breakout indicates we are entering the "Price Discovery Phase."</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <h4 className="text-emerald-500 mb-2">Key Support Levels</h4>
                                    <ul className="list-disc list-inside text-sm">
                                        <li>$4,330 (Immediate Support)</li>
                                        <li>$4,200 (Strong Psychological Level)</li>
                                        <li>$4,050 (Historical Foundation)</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <h4 className="text-red-500 mb-2">Targets & Resistances</h4>
                                    <ul className="list-disc list-inside text-sm">
                                        <li>$4,550 (Initial Target)</li>
                                        <li>$4,800 (Profit Taking Zone)</li>
                                        <li>$5,100 (Strategic 2026 Target)</li>
                                    </ul>
                                </div>
                            </div>

                            <h2>III. Trading with AURA</h2>
                            <p>AURA's smart analysis software provides precise alerts when the price approaches Supply & Demand zones. Traders are advised to monitor the 4-hour chart for high-probability entries aligned with the dominant bull trend.</p>

                            <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20 my-10">
                                <h3 className="flex items-center gap-2 mt-0"><ShieldCheck className="h-5 w-5 text-primary" /> Risk Management Advice</h3>
                                <p className="text-sm italic mb-0">"Always use a trailing stop-loss in a trending market to lock in profits while allowing the trade to reach extended targets."</p>
                            </div>

                            <h2>Conclusion: Have You Missed the Opportunity?</h2>
                            <p>Absolutely not. According to Elliott Wave theory, we are currently at the beginning of a third major wave, implying significant remaining upside potential for those with a disciplined approach.</p>
                        </>
                    )}
                </div>
            </article>

            <Footer />
        </div>
    );
}
