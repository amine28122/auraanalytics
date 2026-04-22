'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, HelpCircle, Newspaper, BarChart2, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EzoicAd } from '@/components/EzoicAd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function TechVsFundArticle() {
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Market Strategy</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'التحليل الفني ضد التحليل الأساسي: بناء استراتيجية موحدة للسيطرة على الأسواق' : 'Technical vs Fundamental Analysis: Building a Unified Strategy to Conquer the Markets'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-31</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>48 min</span>
                        </div>
                        <div className="flex items-center gap-4 ms-auto md:flex">
                            <div className="flex items-center gap-1 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">
                                <Briefcase className="h-3 w-3" /> Masterclass
                            </div>
                        </div>
                    </div>
                </div>

                <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-border/10">
                    <img src="/3 (2).png" alt="Technical vs Fundamental Analysis" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-12 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-4xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-6
                prose-h3:text-2xl prose-h3:mt-12
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-6 prose-blockquote:px-10 prose-blockquote:rounded-e-2xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p className="text-2xl font-light text-foreground/70 leading-relaxed mb-16">هل تتبع الخبر أم تتبع الشارت؟ هذا هو السؤال الأزلي الذي يفرق بين المعسكرات في عالم التداول. الحقيقة الصادمة هي أن كبار مديري الصناديق لا يختارون جانباً واحداً؛ بل يستخدمون كلاهما بذكاء وتناغم تام.</p>

                            <EzoicAd id={110} />
                            <h2>المقدمة: صراع الجبابرة في التداول</h2>
                            <p>التحليل الأساسي يخبرك "لماذا" قد يتحرك السوق، بينما التحليل الفني يخبرك "متى" وبأي "سعر" يجب أن تدخل. في هذا المقال التفصيلي، سننهي الجدل القائم ونبني لك جسراً يربط بين واقع الاقتصاد وجمال التحليل الفني.</p>

                            <h2>القسم الأول: جوهر التحليل الأساسي (البحث عن القيمة)</h2>
                            <p>المتداول الأساسي يرى الاقتصاد كآلة ضخمة. هو يدرس تقارير التوظيف، التضخم، ومعدلات الفائدة ليفهم القوة النسبية للعملة. إذا كان الاقتصاد الأمريكي قوياً والفائدة مرتفعة، فإن الدولار يجب أن يرتفع منطقياً. لكن المشكلة تكمن في أن "المنطق" لا يتحقق دائماً في المدى القصير.</p>

                            <h2>القسم الثاني: سحر التحليل الفني (قراءة النفسية)</h2>
                            <p>المتداول الفني يؤمن بأن "كل شيء موجود في السعر". الأخبار، التوقعات، وحتى الأسرار، كلها تنعكس في الشموع اليابانية. التحليل الفني هو دراسة لنفسية الجماهير، وهو الأداة الوحيدة التي تمنحك نقاط دخول دقيقة بستوب لوز واضح.</p>

                            <h2>القسم الثالث: متى يتصادم المعسكران؟</h2>
                            <p>أخطر الأوقات هي عندما يشر التحليل الفني للصعود بينما تخبرك الأخبار بالهبوط. في هذه الحالة، السعر دائماً هو الملك. التاريخ يثبت أن الشارت يسبق الخبر في كثير من الأحيان لأن "المطلعين" (Insiders) يبدأون في تنفيذ صفقاتهم قبل إعلان الخبر للعامة.</p>
                            <blockquote>"التحليل الأساسي هو البوصلة، والتحليل الفني هو الخريطة التفصيلية. بدون البوصلة ستتوه، وبدون الخريطة ستصطدم بالعقبات."</blockquote>

                            <h2>الالقسم الرابع: الاستراتيجية الموحدة (Unified Strategy)</h2>
                            <p>في أورا، قمنا بابتكار نظام يدمج الاثنين:</p>
                            <ol className="list-decimal pl-6 space-y-6">
                                <li><strong>الفلترة الأساسية (Fundamental Filter):</strong> نحدد الاتجاه العام بناءً على السياسة النقدية للبنوك المركزية (Bullish or Bearish).</li>
                                <li><strong>التمركز الفني (Technical Positioning):</strong> ننتظر وصول السعر لمنطقة طلب أو عرض مؤسساتية تتوافق مع هذا الاتجاه.</li>
                                <li><strong>توقيت الخبر (News Timing):</strong> نستخدم إعلانات الأخبار (مثل الـ NFP) كوقود (Catalyst) لتحريك السعر من مناطقنا الفنية نحو الأهداف.</li>
                            </ol>

                            <h2>القسم الخامس: أدوات أورا للدمج بين النوعين</h2>
                            <p>نوفر لك في المنصة "Calendar Insights" التي لا تعطيك فقط موعد الخبر، بل تخبرك بتأثيره التاريخي على مستويات السيولة الفنية التي رسمناها لك. هذا يجعلك تتداول في قلب الخبر وليس ضده.</p>

                            <h2>الخلاصة: كن متداولاً متكاملاً</h2>
                            <p>لا تحبس نفسك في سجن واحد. تعلم لغة الاقتصاد لتفهم الصورة الكبيرة، وتقن فنون الشارت لتنفذ بدقة الجراح. مع AURA Analytics، نمنحك القوة المزدوجة لتسيطر على السوق بكل هدوء وثقة.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-2xl font-light text-foreground/70 leading-relaxed mb-16">Do you follow the news or the chart? This is the eternal question that divides trading camps. The shocking truth is that major fund managers don't choose one side; they use both with intelligence and perfect harmony.</p>

                            <h2>Introduction: The Clash of Titans in Trading</h2>
                            <p>Fundamental analysis tells you "why" the market might move, while technical analysis tells you "when" and at what "price" to enter. In this detailed article, we end the debate and build a bridge between economic reality and technical beauty.</p>

                            <h2>Section 1: The Essence of Fundamental Analysis (Seeking Value)</h2>
                            <p>A fundamental trader sees the economy as a massive machine. They study employment reports, inflation, and interest rates to understand relative currency strength. If the US economy is strong and rates are high, the dollar should logically rise. But the problem is that "logic" doesn't always manifest in the short term.</p>

                            <h2>Section 2: The Magic of Technical Analysis (Reading Psychology)</h2>
                            <p>The technical trader believes that "everything is in the price." News, expectations, and even secrets are reflected in candlesticks. Technical analysis is a study of crowd psychology, and the only tool that gives you precise entry points with a clear stop loss.</p>

                            <h2>Conclusion: Become a Complete Trader</h2>
                            <p>Don't trap yourself in one prison. Learn the language of economics to understand the big picture, and master chart arts to execute with surgical precision. With AURA Analytics, we give you the dual power to dominate the market with calm and confidence.</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <Newspaper className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الشائعة حول الاستراتيجيات' : 'Strategy FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "أيهما أدق: الفني أم الأساسي؟", a: "في المدى القصير جداً (دقائق)، الفني هو الأدق. في المدى الطويل (شهور)، الأساسي هو المحرك الحقيقي للأسعار." },
                                { q: "كيف أتعامل مع الصدمات الإخبارية؟", a: "ببساطة، لا تتداول وقت الخبر نفسه بل انتظر حتى 'يهدأ الغبار' ويرسم السعر هيكلاً واضحاً داخل مناطق الدعم أو المقاومة." },
                                { q: "هل التحليل الفني يعمل دائماً؟", a: "لا يوجد شيء يعمل دائماً، هو يوفر لك 'احتمالية' أعلى. الانضباط في إدارة المخاطر هو ما يجعلك رابحاً في النهاية." }
                            ] : [
                                { q: "Which is more accurate: Technical or Fundamental?", a: "In the very short term (minutes), Technical is more accurate. In the long term (months), Fundamental is the true driver of prices." },
                                { q: "How do I handle news shocks?", a: "Simply, don't trade exactly during the news release; wait for the 'dust to settle' and for the price to form a clear structure within support/resistance zones." },
                                { q: "Does technical analysis always work?", a: "Nothing works 100% of the time; it provides a 'higher probability.' Discipline in risk management is what makes you profitable in the end." }
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
                    <h2 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'اجمع بين قوة الخبر ودقة الشارت' : 'Combine News Power and Chart Precision'}</h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                        {lang === 'ar'
                            ? 'أورا تقدم لك الرؤية الموحدة التي يحتاجها كل متداول محترف للنجاح المستمر.'
                            : 'AURA provides the unified vision every professional trader needs for continuous success.'}
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
