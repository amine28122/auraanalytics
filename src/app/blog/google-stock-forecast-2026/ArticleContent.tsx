'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, Binary, Cloud, Search, MousePointer2, TrendingUp, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthorByline } from '@/components/blog/AuthorByline';
import dynamic from 'next/dynamic';
const EzoicAd = dynamic(() => import('@/components/EzoicAd').then(mod => mod.EzoicAd), { ssr: false });


export default function GoogleAnalysisArticle() {
    const { lang } = useLanguage();
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

                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-4">AI Tech</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight">
                        {lang === 'ar' ? 'توقعات سهم جوجل 2026: سيطرة Gemini ونمو السحابة المذهل' : 'Google Stock Forecast 2026: Gemini AI Dominance & Cloud Surge'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/10 py-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>2026-01-01</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>22 min read</span>
                        </div>
                        <div className="flex items-center gap-4 ms-auto border-s border-border/10 ps-6">
                            <Share2 className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Facebook className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Twitter className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                            <Linkedin className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/5 relative group">
                    <img src="/GOOGLE.png" alt="Google Cloud and AI 2026" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-8">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-2xl">$314.19</span>
                                <span className="text-primary-foreground/60 text-xs">Current Price</span>
                            </div>
                            <div className="h-10 w-[1px] bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-primary font-bold text-2xl">$385.00</span>
                                <span className="text-primary/60 text-xs">Target Goal</span>
                            </div>
                        </div>
                    </div>

                <AuthorByline authorId="nabil" />

                </div>

                <div className="article-body prose prose-lg dark:prose-invert max-w-none pt-8 space-y-12 text-muted-foreground leading-relaxed">
                    {lang === 'ar' ? (
                        <>
                            <section>
                                <p className="text-2xl font-light text-foreground leading-relaxed italic">بينما كان البعض يتشكك في قدرة جوجل على مواكبة سباق الذكاء الاصطناعي، أثبتت شركة Alphabet في بداية 2026 أنها تمتلك "المحرك الأكثر تطوراً" في العالم. مع سعر يقترب من 314 دولاراً، تبدو الرحلة نحو 385 دولاراً مسألة وقت لا أكثر.</p>
                            </section>

                            <section>
                                <EzoicAd id={110} />
                            <h2>1. هيمنة Gemini في كل مكان</h2>
                                <p>أصبح Gemini ليس مجرد بوت دردشة، بل هو العمود الفقري لجميع منتجات جوجل. من محرك البحث (Search Generative Experience) الذي يعطي إجابات دقيقة ومخصصة، إلى أندرويد 17 الذي أصبح يعمل كوكيل ذكاء اصطناعي كامل.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                                    <div className="p-6 bg-card rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Search className="h-5 w-5 text-primary" />
                                            <h4 className="m-0">تسيير البحث (Search Ads)</h4>
                                        </div>
                                        <p className="text-sm m-0">زادت معدلات التحويل الإعلاني بنسبة 25% بفضل دقة الاستهداف عبر Gemini.</p>
                                    </div>
                                    <div className="p-6 bg-card rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Binary className="h-5 w-5 text-primary" />
                                            <h4 className="m-0">مشاريع DeepMind</h4>
                                        </div>
                                        <p className="text-sm m-0">تطبيقات جوجل في الطب والعلوم بدأت تدر أرباحاً تجارية حقيقية.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2>2. جوجل كلاود: الانفجار الربحي</h2>
                                <p>لأول مرة في تاريخها، أصبح قطاع السحاب (Cloud) يساهم بشكل ضخم في صافي الأرباح. مع تراكم طلبات (Backlog) بقيمة 155 مليار دولار، تضمن جوجل سيولة نقدية وتدفقات مالية قوية للسنوات الثلاث القادمة.</p>
                                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 flex items-start gap-4">
                                    <Cloud className="h-8 w-8 text-primary mt-1 shrink-0" />
                                    <div>
                                        <h4 className="mt-0 font-headline text-foreground">لماذا جوجل كلاود هو الرابح؟</h4>
                                        <p className="text-sm mb-0">لأن المؤسسات التي تريد تدريب نماذج AI تحتاج إلى وحدات معالجة TPU التي تنتجها جوجل بنفسها، مما يجعل التكلفة أقل والكفاءة أعلى بكثير من المنافسين.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2>3. خريطة الطريق الاستراتيجية 2026 (Roadmap)</h2>
                                <div className="space-y-6 my-10">
                                    <div className="flex gap-6">
                                        <div className="w-16 h-16 rounded-full bg-card border border-primary/20 flex items-center justify-center shrink-0">
                                            <span className="text-primary font-bold text-xl">01</span>
                                        </div>
                                        <div>
                                            <h4 className="mt-0 text-foreground">التركيز على "وكلاء الذكاء الاصطناعي" (AI Agents)</h4>
                                            <p className="text-sm">اطلاق النسخة التجارية من "Project Astra" التي تمكن الذكاء الاصطناعي من تنفيذ مهام حقيقية مثل حجز الطيران وإدارة المواعيد.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-16 h-16 rounded-full bg-card border border-primary/20 flex items-center justify-center shrink-0">
                                            <span className="text-primary font-bold text-xl">02</span>
                                        </div>
                                        <div>
                                            <h4 className="mt-0 text-foreground">التوسع في يوتيوب بريميوم</h4>
                                            <p className="text-sm">دمج أدوات صناعة المحتوى بالـ AI حصرياً لمشتركي بريميوم، مما يزيد عدد المشتركين إلى 150 مليون.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2>4. التحليل المالي والتقني</h2>
                                <p>يتم تداول GOOGL حالياً بمكرر ربحية جذاب جداً (22x Forward P/E) مقارنة بمعظم أسهم التكنولوجيا الكبرى. هذا يجعل السهم "أقل خطورة" وأكثر جاذبية لصناديق الاستثمار الكبرى.</p>
                                <div className="p-6 bg-muted/20 border border-border rounded-xl">
                                    <h4 className="mt-0 flex items-center gap-2"><BarChart className="h-5 w-5 text-primary" /> الأرقام الأساسية لـ 2026:</h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
                                        <li className="bg-background p-3 rounded border border-white/5"><strong>نمو الإيرادات:</strong> 14.5% سنوياً</li>
                                        <li className="bg-background p-3 rounded border border-white/5"><strong>هامش الربح التشغيلي:</strong> 31%</li>
                                        <li className="bg-background p-3 rounded border border-white/5"><strong>التدفق النقدي الحر:</strong> 95 مليار دولار</li>
                                        <li className="bg-background p-3 rounded border border-white/5"><strong>نصيب السهم من الأرباح:</strong> 17.50 دولار</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2>الخلاصة: فرصة ذهبية</h2>
                                <p>سهم Alphabet هو الخيار الأمثل للمستثمر الذي يريد الجمع بين "الأمان المالي" و "النمو التكنولوجي". نوصي بمراقبة مستوى 300 دولار كدعم حيوي، وهدفنا الأول هو 355 دولار ثم 385 دولار قبل نهاية العام. في AURA، نعتبر جوجل الركيزة الأساسية في أي محفظة تكنولوجية طموحة.</p>
                            </section>
                        </>
                    ) : (
                        <>
                            <section>
                                <p className="text-2xl font-light text-foreground leading-relaxed italic">While some doubted Google's ability to keep up with the AI race, Alphabet proved in early 2026 that it possesses the "most advanced engine" in the world. With a price near $314, the journey toward $385 seems like a matter of time.</p>
                            </section>

                            <section>
                                <h2>1. Gemini Dominance Everywhere</h2>
                                <p>Gemini has become more than a chatbot; it is the backbone of all Google products. From the Search Generative Experience (SGE), providing precise answers, to Android 17, which now functions as a full-scale AI agent.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                                    <div className="p-6 bg-card rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Search className="h-5 w-5 text-primary" />
                                            <h4 className="m-0">Search Ads Mastery</h4>
                                        </div>
                                        <p className="text-sm m-0">Ad conversion rates increased by 25% thanks to Gemini's precision targeting.</p>
                                    </div>
                                    <div className="p-6 bg-card rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Binary className="h-5 w-5 text-primary" />
                                            <h4 className="m-0">DeepMind Ventures</h4>
                                        </div>
                                        <p className="text-sm m-0">Google's AI applications in healthcare and science are beginning to generate real commercial profits.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2>2. Google Cloud: The Profit Explosion</h2>
                                <p>For the first time in history, the Cloud sector is contributing massively to net profits. With a $155 billion backlog, Google guarantees strong cash flows for the next three years.</p>
                                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 flex items-start gap-4">
                                    <Cloud className="h-8 w-8 text-primary mt-1 shrink-0" />
                                    <div>
                                        <h4 className="mt-0 font-headline text-foreground">Why Google Cloud Wins?</h4>
                                        <p className="text-sm mb-0">Institutions training AI models need TPUs (Tensor Processing Units) produced by Google, making the cost lower and efficiency higher than competitors.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2>3. Strategic Roadmap for 2026</h2>
                                <div className="space-y-6 my-10 border-s border-white/10 ml-4 pl-4">
                                    <div>
                                        <h4 className="text-foreground flex items-center gap-2"><MousePointer2 className="h-4 w-4 text-primary" /> Focus on "AI Agents"</h4>
                                        <p className="text-sm">Launch of the commercial version of "Project Astra," enabling AI to perform real-world tasks like booking flights and managing schedules.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-foreground flex items-center gap-2"><Binary className="h-4 w-4 text-primary" /> YouTube Premium Expansion</h4>
                                        <p className="text-sm">Integrating AI content creation tools exclusively for Premium subscribers, targeting 150 million users.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2>4. Financial & Technical Analysis</h2>
                                <p>GOOGL is currently trading at an attractive 22x Forward P/E. This makes the stock "de-risked" compared to other mega-cap peers.</p>
                                <div className="p-6 bg-muted/20 border border-border rounded-xl">
                                    <h4 className="mt-0 flex items-center gap-2"><BarChart className="h-5 w-5 text-primary" /> Key 2026 Metrics:</h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
                                        <li className="bg-background p-3 rounded border border-white/5"><strong>Revenue Growth:</strong> 14.5% YoY</li>
                                        <li className="bg-background p-3 rounded border border-white/5"><strong>Operating Margin:</strong> 31%</li>
                                        <li className="bg-background p-3 rounded border border-white/5"><strong>Free Cash Flow:</strong> $95 Billion</li>
                                        <li className="bg-background p-3 rounded border border-white/5"><strong>Projected EPS:</strong> $17.50</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2>Conclusion: A Golden Opportunity</h2>
                                <p>Alphabet stock is the ideal choice for investors seeking a blend of financial safety and technological growth. We recommend monitoring $300 as vital support, with initial targets at $355 and $385 by year-end. At AURA, we view Google as the cornerstone of any ambitious tech portfolio.</p>
                            </section>
                        </>
                    )}
                </div>
            </article>

            <Footer />
        </div>
    );
}
