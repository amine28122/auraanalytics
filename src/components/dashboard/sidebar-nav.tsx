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
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRadar } from '@/context/radar-context';

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
    radar: 'Aura Radar',
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
    radar: 'رادار أورا',
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
    radar: 'Radar Aura',
  },
};

export function SidebarNav({
  className,
  lang,
  isCollapsed = false,
  ...props
}: React.HTMLAttributes<HTMLElement> & { lang: 'en' | 'ar' | 'es'; isCollapsed?: boolean }) {
  const pathname = usePathname();
  const t = translations[lang] || translations.en;

  const mainRoutes = [
    { href: `/dashboard`, label: t.dashboard, icon: Home },
    { href: `/dashboard/marche`, label: t.market, icon: BarChart2 },
    { href: `/dashboard/economic-calendar`, label: t.economicCalendar, icon: Calendar },
    { href: `/dashboard/news`, label: t.news, icon: Newspaper },
    { href: `/dashboard/history`, label: t.history, icon: History },
    { href: `/dashboard/simulator`, label: t.simulator, icon: CandlestickChart },
    { href: `/dashboard/radar`, label: t.radar, icon: Target },
    { href: `/dashboard/learning`, label: t.learning, icon: BookOpen },
    { href: `/dashboard/pricing`, label: t.pricing, icon: DollarSign },
  ];

  const secondaryRoutes = [
    { href: `/dashboard/about`, label: t.about, icon: Info },
  ];

  const { signalsCount } = useRadar();

  const renderLink = (route: { href: string; label: string; icon: React.ElementType }) => (
    <Link
      key={route.href}
      href={`${route.href}?lang=${lang}`}
      className={cn(
        'flex items-center rounded-lg px-4 py-3 text-base font-semibold text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group relative',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        pathname === route.href && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground',
        isCollapsed ? 'justify-center' : 'gap-4'
      )}
      title={isCollapsed ? route.label : undefined}
    >
      <route.icon className="h-5 w-5" />
      {!isCollapsed && (
        <>
          <span className="flex-1">{route.label}</span>

          {/* شارة التنبيهات للرادار */}
          {route.href === '/dashboard/radar' && signalsCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
              {signalsCount > 9 ? '9+' : signalsCount}
            </span>
          )}
        </>
      )}

      {/* Badge for collapsed mode */}
      {isCollapsed && route.href === '/dashboard/radar' && signalsCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[8px] font-bold text-white">
          {signalsCount > 9 ? '9' : signalsCount}
        </span>
      )}
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
