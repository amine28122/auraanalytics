'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, HelpCircle, Target, Layers, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SupplyDemandArticle() {
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Technical Analysis</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'مناطق العرض والطلب: المحرك الخفي وراء كل حركة سعرية كبرى' : 'Supply and Demand Zones: The Hidden Engine Behind Every Major Price Move'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-31</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>50 min</span>
                        </div>
                        <div className="flex items-center gap-4 ms-auto border-s border-border/10 ps-6 ms-auto hidden md:flex">
                            <span className="text-sm uppercase tracking-wider font-bold text-primary/80">Premium Guide</span>
                        </div>
                    </div>
                </div>

                <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-border/10">
                    <img src="/1 (2).png" alt="Supply and Demand Mechanics" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-12 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-4xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-6
                prose-h3:text-2xl prose-h3:mt-12
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-6 prose-blockquote:px-10 prose-blockquote:rounded-e-2xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p className="text-2xl font-light text-foreground/70 leading-relaxed mb-16">هل تساءلت يوماً لماذا يتوقف السعر فجأة عند نقطة ما وينعكس بقوة؟ الجواب يكمن في مبدأ اقتصادي بسيط ولكنه عميق للغاية: التوازن بين العرض والطلب. في هذا الدليل، سنغوص في أعماق آليات السوق لنكشف لك كيف تكتشف المناطق التي "تنتظر" فيها البنوك الكبرى تفعيل صفقاتها.</p>

                            <h2>المقدمة: الاقتصاد وراء الشارت</h2>
                            <p>في كل ثانية تمر، هناك صراع دائم بين المشترين والبائعين. عندما يتفوق الطلب على العرض، يرتفع السعر. وعندما يتفوق العرض على الطلب، ينخفض السعر. لكن ما يهمنا كمتداولين محترفين ليس "الحركة" نفسها، بل "المنطقة" التي تسببت في هذا الاختلال الكبير في التوازن.</p>

                            <h2>القسم الأول: تعريف مناطق العرض والطلب</h2>
                            <p>منطقة العرض والطلب ليست مجرد مستوى "دعم ومقاومة" تقليدي. هي منطقة سعرية أظهر فيها كبار الفاعلين في السوق رغبة قوية في الشراء أو البيع، مما أدى إلى ترك فجوات أو حركات انفجارية خلفهم.</p>
                            <h3>1. مناطق الطلب (Demand Zones)</h3>
                            <p>هي المناطق التي كانت فيها أوامر الشراء المؤسساتية ضخمة جداً لدرجة أن البائعين لم يتمكنوا من تلبيتها عند تلك المستويات، مما أجبر السعر على الارتفاع بسرعة. عندما يعود السعر لهذه المناطق، غالباً ما نجد أوامر شراء متبقية (Limit Orders) تنتظر التفعيل.</p>

                            <h3>2. مناطق العرض (Supply Zones)</h3>
                            <p>تعمل بنفس المنطق ولكن بشكل عكسي. هي قلاع البائعين حيث تتركز أوامر البيع الضخمة. يتم تمييز هذه المناطق من خلال "الشموع الانفجارية" (Extended Range Candles) التي تخرج منها.</p>

                            <h2>القسم الثاني: أنواع تشكيلات العرض والطلب</h2>
                            <p>لفهم هذه المناطق، يجب أن نتعلم قراءة أنماط تكونها. هناك نوعان رئيسيان لكل منطقة:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                                <div className="p-8 rounded-2xl bg-white/5 border border-border/10">
                                    <h4 className="text-primary font-bold text-xl mb-4">أنماط الاستمرار (Continuation Patterns)</h4>
                                    <ul className="space-y-2">
                                        <li><strong>Drop-Base-Drop (DBD):</strong> منطقة عرض في اتجاه هابط.</li>
                                        <li><strong>Rally-Base-Rally (RBR):</strong> منطقة طلب في اتجاه صاعد.</li>
                                    </ul>
                                </div>
                                <div className="p-8 rounded-2xl bg-white/5 border border-border/10">
                                    <h4 className="text-primary font-bold text-xl mb-4">أنماط الانعكاس (Reversal Patterns)</h4>
                                    <ul className="space-y-2">
                                        <li><strong>Drop-Base-Rally (DBR):</strong> بداية اتجاه صاعد جديد.</li>
                                        <li><strong>Rally-Base-Drop (RBD):</strong> بداية اتجاه هابط جديد.</li>
                                    </ul>
                                </div>
                            </div>

                            <h2>القسم الثالث: كيفية تقييم قوة المنطقة (The Scorecard)</h2>
                            <p>ليست كل المناطق متساوية في القوة. نحن في أورا نعتمد على ثلاثة معايير ذهبية لتقييم أي منطقة:</p>
                            <ol className="list-decimal pl-6 space-y-6">
                                <li><strong>القوة (Strength of Departure):</strong> بمدى السرعة التي غادر بها السعر المنطقة؟ كلما كانت الحركة أسرع وبشموع أطول، كانت المنطقة أقوى.</li>
                                <li><strong>الوقت المستغرق (Time at Base):</strong> القاعدة تقول: كلما قل الوقت الذي قضاه السعر في المنطقة قبل الانفجار، كان الاختلال في التوازن أكبر. "المناطق المزدحمة" ليست دائماً هي الأفضل.</li>
                                <li><strong>الانتعاش (Freshness):</strong> أفضل الصفقات تكون عند "اللمسة الأولى" للمنطقة. كلما تم لمس المنطقة أكثر، تم استهلاك الأوامر المتبقية فيها، مما يضعفها.</li>
                            </ol>

                            <h2>القسم الرابع: دمج العرض والطلب مع مفاهيم الـ ICT</h2>
                            <p>يكمن السر الحقيقي في دمج هذه المناطق مع مفاهيم السيولة (Liquidity). مناطق العرض والطلب الأكثر ربحية هي تلك التي تقع مباشرة فوق أو تحت سيولة المتداولين الأفراد (Retail Liquidity). عندما يضرب السعر "الستوبات" الخاصة بهم ويدخل في منطقة الطلب المؤسساتية، هنا تقع الصفقة المثالية.</p>
                            <blockquote>"المتداول الناجح لا يشتري لمجرد أن السعر رخيص، بل يشتري لأن هناك طلباً مؤسساتياً سيدفع السعر للأعلى."</blockquote>

                            <h2>القسم الخامس: إدارة الصفقات في مناطق العرض والطلب</h2>
                            <p>أكبر خطأ هو محاولة "توقع" المنطقة. القاعدة هي "التفاعل" وليس "التوقع".</p>
                            <div className="bg-primary/10 p-8 rounded-3xl border border-primary/20 space-y-4">
                                <h3 className="text-primary mt-0">خطة العمل الاحترافية:</h3>
                                <p>1. حدد المنطقة على فريم زمني كبير (4 ساعات أو يومي).</p>
                                <p>2. انتظر عودة السعر للمنطقة.</p>
                                <p>3. انتقل لفريم الـ 15 دقيقة وابحث عن "كسر هيكلي" (Shift in Market Structure).</p>
                                <p>4. ادخل مع إعادة الاختبار، مع وضع الستوب أسفل أو أعلى المنطقة بمسافة آمنة.</p>
                            </div>

                            <h2>الخلاصة: هل أنت مستعد لرؤية السوق بوضوح؟</h2>
                            <p>احتراف العرض والطلب هو رحلة لتغيير طريقة تفكيرك. ستتوقف عن ملاحقة الشموع الخضراء والحمراء، وستبدأ في رؤية "النطاقات" التي تتحكم في اللعبة. مع AURA Analytics، نوفر لك الأدوات الآلية التي ترسم لك هذه المناطق بدقة متناهية، لتوفر عليك عناء البحث اليدوي.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-2xl font-light text-foreground/70 leading-relaxed mb-16">Have you ever wondered why the price suddenly halts at a certain point and reverses violently? The answer lies in a simple yet profound economic principle: the balance between Supply and Demand. In this guide, we dive deep into market mechanics to reveal how to spot zones where major banks are "waiting" to activate their trades.</p>

                            <h2>Introduction: The Economics Behind the Chart</h2>
                            <p>In every passing second, there is a constant struggle between buyers and sellers. When demand exceeds supply, price rises. When supply exceeds demand, price falls. But as professional traders, we don't care about the "move" itself, but the "zone" that caused this massive imbalance.</p>

                            <h2>Section 1: Defining Supply and Demand Zones</h2>
                            <p>A Supply/Demand zone is not just a traditional "Support and Resistance" level. It is a price area where major market actors showed a strong desire to buy or sell, leaving gaps or explosive moves behind.</p>
                            <h3>1. Demand Zones</h3>
                            <p>These are areas where institutional buy orders were so massive that sellers couldn't satisfy them at those levels, forcing the price to rise rapidly. When price returns to these zones, we often find remaining Limit Orders waiting to be filled.</p>

                            <h3>2. Supply Zones</h3>
                            <p>Working on the same logic but reversed. These are the strongholds of sellers where massive sell orders are concentrated, marked by "Extended Range Candles" (ERC) exiting the area.</p>

                            <h2>Section 2: Types of Supply and Demand Formations</h2>
                            <p>To understand these zones, we must learn to read their formation patterns. There are two main types for each zone:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                                <div className="p-8 rounded-2xl bg-white/5 border border-border/10">
                                    <h4 className="text-primary font-bold text-xl mb-4">Continuation Patterns</h4>
                                    <ul className="space-y-2">
                                        <li><strong>Drop-Base-Drop (DBD):</strong> A supply zone in a downtrend.</li>
                                        <li><strong>Rally-Base-Rally (RBR):</strong> A demand zone in an uptrend.</li>
                                    </ul>
                                </div>
                                <div className="p-8 rounded-2xl bg-white/5 border border-border/10">
                                    <h4 className="text-primary font-bold text-xl mb-4">Reversal Patterns</h4>
                                    <ul className="space-y-2">
                                        <li><strong>Drop-Base-Rally (DBR):</strong> The start of a new uptrend.</li>
                                        <li><strong>Rally-Base-Drop (RBD):</strong> The start of a new downtrend.</li>
                                    </ul>
                                </div>
                            </div>

                            <h2>Section 3: Evaluating Zone Strength (The Scorecard)</h2>
                            <p>Not all zones are created equal. At AURA, we rely on three golden criteria to evaluate any zone:</p>
                            <ol className="list-decimal pl-6 space-y-6">
                                <li><strong>Strength of Departure:</strong> How fast did the price leave the zone? The faster the move and longer the candles, the stronger the zone.</li>
                                <li><strong>Time at Base:</strong> The rule is: the less time price spent in the zone before exploding, the greater the imbalance. "Congested zones" are not always the best.</li>
                                <li><strong>Freshness:</strong> The best trades are at the "First Touch" of the zone. The more a zone is touched, the more remaining orders are consumed, weakening it.</li>
                            </ol>

                            <h2>Conclusion: Ready to See the Market Clearly?</h2>
                            <p>Mastering Supply and Demand is a journey to change your mindset. You will stop chasing green and red candles and start seeing the "ranges" that control the game. With AURA Analytics, we provide automated tools that draw these zones for you with extreme precision.</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الشائعة حول العرض والطلب' : 'Supply & Demand FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "ما الفرق بين الدعم والمقاومة ومناطق العرض والطلب؟", a: "الدعم والمقاومة هي خطوط يرتد منها السعر، بينما مناطق العرض والطلب هي مساحات سعرية واسعة تمثل اختلالاً حقيقياً في موازين القوى المؤسساتية." },
                                { q: "هل يمكن استخدام هذه المناطق في السكالبينج؟", a: "نعم وبقوة، ولكن يفضل دائماً أن يكون الدخول متوافقاً مع اتجاه الفريمات الكبيرة (HTF Trend) لزيادة نسبة النجاح." },
                                { q: "كيف أعرف أن المنطقة قد كُسرت؟", a: "عندما يغلق شمعة كاملة (Full Body Close) خارج حدود المنطقة، هنا نعتبر أن العرض قد استوعب الطلب أو العكس." }
                            ] : [
                                { q: "What's the difference between Support/Resistance and Supply/Demand?", a: "Support/Resistance are lines where price bounces, while S/D zones are broad price areas representing a real institutional imbalance of power." },
                                { q: "Can these zones be used for Scalping?", a: "Yes, very effectively, but it's always preferred for entries to align with the Higher Timeframe (HTF) trend to increase success rates." },
                                { q: "How do I know a zone is broken?", a: "When a full candle body closes outside the zone boundaries, we consider that supply has absorbed demand or vice versa." }
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
                    <h2 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'هل تريد كشف مناطق الحيتان آلياً؟' : 'Want to Reveal Whale Zones Automatically?'}</h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                        {lang === 'ar'
                            ? 'نظام أورا يقوم برسم مناطق العرض والطلب الحية لحظة بلحظة ليوصلك لأفضل فرص التداول.'
                            : 'AURA system draws live Supply and Demand zones in real-time to lead you to the best trading opportunities.'}
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
                    padding-right: 1.5rem;
                }
            ` }} />
        </div>
    );
}
