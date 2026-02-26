'use client';
import { useEffect, useRef } from 'react';
import Script from 'next/script';

type Theme = 'light' | 'dark';

interface FinancialTickerProps {
  theme?: Theme;
  isFixed?: boolean;
}

export default function FinancialTicker({ theme = 'dark', isFixed = true }: FinancialTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We need to re-render the widget when theme changes
    // This is a bit of a hack as the third-party script doesn't have a clean API for this
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Clear it
      const script = document.createElement('script');
      script.src = "https://wm.pandats.com/pts-assets-ticker/pts-assets-ticker.js";
      script.async = true;
      containerRef.current.appendChild(script);
    }
  }, [theme]);

  return (
    <div className={isFixed ? "fixed top-0 left-0 right-0 w-full z-50" : "w-full z-20 relative"}>
      <div
        ref={containerRef}
        className="pts-assets-ticker ruler"
        data-brand-slug="aura"
        data-icons="true"
        data-assets="btcusd,usdjpy,eurusd,gbpusd"
        data-link=""
        data-direction="left"
        data-speed="10"
        data-background-color={theme === 'dark' ? '#000000' : '#ffffff'}
        data-text-color={theme === 'dark' ? '#ffffff' : '#000000'}
      >
        {/* The script will be dynamically added/re-added by useEffect */}
      </div>
    </div>
  );
}
