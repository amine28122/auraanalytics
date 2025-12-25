'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AuraAcademyLogo } from '@/components/logo';
import { Download, Menu, X, ArrowUpRight, TrendingUp, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import AppShowcase from '@/components/landing/app-showcase';
import SuccessStory from '@/components/landing/success-story';
import StrategyGlimpse from '@/components/landing/strategy-glimpse';
import PlanComparison from '@/components/landing/plan-comparison';
import PerformanceChart from '@/components/landing/performance-chart';
import GlobalCommunity from '@/components/landing/global-community';
import FoundersStrategy from '@/components/landing/founders-strategy';
import Footer from '@/components/landing/footer';
import FinancialTicker from '@/components/landing/financial-ticker';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { InstallPwaButton } from '@/components/install-pwa-button'; // Import the new component

type Theme = 'light' | 'dark';

const navLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
    { href: "/reviews", label: "Reviews" },
];

function FloatingCard({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <Card className={cn("absolute bg-card/5 backdrop-blur-lg border-border/10 shadow-2xl p-3 sm:p-4 animate-float-slow", className)}>
            {children}
        </Card>
    )
}

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [theme, setTheme] = useState<Theme>('dark');

   useEffect(() => {
    // Set initial theme based on class applied by blocking script
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'dark');
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsHeaderVisible(false);
      } else {
        // Scrolling up
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AURA",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Android", // This can be updated to include more OS
    "description": "AURA gives you the edge in financial markets. Get institutional-grade technical analysis and actionable trade signals, powered by our proprietary strategy. Our engine is built upon a foundation of proven, powerful technical analysis schools including Elliott Wave Theory, ICT Concepts, Fibonacci Levels, and more.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "3"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0",
      "highPrice": "50",
      "offers": [
        { "@type": "Offer", "name": "Free Plan", "price": "0" },
        { "@type": "Offer", "name": "Premium Plan", "price": "50" }
      ]
    },
    "featureList": [
      "Advanced Chart Analysis",
      "Actionable Trade Signals",
      "Multi-Timeframe Perspective",
      "Elliott Wave Theory Analysis",
      "Inner Circle Trader (ICT) Concepts",
      "Fibonacci Level Identification"
    ]
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground antialiased overflow-x-hidden">
       <Script
        id="app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      
      <div className={cn("fixed top-0 left-0 right-0 z-50 transition-transform duration-300", isHeaderVisible ? "translate-y-0" : "-translate-y-full")}>
        <FinancialTicker theme={theme}/>
      </div>


      <header className={cn(
        "fixed top-10 left-0 right-0 z-40 flex items-center justify-between p-4 transition-all duration-300 bg-background",
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="flex items-center gap-3">
            <AuraAcademyLogo iconOnly className="h-10 w-10" />
            <span className="font-headline text-2xl font-bold text-foreground">AURA</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                </Link>
            ))}
        </nav>

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className='text-foreground'>
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
             <Button size="sm" className="futuristic-button hidden md:inline-flex" asChild>
                <Link href="/auth">
                    <span>Sign In</span>
                </Link>
            </Button>
             <Button size="icon" variant="ghost" className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Toggle menu</span>
            </Button>
        </div>
      </header>

       {isMobileMenuOpen && (
            <div className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex flex-col items-center justify-center h-full gap-8 text-center">
                     {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="text-2xl font-bold text-foreground transition-colors hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    <Button size="lg" className="futuristic-button mt-8" asChild>
                        <Link href="/auth">
                            <span>Sign In</span>
                        </Link>
                    </Button>
                </div>
            </div>
        )}

      <main>
        <section className="relative w-full overflow-hidden px-4 pt-40 pb-20">
          <div className="absolute inset-0 -z-10 bg-background dark:bg-gradient-to-br from-blue-900/40 via-black to-black opacity-70"></div>
           <div 
          className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--muted))_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_40%_at_50%_50%,#000_50%,transparent_100%)] opacity-20">
        </div>
          
          <div className="relative z-10 container mx-auto grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-2xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
                      Start Trading, Grow Skills, Build Confidence
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10">
                    Join thousands of traders who trust AURA for its award-winning platform, providing institutional-grade analysis and actionable trade signals.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <InstallPwaButton />
                  </div>
              </div>

               <div className="relative w-full max-w-sm mx-auto md:mx-0">
                    {/* Main Phone and Bull */}
                    <Card className="relative overflow-hidden border-4 border-border shadow-2xl shadow-primary/20 bg-background rounded-[2.5rem] aspect-[9/18.5]">
                        <Image
                          src="/1 (2).png"
                          alt="AURA app interface"
                          width={400}
                          height={800}
                          className="h-full w-full object-cover"
                          data-ai-hint="app interface"
                          priority
                        />
                    </Card>

                    {/* Floating cards */}
                    <FloatingCard className="top-10 -left-12 sm:-left-20 rounded-xl sm:rounded-2xl animate-float-delay">
                         <div className="flex items-center gap-2">
                             <div className="p-1.5 sm:p-2 bg-green-500/20 text-green-400 rounded-full"><TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /></div>
                             <div>
                                 <p className="text-xs sm:text-sm font-bold text-foreground">BTC/USD</p>
                                 <p className="text-xs text-green-400 font-mono">+4.12%</p>
                             </div>
                         </div>
                    </FloatingCard>
                    
                    <FloatingCard className="top-1/3 -right-12 sm:-right-20 rounded-xl sm:rounded-2xl animate-float">
                        <p className="text-xs text-muted-foreground mb-1">Profit</p>
                        <p className="font-bold text-lg sm:text-xl text-foreground font-mono flex items-center gap-1">
                            <span className="text-green-400">+</span>$1,240.50
                        </p>
                    </FloatingCard>
                    
                     <FloatingCard className="bottom-20 -left-16 sm:-left-24 rounded-xl sm:rounded-2xl">
                        <p className="text-xs text-center text-foreground mb-1">EUR/USD Signal</p>
                        <Button size="sm" variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/50 h-8 text-xs sm:h-9 sm:text-sm">
                            View Signal <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                    </FloatingCard>
               </div>
          </div>
        </section>

        <PerformanceChart />
        <AppShowcase />
        <SuccessStory />
        <StrategyGlimpse />
        <PlanComparison />
        <GlobalCommunity />
        <FoundersStrategy />

      </main>

      <Footer />

      <style jsx>{`
        .light .futuristic-button {
          color: white;
          background: linear-gradient(45deg, hsl(var(--primary) / 0.9), hsl(280, 80%, 50%));
        }

        .dark .futuristic-button {
          color: white;
          background: linear-gradient(45deg, hsl(var(--primary) / 0.9), hsl(280, 80%, 50%));
        }

        @keyframes futuristic-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 hsl(var(--primary) / 0.4);
          }
          50% {
            box-shadow: 0 0 10px 4px hsl(var(--primary) / 0.1), 0 0 25px 10px hsl(var(--primary) / 0.05);
          }
        }
        
        @keyframes shine {
            0% { transform: translateX(-150%) skewX(-30deg); }
            100% { transform: translateX(150%) skewX(-30deg); }
        }

        @keyframes cta-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }
        
        .futuristic-button {
          position: relative;
          font-weight: 600;
          transition: all 0.4s ease;
          border: 1px solid hsl(var(--primary) / 0.5);
          overflow: hidden;
          animation: futuristic-pulse 3s infinite ease-in-out;
        }

        .futuristic-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(-150%) skewX(-30deg);
          transition: transform 0.6s ease;
        }

        .futuristic-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px hsl(var(--primary) / 0.4);
          border-color: hsl(var(--primary));
        }

        .light .futuristic-button:hover {
           background: linear-gradient(45deg, hsl(var(--primary)), hsl(280, 85%, 55%));
        }

        .dark .futuristic-button:hover {
           background: linear-gradient(45deg, hsl(var(--primary)), hsl(280, 85%, 55%));
        }
        
        .futuristic-button:hover::before {
            transform: translateX(250%) skewX(-30deg);
        }
        
        .futuristic-button:active {
            transform: translateY(0);
        }

        .futuristic-button .cta-icon {
          animation: cta-bounce 2.5s infinite ease-in-out;
        }
        
        .futuristic-button:hover .cta-icon {
          animation: none;
          transform: scale(1.1);
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
           animation: float 7s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
}
