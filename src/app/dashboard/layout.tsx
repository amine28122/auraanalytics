'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { Header } from '@/components/dashboard/header';
import { Loader2 } from 'lucide-react';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ErrorBoundary } from '@/components/error-boundary';
import { RadarProvider } from '@/context/radar-context';
import { PriceTicker } from '@/components/dashboard/price-ticker';

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Full-width Header at the top */}
      <Header />

      {/* Live Price Ticker below header */}
      <PriceTicker />

      {/* Sidebar and Main Content below Header */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main Content Area - with left margin for fixed sidebar ONLY on desktop */}
        <div className="flex flex-1 flex-col overflow-hidden ml-0 md:ml-20">
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>

          <footer className="mt-auto border-t bg-background/50 p-4 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <Link href="/dashboard/terms-of-service" className="transition-colors hover:text-foreground">
                Terms of Service
              </Link>
              <div className="h-4 w-px bg-border" />
              <Link href="/dashboard/privacy-policy" className="transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <RadarProvider>
        <Suspense
          fallback={
            <div className="flex min-h-screen w-full items-center justify-center bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </Suspense>
      </RadarProvider>
    </FirebaseClientProvider>
  );
}
