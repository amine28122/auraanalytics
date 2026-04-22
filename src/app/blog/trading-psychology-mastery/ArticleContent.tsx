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

export default function TradingPsychologyArticle() {
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Psychology</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'سيكولوجية التداول: كيف تسيطر على عقلك لتحقيق أرباح مستدامة' : 'Trading Psychology: Mastering Your Mind for Sustainable Profits'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-31</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>20 min</span>
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
                    <img src="/psychology_trading_banner.png" alt="Trading Psychology Mastery" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
                prose-h3:text-2xl prose-h3:mt-10
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-e-xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p>يعتقد الكثيرون أن التداول يتعلق بالرياضيات والاحتمالات فقط، لكن الحقيقة الصادمة هي أن 90% من نجاح التداول يعتمد على الحالة النفسية. بدون الانضباط العقلي، ستفشل حتى أفضل الاستراتيجيات التقنية في العالم.</p>

                            <EzoicAd id={110} />
                            <h2>عدو المتداول الأول: الخوف والطمع</h2>
                            <p>الخوف يجعلك تخرج من الصفقات الرابحة مبكراً، والطمع يجعلك تتمسك بالصفقات الخاسرة على أمل الارتداد. إدارة هذه المشاعر هي ما يميز المتداول المحترف عن الهاوي.</p>

                            <h2>1. عقلية الاحتمالات</h2>
                            <p>المتداول الناجح لا ينظر إلى كل صفقة على أنها "حكم نهائي" على قدراته. بدلاً من ذلك، هو يرى التداول كسلسلة من الأحداث الاحتمالية. إذا كان لديك استراتيجية ناجحة بنسبة 60%، فأنت تعلم أن هناك 40 صفقة خاسرة قادمة، وهذا لا يزعجك.</p>

                            <h3>قبول الخسارة كجزء من العمل</h3>
                            <p>الخسارة في التداول ليست "فشلاً"، بل هي "تكلفة تشغيلية". تماماً كما يدفع صاحب المطعم ثمن الإيجار والمواد، يدفع المتداول ثمن الصفقات الخاسرة للوصول إلى الربح الكلي.</p>

                            <h2>2. تجنب التداول الانتقامي</h2>
                            <p>بعد خسارة مؤلمة، يشعر الدماغ برغبة قوية في "استعادة المال". هذا يؤدي إلى زيادة الرافعة المالية والدخول في صفقات عشوائية. أورا تنصح دائماً بالابتعاد عن الشاشة لمدة ساعتين على الأقل بعد أي خسارة خارج إطار الخطة.</p>

                            <h2>3. دور الروتين في الاستقرار النفسي</h2>
                            <p>الانضباط يبدأ قبل فتح المنصة. ممارسة التأمل، الرياضة، وتسجيل الصفقات في (Journal) يساعد في تصفية الذهن واتخاذ قرارات مبنية على المنطق لا على العاطفة.</p>

                            <h2>الخلاصة: العقل هو محرك الربح</h2>
                            <p>في AURA Analytics، نوفر لك الأدوات والبيانات، ولكن قدرتك على البقاء هادئاً تحت الضغط هي ما سيحدد حجم حسابك في نهاية العام.</p>
                        </>
                    ) : (
                        <>
                            <p>Many believe trading is purely about math and probabilities, but the shocking truth is that 90% of trading success depends on your mental state. Without mental discipline, even the best technical strategies in the world will fail.</p>

                            <h2>The Trader's Greatest Enemies: Fear and Greed</h2>
                            <p>Fear makes you exit winning trades too early, while greed makes you hold onto losing trades hoping for a reversal. Managing these emotions is what separates professional traders from amateurs.</p>

                            <h2>1. The Probabilistic Mindset</h2>
                            <p>Successful traders don't view every single trade as a "final judgment" on their abilities. Instead, they see trading as a series of probabilistic events. If you have a strategy that wins 60% of the time, you know 40 losing trades are coming, and that doesn't bother you.</p>

                            <h3>Accepting Loss as a Business Cost</h3>
                            <p>A loss in trading isn't a "failure"; it's an "operating cost." Just as a restaurant owner pays for rent and ingredients, a trader pays for losing trades to reach overall profitability.</p>

                            <h2>2. Avoiding Revenge Trading</h2>
                            <p>After a painful loss, the brain feels a powerful urge to "get the money back." This leads to over-leveraging and taking random trades. AURA always recommends stepping away from the screen for at least two hours after any loss outside your plan.</p>

                            <h2>3. The Role of Routine in Mental Stability</h2>
                            <p>Discipline starts before you open the platform. Meditation, exercise, and journaling your trades help clear your mind to make decisions based on logic, not emotion.</p>

                            <h2>Conclusion: The Mind is the Profit Engine</h2>
                            <p>At AURA Analytics, we provide you with the tools and data, but your ability to stay calm under pressure is what will determine your account size at the end of the year.</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الشائعة حول نفسية التداول' : 'Trading Psychology FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "كيف أتوقف عن الشعور بالقلق أثناء صفقاتي؟", a: "القلق غالباً ما يأتي من المخاطرة بمبالغ كبيرة جداً. قلل حجم اللوت، وستلاحظ أنك أصبحت أكثر هدوءاً." },
                                { q: "هل الروبوتات تلغي الجانب النفسي تماماً؟", a: "الروبوت ينفذ بأمانة، لكن المتداول قد يتدخل يدوياً بسبب الخوف. لذا الانضباط النفسي مطلوب حتى لمستخدمي الأنظمة الآلية." },
                                { q: "ما هو أفضل تمرين ذهني للمتداول؟", a: "كتابة (Trading Journal). عندما ترى أخطاءك مكتوبة، يتوقف عقلك عن تكرارها بشكل تلقائي." }
                            ] : [
                                { q: "How do I stop feeling anxious during my trades?", a: "Anxiety often comes from risking too much. Reduce your lot size, and you will notice you become much calmer." },
                                { q: "Do robots eliminate the psychological side completely?", a: "The robot executes faithfully, but the trader may intervene manually due to fear. Thus, discipline is required even for automated system users." },
                                { q: "What is the best mental exercise for a trader?", a: "Keeping a Trading Journal. When you see your mistakes in writing, your brain naturally starts avoiding them." }
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
                    <h2 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'هل تود السيطرة على تداولاتك؟' : 'Ready to Master Your Trades?'}</h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                        {lang === 'ar'
                            ? 'انضم إلى أورا واحصل على نظام تداول مبني على المنطق الخالص بعيداً عن العواطف.'
                            : 'Join AURA and get a trading system built on pure logic, far from emotions.'}
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
