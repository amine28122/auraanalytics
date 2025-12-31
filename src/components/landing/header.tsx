'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuraAcademyLogo } from '@/components/logo';
import { useLanguage } from '@/context/LanguageContext';
import { Languages, Sun, Moon, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import FinancialTicker from './financial-ticker';

export function LandingHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const { lang, setLang, t } = useLanguage();

    const navLinks = [
        { href: "/#aura-pro", label: t.aura_pro },
        { href: "/blog", label: t.blog },
        { href: "/pricing", label: t.pricing },
        { href: "/about", label: t.about },
        { href: "/reviews", label: t.reviews },
    ];

    useEffect(() => {
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
            localStorage.setItem('theme', 'light');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsHeaderVisible(false);
            } else {
                setIsHeaderVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className={cn("fixed top-0 left-0 right-0 z-50 transition-transform duration-300", isHeaderVisible ? "translate-y-0" : "-translate-y-full")} dir="ltr">
                <FinancialTicker theme={theme} />
            </div>

            <header className={cn(
                "fixed top-10 left-0 right-0 z-40 flex items-center justify-between p-4 transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-border/10",
                isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            )}>
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <AuraAcademyLogo iconOnly className="h-10 w-10" />
                        <span className="font-headline text-2xl font-bold text-foreground">AURA</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className='text-foreground'>
                        <Languages className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className='text-foreground'>
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    <Button size="sm" className="futuristic-button hidden md:inline-flex" asChild>
                        <Link href="/auth">
                            <span>{t.sign_in}</span>
                        </Link>
                    </Button>
                    <Button size="icon" variant="ghost" className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                                <span>{t.sign_in}</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
