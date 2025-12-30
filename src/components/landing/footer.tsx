'use client';

import Link from 'next/link';
import { AuraAcademyLogo } from '@/components/logo';
import { WorldMap } from '@/components/world-map';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="relative border-t border-border/10 bg-background/5 text-sm text-muted-foreground overflow-hidden">
      <WorldMap className="absolute inset-0 z-0" />
      <div className="relative z-10 container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <AuraAcademyLogo iconOnly className="h-10 w-10" />
              <span className="font-headline text-2xl font-bold text-foreground">AURA</span>
            </div>
            <p className="max-w-xs text-muted-foreground">
              {t.footer_desc}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://www.facebook.com/profile.php?id=61585475785922" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/aura_analytics/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@aura_analytics1" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t.product}</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">{t.features}</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">{t.pricing}</Link></li>
                <li><Link href="/reviews" className="text-muted-foreground hover:text-primary transition-colors">{t.reviews}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t.company}</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">{t.about}</Link></li>
                <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">{t.methodology}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t.legal}</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">{t.privacy_policy}</Link></li>
                <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">{t.terms_of_service}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border/10 pt-8 text-center text-muted-foreground/80">
          <p>&copy; {new Date().getFullYear()} AURA. {t.all_rights_reserved}</p>
        </div>
      </div>
    </footer>
  );
}
