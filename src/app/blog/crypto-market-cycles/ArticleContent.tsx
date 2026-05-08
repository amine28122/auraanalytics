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

export default function CryptoCyclesArticle() {
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Crypto</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'دورات سوق الكريبتو: متى تشتري ومتى تبيع بناءً على تحليل السلسلة' : 'Crypto Market Cycles: When to Buy and Sell Based on On-Chain Analysis'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-29</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>22 min</span>
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
                    <img src="/crypto_market_analysis_modern.png" alt="Crypto Market Cycles" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
                prose-h3:text-2xl prose-h3:mt-10
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-e-xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p>أهلاً بك في عالم الكريبتو، حيث تتحرك الأسواق بسرعة البرق. فهم "دورة السوق" هو الفرق بين أن تكون مستثمراً ناجحاً أو ضحية للتحركات العنيفة. الأسواق لا تتحرك في خطوط مستقيمة، بل في دورات نفسية واقتصادية متكررة.</p>

                            <EzoicAd id={110} />
                            <h2>المراحل الأربعة لدورة الكريبتو</h2>
                            <p>تمر العملات الرقمية عبر أربع مراحل أساسية: التجميع (Accumulation)، الارتفاع (Markup)، التوزيع (Distribution)، والانخفاض (Markdown). معرفة المرحلة الحالية تحميك من الشراء عند القمة.</p>

                            <h2>1. تنصيف البتكوين (Bitcoin Halving)</h2>
                            <p>تاريخياً، يرتبط تنصيف البتكوين ببداية دورات صاعدة كبرى. من خلال تقليل المعروض الجديد، يزداد الضغط على السعر للأعلى. أورا تتابع هذه البيانات بدقة لتوقع مناطق الانفجار السعري القادمة.</p>

                            <h3>موسم العملات البديلة (Altseason)</h3>
                            <p>يبدأ موسم البديلات عادة عندما يبدأ البتكوين في التحرك عرضياً بعد ارتفاع كبير. عندها تنتقل السيولة من البتكوين إلى العملات الصغيرة بحثاً عن أرباح أعلى. فهم هذا الانتقال هو جوهر التداول الاحترافي.</p>

                            <h2>2. تحليل السلسلة (On-Chain Analysis)</h2>
                            <p>على عكس الأسواق التقليدية، يمنحنا الكريبتو إمكانية رؤية ما تفعله "الحيتان" (Whales) على الشبكة. تحركات المحافظ الكبرى هي المؤشر الحقيقي لقرب نهاية الدورة الصاعدة وضرورة الخروج.</p>

                            <h2>3. دور الفومو (FOMO) في تدمير المحافظ</h2>
                            <p>الخوف من ضياع الفرصة هو القاتل الصامت. عندما تسمع الجميع يتحدثون عن الربح في الكريبتو، فغالباً أنت في مرحلة التوزيع ويجب أن تستعد للبيع، وليس للشراء.</p>

                            <h2>الخلاصة: اتبع البيانات لا المشاعر</h2>
                            <p>أورا توفر لك راداراً ذكياً يمسح السوق ويبحث عن الإشارات الحقيقية بعيداً عن ضجيج الأخبار الزائفة (FUD).</p>
                        </>
                    ) : (
                        <>
                            <p>Welcome to the world of crypto, where markets move at lightning speed. Understanding the "Market Cycle" is the difference between being a successful investor or a victim of violent swings. Markets don't move in straight lines, but in repetitive psychological and economic cycles.</p>

                            <h2>The Four Stages of the Crypto Cycle</h2>
                            <p>Digital currencies go through four basic stages: Accumulation, Markup, Distribution, and Markdown. Knowing the current stage protects you from buying at the top.</p>

                            <h2>1. Bitcoin Halving</h2>
                            <p>Historically, the Bitcoin halving is linked to the start of major bull cycles. By reducing the new supply, pressure on the price increases. AURA tracks this data precisely to anticipate upcoming price explosions.</p>

                            <h3>Altseason</h3>
                            <p>Altseason usually begins when Bitcoin starts moving sideways after a large gain. Then, liquidity moves from Bitcoin to smaller coins in search of higher profits. Understanding this transition is the essence of professional trading.</p>

                            <h2>2. On-Chain Analysis</h2>
                            <p>Unlike traditional markets, crypto gives us the ability to see what "Whales" are doing on the network. Large wallet movements are the true indicator of the bull cycle's end and the necessity to exit.</p>

                            <h2>3. The Role of FOMO in Portfolio Destruction</h2>
                            <p>Fear Of Missing Out is the silent killer. When you hear everyone talking about crypto profits, you're likely in the distribution phase and should prepare to sell, not buy.</p>

                            <h2>Conclusion: Follow Data, Not Emotions</h2>
                            <p>AURA provides you with a smart radar that scans the market for true signals, away from the noise of fake news (FUD).</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الشائعة حول الكريبتو' : 'Crypto Cycles FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "متى يبدأ الانفجار السعري القادم؟", a: "تاريخياً، يبدأ الانفجار الحقيقي بعد 6 إلى 12 شهراً من تاريخ التنصيف، مدفوعاً بتبني المؤسسات الكبرى." },
                                { q: "ما هي أفضل عملة للاستثمار طويل الأمد؟", a: "البتكوين والايثريوم هما الأساس، لكن التنويع في مشاريع قوية (Utility) هو الذي يحقق أرباحاً مضاعفة." },
                                { q: "كيف أعرف أن الدورة الصاعدة قد انتهت؟", a: "عندما ترى جنوناً في الشراء وزيادة كبيرة جداً في البحث عن الكريبتو عند غير المتخصصين، فهذا وقت الخروج." }
                            ] : [
                                { q: "When will the next price explosion begin?", a: "Historically, the true explosion starts 6 to 12 months after the halving date, driven by major institutional adoption." },
                                { q: "What is the best coin for long-term investment?", a: "Bitcoin and Ethereum are the foundation, but diversifying into strong utility projects is what achieves multiple returns." },
                                { q: "How do I know the bull cycle has ended?", a: "When you see buying madness and a huge increase in crypto searches among non-professionals, it's time to exit." }
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
                    <h2 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'هل أنت مستعد لموسم الكريبتو؟' : 'Ready for the Crypto Season?'}</h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                        {lang === 'ar'
                            ? 'أورا تحلل بيانات السلسلة (On-chain) وتوفر لك إشارات دقيقة للدخول والخروج.'
                            : 'AURA analyzes on-chain data and provides you with accurate entry and exit signals.'}
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
