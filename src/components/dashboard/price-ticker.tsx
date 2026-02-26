'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─── Symbols to track ─────────────────────────────────────────────────────────
const SYMBOLS = [
    { stream: 'btcusdt', label: 'BTC/USDT', decimals: 2, emoji: '₿' },
    { stream: 'ethusdt', label: 'ETH/USDT', decimals: 2, emoji: 'Ξ' },
    { stream: 'solusdt', label: 'SOL/USDT', decimals: 3, emoji: '◎' },
    { stream: 'xrpusdt', label: 'XRP/USDT', decimals: 4, emoji: '✕' },
    { stream: 'bnbusdt', label: 'BNB/USDT', decimals: 2, emoji: 'B' },
    { stream: 'xauusdt', label: 'XAU/USDT', decimals: 2, emoji: '🥇' },
    { stream: 'eurusdt', label: 'EUR/USD', decimals: 4, emoji: '€' },
    { stream: 'gbpusdt', label: 'GBP/USD', decimals: 4, emoji: '£' },
];

type TickerData = {
    price: string;
    change: number;    // 24h % change
    high: string;
    low: string;
    flash: 'up' | 'down' | null;
};

type TickerMap = Record<string, TickerData>;

// ─── Single item ──────────────────────────────────────────────────────────────

function TickerItem({ symbol, data }: { symbol: typeof SYMBOLS[number]; data: TickerData | undefined }) {
    if (!data) {
        return (
            <div className="flex items-center gap-2 px-4 py-1.5 flex-shrink-0">
                <span className="text-xs font-mono text-muted-foreground/40 animate-pulse">
                    {symbol.label} ···
                </span>
            </div>
        );
    }

    const isUp = data.change > 0;
    const isDown = data.change < 0;
    const priceColor =
        data.flash === 'up' ? 'text-emerald-400' :
            data.flash === 'down' ? 'text-red-400' :
                isUp ? 'text-emerald-400' :
                    isDown ? 'text-red-400' :
                        'text-foreground';

    const changeColor = isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-muted-foreground';

    return (
        <div className="flex items-center gap-2 px-4 border-r border-border/30 flex-shrink-0 py-1">
            {/* Label */}
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 select-none">
                {symbol.label}
            </span>

            {/* Price */}
            <span
                className={`text-xs font-mono font-black tabular-nums transition-colors duration-300 ${priceColor}`}
            >
                {parseFloat(data.price).toLocaleString('en-US', {
                    minimumFractionDigits: symbol.decimals,
                    maximumFractionDigits: symbol.decimals,
                })}
            </span>

            {/* Change % */}
            <span className={`flex items-center gap-0.5 text-[10px] font-bold ${changeColor}`}>
                {isUp ? (
                    <TrendingUp className="h-2.5 w-2.5" />
                ) : isDown ? (
                    <TrendingDown className="h-2.5 w-2.5" />
                ) : (
                    <Minus className="h-2.5 w-2.5" />
                )}
                {isUp ? '+' : ''}{data.change.toFixed(2)}%
            </span>
        </div>
    );
}

// ─── Main ticker ──────────────────────────────────────────────────────────────

export function PriceTicker() {
    const [tickers, setTickers] = useState<TickerMap>({});
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const connect = () => {
        // Combined stream URL — all tickers in one WS connection
        const streams = SYMBOLS.map(s => `${s.stream}@ticker`).join('/');
        const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                const d = msg.data;
                if (!d) return;

                const symbol = d.s?.toLowerCase().replace('usdt', '');
                if (!symbol) return;

                setTickers(prev => {
                    const prevPrice = prev[d.s]?.price;
                    const newPrice = d.c;
                    const flash: 'up' | 'down' | null =
                        prevPrice === undefined ? null :
                            parseFloat(newPrice) > parseFloat(prevPrice) ? 'up' :
                                parseFloat(newPrice) < parseFloat(prevPrice) ? 'down' : null;

                    return {
                        ...prev,
                        [d.s]: {
                            price: d.c,
                            change: parseFloat(d.P),
                            high: d.h,
                            low: d.l,
                            flash,
                        },
                    };
                });

                // Clear flash after 600ms
                if (d.s) {
                    setTimeout(() => {
                        setTickers(prev => prev[d.s]
                            ? { ...prev, [d.s]: { ...prev[d.s], flash: null } }
                            : prev
                        );
                    }, 600);
                }
            } catch { /* ignore parse errors */ }
        };

        ws.onerror = () => ws.close();

        ws.onclose = () => {
            // Auto-reconnect after 3 seconds
            reconnectRef.current = setTimeout(() => {
                if (wsRef.current?.readyState !== WebSocket.OPEN) {
                    connect();
                }
            }, 3000);
        };
    };

    useEffect(() => {
        connect();
        return () => {
            if (reconnectRef.current) clearTimeout(reconnectRef.current);
            wsRef.current?.close();
        };
    }, []);

    // Duplicate items so the scroll loop is seamless
    const items = [...SYMBOLS, ...SYMBOLS];

    return (
        <div className="relative w-full border-b border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden flex items-center h-9">
            {/* Left fade */}
            <div className="absolute left-0 top-0 h-full w-12 z-10 bg-gradient-to-r from-card/80 to-transparent pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 h-full w-12 z-10 bg-gradient-to-l from-card/80 to-transparent pointer-events-none" />

            {/* Scrolling track */}
            <div
                className="flex items-center animate-ticker"
                style={{ willChange: 'transform' }}
            >
                {items.map((symbol, idx) => (
                    <TickerItem
                        key={`${symbol.stream}-${idx}`}
                        symbol={symbol}
                        data={tickers[symbol.stream.toUpperCase()]}
                    />
                ))}
            </div>
        </div>
    );
}
