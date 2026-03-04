'use client';

import { useState, useEffect } from 'react';
import TradingViewWidget from "@/components/dashboard/tradingview-widget";
import { CorrelationSpider } from "@/components/dashboard/CorrelationSpider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, Cpu, Globe } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type Theme = 'light' | 'dark';

const popularSymbols = [
  { name: 'GOLD', symbol: 'GOLD', icon: <TrendingUp className="w-4 h-4" />, label: 'الذهب' },
  { name: 'BTC', symbol: 'BTC', icon: <Cpu className="w-4 h-4" />, label: 'بيتكوين' },
  { name: 'S&P 500', symbol: 'FOREXCOM:SPX500', icon: <Globe className="w-4 h-4" />, label: 'الأسهم الأمريكية' },
  { name: 'EUR/USD', symbol: 'FX:EURUSD', icon: <Globe className="w-4 h-4" />, label: 'اليورو/دولار' },
  { name: 'TASI', symbol: 'TADAWUL:TASI', icon: <TrendingUp className="w-4 h-4" />, label: 'سوق تاسي (مقيد)', restricted: true },
];

export default function MarchePage() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [currentSymbol, setCurrentSymbol] = useState('GOLD');
  const searchParams = useSearchParams();
  const isAr = searchParams.get('lang') === 'ar';

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
    <div className="h-full w-full flex flex-col gap-8 p-4 md:p-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Search & Feedback Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {popularSymbols.map((item) => (
            <button
              key={item.symbol}
              onClick={() => setCurrentSymbol(item.symbol)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${currentSymbol === item.symbol
                ? 'bg-primary border-primary text-primary-foreground shadow-lg'
                : 'bg-card border-border hover:border-primary/50 text-card-foreground'
                }`}
            >
              {item.icon}
              <span className="font-medium">{isAr ? item.label : item.name}</span>
              {item.restricted && (
                <Badge variant="outline" className="text-[10px] ml-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
                  {isAr ? 'مقيد' : 'Restricted'}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {currentSymbol.includes('TASI') && (
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-yellow-600 dark:text-yellow-500">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  {isAr
                    ? "سوق 'تاسي' (TASI) مقيد ولا يمكن عرضه هنا مباشرة. يمكنك مشاهدة الرسم البياني الحي كاملاً على منصة TradingView."
                    : "The 'TASI' market is restricted and cannot be displayed here directly. You can view the full live chart on TradingView."}
                </p>
              </div>
              <a
                href={`https://www.tradingview.com/symbols/${currentSymbol}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition-colors shadow-md whitespace-nowrap"
              >
                <Globe className="w-4 h-4" />
                {isAr ? "افتح في TradingView" : "Open in TradingView"}
              </a>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="h-[75vh] w-full rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
        <TradingViewWidget theme={theme} symbol={currentSymbol} />
      </div>

      <div className="grid grid-cols-1 gap-6 pb-8">
        <div className="h-[400px]">
          <CorrelationSpider />
        </div>
      </div>
    </div>
  );
}
