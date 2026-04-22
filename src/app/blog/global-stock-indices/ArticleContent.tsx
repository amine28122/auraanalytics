'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, HelpCircle, TrendingUp, BarChart3, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EzoicAd } from '@/components/EzoicAd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function StockIndicesArticle() {
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Indices</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'دليل تداول مؤشرات الأسهم العالمية: استراتيجيات النخبة للسيطرة على S&P 500 و NASDAQ' : 'Global Stock Indices Encyclopedia: Elite Strategies to Dominate S&P 500 and NASDAQ'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-30</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>40 min</span>
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
                    <img src="/stock_indices_mastery_banner.png" alt="Global Stock Indices Mastery" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
                prose-h3:text-2xl prose-h3:mt-10
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-e-xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p className="text-xl font-medium text-foreground/80 italic">مؤشرات الأسهم هي قلب الرأسمالية العالمية النابض. في أورا، لا نرى المؤشرات مجرد أرقام، بل نراها فرصاً ذهبية تتكرر يومياً للمتداول الذكي.</p>

                            <EzoicAd id={110} />
                            <h2>المقدمة: ما هي المؤشرات ولماذا يفضلها المحترفون؟</h2>
                            <p>المؤشر (Index) هو مقياس إحصائي يقيس قيمة قسم من سوق الأسهم. بدلاً من المراهنة على نجاح شركة واحدة مثل آبل، أنت تتداول أداء أقوى 100 شركة تكنولوجيا في العالم مجتمعة. هذا يقلل من مخاطر الصدمات الفردية ويزيد من إمكانية تحليل اتجاه السوق العام.</p>

                            <h2>القسم الأول: تحليل العمالقة الأمريكيين</h2>
                            <h3>1. مؤشر NASDAQ 100 (حصان طروادة التكنولوجي)</h3>
                            <p>يضم هذا المؤشر أكبر 100 شركة غير مالية مدرجة في بورصة ناسداك. هو المحرك الأساسي لقطاع التكنولوجيا والذكاء الاصطناعي. يتميز النازداك بـ "التقلب العالي" (High Volatility)، مما يجعله المفضل للمتداولين الذين يبحثون عن أرباح سريعة وكبيرة، لكنه يتطلب أعصاباً حديدية.</p>

                            <h3>2. مؤشر S&P 500 (المقياس الحقيقي للصحة الاقتصادية)</h3>
                            <p>يضم 500 من أكبر الشركات الأمريكية عبر كافة القطاعات. يعتبره المحللون المعيار الذهبي لقوة الاقتصاد الأمريكي. تداول الـ S&P 500 يوفر حركة سعرية أكثر "نظافة" وأقل تذبذباً عشوائياً مقارنة بالنازداك، مما يجعله مثالياً للمتداولين الذين يستخدمون موجات إليوت.</p>

                            <h2>القسم الثاني: محركات المؤشرات (The Market Drivers)</h2>
                            <p>لماذا ينهار النازداك فجأة؟ ولماذا يسجل الداو جونز قمم تاريخية؟</p>
                            <ul className="space-y-4">
                                <li><strong>عوائد السندات (Treasury Yields):</strong> هناك علاقة عكسية قوية؛ عندما ترتفع عوائد السندات، تعاني أسهم التكنولوجيا (NASDAQ) لأن تكلفة الاقتراض تزداد.</li>
                                <li><strong>نتائج الأرباح (Earnings Season):</strong> تقارير آبل، تسلا، ومايكروسوفت قادرة على قلب اتجاه السوق في ثوانٍ.</li>
                                <li><strong>قرارات الفيدرالي:</strong> المؤشرات تحب "الأموال الرخيصة". أي إشارة لخفض الفائدة هي وقود للارتفاع.</li>
                            </ul>

                            <h2>القسم الثالث: أسرار الافتتاح الأمريكي (The Power Hour)</h2>
                            <p>في أورا، نركز بشكل مكثف على أول ساعة من افتتاح بورصة نيويورك (الساعة 5:30 مساءً بتوقيت مكة). هذه الساعة هي التي تحدد اتجاه اليوم بالكامل.</p>
                            <h3>استراتيجية فجوة الافتتاح (The Gap & Go)</h3>
                            <p>غالباً ما تترك المؤشرات "فجوات" بين سعر إغلاق اليوم السابق وسعر افتتاح اليوم الحالي. مراقبة ما إذا كان السعر سيغلق هذه الفجوة أم سيستخدمها كمنصة للانطلاق هو ما يميز المتداول المحترف عن الهاوي.</p>

                            <h2>القسم الرابع: هندسة الفرق السعري (Dealing Range)</h2>
                            <p>المؤشرات تتحرك في "نطاقات" محددة. المؤسسات المالية تستخدم خوارزميات لبرمجة هذه النطاقات. نحن في أورا نكشف لك هذه النطاقات باستخدام أدوات مثل Premium vs Discount، لنعلمك متى يكون السعر "غالياً" (للبيع) ومتى يكون "رخيصاً" (للشراء).</p>

                            <h2>القسم الخامس: إدارة المخاطر في المؤشرات</h2>
                            <p>بسبب التقلب العالي، إدارة المخاطر هنا مختلفة. نقطة واحدة في النازداك قد تساوي الكثير. لذا، ننصح دائماً بـ:</p>
                            <ol className="list-decimal pl-6 space-y-4">
                                <li>استخدام أحجام عقود صغيرة (Micros) في البداية.</li>
                                <li>عدم وضع وقف الخسارة قريباً جداً، لأن المؤشرات تميل لعمل "هزات" (Whipsaws) قبل الانطلاق.</li>
                                <li>التداول فقط في الجلسات ذات السيولة العالية (نيويورك ولندن).</li>
                            </ol>

                            <h2>الخلاصة: مستقبلك في تداول المؤشرات</h2>
                            <p>تداول المؤشرات هو الطريق الأسرع لبناء ثروة إذا اقترن بالعلم والادوات الصحيحة. مع AURA Analytics، أنت لا تتداول وحدك؛ أنت تملك ذكاءً اصطناعياً يحلل ملايين البيانات ليعطيك الخلاصة على طبق من ذهب.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-medium text-foreground/80 italic">Stock indices are the pulsating heart of global capitalism. At AURA, we don't see indices just as numbers; we see them as golden opportunities recurring daily for the smart trader.</p>

                            <h2>Introduction: What are Indices and Why Professionals Prefer Them?</h2>
                            <p>An Index is a statistical measure of the value of a section of the stock market. Instead of betting on the success of a single company like Apple, you are trading the performance of the top 100 tech companies in the world combined. This reduces the risk of individual shocks and increases the ability to analyze the general market trend.</p>

                            <h2>Section 1: Analyzing the American Giants</h2>
                            <h3>1. NASDAQ 100 (The Tech Trojan Horse)</h3>
                            <p>This index includes the 100 largest non-financial companies listed on the NASDAQ exchange. It is the primary driver of the technology and AI sectors. The NASDAQ is characterized by "High Volatility," making it a favorite for traders seeking fast and large profits, but it requires nerves of steel.</p>

                            <h3>2. S&P 500 (The True Measure of Economic Health)</h3>
                            <p>It includes 500 of the largest US companies across all sectors. Analysts consider it the gold standard for the strength of the US economy. Trading the S&P 500 provides a "cleaner" price action with less random noise compared to the NASDAQ, making it ideal for traders using Elliott Waves.</p>

                            <h2>Section 2: Market Drivers</h2>
                            <p>Why does the NASDAQ crash suddenly? And why does the Dow Jones hit historical highs?</p>
                            <ul className="space-y-4">
                                <li><strong>Treasury Yields:</strong> There is a strong inverse relationship; when yields rise, tech stocks (NASDAQ) suffer because borrowing costs increase.</li>
                                <li><strong>Earnings Season:</strong> Reports from Apple, Tesla, and Microsoft can flip market direction in seconds.</li>
                                <li><strong>Fed Decisions:</strong> Indices love "cheap money." Any signal of interest rate cuts is fuel for a rally.</li>
                            </ul>

                            <h2>Section 3: The Power Hour (New York Open)</h2>
                            <p>At AURA, we focus intensely on the first hour of the NYSE opening. This hour often sets the direction for the entire day.</p>
                            <h3>The Gap & Go Strategy</h3>
                            <p>Indices often leave "gaps" between the previous day's close and current day's open. Monitoring whether the price will fill this gap or use it as a platform to launch is what distinguishes a professional from an amateur.</p>

                            <h2>Section 4: Dealing Range Engineering</h2>
                            <p>Indices move in specific "ranges." Financial institutions use algorithms to program these ranges. At AURA, we reveal these ranges to you using tools like Premium vs Discount, teaching you when price is "expensive" (to sell) and when it's "cheap" (to buy).</p>

                            <h2>Section 5: Risk Management in Indices</h2>
                            <p>Due to high volatility, risk management here is different. A single point in NASDAQ can be worth a lot. Therefore, we always advise:</p>
                            <ol className="list-decimal pl-6 space-y-4">
                                <li>Using Micro lot sizes in the beginning.</li>
                                <li>Avoiding placing stop losses too close, as indices tend to perform "Whipsaws" before taking off.</li>
                                <li>Trading only during high liquidity sessions (New York and London).</li>
                            </ol>

                            <h2>Conclusion: Your Future in Index Trading</h2>
                            <p>Index trading is the fastest way to build wealth if coupled with the right knowledge and tools. With AURA Analytics, you are not trading alone; you possess AI that analyzes millions of data points to give you the essence on a silver platter.</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'أسئلة الخبراء حول المؤشرات' : 'Expert Indices FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "ما هو 'تأثير يوم الاثنين' في المؤشرات؟", a: "غالباً ما تبدأ المؤشرات الأسبوع بحركة 'صيد سيولة' عكس الاتجاه المتوقع قبل أن تستقر في اتجاهها الحقيقي يوم الثلاثاء." },
                                { q: "كيف يؤثر مؤشر الخوف VIX على تداولي؟", a: "عندما يرتفع الـ VIX فوق 20، توقع تقلبات عنيفة جداً في S&P 500. هو مؤشر للتحذير من العواصف السعرية." },
                                { q: "لماذا تتبع كل المؤشرات بعضها البعض؟", a: "بسبب 'الارتباط الموجب'؛ فعندما تضخ الصناديق الكبرى سيولة في السوق الأمريكي، فإنها تشتري سلالاً تضم معظم الشركات الكبرى في آن واحد." }
                            ] : [
                                { q: "What is the 'Monday Effect' in Indices?", a: "Indices often start the week with a 'Liquidity Hunt' move opposite to the expected direction before settling into their true trend on Tuesday." },
                                { q: "How does the VIX (Fear Index) affect my trading?", a: "When the VIX rises above 20, expect very violent volatility in the S&P 500. It's an indicator to warn of price storms." },
                                { q: "Why do all indices follow each other?", a: "Due to 'Positive Correlation'; when major funds inject liquidity into the US market, they buy baskets that include most major companies simultaneously." }
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
                    <h2 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'ابدأ تداول المؤشرات بعقلية المؤسسات' : 'Start Trading Indices with an Institutional Mindset'}</h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                        {lang === 'ar'
                            ? 'أورا تمنحك العين التي ترى بها البنوك الكبرى مسار الصعود والهبوط.'
                            : 'AURA gives you the eye through which big banks see the path of rise and fall.'}
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
