'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, HelpCircle, GraduationCap, PlayCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EzoicAd } from '@/components/EzoicAd';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function AuraDemoGuideArticle() {
    const { lang, t } = useLanguage();
    // SSR fix for Ezoic

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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">Academy</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {lang === 'ar' ? 'رحلتك من الصفر إلى الاحتراف: الدليل الكامل لاستخدام منصة أورا التعليمية والحساب التجريبي' : 'Your Journey from Zero to Pro: The Complete Guide to AURA Learning Platform and Demo Account'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2024-12-31</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>35 min</span>
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
                    <img src="/6.png" alt="AURA Demo Account Guide" className="w-full h-full object-cover" />
                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-8 text-muted-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-headline 
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
                prose-h3:text-2xl prose-h3:mt-10
                prose-blockquote:border-s-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-e-xl prose-blockquote:italic
                prose-strong:text-foreground prose-strong:font-bold">
                    {lang === 'ar' ? (
                        <>
                            <p className="text-xl font-medium text-foreground/80 italic">أكبر خطأ يقع فيه المتداول الجديد هو البدء بالمال الحقيقي قبل "تطبيع" عينه على حركة السوق. في أورا، أوجدنا الحل الجذري لهذه المشكلة عبر الحساب التجريبي الأكثر تطوراً في الوطن العربي.</p>

                            <EzoicAd id={110} />
                            <h2>المقدمة: لماذا التعليم أولاً؟</h2>
                            <p>التداول هو المهنة الوحيدة التي يظن الناس أنهم يمكنهم النجاح فيها دون دراسة لسنوات. هل تتخيل جراحاً يجري عملية بمليون دولار دون تدريب؟ بالتأكيد لا. منصة أورا التعليمية توفر لك "مشرحة" السوق لتعمل فيها بأمان تام وبدون مخاطرة مالية.</p>

                            <h2>القسم الأول: فلسفة الحساب التجريبي في أورا</h2>
                            <p>الحسابات التجريبية التقليدية في شركات الوساطة غالباً ما تكون مملة وبدون توجيه. في أورا، حسابك التجريبي مرتبط بخبراء يوجهونك. أنت لا تتداول وحدك؛ بل تتلقى تنبيهات تشرح لك "لماذا" هذه المنطقة هي منطقة دخول، و "لماذا" هذا المستوى هو مستوى وقف خسارة.</p>
                            <h3>مميزات البيئة التجريبية لدينا:</h3>
                            <ul className="space-y-2">
                                <li><CheckCircle2 className="inline-block h-5 w-5 text-primary me-2" /> <strong>بيانات لحظية (Real-time):</strong> لا يوجد تأخير في الأسعار، أنت تشاهد ما يراه المحترفون.</li>
                                <li><CheckCircle2 className="inline-block h-5 w-5 text-primary me-2" /> <strong>خوارزميات مدمجة:</strong> أدوات التحليل الخاصة بنا تعمل بكامل قوتها في النسخة التجريبية.</li>
                                <li><CheckCircle2 className="inline-block h-5 w-5 text-primary me-2" /> <strong>محاكاة نفسية:</strong> نستخدم نظام "رصيد محدود" لنجعلك تشعر بقيمة المال الوهمي لتدريب انضباطك.</li>
                            </ul>

                            <h2>الالقسم الثاني: الخطوات الأربع لاستغلال المنصة</h2>
                            <h3>الخطوة 1: استكشاف لوحة التحكم (The Cockpit)</h3>
                            <p>أول ما ستراه هو لوحة التحكم الشاملة. نوصيك بالبدء بزوج واحد فقط، مثل اليورو دولار أو البتكوين، ومراقبته لمدة 72 ساعة دون تنفيذ أي صفقة. فقط راقب كيف تحترم الأسعار مستويات "السيولة" التي نحددها لك.</p>

                            <h3>الخطوة 2: تطبيق استراتيجية 'المدارس المتقدمة'</h3>
                            <p>في حسابك التجريبي، قم بتطبيق دروس موجات إليوت وICT التي نوفرها في الأكاديمية. ابحث عن فجوات القيمة العادلة (FVG) وانتظر تفاعل السعر معها. هذه هي المرحلة التي تبدأ فيها عيناك "بترجمة" لغة الشارت.</p>

                            <h2>القسم الثالث: كيف تفرق بين الحظ والمهارة؟</h2>
                            <p>العديد من المبتدئين يربحون في الحساب التجريبي ويظنون أنهم عباقرة، ثم يصفرون حساباتهم الحقيقية. السر يكمن في "الاستمرارية" (Consistency). في أورا، نمنحك "سجل أداء" (Performance Journaling) يحلل صفقاتك التجريبية ويخبرك إذا كنت تربح بناءً على نظام مدروس أم بمحض الصدفة.</p>
                            <blockquote>"المهارة هي نتاج تكرار الفعل الصحيح مئات المرات في بيئة آمنة."</blockquote>

                            <h2>القسم الرابع: متى يحين وقت الانتقال للحساب الحقيقي؟</h2>
                            <p>نحن في أورا نضع شرطين أساسيين قبل أن ننصحك بوضع دولار واحد في السوق:</p>
                            <ol className="list-decimal pl-6 space-y-4">
                                <li><strong>قاعدة الـ 20 صفقة:</strong> يجب أن تنفذ 20 صفقة متتالية بنفس الخطة وبدون أي تدخل عاطفي.</li>
                                <li><strong>ثبات الربح:</strong> يجب أن ينتهي رصيدك التجريبي بارتفاع (حتى لو بسيط) لمدة شهر كامل.</li>
                            </ol>

                            <h2>القسم الخامس: الدعم الفني والتعليمي المستمر</h2>
                            <p>بصفتك مستخدماً لأورا، لديك وصول لغرفة نقاش تعليمية حيث يمكنك طرح تساؤلاتك حول صفقاتك التجريبية. خبراؤنا سيقومون بمراجعة تحليلك وإخبارك بنقاط القوة والضعف في دخولك.</p>

                            <h2>الخلاصة: مستقبلك يبدأ هنا</h2>
                            <p>التداول ليس مقامرة إذا كنت تمتلك المعرفة. الحساب التجريبي في AURA Analytics هو بوابتك لتصبح متداولاً محترفاً يخدم نفسه بنفسه. ابدأ اليوم، تعلم اليوم، لتربح غداً.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-medium text-foreground/80 italic">The biggest mistake a new trader makes is starting with real money before "normalizing" their eyes to market movement. At AURA, we created the radical solution: the most advanced demo account in the region.</p>

                            <h2>Introduction: Why Education First?</h2>
                            <p>Trading is the only profession people think they can succeed in without years of study. Can you imagine a surgeon performing a million-dollar surgery without training? Certainly not. AURA provides the market "lab" for you to work in complete safety and without financial risk.</p>

                            <h2>Section 1: The AURA Demo Philosophy</h2>
                            <p>Traditional demo accounts at brokers are often boring and lack guidance. At AURA, your demo account is linked to expert guidance. You don't trade alone; you receive alerts explaining "why" a zone is an entry point and "why" a level is a stop loss.</p>
                            <h3>Features of Our Demo Environment:</h3>
                            <ul className="space-y-2">
                                <li><CheckCircle2 className="inline-block h-5 w-5 text-primary me-2" /> <strong>Real-time Data:</strong> No price delay; you see what the pros see.</li>
                                <li><CheckCircle2 className="inline-block h-5 w-5 text-primary me-2" /> <strong>Integrated Algorithms:</strong> Our analytical tools work fully in the demo version.</li>
                                <li><CheckCircle2 className="inline-block h-5 w-5 text-primary me-2" /> <strong>Psychological Simulation:</strong> We use a "limited balance" system to make you feel the value of virtual money to train your discipline.</li>
                            </ul>

                            <h2>Section 2: Four Steps to Dominate the Platform</h2>
                            <h3>Step 1: Exploring the Cockpit</h3>
                            <p>The first thing you'll see is the comprehensive dashboard. We recommend starting with just one pair, like EUR/USD or Bitcoin, and watching it for 72 hours without executing any trade. Just observe how prices respect the "Liquidity" levels we set for you.</p>

                            <h3>Step 2: Applying the 'Advanced Schools' Strategy</h3>
                            <p>In your demo account, apply the Elliott Wave and ICT lessons provided in the Academy. Look for Fair Value Gaps (FVG) and wait for price reaction. This is the stage where your eyes start to "translate" the language of charts.</p>

                            <h2>Section 3: Distinguishing Luck from Skill</h2>
                            <p>Many beginners win in demo and think they're geniuses, then blow real accounts. The secret is "Consistency." At AURA, we give you "Performance Journaling" that analyzes your demo trades and tells you if you're winning based on a system or pure luck.</p>
                            <blockquote>"Skill is the product of repeating the correct action hundreds of times in a safe environment."</blockquote>

                            <h2>Section 4: When is it Time to Go Real?</h2>
                            <p>At AURA, we set two basic conditions before advising you to put a single dollar into the market:</p>
                            <ol className="list-decimal pl-6 space-y-4">
                                <li><strong>The 20-Trade Rule:</strong> You must execute 20 consecutive trades following the same plan without emotional interference.</li>
                                <li><strong>Profit Stability:</strong> Your demo balance must end in the green (even slightly) for a full month.</li>
                            </ol>

                            <h2>Conclusion: Your Future Starts Here</h2>
                            <p>Trading is not gambling if you have the knowledge. The AURA Analytics demo account is your gateway to becoming a self-reliant professional trader. Start today, learn today, to earn tomorrow.</p>
                        </>
                    )}
                </div>

                <div className="mt-24 space-y-8 border-t border-border/10 pt-16">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">
                            {lang === 'ar' ? 'الأسئلة الشائعة للمبتدئين' : 'Beginner Mastery FAQ'}
                        </h2>
                    </div>

                    {mounted && (
                        <Accordion type="single" collapsible className="w-full">
                            {(lang === 'ar' ? [
                                { q: "ما هو الفرق بين رصيد الديمو ورصيد الريل؟", a: "في أورا، لا يوجد فرق تقني؛ الأسعار والإشارات هي نفسها تماماً. الفرق الوحيد هو في مشاعرك أنت تجاه المال." },
                                { q: "هل أحتاج لخبرة سابقة لاستخدام الحساب التجريبي؟", a: "إطلاقاً، الحساب مصمم ليأخذ بيدك من الصفر عبر فيديوهات تعليمية بسيطة ومباشرة." },
                                { q: "ماذا أفعل إذا خسرت كل المال الوهمي في الديمو؟", a: "ببساطة يمكنك إعادة تعيين الحساب (Reset)، ولكننا ننصحك بمراجعة أخطائك مع خبيرنا أولاً لتجنب تكرارها." }
                            ] : [
                                { q: "What is the difference between Demo and Real balance?", a: "At AURA, there is no technical difference; prices and signals are exactly the same. The only difference is in your emotions toward the money." },
                                { q: "Do I need previous experience to use the demo account?", a: "Not at all, the account is designed to take you from zero through simple and direct educational videos." },
                                { q: "What should I do if I lose all the virtual money in demo?", a: "You can simply Reset the account, but we advise you to review your mistakes with our expert first to avoid repeating them." }
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
                    <h2 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'ابدأ تعلمك المجاني اليوم' : 'Start Your Free Learning Today'}</h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                        {lang === 'ar'
                            ? 'انضم إلى جيل جديد من المتداولين الذين يمتلكون العلم والتكنولوجيا.'
                            : 'Join a new generation of traders who possess both knowledge and technology.'}
                    </p>
                    <Button size="lg" className="futuristic-button h-14 px-10 text-lg" asChild>
                        <Link href="/pricing">{lang === 'ar' ? 'ابدأ الآن مجاناً' : 'Start Now for Free'}</Link>
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
