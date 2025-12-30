'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbol = 'GOLD', theme = 'dark' }: { symbol?: string, theme?: 'light' | 'dark' }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // Logic for symbol: If it's GOLD, use TVC:GOLD. If others, use BINANCE:SYMBOLUSDT
    const finalSymbol = symbol === 'GOLD' ? 'TVC:GOLD' : `BINANCE:${symbol}USDT`;

    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": finalSymbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });
    container.current.appendChild(script);
  }, [symbol, theme]); // Re-run when symbol or theme changes

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}

export default memo(TradingViewWidget);