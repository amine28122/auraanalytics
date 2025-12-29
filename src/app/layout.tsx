import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

// IMPORTANT: Replace with your actual production URL
const AURA_APP_URL = new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://auraanalytics.vercel.app');

export const metadata: Metadata = {
  metadataBase: AURA_APP_URL,
  title: {
    default: 'AURA | Institutional Grade Trade Signal Analysis',
    template: '%s | AURA'
  },
  description: 'Master the markets with AURA. Advanced AI-powered trade signals using Elliott Wave Theory, ICT concepts, and Fibonacci levels. Unlock professional technical analysis for Crypto, Forex, and Stocks.',
  keywords: ['trade signals', 'crypto analysis', 'forex signals', 'Elliott Wave Theory', 'ICT trading', 'technical analysis', 'AI trading', 'AURA analytics', 'financial markets'],
  authors: [{ name: 'AURA Team' }],
  creator: 'AURA Analytics',
  publisher: 'AURA Analytics',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'AURA | Advanced Trade Signal Analysis',
    description: 'Empowering traders with institutional-grade technical analysis and actionable trade signals.',
    url: AURA_APP_URL.toString(),
    siteName: 'AURA Analytics',
    images: [
      {
        url: '/og-image.png', // Fallback or user should provide this
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
  },
  alternates: {
    canonical: AURA_APP_URL.toString(),
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7139106139007097"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="tawk-to-script" strategy="lazyOnload">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/68bf7efe791cb1192942bd2e/1j4m0g4lv';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
