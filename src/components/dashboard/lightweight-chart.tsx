'use client';

import React, { useEffect, useRef, memo, useState } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, CandlestickSeries, Time } from 'lightweight-charts';

interface LightweightChartProps {
    symbol: string;
    interval: string; // e.g., '1m', '15m', '1h', '4h', '1d'
    positions: any[];
    selectedPositionId?: number | string | null;
    theme?: 'light' | 'dark';
    onUpdatePosition?: (id: string | number, updates: { sl?: number | null, tp?: number | null }) => void;
}

function LightweightChart({ symbol, interval, positions, selectedPositionId, theme = 'dark', onUpdatePosition }: LightweightChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<IChartApi | null>(null);
    const [series, setSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const linesRef = useRef<any[]>([]);
    const dragInfo = useRef<{ id: string | number, type: 'sl' | 'tp' } | null>(null);

    // Refs to avoid chart recreation while allowing access to latest props in event listeners
    const positionsRef = useRef(positions);
    const selectedPositionIdRef = useRef(selectedPositionId);
    const onUpdatePositionRef = useRef(onUpdatePosition);

    useEffect(() => {
        positionsRef.current = positions;
        selectedPositionIdRef.current = selectedPositionId;
        onUpdatePositionRef.current = onUpdatePosition;
    }, [positions, selectedPositionId, onUpdatePosition]);

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
        seriesRef.current = candlestickSeries;
        setSeries(candlestickSeries);

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

        // Dragging Logic
        const handleMouseDown = (e: MouseEvent) => {
            // Use refs for stable access in event listeners
            if (!selectedPositionIdRef.current || !seriesRef.current || !chartContainerRef.current) return;
            const seriesInstance = seriesRef.current;
            const pos = positionsRef.current.find((p: any) => p.id === selectedPositionIdRef.current);
            if (!pos || pos.symbol !== `${symbol}/USDT`) return;

            const rect = chartContainerRef.current.getBoundingClientRect();
            const y = e.clientY - rect.top;

            // Ghost lines are exactly at entry price if not set
            const slPrice = pos.sl || pos.entryPrice;
            const tpPrice = pos.tp || pos.entryPrice;

            const slCoord = seriesInstance.priceToCoordinate(slPrice);
            const tpCoord = seriesInstance.priceToCoordinate(tpPrice);

            const threshold = 15;
            if (slCoord !== null && Math.abs(y - slCoord) < threshold) {
                dragInfo.current = { id: pos.id, type: 'sl' };
                chart.applyOptions({ handleScroll: false, handleScale: false });
            } else if (tpCoord !== null && Math.abs(y - tpCoord) < threshold) {
                dragInfo.current = { id: pos.id, type: 'tp' };
                chart.applyOptions({ handleScroll: false, handleScale: false });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!dragInfo.current || !seriesRef.current || !chartContainerRef.current) return;
            const seriesInstance = seriesRef.current;
            const rect = chartContainerRef.current.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const price = seriesInstance.coordinateToPrice(y);
            if (price === null) return;

            // Find the line and update visually
            const lineType = dragInfo.current.type;
            const targetLine = linesRef.current.find((l: any) => l.__type === lineType && l.__posId === dragInfo.current?.id);
            const pos = positionsRef.current.find((p: any) => p.id === dragInfo.current?.id);

            if (targetLine && pos) {
                const diff = price - pos.entryPrice;
                const projectedPnl = pos.type === 'LONG' ? diff * pos.lotSize : -diff * pos.lotSize;
                const pnlText = projectedPnl >= 0 ? `+${projectedPnl.toFixed(2)}$` : `${projectedPnl.toFixed(2)}$`;

                targetLine.applyOptions({
                    price: price,
                    title: `${lineType.toUpperCase()} (${pnlText})`,
                    color: lineType === 'sl' ? '#ef4444' : '#22c55e'
                });
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (!dragInfo.current || !seriesRef.current || !chartContainerRef.current) return;
            const seriesInstance = seriesRef.current;
            const rect = chartContainerRef.current.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const price = seriesInstance.coordinateToPrice(y);

            // Use ref for onUpdatePosition
            if (price !== null && onUpdatePositionRef.current) {
                const pos = positionsRef.current.find((p: any) => p.id === dragInfo.current?.id);
                // Only save if it's actually moved from entry
                if (pos && Math.abs(price - pos.entryPrice) > (pos.entryPrice * 0.0001)) {
                    onUpdatePositionRef.current(dragInfo.current.id, {
                        [dragInfo.current.type]: price
                    });
                }
            }

            dragInfo.current = null;
            chart.applyOptions({ handleScroll: true, handleScale: true });
        };

        const container = chartContainerRef.current;

        const updateCursor = (e: MouseEvent) => {
            if (!selectedPositionIdRef.current || !seriesRef.current || !container) return;
            const seriesInstance = seriesRef.current;
            const pos = positionsRef.current.find((p: any) => p.id === selectedPositionIdRef.current);
            if (!pos || pos.symbol !== `${symbol}/USDT`) {
                container.style.cursor = 'default';
                return;
            }

            const rect = container.getBoundingClientRect();
            const y = e.clientY - rect.top;

            // Use effective prices for cursor detection too
            const slPrice = pos.sl || pos.entryPrice;
            const tpPrice = pos.tp || pos.entryPrice;

            const slCoord = seriesInstance.priceToCoordinate(slPrice);
            const tpCoord = seriesInstance.priceToCoordinate(tpPrice);

            const threshold = 10;
            if ((slCoord !== null && Math.abs(y - slCoord) < threshold) ||
                (tpCoord !== null && Math.abs(y - tpCoord) < threshold)) {
                container.style.cursor = 'ns-resize';
            } else {
                container.style.cursor = 'default';
            }
        };

        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mousemove', updateCursor);
        window.addEventListener('mouseup', handleMouseUp);

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('mousemove', updateCursor);
            window.removeEventListener('resize', handleResize);
            ws.close();
            chart.remove();
        };
    }, [symbol, interval, theme]); // Keep dependencies minimal for chart recreation

    // Update Position Lines
    useEffect(() => {
        if (!series) return;

        // Clear old lines
        linesRef.current.forEach(line => series.removePriceLine(line));
        linesRef.current = [];

        // Add new lines for each active position
        positions.forEach(pos => {
            const isSelected = pos.id === selectedPositionId;
            const isLong = pos.type === 'LONG';
            if (pos.symbol !== `${symbol}/USDT`) return; // Only show for current symbol

            // Professional persistent colors
            const entryColor = '#3b82f6'; // Persistent Blue
            const slColor = '#ef4444';    // Persistent Red
            const tpColor = '#22c55e';    // Persistent Green

            // Entry Line
            const priceLine = series.createPriceLine({
                price: pos.entryPrice,
                color: entryColor,
                lineWidth: isSelected ? 2 : 1,
                lineStyle: isSelected ? 0 : 2, // Solid if selected, Dashed if not
                axisLabelVisible: true,
                title: `${isLong ? 'Buy' : 'Sell'} ${pos.lotSize} ${isSelected ? `(${Math.round(pos.pnl)}$)` : ''}`,
            }) as any;
            if (priceLine) {
                priceLine.__type = 'entry';
                priceLine.__posId = pos.id;
                linesRef.current.push(priceLine);
            }

            // Stop Loss Line (Always show for selected, exactly at entry if not set)
            const slPrice = pos.sl || (isSelected ? pos.entryPrice : null);
            if (slPrice) {
                const slLine = series.createPriceLine({
                    price: slPrice,
                    color: pos.sl ? slColor : `${slColor}44`, // Faint if at entry
                    lineWidth: 1,
                    lineStyle: 3, // Dotted
                    axisLabelVisible: isSelected && !!pos.sl,
                    title: isSelected ? (pos.sl ? 'SL' : 'Set SL') : '',
                }) as any;
                if (slLine) {
                    slLine.__type = 'sl';
                    slLine.__posId = pos.id;
                    linesRef.current.push(slLine);
                }
            }

            // Take Profit Line (Always show for selected, exactly at entry if not set)
            const tpPrice = pos.tp || (isSelected ? pos.entryPrice : null);
            if (tpPrice) {
                const tpLine = series.createPriceLine({
                    price: tpPrice,
                    color: pos.tp ? tpColor : `${tpColor}44`, // Faded if ghost
                    lineWidth: 1,
                    lineStyle: 3, // Dotted
                    axisLabelVisible: isSelected && !!pos.tp,
                    title: isSelected ? (pos.tp ? 'TP' : 'Set TP') : '',
                }) as any;
                if (tpLine) {
                    tpLine.__type = 'tp';
                    tpLine.__posId = pos.id;
                    linesRef.current.push(tpLine);
                }
            }
        });

    }, [positions, selectedPositionId, symbol, series]);

    return (
        <div ref={chartContainerRef} className="w-full h-full relative" />
    );
}

export default memo(LightweightChart);
