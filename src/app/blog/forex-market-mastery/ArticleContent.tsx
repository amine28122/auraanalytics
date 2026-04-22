'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, HelpCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EzoicAd } from '@/components/EzoicAd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ForexMasteryArticle() {
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Forex</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'موسوعة احتراف الفوركس: الدليل الشامل للتداول مع كبار المؤسسات المالية' : 'The Ultimate Forex Encyclopedia: Trading with Financial Giants'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-31</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>45 min</span>
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
                    <img src="/forex_market_mastery_banner.png" alt="Forex Market Mastery" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
                prose-h3:text-2xl prose-h3:mt-10
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-e-xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p className="text-xl font-medium text-foreground/80 italic">مرحباً بك في أعمق دليل تعليمي حول سوق الفوركس، حيث سنتجاوز القشور لندخل في صلب الآليات التي تحرك تريليونات الدولارات يومياً.</p>

                            <EzoicAd id={110} />
                            <h2>المقدمة: لماذا الفوركس هو الملك؟</h2>
                            <p>سوق صرف العملات الأجنبية (Forex) ليس مجرد شاشة وأرقام؛ هو انعكاس لقوة الأمم. بمتوسط تداول يومي يتجاوز 6.6 تريليون دولار، يتفوق الفوركس على جميع أسواق الأسهم العالمية مجتمعة. في هذا المقال، سنفكك شفرة هذا السوق لنجعلك تتداول بجانب "الأموال الذكية" بدلاً من أن تكون ضحية لها.</p>

                            <h2>القسم الأول: هيكلية السوق واللاعبون الأساسيون</h2>
                            <h3>1. البنوك المركزية (The Puppet Masters)</h3>
                            <p>البنوك المركزية، مثل الاحتياطي الفيدرالي الأمريكي (Fed) والبنك المركزي الأوروبي (ECB)، هي المحرك الأول. قراراتهم بشأن معدلات الفائدة والسياسة النقدية تملي على العملات اتجاهاتها لسنوات. عندما ترفع دولة ما معدل الفائدة، تصبح عملتها أكثر جاذبية للمستثمرين، مما يؤدي إلى زيادة الطلب وارتفاع السعر.</p>

                            <h3>2. بنوك الدرجة الأولى (Tier 1 Banks)</h3>
                            <p>مؤسسات مثل JP Morgan و Goldman Sachs هي من تصنع السيولة. هم لا يتداولون بناءً على مؤشرات "RSI" أو "MACD"؛ بل يتداولون بناءً على تدفقات الطلبات الضخمة واحتياجات الشركات الكبرى. فهم كيف يتحرك هؤلاء العمالقة هو سر استراتيجية الـ ICT التي نعتمدها في أورا.</p>

                            <h2>القسم الثاني: التحليل الأساسي (الجغرافيا السياسية والاقتصاد)</h2>
                            <p>الكثير من المتداولين يغرقون في الشارت وينسون الواقع. التحليل الأساسي هو البوصلة التي تخبرك "لماذا" يتحرك السعر.</p>
                            <ul className="space-y-4">
                                <li><strong>تقرير الوظائف غير الزراعية (NFP):</strong> القنبلة الموقوتة في سوق الفوركس، تصدر أول جمعة من كل شهر وتحدد قوة الدولار.</li>
                                <li><strong>مؤشر أسعار المستهلك (CPI):</strong> المقياس الحقيقي للتضخم، والذي يجبر البنوك المركزية على تغيير سياساتها.</li>
                                <li><strong>الأزمات الجيوسياسية:</strong> الذهب والفرنك السويسري والين الياباني تعتبر "ملاذات آمنة" (Safe Havens) في أوقات التوتر.</li>
                            </ul>

                            <h2>القسم الثالث: هندسة السيولة (Liquidity Engineering)</h2>
                            <p>في أورا، نؤمن بأن السعر يتحرك لسبب واحد فقط: البحث عن السيولة. السيولة توجد في مكانين: فوق القمم وتحت القيعان.</p>
                            <blockquote>"السوق هو آلية لنقل المال من المتداولين غير الصبورين إلى المتداولين الصبورين." - وارن بافيت</blockquote>
                            <h3>صيد وقف الخسارة (Stop Hunt)</h3>
                            <p>هل دخلت صفقة يوماً ما، ثم ضرب السعر "الستوب" الخاص بك وانطلق نحو الهدف؟ هذا لم يكن حظاً سيئاً؛ بل كان بحثاً مؤسساتياً عن السيولة لتفعيل صفقاتهم الكبرى. نحن نعلمك كيف تكتشف هذه الحركة قبل وقوعها.</p>

                            <h2>القسم الرابع: استراتيجية التداول الاحترافية</h2>
                            <p>لتحقيق النجاح المستدام، تحتاج إلى نظام متكامل. إليك الهيكل الأساسي لصفقة احترافية:</p>
                            <ol className="list-decimal pl-6 space-y-4">
                                <li><strong>تحديد الاتجاه العام (Higher Timeframe Context):</strong> هل نحن في توسع أم في تراجع على الفريم اليومي؟</li>
                                <li><strong>تحديد منطقة القيمة (PD Array):</strong> هل السعر في الـ Order Block أم الـ Fair Value Gap؟</li>
                                <li><strong>تأكيد الكسر الهيكلي (Market Structure Shift):</strong> لا ندخل بعشوائية، ننتظر تغير السلوك السعري على فريمات أصغر.</li>
                                <li><strong>إدارة المخاطر الصارمة:</strong> الهدف دائماً 1:3 كحد أدنى.</li>
                            </ol>

                            <h2>القسم الخامس: سيكولوجية المتداول في الفوركس</h2>
                            <p>الفوركس سريع جداً، وهذا يولد ضغوطاً نفسية رهيبة. "الانتقام التداولي" بعد الخسارة هو السبب الأول لتصفير الحسابات. المتداول المحترف يرى الخسارة مجرد "تكلفة عمل لابد منها" مثل إيجار المحل.</p>

                            <h2>الخلاصة: خارطة الطريق للنجاح</h2>
                            <p>الفوركس غابة، ولكي تنجو يجب أن تتبع القادة. في AURA Analytics، نمنحك الرادار الذي يكشف لك تحركات الأسود في هذه الغابة. لا تتداول ضدهم، اتبع آثار أقدامهم.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-medium text-foreground/80 italic">Welcome to the most in-depth educational guide on the Forex market, where we go beyond the surface into the core mechanisms moving trillions of dollars daily.</p>

                            <h2>Introduction: Why Forex is King?</h2>
                            <p>The Foreign Exchange (Forex) market is not just screens and numbers; it is a reflection of the strength of nations. With a daily trading volume exceeding $6.6 trillion, Forex dwarfs all global stock markets combined. In this article, we will decode this market to make you trade alongside "Smart Money" instead of being its victim.</p>

                            <h2>Section 1: Market Structure and Key Players</h2>
                            <h3>1. Central Banks (The Puppet Masters)</h3>
                            <p>Central banks, like the Federal Reserve (Fed) and the European Central Bank (ECB), are the primary movers. Their decisions on interest rates and monetary policy dictate currency trends for years. When a country raises rates, its currency becomes more attractive, leading to increased demand and higher prices.</p>

                            <h3>2. Tier 1 Banks</h3>
                            <p>Institutions like JP Morgan and Goldman Sachs create the liquidity. They don't trade based on "RSI" or "MACD" indicators; they trade based on massive order flows and the needs of major corporations. Understanding how these giants move is the secret of the ICT strategy we adopt at AURA.</p>

                            <h2>Section 2: Fundamental Analysis (Geopolitics and Economics)</h2>
                            <p>Many traders drown in charts and forget reality. Fundamental analysis is the compass that tells you "why" price moves.</p>
                            <ul className="space-y-4">
                                <li><strong>Non-Farm Payrolls (NFP):</strong> The ticking time bomb in Forex, released every first Friday of the month, determining USD strength.</li>
                                <li><strong>Consumer Price Index (CPI):</strong> The true measure of inflation, forcing central banks to shift policies.</li>
                                <li><strong>Geopolitical Crises:</strong> Gold, CHF, and JPY are considered "Safe Havens" in times of tension.</li>
                            </ul>

                            <h2>Section 3: Liquidity Engineering</h2>
                            <p>At AURA, we believe price moves for one reason: seeking liquidity. Liquidity exists in two places: above highs and below lows.</p>
                            <blockquote>"The stock market is a device for transferring money from the impatient to the patient." - Warren Buffett</blockquote>
                            <h3>Stop Hunt</h3>
                            <p>Have you ever entered a trade, only for the price to hit your stop and then race to your target? That wasn't bad luck; it was institutional hunting for liquidity to activate their massive orders. We teach you how to spot this before it happens.</p>

                            <h2>Section 4: Professional Trading Strategy</h2>
                            <p>For sustainable success, you need a complete system. Here is the basic structure of a professional trade:</p>
                            <ol className="list-decimal pl-6 space-y-4">
                                <li><strong>Higher Timeframe Context:</strong> Are we in expansion or retracement on the Daily?</li>
                                <li><strong>PD Array Identification:</strong> Is the price in an Order Block or a Fair Value Gap?</li>
                                <li><strong>Market Structure Shift (MSS):</strong> We don't enter randomly; we wait for a change in price behavior on lower timeframes.</li>
                                <li><strong>Strict Risk Management:</strong> The target is always at least 1:3.</li>
                            </ol>

                            <h2>Section 5: Trader Psychology in Forex</h2>
                            <p>Forex is very fast, creating immense psychological pressure. "Revenge trading" after a loss is the number one cause of blown accounts. A professional trader sees a loss as a "business expense," like shop rent.</p>

                            <h2>Conclusion: The Roadmap to Success</h2>
                            <p>Forex is a jungle, and to survive, you must follow the leaders. At AURA Analytics, we give you the radar that reveals the movements of the lions in this jungle. Don't trade against them, follow their footprints.</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الأكثر عمقاً حول الفوركس' : 'Deep Forex FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "ما هي العملات السلعية (Commodity Currencies)؟", a: "هي عملات دول تعتمد صادراتها على سلع معينة، مثل الدولار الكندي (يتأثر بالنفط) والدولار الأسترالي (يتأثر بالذهب)." },
                                { q: "كيف أتنبأ بالانعكاس السعري قبل وقوعه؟", a: "من خلال مراقبة 'فجوات القيمة العادلة' (FVG) والبحث عن 'فشل السعر في كسر القمة السابقة' مع وجود دايفرجنس." },
                                { q: "هل الرافعة المالية 1:500 خطرة؟", a: "الرافعة هي تضخيم لقدرتك الشرائية؛ هي ليست خطرة بحد ذاتها، بل غياب 'إدارة العقد' هو الخطر الحقيقي." }
                            ] : [
                                { q: "What are Commodity Currencies?", a: "These are currencies of countries whose exports depend on specific commodities, like CAD (oil) and AUD (gold)." },
                                { q: "How do I predict a price reversal before it happens?", a: "By monitoring 'Fair Value Gaps' (FVG) and looking for 'Failure Swings' combined with Divergence." },
                                { q: "Is 1:500 leverage dangerous?", a: "Leverage is an amplification of your purchasing power; it's not dangerous in itself, but the lack of 'position sizing' is the real danger." }
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
                    <h2 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'هل أنت مستعد لتصبح جزءاً من الـ 1% الرابحين؟' : 'Ready to be Part of the Profitable 1%?'}</h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                        {lang === 'ar'
                            ? 'أورا توفر لك التكنولوجيا التي كانت حكراً على البنوك الكبرى فقط.'
                            : 'AURA provides you with the technology that was once exclusive to big banks.'}
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
