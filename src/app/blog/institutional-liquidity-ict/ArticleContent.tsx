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
import dynamic from 'next/dynamic';
const EzoicAd = dynamic(() => import('@/components/EzoicAd').then(mod => mod.EzoicAd), { ssr: false });
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function InstitutionalLiquidityArticle() {
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Technical</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'اللعبة الخفية: فهم السيولة المؤسساتية وآلية تسليم السعر' : 'The Invisible Game: Understanding Institutional Liquidity and Price Delivery'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-28</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>12 min</span>
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
                    <img src="/7.png" alt="Institutional Liquidity Logic" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
                prose-h3:text-2xl prose-h3:mt-10
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-e-xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p>سيولة السوق هي شريان الحياة للتداول. بدونها، لا يمكن للسعر أن يتحرك. تتطلب المؤسسات—البنوك الكبرى، صناديق التحوط، والبنوك المركزية—كميات هائلة من السيولة لتنفيذ أوامرها دون التسبب في انزلاق سعري مفرط.</p>

                            <EzoicAd id={110} />
                            <h2>أسطورة العرض والطلب</h2>
                            <p>مناطق العرض والطلب التقليدية لدى التجزئة هي غالباً المكان الذي "تكمن" فيه السيولة. تعرف البنوك الكبرى أن متداولي التجزئة يضعون أوامر وقف الخسارة فوق أو تحت هذه المناطق مباشرة. هذا يخلق "تجمعاً للسيولة" تستخدمه المؤسسات لملء مراكزها الأكبر بكثير.</p>

                            <h2>فهم بصمات الأموال الذكية</h2>
                            <h3>1. سحب السيولة (The Raid)</h3>
                            <p>قبل أي حركة كبرى، غالباً ما يمسح السوق قمة أو قاعاً ملحوظاً. هذا ليس "كسراً كاذباً" بالمعنى التقليدي—بل هو غارة ضرورية على السيولة لتغذية الاتجاه القادم.</p>

                            <h3>2. تحول هيكلية السوق (MSS)</h3>
                            <p>يحدث التحول في هيكلية السوق عندما يتم كسر قمة أو قاع سابق بزخم بعد سحب السيولة. هذه هي الإشارة الأولى على أن الاتجاه قد تغير رسمياً.</p>

                            <h2>PO3: قوة الـ 3 (تجميع، تلاعب، توزيع)</h2>
                            <p>هذا هو حجر الزاوية في تسليم السعر المؤسساتي. في اليوم الصاعد:
                                <ul>
                                    <li><strong>التجميع:</strong> يحدث خلال الفترة الآسيوية.</li>
                                    <li><strong>التلاعب:</strong> عادة ما يكون هبوطاً تحت سعر الافتتاح خلال فترة لندن (تأرجح يهوذا).</li>
                                    <li><strong>التوزيع:</strong> حركة التوسع الرئيسية نحو الأعلى.</li>
                                </ul>
                            </p>

                            <h2>التطبيق العملي</h2>
                            <p>من خلال فهم هذه المفاهيم، ستتوقف عن كونك "السيولة" وتبدأ في التداول بجانبها. تدمج تحليلات أورا هذه البوابات المنطقية في كل إشارة يولدها محركنا.</p>
                        </>
                    ) : (
                        <>
                            <p>Market liquidity is the lifeblood of trading. Without it, price cannot move. Institutions—large banks, hedge funds, and central banks—require massive amounts of liquidity to fill their orders without causing excessive slippage.</p>

                            <h2>The Myth of Supply and Demand</h2>
                            <p>Common retail supply and demand areas are often where liquidity is "resting." Big banks know that retail traders place their stop losses just above or below these zones. This creates a pool of liquidity that institutions use to fill their much larger positions.</p>

                            <h2>Understanding Smart Money Footprints</h2>
                            <h3>1. The Liquidity Grab (The Raid)</h3>
                            <p>Before a major move, the market often sweeps a significant high or low. This is not a "fakeout" in the retail sense—it is a necessary raid on liquidity to fuel the next trend.</p>

                            <h3>2. Market Structure Shift (MSS)</h3>
                            <p>A shift in market structure occurs when a previous swing high/low is broken with momentum after a liquidity grab. This is the first signal that the trend has officially changed.</p>

                            <h2>PO3: Power of 3 (Accumulation, Manipulation, Distribution)</h2>
                            <p>This is the cornerstone of institutional price delivery. In a bullish day:
                                <ul>
                                    <li><strong>Accumulation:</strong> Happens during Asian session.</li>
                                    <li><strong>Manipulation:</strong> Usually a dip below the open price during London (The Judas Swing).</li>
                                    <li><strong>Distribution:</strong> The main expansion move to the upside.</li>
                                </ul>
                            </p>

                            <h2>Practical Application</h2>
                            <p>By understanding these concepts, you stop being the "liquidity" and start trading alongside it. AURA Analytics integrates these logic gates into every signal our engine generates.</p>
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
                                { q: "ما هي الـ Order Block؟", a: "هي شمعة محددة دخل عندها الأموال الذكية إلى السوق. تعمل كدعم أو مقاومة مستقبلية عندما يعيد السعر اختبارها." },
                                { q: "كيف أتجنب الوقوع في فخ الكسر الكاذب؟", a: "ابحث عن مسح واضح للسيولة يتبعه تحول في هيكلية السوق (MSS) قبل الدخول في أي صفقة." },
                                { q: "هل ينطبق منطق ICT على الذهب؟", a: "نعم، الذهب (XAUUSD) خوارزمي بامتياز وهو من أفضل الأصول لتحليل ICT والسيولة." }
                            ] : [
                                { q: "What is an Order Block?", a: "It is a specific candle where smart money has entered the market. It acts as a future support or resistance when price retests it." },
                                { q: "How can I avoid getting trapped by a fakeout?", a: "Look for a clear liquidity sweep followed by a Market Structure Shift (MSS) before entering any trade." },
                                { q: "Does ICT logic apply to Gold?", a: "Yes, Gold (XAUUSD) is highly algorithmic and is one of the best assets for ICT and liquidity analysis." }
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
