'use client';
import React from 'react';

type TradingViewWidgetProps = {
  theme?: 'light' | 'dark';
};

function TradingViewWidget({ theme = 'dark' }: TradingViewWidgetProps) {
  const src = `/tradingview.html?theme=${theme}`;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <iframe
        src={src}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="TradingView Chart"
        allow="autoplay"
      />
    </div>
  );
}

export default React.memo(TradingViewWidget);