'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuraAcademyLogo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Download } from 'lucide-react';

// Define the beforeinstallprompt event type
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
  prompt(): Promise<void>;
}

export function Header({ lang }: { lang: string }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setInstallPrompt(null); // The prompt can only be used once
    });
  };

  const navLinks = [
    { href: '/dashboard', text: 'Dashboard' },
    { href: '/learning-center', text: 'Learning Center' },
    { href: '/settings', text: 'Settings' },
  ];

  const translations = {
    en: {
      installApp: 'Install App',
      dashboard: 'Dashboard',
      learningCenter: 'Learning Center',
      settings: 'Settings',
    },
    ar: {
      installApp: 'تثبيت التطبيق',
      dashboard: 'لوحة التحكم',
      learningCenter: 'مركز التعلم',
      settings: 'الإعدادات',
    },
    es: {
      installApp: 'Instalar Aplicación',
      dashboard: 'Tablero',
      learningCenter: 'Centro de Aprendizaje',
      settings: 'Configuración',
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  const navLinksTranslated = [
    { href: `/dashboard?lang=${lang}`, text: t.dashboard },
    { href: `/learning-center?lang=${lang}`, text: t.learningCenter },
    { href: `/settings?lang=${lang}`, text: t.settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href={`/dashboard?lang=${lang}`} className="mr-6 flex items-center space-x-2">
          <AuraAcademyLogo iconOnly className="h-8 w-8" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinksTranslated.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {link.text}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Install Button */}
          {installPrompt && (
            <Button onClick={handleInstallClick}>
              <Download className="mr-2 h-4 w-4" />
              {t.installApp}
            </Button>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link href={`/dashboard?lang=${lang}`} className="mr-6 flex items-center space-x-2 mb-6" onClick={() => setMenuOpen(false)}>
                  <AuraAcademyLogo iconOnly className="h-8 w-8" />
                  <span className="font-bold">AURA</span>
                </Link>
                <div className="flex flex-col space-y-3">
                  {navLinksTranslated.map((link) => (
                    <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80" onClick={() => setMenuOpen(false)}>
                      {link.text}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
