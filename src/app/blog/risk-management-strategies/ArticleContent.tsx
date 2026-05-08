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

export default function RiskManagementArticle() {
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Finance</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'إدارة المخاطر: الدرع الواقي لمحفظتك من التقلبات الكبرى' : 'Risk Management: Secure Your Portfolio Against Market Volatility'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-30</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>18 min</span>
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
                    <img src="/risk_management_visualization.png" alt="Strategic Risk Management" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
                prose-h3:text-2xl prose-h3:mt-10
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-e-xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p>في عالم التداول، ليس الأذكى هو من يربح، بل هو من "يبقى على قيد الحياة". إدارة المخاطر ليست مجرد معادلة حسابية، بل هي الفارق بين الثراء وبين خسارة كل شيء في ليلة واحدة.</p>

                            <EzoicAd id={110} />
                            <h2>قاعدة الـ 1%: لماذا هي مقدسة؟</h2>
                            <p>ينصح المحترفون دائماً بعدم المخاطرة بأكثر من 1% من رصيد الحساب في الصفقة الواحدة. هذا يعني أنك ستحتاج إلى 100 خسارة متتالية لتصفير حسابك، وهذا أمر مستحيل تقريباً إذا كنت تملك استراتيجية مدروسة.</p>

                            <h2>1. العائد مقابل المخاطرة (Risk to Reward Ratio)</h2>
                            <p>لا تدخل في صفقة أبداً إذا لم يكن هدف الربح على الأقل ضعف حجم الوقف (1:2). بهذا المنطق، حتى لو كنت تخسر نصف صفقاتك، ستظل في النهاية رابحاً بسبب حجم الأرباح الكبير مقارنة بالخسائر الصغيرة.</p>

                            <h3>وقف الخسارة: صديقك وليس عدوك</h3>
                            <p>يعتبر الكثير من المتداولين المبتدئين وقف الخسارة (Stop Loss) عدواً يضرب صفقاتهم. بينما الحقيقة هي أنه "حزام الأمان" الذي ينقذك عندما يقرر السوق التحرك ضدك بفعل أخبار مفاجئة.</p>

                            <h2>2. إدارة رأس المال في عصر العملات الرقمية</h2>
                            <p>بسبب التقلب الشديد في الكريبتو، إدارة المخاطر هنا تتطلب مرونة أكبر. أورا تنصح بتقليل الرافعة المالية (Leverage) إلى أدنى مستويات ممكنة، والاعتماد على التحليل الفني لتحديد مناطق الدخول العميقة.</p>

                            <h2>3. التنويع: لا تضع كل بيضك في سلة واحدة</h2>
                            <p>توزيع رأس المال بين العملات الرئيسية، الأسهم، والذهب يقلل من تأثير الأزمات المفاجئة في قطاع معين على إجمالي المحفظة.</p>

                            <h2>الخلاصة: الحماية أولاً، الربح ثانياً</h2>
                            <p>أولويتنا في AURA هي حماية رأس مال العميل قبل كل شيء. الأرباح تأتي كنتيجة طبيعية للبقاء في اللعبة لأطول فترة ممكنة.</p>
                        </>
                    ) : (
                        <>
                            <p>In the world of trading, it's not the smartest who wins, but the one who "survives." Risk management isn't just a mathematical formula; it's the difference between wealth and losing everything in a single night.</p>

                            <h2>The 1% Rule: Why is it Sacred?</h2>
                            <p>Professionals always advise against risking more than 1% of your account balance on a single trade. This means you would need 100 consecutive losses to blow your account—nearly impossible if you have a sound strategy.</p>

                            <h2>1. Risk to Reward Ratio (RRR)</h2>
                            <p>Never enter a trade if the profit target isn't at least twice the stop-loss size (1:2). With this logic, even if you lose half your trades, you will still end up profitable because of the large profit size compared to small losses.</p>

                            <h3>Stop Loss: Your Friend, Not Your Enemy</h3>
                            <p>Many novice traders view the Stop Loss as an enemy that hits their positions. The truth is, it's the "safety belt" that saves you when the market decides to move against you due to sudden news.</p>

                            <h2>2. Capital Management in the Crypto Era</h2>
                            <p>Due to high volatility in crypto, risk management here requires greater flexibility. AURA advises reducing leverage to the minimum possible levels and relying on technical analysis to determine deep entry zones.</p>

                            <h2>3. Diversification: Don't Put All Your Eggs in One Basket</h2>
                            <p>Distributing capital among major currencies, stocks, and gold reduces the impact of sudden crises in a specific sector on your total portfolio.</p>

                            <h2>Conclusion: Protection First, Profit Second</h2>
                            <p>Our priority at AURA is protecting the client's capital above all. Profits come as a natural result of staying in the game as long as possible.</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الشائعة حول إدارة المخاطر' : 'Risk Management FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "كم يجب أن أخاطر في كل صفقة؟", a: "ننصح دائماً بنسبة تتراوح بين 0.5% إلى 1% للمتداولين المستقرين، وربما أقل في العملات شديدة التقلب." },
                                { q: "ماذا أفعل إذا ضرب السعر وقف الخسارة كثيراً؟", a: "قد يكون السبب هو وضع الوقف 'قريب جداً' من السعر. جرب وضعه بناءً على مستويات تقنية أبعد مثل الـ Order Blocks." },
                                { q: "هل الرافعة المالية (Leverage) خطر؟", a: "الرافعة سلاح ذو حدين؛ هي تزيد الربح لكنها قد تجعل أي حركة بسيطة ضدك تنهي حسابك. استخدمها بحذر شديد." }
                            ] : [
                                { q: "How much should I risk per trade?", a: "We always recommend 0.5% to 1% for stable traders, and perhaps less for highly volatile assets." },
                                { q: "What should I do if my stop loss gets hit frequently?", a: "The reason might be placing it 'too close' to the price. Try placing it based on deeper technical levels like Order Blocks." },
                                { q: "Is Leverage dangerous?", a: "Leverage is a double-edged sword; it increases profit but can make any small move against you blow your account. Use it with extreme caution." }
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
                    <h2 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'هل تود حماية رأس مالك؟' : 'Ready to Secure Your Capital?'}</h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                        {lang === 'ar'
                            ? 'أورا توفر لك أدوات حسابية مدمجة لإدارة مخاطرك باحترافية تامة.'
                            : 'AURA provides you with built-in calculation tools to manage your risks professionally.'}
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
