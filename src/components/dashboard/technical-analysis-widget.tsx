'use client';
import React, { useEffect, useRef, memo } from 'react';

type Theme = 'light' | 'dark';

function TechnicalAnalysisWidget({ theme = 'dark' }: { theme?: Theme }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      // Clear the container before appending the script
      container.current.innerHTML = '';
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "colorTheme": "${theme}",
          "displayMode": "single",
          "isTransparent": false,
          "locale": "en",
          "interval": "1m",
          "disableInterval": false,
          "width": "100%",
          "height": "99%",
          "symbol": "OANDA:XAUUSD",
          "showIntervalTabs": true
        }`;
      container.current.appendChild(script);

      return () => {
        if (container.current) {
            try {
              container.current.innerHTML = "";
            } catch (e) {
                // ignore
            }
        }
      }
    },
    [theme]
  );

  return (
    <div className="tradingview-widget-container h-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  );
}

export default memo(TechnicalAnalysisWidget);
