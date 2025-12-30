'use client';

import React, { useEffect, useRef, memo } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, CandlestickSeries, Time } from 'lightweight-charts';

interface LightweightChartProps {
    symbol: string;
    interval: string; // e.g., '1m', '15m', '1h', '4h', '1d'
    positions: any[];
    selectedPositionId?: number | string | null;
    theme?: 'light' | 'dark';
}

function LightweightChart({ symbol, interval, positions, selectedPositionId, theme = 'dark' }: LightweightChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<IChartApi | null>(null);
    const seriesInstance = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const linesRef = useRef<any[]>([]);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const isDark = theme === 'dark';

        // Create Chart Instance
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: isDark ? '#09090b' : '#ffffff' },
                textColor: isDark ? '#d1d5db' : '#1f2937',
            },
            grid: {
                vertLines: { color: isDark ? 'rgba(42, 46, 57, 0.2)' : 'rgba(209, 213, 219, 0.5)' },
                horzLines: { color: isDark ? 'rgba(42, 46, 57, 0.2)' : 'rgba(209, 213, 219, 0.5)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });

        chartInstance.current = chart;
        seriesInstance.current = candlestickSeries;

        // Fetch Historical Data
        fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=200`)
            .then(res => res.json())
            .then(data => {
                const candleData = data.map((d: any) => ({
                    time: (d[0] / 1000) as Time,
                    open: parseFloat(d[1]),
                    high: parseFloat(d[2]),
                    low: parseFloat(d[3]),
                    close: parseFloat(d[4]),
                }));
                candlestickSeries.setData(candleData);
            });

        // WebSocket for Live Updates
        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@kline_${interval}`);
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const kline = message.k;
            candlestickSeries.update({
                time: (kline.t / 1000) as Time,
                open: parseFloat(kline.o),
                high: parseFloat(kline.h),
                low: parseFloat(kline.l),
                close: parseFloat(kline.c),
            });
        };

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            ws.close();
            chart.remove();
        };
    }, [symbol, interval]); // Re-run when symbol or interval changes

    // Update Position Lines
    useEffect(() => {
        if (!seriesInstance.current) return;

        // Clear old lines
        // Note: Lightweight charts price lines must be managed by the series
        // We actually need to remove old lines first. Since the API doesn't list them easily,
        // we keep track of them in linesRef.
        linesRef.current.forEach(line => seriesInstance.current?.removePriceLine(line));
        linesRef.current = [];

        // Add new lines for each active position
        positions.forEach(pos => {
            const isSelected = pos.id === selectedPositionId;
            const isLong = pos.type === 'LONG';

            // Professional persistent colors
            const entryColor = '#3b82f6'; // Persistent Blue
            const slColor = '#ef4444';    // Persistent Red
            const tpColor = '#22c55e';    // Persistent Green

            // Entry Line
            const priceLine = seriesInstance.current?.createPriceLine({
                price: pos.entryPrice,
                color: entryColor,
                lineWidth: isSelected ? 2 : 1,
                lineStyle: isSelected ? 0 : 2, // Solid if selected, Dashed if not
                axisLabelVisible: true,
                title: `${isLong ? 'Buy' : 'Sell'} ${pos.lotSize} ${isSelected ? `(${Math.round(pos.pnl)}$)` : ''}`,
            });
            if (priceLine) linesRef.current.push(priceLine);

            // Stop Loss Line
            if (pos.sl) {
                const slLine = seriesInstance.current?.createPriceLine({
                    price: pos.sl,
                    color: slColor,
                    lineWidth: 1,
                    lineStyle: 3, // Dotted
                    axisLabelVisible: true,
                    title: 'SL',
                });
                if (slLine) linesRef.current.push(slLine);
            }

            // Take Profit Line
            if (pos.tp) {
                const tpLine = seriesInstance.current?.createPriceLine({
                    price: pos.tp,
                    color: tpColor,
                    lineWidth: 1,
                    lineStyle: 3, // Dotted
                    axisLabelVisible: true,
                    title: 'TP',
                });
                if (tpLine) linesRef.current.push(tpLine);
            }
        });

    }, [positions, selectedPositionId, symbol, interval, theme]);

    return (
        <div ref={chartContainerRef} className="w-full h-full" />
    );
}

export default memo(LightweightChart);
