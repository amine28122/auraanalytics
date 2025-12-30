'use client';

import { cn } from '@/lib/utils';
import {
  BookOpen,
  Home,
  Newspaper,
  Shield,
  BarChart2,
  DollarSign,
  Info,
  Calendar,
  History,
  CandlestickChart,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const translations = {
  en: {
    dashboard: 'Dashboard',
    market: 'Market',
    economicCalendar: 'Eco. Calendar',
    news: 'News',
    history: 'History',
    learning: 'Learning',
    pricing: 'Pricing',
    about: 'About',
    admin: 'Admin',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    simulator: 'Simulator',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    market: 'السوق',
    economicCalendar: 'التقويم الاقتصادي',
    news: 'الأخبار',
    history: 'سجل التحليلات',
    learning: 'التعلم',
    pricing: 'الأسعار',
    about: 'من نحن',
    admin: 'الإدارة',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    simulator: 'المحاكي',
  },
  es: {
    dashboard: 'Dashboard',
    market: 'Mercado',
    economicCalendar: 'Calendario Eco.',
    news: 'Noticias',
    history: 'Historial',
    learning: 'Aprender',
    pricing: 'Precios',
    about: 'Sobre Nosotros',
    admin: 'Admin',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Servicio',
    simulator: 'Simulador',
  },
};

export function SidebarNav({
  className,
  lang,
  ...props
}: React.HTMLAttributes<HTMLElement> & { lang: 'en' | 'ar' | 'es' }) {
  const pathname = usePathname();
  const t = translations[lang] || translations.en;

  const mainRoutes = [
    { href: `/dashboard`, label: t.dashboard, icon: Home },
    { href: `/dashboard/marche`, label: t.market, icon: BarChart2 },
    { href: `/dashboard/economic-calendar`, label: t.economicCalendar, icon: Calendar },
    { href: `/dashboard/news`, label: t.news, icon: Newspaper },
    { href: `/dashboard/history`, label: t.history, icon: History },
    { href: `/dashboard/simulator`, label: t.simulator, icon: CandlestickChart },
    { href: `/dashboard/learning`, label: t.learning, icon: BookOpen },
    { href: `/dashboard/pricing`, label: t.pricing, icon: DollarSign },
  ];

  const secondaryRoutes = [
    { href: `/dashboard/about`, label: t.about, icon: Info },
  ];

  const renderLink = (route: { href: string; label: string; icon: React.ElementType }) => (
    <Link
      key={route.href}
      href={`${route.href}?lang=${lang}`}
      className={cn(
        'flex items-center gap-4 rounded-lg px-4 py-3 text-base font-semibold text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        pathname === route.href && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground'
      )}
    >
      <route.icon className="h-5 w-5" />
      {route.label}
    </Link>
  );

  return (
    <nav
      className={cn('flex flex-col gap-1', className)}
      {...props}
    >
      {mainRoutes.map(renderLink)}
      <div className="my-2 border-t border-sidebar-border/50" />
      {secondaryRoutes.map(renderLink)}
    </nav>
  );
}
