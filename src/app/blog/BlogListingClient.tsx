'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { useLanguage } from '@/context/LanguageContext';
import { Newspaper, Calendar, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Static Blog Data for Listing
const blogPosts = [
    {
        slug: 'apple-stock-forecast-2026',
        title: {
            en: 'Apple Stock Forecast 2026: The AI Revolution & $350 Target',
            ar: 'توقعات سهم أبل 2026: ثورة الذكاء الاصطناعي وهدف 350 دولار'
        },
        date: '2026-01-01',
        readTime: '25 min',
        category: 'Stocks',
        image: '/APPLE.png',
        excerpt: {
            en: 'Analysis of the AI-driven iPhone 18 cycle, services revenue growth, and the technical roadmap to new all-time highs for Apple.',
            ar: 'تحليل لدورة آيفون 18 المدعومة بالذكاء الاصطناعي، ونمو إيرادات الخدمات، وخريطة الطريق التقنية لأسهم أبل.'
        }
    },
    {
        slug: 'google-stock-forecast-2026',
        title: {
            en: 'Google Stock Forecast 2026: Gemini AI Dominance & Cloud Surge',
            ar: 'توقعات سهم جوجل 2026: سيطرة Gemini ونمو السحابة المذهل'
        },
        date: '2026-01-01',
        readTime: '22 min',
        category: 'AI Tech',
        image: '/GOOGLE.png',
        excerpt: {
            en: 'Explore Alphabet Inc. (GOOGL) growth through Gemini AI integration and massive Google Cloud backlog expansion.',
            ar: 'استكشف نمو شركة Alphabet من خلال تكامل ذكاء Gemini الاصطناعي والتوسع الهائل في قطاع جوجل كلاود.'
        }
    },
    {
        slug: 'tesla-stock-forecast-2026',
        title: {
            en: 'Tesla Stock Forecast 2026: The Robotaxi Era & Parabolic Potential',
            ar: 'توقعات سهم تيسلا 2026: عصر الـ Robotaxis والانفجار السعري المرتقب'
        },
        date: '2026-01-01',
        readTime: '28 min',
        category: 'Hyper-growth',
        image: '/TESLA.png',
        excerpt: {
            en: 'Inside Tesla’s pivot to autonomy, Robotaxi commercialization, and the roadmap to becoming a $3T AI powerhouse.',
            ar: 'نظرة داخل تحول تيسلا نحو القيادة الذاتية، وتسويق Robotaxi، وخريطة الطريق لتصبح قوة ذكاء اصطناعي بقيمة 3 تريليون دولار.'
        }
    },
    {
        slug: 'bitcoin-analysis-2026',
        title: {
            en: 'Bitcoin Forecast 2026: The $250,000 Milestone',
            ar: 'توقعات البتكوين 2026: هل نصل إلى 250,000 دولار؟'
        },
        date: '2026-01-01',
        readTime: '18 min',
        category: 'Crypto',
        image: '/BITCOIN.png',
        excerpt: {
            en: 'Deep dive into Bitcoin market analysis for 2026. Understanding institutional adoption and technical targets.',
            ar: 'تحليل شامل لسوق البتكوين لعام 2026. فهم التبني المؤسساتي والأهداف التقنية.'
        }
    },
    {
        slug: 'gold-analysis-2026',
        title: {
            en: 'Gold Price Analysis 2026: The Roadmap to $5,000',
            ar: 'تحليل أسعار الذهب 2026: الطريق نحو 5,000 دولار للأونصة'
        },
        date: '2026-01-01',
        readTime: '15 min',
        category: 'Markets',
        image: '/stock_indices_mastery_banner.png',
        excerpt: {
            en: 'Comprehensive analysis of Gold in 2026. Explore key support levels and the drivers behind the gold bull run.',
            ar: 'تحليل شامل للذهب في عام 2026. اكتشف مستويات الدعم الرئيسية والدوافع وراء صعود الذهب.'
        }
    },
    {
        slug: 'dollar-index-analysis-2026',
        title: {
            en: 'US Dollar Index (DXY) 2026: Facing a Structural Shift',
            ar: 'مؤشر الدولار الأمريكي (DXY) 2026: هل نشهد نهاية هيمنة الدولار؟'
        },
        date: '2026-01-01',
        readTime: '14 min',
        category: 'Forex',
        image: '/forex_market_mastery_banner.png',
        excerpt: {
            en: 'Analyzing the US Dollar Index (DXY) in 2026. Will the dollar continue its descent toward 90?',
            ar: 'تحليل مؤشر الدولار الأمريكي في عام 2026. هل سينجح الدولار في الحفاظ على مستوياته؟'
        }
    },
    {
        slug: 'advanced-schools-strategy',
        title: {
            en: 'Mastering the Markets with Advanced Schools Strategy',
            ar: 'احتراف الأسواق باستراتيجية المدارس المتقدمة'
        },
        date: '2024-12-30',
        readTime: '15 min',
        category: 'Strategy',
        image: '/6.png',
        excerpt: {
            en: 'Discover how combining Elliott Wave Theory with ICT concepts creates a powerful analytical edge.',
            ar: 'اكتشف كيف يخلق دمج نظرية موجات إليوت مع مفاهيم ICT ميزة تحليلية قوية.'
        }
    },
    {
        slug: 'trading-psychology-mastery',
        title: {
            en: 'Trading Psychology: Mastering Your Mind for Profits',
            ar: 'سيكولوجية التداول: كيف تسيطر على عقلك لتحقيق أرباح'
        },
        date: '2024-12-31',
        readTime: '20 min',
        category: 'Psychology',
        image: '/psychology_trading_banner.png',
        excerpt: {
            en: 'Learn how to conquer fear and greed to build a professional trading mindset.',
            ar: 'تعلم كيف تتغلب على الخوف والطمع لبناء عقلية تداول احترافية.'
        }
    },
    {
        slug: 'risk-management-strategies',
        title: {
            en: 'Risk Management: Secure Your Portfolio Against Volatility',
            ar: 'إدارة المخاطر: الدرع الواقي لمحفظتك من التقلبات'
        },
        date: '2024-12-30',
        readTime: '18 min',
        category: 'Finance',
        image: '/risk_management_visualization.png',
        excerpt: {
            en: 'The essential guide to sustainable capital growth and portfolio protection.',
            ar: 'الدليل الأساسي لنمو رأس المال المستدام وحماية المحفظة.'
        }
    },
    {
        slug: 'crypto-market-cycles',
        title: {
            en: 'Crypto Market Cycles: On-Chain Analysis Insights',
            ar: 'دورات سوق الكريبتو: رؤى من تحليل السلسلة'
        },
        date: '2024-12-29',
        readTime: '22 min',
        category: 'Crypto',
        image: '/crypto_market_analysis_modern.png',
        excerpt: {
            en: 'Understand Bitcoin halving and market phases to time your entries perfectly.',
            ar: 'افهم تنصيف البتكوين مراحل السوق لتوقيت دخولك بشكل مثالي.'
        }
    },
    {
        slug: 'supply-demand-zones',
        title: {
            en: 'Supply and Demand Zones: The Hidden Engine of Markets',
            ar: 'مناطق العرض والطلب: المحرك الخفي وراء كل حركة سعرية'
        },
        date: '2024-12-31',
        readTime: '50 min',
        category: 'Technical',
        image: '/1 (2).png',
        excerpt: {
            en: 'Learn how institutional order flow creates massive price imbalances and how to spot them.',
            ar: 'تعلم كيف يخلق تدفق الطلبات المؤسساتي اختلالات سعرية ضخمة وكيف تكتشفها.'
        }
    },
    {
        slug: 'harmonic-patterns-trading',
        title: {
            en: 'Harmonic Patterns: Advanced Geometric Trading',
            ar: 'النماذج التوافقية: هندسة الجمال الرياضي في قلب الشارت'
        },
        date: '2024-12-31',
        readTime: '42 min',
        category: 'Advanced',
        image: '/2 (2).png',
        excerpt: {
            en: 'Master the art of Fibonacci-based geometric patterns like Gartley and Bat.',
            ar: 'احترف فن الأنماط الهندسية المبنية على نسب فيبوناتشي مثل جارتلي والخفاش.'
        }
    },
    {
        slug: 'technical-vs-fundamental',
        title: {
            en: 'Technical vs Fundamental: A Unified Trading Strategy',
            ar: 'الفني ضد الأساسي: بناء استراتيجية تداول موحدة'
        },
        date: '2024-12-31',
        readTime: '48 min',
        category: 'Strategy',
        image: '/3 (2).png',
        excerpt: {
            en: 'Bridge the gap between economic news and chart precision for surgical execution.',
            ar: 'اربط الفجوة بين الأخبار الاقتصادية ودقة الشارت لتنفيذ صفقات دقيقة كالجراح.'
        }
    },
    {
        slug: 'forex-market-mastery',
        title: {
            en: 'Forex Market Mastery: Secrets of the Largest Market',
            ar: 'دليل احتراف سوق الفوركس: أسرار أكبر سوق مالي'
        },
        date: '2024-12-31',
        readTime: '25 min',
        category: 'Forex',
        image: '/forex_market_mastery_banner.png',
        excerpt: {
            en: 'Master the secrets of currency trading and institutional liquidity in the global Forex market.',
            ar: 'احترف أسرار تداول العملات والسيولة المؤسساتية في سوق الفوركس العالمي.'
        }
    },
    {
        slug: 'global-stock-indices',
        title: {
            en: 'Global Stock Indices: Trading S&P 500 and NASDAQ',
            ar: 'فهم مؤشرات الأسهم العالمية: تداول S&P 500 و NASDAQ'
        },
        date: '2024-12-30',
        readTime: '22 min',
        category: 'Indices',
        image: '/stock_indices_mastery_banner.png',
        excerpt: {
            en: 'A complete guide to understanding and trading the worlds most liquid stock benchmarks.',
            ar: 'دليل كامل لفهم وتداول أكثر مؤشرات الأسهم سيولة في العالم.'
        }
    },
    {
        slug: 'aura-demo-account-guide',
        title: {
            en: 'AURA Demo Account: Learn Trading Risk-Free',
            ar: 'الدليل الشامل لاستخدام حساب أورا التجريبي'
        },
        date: '2024-12-31',
        readTime: '15 min',
        category: 'Guide',
        image: '/6.png',
        excerpt: {
            en: 'The complete guide to testing institutional strategies without financial risk.',
            ar: 'الدليل الشامل لاختبار استراتيجيات المؤسسات دون مخاطرة مالية.'
        }
    },
    {
        slug: 'institutional-liquidity-ict',
        title: {
            en: 'The Truth About Institutional Liquidity and ICT Logic',
            ar: 'الحقيقة حول السيولة المؤسساتية ومنطق ICT'
        },
        date: '2024-12-28',
        readTime: '12 min',
        category: 'Technical',
        image: '/7.png',
        excerpt: {
            en: 'Learn how to spot the footprints of big banks and smart money in the retail markets.',
            ar: 'تعلم كيفية اكتشاف بصمات البنوك الكبرى والأموال الذكية في أسواق التجزئة.'
        }
    },
    {
        slug: 'elliott-wave-forecasting',
        title: {
            en: 'Precision Forecasting Using Elliott Wave Theory',
            ar: 'التنبؤ الدقيق باستخدام نظرية موجات إليوت'
        },
        date: '2024-12-25',
        readTime: '14 min',
        category: 'Analysis',
        image: '/8.png',
        excerpt: {
            en: 'A deep dive into market cycles and how to anticipate major price reversals.',
            ar: 'غوص عميق في دورات السوق وكيفية توقع الانعكاسات السعرية الكبرى.'
        }
    }
];

export default function BlogListingClient() {
    const [activeCategory, setActiveCategory] = React.useState('All');
    const { lang, t } = useLanguage();

    const categories = ['All', 'Stocks', 'Crypto', 'Forex', 'Strategy', 'Technical', 'Analysis'];
    
    const filteredPosts = activeCategory === 'All' 
        ? blogPosts 
        : blogPosts.filter(post => post.category === activeCategory || (activeCategory === 'Technical' && post.category === 'Advanced'));

    const marketAnalysisLabel = lang === 'ar' ? 'تحليل السوق والذكاء المالي' : 'Market Intelligence & Analysis';

    return (
        <div className={cn("min-h-screen bg-background text-foreground antialiased overflow-x-hidden", lang === 'ar' && "font-['Cairo']")} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <LandingHeader />

            <main className="container mx-auto px-4 pt-44 pb-16">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="flex justify-center mb-4">
                        <Badge variant="secondary" className="px-4 py-1 flex gap-2 items-center">
                            <Newspaper className="h-4 w-4 text-primary" />
                            {marketAnalysisLabel}
                        </Badge>
                    </div>
                    <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
                        {lang === 'ar' ? 'تحليل الأسواق ومركز التعليم' : 'Market Analysis & Learning Center'}
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                        {lang === 'ar'
                            ? 'تعمق في مهارات التداول مع رؤى الخبراء والدروس التعليمية حول استراتيجيات المؤسسات.'
                            : 'Deepen your trading skills with expert insights and comprehensive guides on institutional strategies.'}
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-medium transition-all border",
                                    activeCategory === cat 
                                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105" 
                                        : "bg-muted/50 text-muted-foreground border-border/10 hover:border-primary/50"
                                )}
                            >
                                {lang === 'ar' ? (
                                    cat === 'All' ? 'الكل' :
                                    cat === 'Stocks' ? 'الأسهم' :
                                    cat === 'Crypto' ? 'الكريبتو' :
                                    cat === 'Forex' ? 'الفوركس' :
                                    cat === 'Strategy' ? 'الاستراتيجيات' :
                                    cat === 'Technical' ? 'التحليل الفني' :
                                    cat === 'Analysis' ? 'التقارير' : cat
                                ) : cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`}>
                            <Card className="h-full overflow-hidden border border-border/10 hover:border-primary/50 transition-all duration-300 bg-card/5 backdrop-blur-sm group card-glow">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title[lang]}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-primary/90 backdrop-blur-md">{post.category}</Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                                    </div>
                                    <CardTitle className="leading-snug group-hover:text-primary transition-colors">
                                        {post.title[lang]}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground line-clamp-3 mb-6">
                                        {post.excerpt[lang]}
                                    </p>
                                    <div className="flex items-center text-primary font-bold group-hover:gap-2 transition-all">
                                        {t.read_more} <ArrowRight className={cn("h-4 w-4", lang === 'ar' ? 'rotate-180 mr-2' : 'ml-2')} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
