'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EzoicAd } from '@/components/EzoicAd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ElliottWaveArticle() {
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
                            {lang === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
                        </Link>
                    </Button>

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Analysis</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'تنبؤات موجات إليوت: كيف تتوقع الانعكاسات الكبرى في السوق' : 'Elliott Wave Prediction: How to Forecast Major Market Reversals'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-25</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>14 min</span>
                        </div>
                        <div className="flex items-center gap-4 ms-auto">
                            <Share2 className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Facebook className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Twitter className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Linkedin className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-border/10">
                    <img src="/8.png" alt="Elliott Wave Theory Prediction" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
                prose-h3:text-2xl prose-h3:mt-10
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-e-xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p>اكتشف رالف نيلسون إليوت في ثلاثينيات القرن العشرين أن الأسواق المالية لا تتحرك بطريقة فوضوية، بل في دورات متكررة أو "موجات". هذه الموجات هي انعكاس للنفسية البشرية الجماعية—تتناوب بين التفاؤل والتشاؤم.</p>

                            <EzoicAd id={110} />
                            <h2>النفسية الجوهرية للسوق</h2>
                            <p>الأسواق تحركها الحالة المزاجية الاجتماعية. تقوم نظرية موجات إليوت بقياس هذا المزاج في أنماط. عندما يكون الناس في حالة نشوة، نرى الاندفاع المكون من 5 موجات. وعندما يشعرون بالخوف، نرى التصحيح المكون من 3 موجات.</p>

                            <h2>نموذج الـ 5 موجات الحافز</h2>
                            <h3>تشريح الاندفاع</h3>
                            <ul>
                                <li><strong>الموجة 1:</strong> حركة أولية، غالباً لا يتم التعرف عليها.</li>
                                <li><strong>الموجة 2:</strong> تراجع حاد، غالباً ما يختبر بداية الموجة 1.</li>
                                <li><strong>الموجة 3:</strong> أقوى توسع؛ حيث يتم جني أكبر قدر من الأرباح.</li>
                                <li><strong>الموجة 4:</strong> تصحيح معقد؛ غالباً ما يكون عرضياً.</li>
                                <li><strong>الموجة 5:</strong> حركة الإنهاك الأخيرة؛ يدخل متداولو التجزئة هنا بينما تخرج الأموال الكبيرة.</li>
                            </ul>

                            <h2>الموجات التصحيحية: نموذج ABC</h2>
                            <p>بعد اندفاع مكون من 5 موجات، يجب أن يصحح السوق. يحدث هذا عادة في نموذج "ABC" المكون من 3 موجات. فهم هذا التسلسل يسمح للمتداولين المحترفين بانتظار اكتمال التصحيح قبل الدخول في الموجة الاندفاعية الكبرى التالية.</p>

                            <h2>النسب الذهبية: فيبوناتشي وإليوت</h2>
                            <p>غالباً ما تلتزم موجات إليوت بنسب فيبوناتشي. على سبيل المثال، الموجة 2 عادة ما تتراجع بنسبة 61.8% من الموجة 1. وغالباً ما تكون الموجة 3 بطول 161.8% من الموجة 1. هذه الدقة الرياضية هي ما تجعل التنبؤ ممكناً.</p>

                            <h2>الخلاصة</h2>
                            <p>يستخدم محرك أورا الهندسة الكسورية لتحليل هذه الموجات عبر أطر زمنية متعددة في وقت واحد، مما يوفر منظوراً "من الأعلى لأسفل" يبقيك في الجانب الصحيح من السوق.</p>
                        </>
                    ) : (
                        <>
                            <p>Ralph Nelson Elliott discovered in the 1930s that financial markets do not move in a chaotic manner, but rather in repetitive cycles or "waves." These waves are a reflection of collective human psychology—alternating between optimism and pessimism.</p>

                            <h2>The core Psychology of the Market</h2>
                            <p>Markets are driven by social mood. Elliott Wave Theory quantifies this mood into patterns. When people are euphoric, we see the 5-wave impulse. When they are fearful, we see the 3-wave correction.</p>

                            <h2>The 5-Wave Motive Pattern</h2>
                            <h3>The Anatomy of an Impulse</h3>
                            <ul>
                                <li><strong>Wave 1:</strong> Initial move, often unrecognized.</li>
                                <li><strong>Wave 2:</strong> Sharp retracement, often testing the start of Wave 1.</li>
                                <li><strong>Wave 3:</strong> The strongest expansion; where the most money is made.</li>
                                <li><strong>Wave 4:</strong> Complex correction; often sideways.</li>
                                <li><strong>Wave 5:</strong> Final exhaustion move; retail traders enter here while big money exits.</li>
                            </ul>

                            <h2>Corrective Waves: The ABC Pattern</h2>
                            <p>After a 5-wave impulse, the market must correct. This usually happens in a 3-wave "ABC" pattern. Understanding this sequence allows professional traders to wait for the completion of a correction before entering for the next major impulse wave.</p>

                            <h2>Golden Ratios: Fibonacci and Elliott</h2>
                            <p>Elliott waves often adhere to Fibonacci proportions. For example, Wave 2 typically retraces 61.8% of Wave 1. Wave 3 is often 161.8% of Wave 1's length. This mathematical precision is what makes forecasting possible.</p>

                            <h2>Conclusion</h2>
                            <p>AURA's engine uses fractal geometry to analyze these waves across multiple timeframes simultaneously, providing a "top-down" perspective that keeps you on the right side of the market.</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الشائعة حول هذا الموضوع' : 'Frequently Asked Questions'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "هل الموجة 3 هي دائماً الأطول؟", a: "لا يمكن أن تكون الموجة 3 هي الأقصر، وفي معظم السلع والأسهم، تكون هي الموجة الأطول والأقوى." },
                                { q: "ما هو تصحيح الـ Flat؟", a: "هو نموذج تصحيحي حيث يتحرك السعر بشكل عرضي بدلاً من التصحيح العميق، مما يظهر زخماً أساسياً قوياً." },
                                { q: "هل يمكن لموجات إليوت التنبؤ بالسعر الدقيق؟", a: "توفر مناطق مستهدفة بناءً على نسب فيبوناتشي، والتي تملك نسبة نجاح تاريخية عالية جداً عند دمجها مع الهيكلية." }
                            ] : [
                                { q: "Is Wave 3 always the longest?", a: "Wave 3 cannot be the shortest wave, and in most commodities and stocks, it is the longest and most powerful wave." },
                                { q: "What is a 'Flat' correction?", a: "It is a corrective pattern where price moves sideways rather than deeply against the trend, showing strong underlying momentum." },
                                { q: "Can Elliott Wave predict the exact price?", a: "It provides target zones based on Fibonacci ratios, which have a very high historical strike rate when combined with structure." }
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

                <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-tr from-blue-900/40 via-purple-900/40 to-black border border-primary/30 text-center shadow-xl">
                    <h2 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'هل أنت مستعد للتداول كالمحترفين؟' : 'Ready to Trade Like the Pros?'}</h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                        {lang === 'ar'
                            ? 'انضم إلى آلاف المتداولين واستفد من قوة تحليلات أورا اليوم.'
                            : 'Join thousands of traders and leverage the power of AURA Analytics today.'}
                    </p>
                    <Button size="lg" className="futuristic-button h-14 px-10 text-lg" asChild>
                        <Link href="/pricing">{t.become_member}</Link>
                    </Button>
                </div>
            </article>

            <Footer />

            <style dangerouslySetInnerHTML={{
                __html: `
                .article-body h2 {
                    scroll-margin-top: 100px;
                }
                [dir="rtl"] .article-body h2 {
                    border-left: 0;
                    border-right: 4px solid hsl(var(--primary));
                    padding-left: 0;
                    padding-right: 1rem;
                }
            ` }} />
        </div>
    );
}
