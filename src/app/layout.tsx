import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { WhatsAppButton } from '@/components/WhatsAppButton';

// IMPORTANT: Replace with your actual production URL
const AURA_APP_URL = new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.auraanalyticspro.com');

export const metadata: Metadata = {
  metadataBase: AURA_APP_URL,
  title: {
    default: 'AURA | Institutional Grade Trade Signal Analysis',
    template: '%s | AURA'
  },
  description: 'Master the markets with AURA. Advanced schools trade signals using Elliott Wave Theory, ICT concepts, and Fibonacci levels. Unlock professional technical analysis for Crypto, Forex, and Stocks. استمتع بأفضل إشارات التداول والتحليل الفني المؤسساتي.',
  keywords: [
    'trade signals', 'crypto analysis', 'forex signals', 'Elliott Wave Theory', 'ICT trading', 'technical analysis', 'Advanced Schools', 'AURA analytics', 'financial markets',
    'إشارات تداول', 'تحليل فني', 'سوق الكريبتو', 'فوركس', 'مدارس متقدمة', 'تحليل الأسواق', 'تداول العملات الرقمية'
  ],
  authors: [{ name: 'AURA Team' }],
  creator: 'AURA Analytics',
  publisher: 'AURA Analytics',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/ico.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/ico.png' },
    ],
    shortcut: ['/favicon.svg'],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'AURA | Advanced Trade Signal Analysis',
    description: 'Empowering traders with institutional-grade technical analysis and actionable trade signals. تحليل فني مؤسساتي متقدم.',
    url: AURA_APP_URL.toString(),
    siteName: 'AURA Analytics',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AURA Analytics Platform Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURA | Advanced Trade Signal Analysis',
    description: 'Empowering traders with institutional-grade technical analysis and actionable trade signals.',
    creator: '@aura_analytics',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'wroXjZruNWdxhL2KNmHUSmVGQJ6H-jXL0-D_TOrgIb4',
    other: {
      'msvalidate.01': 'B71F7713A9EF4C86EAB6D034A9189795',
    }
  },
  alternates: {
    canonical: AURA_APP_URL.toString(),
    languages: {
      'en-US': '/en',
      'ar-SA': '/ar',
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#7C3AED',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ezoic Privacy Scripts */}
        <script data-cfasync="false" src="https://cmp.gatekeeperconsent.com/min.js" />
        <script data-cfasync="false" src="https://the.gatekeeperconsent.com/cmp.min.js" />

        {/* Ezoic Header Script */}
        <script async src="//www.ezojs.com/ezoic/sa.min.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
            `,
          }}
        />
        <script src="//ezoicanalytics.com/analytics.js" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }

                // Capture Referral Code
                try {
                  var urlParams = new URLSearchParams(window.location.search);
                  var ref = urlParams.get('ref');
                  if (ref) {
                    sessionStorage.setItem('aura_ref', ref);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Cairo:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <Toaster />
            <WhatsAppButton />
          </ThemeProvider>
        </LanguageProvider>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-26JEWQ7ZDV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-26JEWQ7ZDV');
          `}
        </Script>

      </body>
    </html>
  );
}
