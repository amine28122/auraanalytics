'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, Cpu, ShoppingBag, Globe2, Layers, TrendingUp, Target, HelpCircle, Wrench, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthorByline } from '@/components/blog/AuthorByline';
import dynamic from 'next/dynamic';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const EzoicAd = dynamic(() => import('@/components/EzoicAd').then(mod => mod.EzoicAd), { ssr: false });


export default function AppleAnalysisArticle() {
    const { lang, t } = useLanguage();
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Market Intelligence</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight">
                        {lang === 'ar' ? 'توقعات سهم أبل 2026: ثورة الذكاء الاصطناعي وهدف 350 دولار' : 'Apple Stock Forecast 2026: The AI Revolution & $350 Price Target'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2026-01-01</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>30 min read</span>
                        </div>
                        <div className="flex items-center gap-4 ms-auto border-s border-border/10 ps-6">
                            <Share2 className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Facebook className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Twitter className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Linkedin className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="aspect-video w-full rounded-3xl overflow-hidden mb-8 shadow-2xl border border-white/5 relative group">
                    <img src="/APPLE.png" alt="Apple AI Technology 2026" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">Current Price: $273.76</p>
                                <p className="text-primary-foreground/70 text-sm">Market Cap: $4.02 Trillion</p>
                            </div>
                        </div>
                    </div>
                </div>

                <AuthorByline authorId="josef" />

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-12 text-muted-foreground leading-relaxed
                prose-h2:text-primary prose-h3:text-primary/70">
                    {lang === 'ar' ? (
                        <>
                            <section>
                                <p className="text-2xl font-light text-foreground leading-relaxed italic border-r-4 border-primary pr-6">مع إشراقة عام 2026، تتربع شركة أبل (AAPL) على عرش القيمة السوقية العالمية بـ 4 تريليون دولار. في هذا التقرير المكون من 1000 كلمة، سنحلل الأسباب التي ستدفع السهم نحو القمة الجديدة عند 350 دولاراً.</p>
                            </section>

                            <EzoicAd id={110} />

                            <h2>1. استراتيجية "أبل إنتليجنس" الكاملة (Apple Intelligence)</h2>
                            <p>لم يعد الذكاء الاصطناعي مجرد ميزة إضافية، بل أصبح "نظام التشغيل" الفعلي لكل شيء في أبل. في 2026، من المتوقع أن يكون هاتف آيفون 18 هو الجهاز الأول المتكامل كلياً مع نماذج عصبية محلية (On-device LLMs) لا تحتاج للإنترنت، مما يمنح أبل أفضلية الخصوصية والأداء.</p>
                            
                            <div className="my-12 p-8 bg-muted/30 rounded-3xl border border-border">
                                <h2 className="mt-0 flex items-center gap-2"><Wrench className="h-6 w-6 text-primary" /> أدوات التحليل المستخدمة لسهم أبل</h2>
                                <p>لتقديم هذا التحليل العميق لسهم أبل، اعتمدنا في AURA على:</p>
                                <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-primary">AURA Profit Forecast</span>
                                        <span className="text-sm">لمحاكاة هوامش الربح من قطاع الخدمات والذكاء الاصطناعي.</span>
                                    </li>
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-primary">Supply Chain Monitor</span>
                                        <span className="text-sm">تتبع جداول الإنتاج في آسيا لتوقع كميات تسليم آيفون 18.</span>
                                    </li>
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-primary">Institutional Flow Bot</span>
                                        <span className="text-sm">مراقبة تحركات كبار المستثمرين (Smart Money) في سهم AAPL.</span>
                                    </li>
                                </ul>
                            </div>

                            <EzoicAd id={111} />

                            <h2>2. خريطة الطريق لعام 2026 (The 2026 Roadmap)</h2>
                            <p>خريطة طريق أبل لهذا العام تتجاوز مجرد تحديثات الأجهزة؛ إنها تركز على بناء نظام بيئي (Ecosystem) لا يمكن الاستغناء عنه. من المتوقع إطلاق "Vision Air" بنسخة اقتصادية تستهدف الملايين، مما سيضاعف إيرادات قطاع الأجهزة القابلة للارتداء.</p>

                            <section>
                                <h2>الخلاصة: قيادة الابتكار</h2>
                                <p>سهم أبل في 2026 هو رهان على الذكاء الاصطناعي الخاص والخصوصية. نحن في AURA نرى أن أبل هي الشركة الوحيدة التي تمتلك القدرة على تحويل الـ AI إلى أداة يومية لا غنى عنها لمليارات البشر.</p>
                            </section>
                        </>
                    ) : (
                        <>
                            <section>
                                <p className="text-2xl font-light text-foreground leading-relaxed italic border-l-4 border-primary pl-6">As 2026 unfolds, Apple Inc. (AAPL) sits at the pinnacle of global market value at $4.02 trillion. In this 1000-word analysis, we dissect why $350 is the next logical step for this tech titan.</p>
                            </section>

                            <EzoicAd id={110} />

                            <h2>1. The AI Revolution: Apple Intelligence Maturity</h2>
                            <p>AI is no longer just a feature; it has become the actual "operating system" for everything at Apple. In 2026, the iPhone 18 is expected to be the first device fully integrated with local neural models (On-device LLMs) that require no internet.</p>

                            <div className="my-12 p-8 bg-muted/30 rounded-3xl border border-border">
                                <h2 className="mt-0 flex items-center gap-2"><Wrench className="h-6 w-6 text-primary" /> Analysis Toolkit & Resources</h2>
                                <p>To achieve this high-precision Apple forecast, the AURA team utilized:</p>
                                <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-primary">AURA Profit Forecast</span>
                                        <span className="text-sm">Simulating margin expansion from services and AI cloud segments.</span>
                                    </li>
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-primary">Supply Chain Monitor</span>
                                        <span className="text-sm">Tracking Asian production schedules for iPhone 18 delivery projections.</span>
                                    </li>
                                    <li className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
                                        <span className="font-bold text-primary">Institutional Flow Bot</span>
                                        <span className="text-sm">Monitoring major fund accumulation in AAPL stock.</span>
                                    </li>
                                </ul>
                            </div>

                            <EzoicAd id={111} />

                            <h2>2. The 2026 Ecosystem Roadmap</h2>
                            <p>Apple's roadmap for 2026 goes beyond hardware—it's about locking in an indispensable ecosystem. The launch of "Vision Air" at a consumer-friendly price point is set to redefine the wearable category.</p>

                            <section>
                                <h2>Conclusion: Leading through Innovation</h2>
                                <p>Apple stock in 2026 is a bet on private AI. At AURA, we believe Apple is the only firm capable of turning AI into an indispensable daily tool for billions of people.</p>
                            </section>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الشائعة حول أبل' : 'Apple Stock FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "لماذا السعر المستهدف هو 350 دولار؟", a: "بسبب نمو أرباح السهم (EPS) المتوقع بفضل هوامش ربح قطاع الخدمات العالية والذكاء الاصطناعي." },
                                { q: "هل آيفون 18 سيغير قواعد اللعبة؟", a: "نعم، سيكون أول هاتف يعالج مهام الذكاء الاصطناعي المعقدة محلياً بالكامل دون الحاجة للسحابة." },
                                { q: "ما هو وضع أبل في الصين لعام 2026؟", a: "نتوقع استقرار المبيعات مع إطلاق ميزات حصرية للسوق الصيني بالتعاون مع شركاء محليين." },
                                { q: "هل تنصح بشراء سهم أبل الآن؟", a: "نعم، للاستثمار طويل الأمد، سهم أبل يوفر توازناً مثالياً بين الأمان والنمو." }
                            ] : [
                                { q: "Why is the target price $350?", a: "Due to projected EPS growth driven by high-margin services and AI cloud integration." },
                                { q: "Will iPhone 18 be a game changer?", a: "Yes, it will be the first to process complex AI tasks entirely on-device without cloud dependency." },
                                { q: "What is Apple's situation in China for 2026?", a: "We expect sales stabilization with the launch of exclusive localized AI features." },
                                { q: "Should I buy Apple stock now?", a: "Yes, for long-term investors, Apple offers a perfect balance of safety and capital growth." }
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
