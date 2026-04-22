'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, HelpCircle, Triangle, Ruler, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EzoicAd } from '@/components/EzoicAd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HarmonicPatternsArticle() {
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Advanced Trading</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'النماذج التوافقية (Harmonics): هندسة الجمال الرياضي في قلب الشارت' : 'Harmonic Patterns: The Engineering of Mathematical Beauty in the Heart of Charts'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-31</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>42 min</span>
                        </div>
                        <div className="flex items-center gap-4 ms-auto md:flex">
                            <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                                <Sparkles className="h-3 w-3" /> Advanced Guide
                            </div>
                        </div>
                    </div>
                </div>

                <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-border/10">
                    <img src="/2 (2).png" alt="Harmonic Patterns Visualization" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-12 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-4xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-6
                prose-h3:text-2xl prose-h3:mt-12
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-6 prose-blockquote:px-10 prose-blockquote:rounded-e-2xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p className="text-2xl font-light text-foreground/70 leading-relaxed mb-16">هل تعتقد أن حركة الأسواق عشوائية؟ النماذج التوافقية أو "الهرمونيك" تثبت العكس تماماً. هي لغة الأرقام والنسب الذهبية (فيبوناتشي) التي تعيد رسم ملامح المستقبل من خلال أنماط هندسية متكررة بدقة مذهلة.</p>

                            <EzoicAd id={110} />
                            <h2>المقدمة: السيمفونية الرياضية للأسعار</h2>
                            <p>تعتمد النماذج التوافقية على فكرة أن حركة السعر تتبع نسباً رياضية ثابتة، تماماً مثلما نجدها في الطبيعة والكون. بدمج التحليل الفني مع نسب فيبوناتشي، نتمكن من تحديد "نقاط الانعكاس المحتملة" (PRZ) بدقة لا توفرها الأدوات التقليدية.</p>

                            <h2>القسم الأول: حكاية فيبوناتشي والمتداول الهرمونيكي</h2>
                            <p>قبل أن تلمس أي نموذج، يجب أن تفهم علاقتنا مع فيبوناتشي. نسب مثل 61.8% و 78.6% و 161.8% هي العمدان التي تقوم عليها خيمة الهرمونيك. المتداول الهرمونيكي لا يرى مثلثات؛ بل يرى "تناغماً" بين موجات السعر.</p>

                            <h2>القسم الثاني: النماذج الخمسة الكبرى</h2>
                            <ul className="space-y-8 list-none pl-0">
                                <li className="p-8 rounded-3xl bg-white/5 border border-border/10">
                                    <h3 className="text-primary mt-0">1. نموذج جارتلي (Gartley Pattern)</h3>
                                    <p>الملك الأصلي للنماذج التوافقية. يعتمد على تصحيح بنسبة 61.8% للموجة الأولى. إذا رأيت جارتلي يتكون بالتزامن مع منطقة "طلب"، فهذه صفقة عالية الاحتمالية.</p>
                                </li>
                                <li className="p-8 rounded-3xl bg-white/5 border border-border/10">
                                    <h3 className="text-primary mt-0">2. نموذج الفراشة (Butterfly Pattern)</h3>
                                    <p>يتميز بتجاوزه لنقطة الأصل، مما يجعله نموذجاً انعكاسياً قوياً جداً يظهر غالباً عند القمم والقيعان التاريخية.</p>
                                </li>
                                <li className="p-8 rounded-3xl bg-white/5 border border-border/10">
                                    <h3 className="text-primary mt-0">3. نموذج الخفاش (Bat Pattern)</h3>
                                    <p>يعتبر الأدق بين الجميع، حيث يعتمد على نسبة 88.6% كنقطة انعكاس نهائية. الدقة هي اسم اللعبة هنا.</p>
                                </li>
                            </ul>

                            <h2>القسم الثالث: كيف تحدد منطقة الانعكاس (PRZ)؟</h2>
                            <p>الـ Potential Reversal Zone هي المكان الذي تتلاقي فيه عدة مستويات فيبوناتشي لنموذج واحد. نحن في أورا لا ننظر لمستوى واحد؛ بل نبحث عن "التلاقي" (Confluence).</p>
                            <blockquote>"الجمال في الهرمونيك يكمن في أنه يخبرك أين ستفشل الصفقة قبل أن تدخلها، مما يجعل إدارة المخاطر واضحة جداً."</blockquote>

                            <h2>القسم الرابع: دمج الهرمونيك مع استراتيجية أورا</h2>
                            <p>القوة الحقيقية تظهر عندما ندمج "شكل" الهرمونيك مع "منطق" الـ ICT. تخيل وجود نموذج خفاش ينتهي داخل Fair Value Gap على فريم اليومي. هذه هي الصفقات التي يبحث عنها كبار المتداولين في نظامنا.</p>

                            <h2>القسم الخامس: الأخطاء الشائعة في رسم الهرمونيك</h2>
                            <p>أكبر خطأ هو "إجبار" السعر على تكوين نموذج غير موجود. الهرمونيك يتطلب صبراً أيوبياً لتنتظر السعر حتى يصل لنقطة الـ D الموعودة. المتسرعون يدخلون مبكراً ويضربون صفقاتهم.</p>

                            <h2>الخلاصة: هل أنت مستعد لتصبح مهندس شارت؟</h2>
                            <p>التداول بالهرمونيك يحولك من مقامر إلى مهندس. في AURA Analytics، نظامنا الذكي يقوم بمسح آلاف الأدوات المالية للبحث عن هذه النماذج الهندسية بدقة 100% في القياس، ليرسل لك الإشعار في اللحظة التي يكتمل فيها النموذج.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-2xl font-light text-foreground/70 leading-relaxed mb-16">Do you believe market movements are random? Harmonic patterns prove the opposite. They are the language of numbers and golden ratios (Fibonacci) that reshape the future through repetitive geometric patterns with astonishing precision.</p>

                            <h2>Introduction: The Mathematical Symphony of Prices</h2>
                            <p>Harmonic patterns rely on the idea that price movement follows fixed mathematical ratios found in nature. By merging technical analysis with Fibonacci ratios, we can identify "Potential Reversal Zones" (PRZ) with precision unknown to traditional tools.</p>

                            <h2>Section 1: The Tale of Fibonacci and the Harmonic Trader</h2>
                            <p>Before touching any pattern, you must understand our relationship with Fibonacci. Ratios like 61.8%, 78.6%, and 161.8% are the pillars of the harmonic tent. A harmonic trader doesn't see triangles; they see "harmony" between price waves.</p>

                            <h2>Section 2: The Big Five Patterns</h2>
                            <p>We explore the Gartley, Butterfly, Bat, Crab, and Shark patterns. Each has a specific DNA of ratios. For instance, the Bat pattern is considered the most accurate, relying on the 88.6% retracement as its ultimate reversal point.</p>

                            <h2>Conclusion: Ready to Become a Chart Engineer?</h2>
                            <p>Trading with Harmonics transforms you from a gambler into an engineer. At AURA Analytics, our smart system scans thousands of financial instruments for these geometric patterns with 100% measurement accuracy, notifying you the moment a pattern completes.</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <Triangle className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الشائعة حول الهرمونيك' : 'Harmonic FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "ما هو أقوى نموذج هرمونيك؟", a: "يعتبر نموذج الخفاش (Bat) ونموذج السرطان (Crab) الأقوى بسبب عمق تصحيحاتهما التي تعكس استنفاداً تاماً لسيولة الاتجاه السابق." },
                                { q: "هل أحتاج لبرنامج خاص لرسم النماذج؟", a: "رغم إمكانية الرسم اليدوي، إلا أن الدقة تتطلب أدوات رقمية. نظام أورا يوفر كاشف هرمونيك آلي يوفر عليك الوقت والخطأ البشري." },
                                { q: "هل يعمل الهرمونيك في العملات الرقمية؟", a: "نعم، وبشكل مذهل. سوق الكريبتو يتبع نسب فيبوناتشي بدقة عالية جداً نظراً لسيطرة الخوارزميات على التداول فيه." }
                            ] : [
                                { q: "What is the strongest Harmonic pattern?", a: "The Bat and Crab patterns are often considered the strongest due to the depth of their retracements which reflect a complete exhaustion of prior trend liquidity." },
                                { q: "Do I need special software to draw patterns?", a: "While manual drawing is possible, precision requires digital tools. AURA provides an automated harmonic scanner to save time and reduce human error." },
                                { q: "Does Harmonics work in Crypto?", a: "Yes, amazingly well. The crypto market follows Fibonacci ratios with high precision due to the algorithmic dominance of trading in that sector." }
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
                    <h2 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'اجعل الرياضيات تكتشف صفقاتك القادة' : 'Let Mathematics Discover Your Next Trades'}</h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                        {lang === 'ar'
                            ? 'نظام أورا الهرمونيكي يمسح الشارتات لحظياً ليكشف لك الأنماط الهندسية قبل أن يلاحظها الآخرون.'
                            : 'AURA Harmonic system scans charts in real-time to reveal geometric patterns before others notice them.'}
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
