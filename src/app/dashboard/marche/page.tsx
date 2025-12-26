'use client';

import { useState, useEffect } from 'react';
import TradingViewWidget from "@/components/dashboard/tradingview-widget";

type Theme = 'light' | 'dark';

export default function MarchePage() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(currentTheme);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col gap-8">
        <div className="flex-1 min-h-[70vh]">
            <TradingViewWidget theme={theme} />
        </div>
    </div>
  );
}
