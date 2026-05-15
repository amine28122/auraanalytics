'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, TrendingUp, AlertTriangle, ShieldCheck, HelpCircle, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthorByline } from '@/components/blog/AuthorByline';
import dynamic from 'next/dynamic';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const EzoicAd = dynamic(() => import('@/components/EzoicAd').then(mod => mod.EzoicAd), { ssr: false });


export default function GoldAnalysisArticle() {
    const { lang } = useLanguage();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={cn("min-h-screen bg-background text-foreground pb-20 antialiased overflow-x-hidden", lang === 'ar' && "font-['Cairo']")} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <LandingHeader />

            <article className="container mx-auto max-w-4xl px-4 pt-44 pb-20">
                <div className="mb-12">
                    <Button variant="ghost" className="mb-8 p-0 hover:bg-transparent text-primary" asChild>
                        <Link href="/blog" className="flex items-center gap-2">
                            {lang === 'ar' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            {lang === 'ar' ? 'العودة لمركز التحليل' : 'Back to Analysis Center'}
                        </Link>
                    </Button>

                    <Badge className="mb-4 bg-amber-500/20 text-amber-500 border-amber-500/30 py-1 px-4">Macro Markets</Badge>
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
                            <span>18 min read</span>
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

                <AuthorByline authorId="nabil" />


                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed">
                    {lang === 'ar' ? (
                        <>
                            <p className="text-xl font-medium text-foreground">مع دخولنا عام 2026، يظل الذهب هو الملاذ الآمن الأول وسط تقلبات الأسواق العالمية. في هذا التقرير الشامل، سنقوم بتحليل العوامل التقنية والأساسية التي تدفع المعدن الأصفر نحو مستويات قياسية جديدة غير مسبوقة.</p>

                            <EzoicAd id={110} />

                            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl my-8">
                                <h3 className="text-amber-500 mt-0 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" /> السعر الحالي والوضع السوقي
                                </h3>
                                <p className="mb-0">يتداول الذهب حالياً عند مستويات <strong>4,400 دولار للأونصة</strong>، مكملاً مسيرة الصعود القوية التي بدأت في أواخر عام 2024. التوقعات تشير إلى استمرار هذا الزخم ليصل إلى 5,000 دولار بحلول نهاية العام.</p>
                            </div>

                            <h2>أولاً: الدوافع الأساسية للصعود (Fundamental Drivers)</h2>
                            <p>استمرت البنوك المركزية العالمية في زيادة احتياطياتها من الذهب بمعدلات تاريخية. الصين والهند والعديد من دول الأسواق الناشئة تسعى لتقليل الاعتماد على الدولار الأمريكي، مما يخلق طلباً دائماً وقوياً يرفع الأسعار.</p>

                            <div className="my-12 p-8 bg-muted/30 rounded-3xl border border-border">
                                <h2 className="mt-0 flex items-center gap-2"><Wrench className="h-6 w-6 text-amber-500" /> الأدوات المستخدمة في تحليل الذهب</h2>
                                <p>لتقديم هذا التحليل العميق للذهب، نعتمد على حزمة من الأدوات المتقدمة:</p>
                                <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-amber-500">AURA AI Liquidity Map</span>
                                        <span className="text-sm">لمعرفة أين تضع البنوك المركزية أوامر الشراء الضخمة.</span>
                                    </li>
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-amber-500">DXY Correlation Bot</span>
                                        <span className="text-sm">لمراقبة العلاقة العكسية بين الدولار والذهب لحظة بلحظة.</span>
                                    </li>
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-amber-500">COT Reports</span>
                                        <span className="text-sm">تحليل التزام المتداولين لمعرفة مراكز كبار المضاربين في بورصة COMEX.</span>
                                    </li>
                                </ul>
                            </div>

                            <EzoicAd id={111} />

                            <h2>ثانياً: التحليل التقني والأهداف السعرية</h2>
                            <p>من الناحية التقنية، اخترق الذهب قناة صاعدة كبرى كانت تحكم حركته لسنوات. هذا الاختراق يشير إلى دخولنا في "مرحلة اكتشاف السعر" (Price Discovery Phase).</p>

                            <h2>الخلاصة: هل فاتتك الفرصة؟</h2>
                            <p>بالتأكيد لا. نحن حالياً في بداية موجة صاعدة ثالثة حسب تحليل موجات إليوت، مما يعني أن هناك متسعاً من الوقت لبناء مراكز شرائية مع إدارة مخاطر صارمة.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-medium text-foreground">As we enter 2026, Gold remains the premier safe-haven asset amidst global market volatility. In this comprehensive report, we analyze the technical and fundamental factors driving the yellow metal toward unprecedented record highs.</p>

                            <EzoicAd id={110} />

                            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl my-8">
                                <h3 className="text-amber-500 mt-0 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" /> Current Price & Market Status
                                </h3>
                                <p className="mb-0">Gold is currently trading around <strong>$4,400 per ounce</strong>, maintaining the strong upward momentum that began in late 2024. Forecasts suggest this rally could hit $5,000 by year-end.</p>
                            </div>

                            <h2>I. Fundamental Drivers of the Rally</h2>
                            <p>Global central banks have continued to increase their gold reserves at historic rates. China, India, and many emerging market nations are seeking to de-dollarize, creating permanent and strong demand.</p>

                            <div className="my-12 p-8 bg-muted/30 rounded-3xl border border-border">
                                <h2 className="mt-0 flex items-center gap-2"><Wrench className="h-6 w-6 text-amber-500" /> Analysis Toolkit & Resources</h2>
                                <p>To deliver this high-fidelity Gold analysis, we utilize the following professional toolkit:</p>
                                <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-amber-500">AURA AI Liquidity Map</span>
                                        <span className="text-sm">To identify where central banks are placing massive buy orders.</span>
                                    </li>
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-amber-500">DXY Correlation Bot</span>
                                        <span className="text-sm">Real-time monitoring of the inverse relationship between USD and Gold.</span>
                                    </li>
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-amber-500">COT Reports Analysis</span>
                                        <span className="text-sm">Analyzing the Commitment of Traders to understand commercial positioning.</span>
                                    </li>
                                </ul>
                            </div>

                            <EzoicAd id={111} />

                            <h2>II. Technical Analysis & Price Targets</h2>
                            <p>Technically, Gold has broken out of a major ascending channel that governed its movement for years. This breakout indicates we are entering the "Price Discovery Phase."</p>

                            <h2>Conclusion: Preparation is Key</h2>
                            <p>Absolutely not. According to Elliott Wave theory, we are currently at the beginning of a third major wave, implying significant remaining upside potential for those with a disciplined approach.</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-8 w-8 text-amber-500" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الشائعة حول الذهب' : 'Gold Market FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "هل الذهب أفضل من البتكوين في 2026؟", a: "كلاهما أصول نادرة، لكن الذهب يتميز باستقرار أكبر بينما يوفر البتكوين عوائد أعلى مقابل مخاطرة أكبر." },
                                { q: "كيف أبدأ الاستثمار في الذهب؟", a: "يمكنك البدء بصناديق الاستثمار المتداولة (ETFs) أو شراء الذهب الفيزيائي كتحوط طويل الأمد." },
                                { q: "ما هو أفضل وقت للشراء؟", a: "بناءً على نماذجنا، أي تصحيح نحو 4,200 دولار يعتبر منطقة شراء استراتيجية ممتازة." }
                            ] : [
                                { q: "Is Gold better than Bitcoin in 2026?", a: "Both are scarce assets, but Gold offers higher stability while Bitcoin provides higher potential returns with more risk." },
                                { q: "How do I start investing in Gold?", a: "You can start with Gold ETFs or physical gold as a long-term hedge against inflation." },
                                { q: "When is the best time to buy?", a: "According to our models, any correction toward $4,200 is considered an excellent strategic entry zone." }
                            ]).map((faq, idx) => (
                                <AccordionItem key={idx} value={`item-${idx}`} className="border-border/10">
                                    <AccordionTrigger className="text-lg font-medium hover:text-primary text-start">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed text-lg pb-6">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            </article>

            <Footer />
        </div>
    );
}
