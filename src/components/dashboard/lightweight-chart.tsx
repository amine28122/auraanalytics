'use client';

import React, { useEffect, useRef, memo, useState } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, CandlestickSeries, AreaSeries, LineSeries, Time } from 'lightweight-charts';

interface LightweightChartProps {
    symbol: string;
    interval: string; // e.g., '1m', '15m', '1h', '4h', '1d'
    positions: any[];
    selectedPositionId?: number | string | null;
    theme?: 'light' | 'dark';
    markers?: any[];
    extraLines?: { price: number; color: string; title: string }[]; // Institutional Levels
    predictionPath?: { time: number; value: number }[]; // Futuristic Path
    liquidityBands?: { upper: any[], lower: any[] }; // Dynamic Reversal Bands
    showAuraIndicator?: boolean;
    onUpdatePosition?: (id: string | number, updates: { sl?: number | null, tp?: number | null }) => void;
}

function LightweightChart({ symbol, interval, positions, selectedPositionId, theme = 'dark', markers = [], extraLines = [], predictionPath = [], liquidityBands = { upper: [], lower: [] }, showAuraIndicator = false, onUpdatePosition }: LightweightChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<IChartApi | null>(null);
    const [series, setSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const linesRef = useRef<any[]>([]);
    const ema20Ref = useRef<any>(null);
    const ema50Ref = useRef<any>(null);
    const ema200Ref = useRef<any>(null);
    const bbUpperRef = useRef<any>(null);
    const bbLowerRef = useRef<any>(null);
    const predictionRef = useRef<any>(null);
    const dragInfo = useRef<{ id: string | number, type: 'sl' | 'tp' | 'auto', initialPrice?: number } | null>(null);

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

        // Fetch Historical Data - Increased to 1000 for deep history
        fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=1000`)
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
            const update = {
                time: (kline.t / 1000) as Time,
                open: parseFloat(kline.o),
                high: parseFloat(kline.h),
                low: parseFloat(kline.l),
                close: parseFloat(kline.c),
            };
            candlestickSeries.update(update);
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

            // If both targets are at entry (unset), use 'auto' to decide based on direction
            if (!pos.sl && !pos.tp && slCoord !== null && Math.abs(y - slCoord) < threshold) {
                dragInfo.current = { id: pos.id, type: 'auto', initialPrice: pos.entryPrice };
                chart.applyOptions({ handleScroll: false, handleScale: false });
                return;
            }

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
            const pos = positionsRef.current.find((p: any) => p.id === dragInfo.current?.id);
            if (!pos) return;

            let lineType = dragInfo.current.type;

            // Auto-detect SL vs TP based on direction and position type
            if (lineType === 'auto') {
                const isLong = pos.type === 'LONG';
                const isAbove = price > pos.entryPrice;
                if (isLong) {
                    lineType = isAbove ? 'tp' : 'sl';
                } else {
                    lineType = isAbove ? 'sl' : 'tp';
                }

                // Keep 'ghost' lines at entry visually unless it's the one we are dragging
                linesRef.current.forEach((l: any) => {
                    if (l.__posId === pos.id && (l.__type === 'sl' || l.__type === 'tp')) {
                        if (l.__type === lineType) {
                            l.applyOptions({ price: price });
                        } else if (!pos[l.__type]) {
                            l.applyOptions({ price: pos.entryPrice });
                        }
                    }
                });
            }

            const targetLine = linesRef.current.find((l: any) => l.__type === lineType && l.__posId === dragInfo.current?.id);

            if (targetLine) {
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
                if (pos) {
                    let finalType = dragInfo.current.type as 'sl' | 'tp';

                    if (dragInfo.current.type === 'auto') {
                        const isLong = pos.type === 'LONG';
                        const isAbove = price > pos.entryPrice;
                        if (isLong) {
                            finalType = isAbove ? 'tp' : 'sl';
                        } else {
                            finalType = isAbove ? 'sl' : 'tp';
                        }
                    }

                    // Only save if it's actually moved from entry
                    if (Math.abs(price - pos.entryPrice) > (pos.entryPrice * 0.0001)) {
                        onUpdatePositionRef.current(dragInfo.current.id, {
                            [finalType]: price
                        });
                    }
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
            chartInstance.current = null;
            // Clear indicator refs as they belong to the destroyed chart
            [ema20Ref, ema50Ref, ema200Ref, bbUpperRef, bbLowerRef].forEach(ref => {
                ref.current = null;
            });
        };
    }, [symbol, interval, theme]); // Keep dependencies minimal for chart recreation

    // Update Position Lines & Extra Lines
    useEffect(() => {
        if (!series) return;

        // Clear old lines
        linesRef.current.forEach(line => series.removePriceLine(line));
        linesRef.current = [];

        // 1. Draw Position Lines
        positions.forEach(pos => {
            const isSelected = pos.id === selectedPositionId;
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
                title: `${pos.type === 'LONG' ? 'Buy' : 'Sell'} ${pos.lotSize} ${isSelected ? `(${Math.round(pos.pnl)}$)` : ''}`,
            }) as any;
            if (priceLine) {
                priceLine.__type = 'entry';
                priceLine.__posId = pos.id;
                linesRef.current.push(priceLine);
            }

            // Stop Loss Line
            const slPrice = pos.sl || (isSelected ? pos.entryPrice : null);
            if (slPrice) {
                const slLine = series.createPriceLine({
                    price: slPrice,
                    color: pos.sl ? slColor : `${slColor}44`,
                    lineWidth: 1,
                    lineStyle: 3,
                    axisLabelVisible: isSelected && !!pos.sl,
                    title: isSelected ? (pos.sl ? 'SL' : 'Set SL') : '',
                }) as any;
                if (slLine) {
                    slLine.__type = 'sl';
                    slLine.__posId = pos.id;
                    linesRef.current.push(slLine);
                }
            }

            // Take Profit Line
            const tpPrice = pos.tp || (isSelected ? pos.entryPrice : null);
            if (tpPrice) {
                const tpLine = series.createPriceLine({
                    price: tpPrice,
                    color: pos.tp ? tpColor : `${tpColor}44`,
                    lineWidth: 1,
                    lineStyle: 3,
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

        // 2. Draw Institutional Levels (Extra Lines)
        extraLines.forEach(line => {
            const pl = series.createPriceLine({
                price: line.price,
                color: line.color,
                lineWidth: 2,
                lineStyle: 0, // Solid
                title: line.title,
                axisLabelVisible: true,
            }) as any;
            if (pl) {
                pl.__type = 'extra';
                linesRef.current.push(pl);
            }
        });

    }, [positions, selectedPositionId, symbol, series, extraLines]);

    // Update Markers (Signals)
    useEffect(() => {
        let isMounted = true;
        if (series) {
            try {
                // EMA Calculation Function
                const calculateEMA = (data: any[], period: number) => {
                    const k = 2 / (period + 1);
                    let emaData = [];
                    let prevEma = data[0].close;

                    for (let i = 0; i < data.length; i++) {
                        const ema = (data[i].close - prevEma) * k + prevEma;
                        emaData.push({ time: data[i].time, value: ema });
                        prevEma = ema;
                    }
                    return emaData;
                };

                // Bollinger Bands Calculation
                const calculateBB = (data: any[], period: number, stdDev: number) => {
                    let bbData = { upper: [] as any[], middle: [] as any[], lower: [] as any[] };
                    for (let i = period - 1; i < data.length; i++) {
                        const slice = data.slice(i - period + 1, i + 1);
                        const mean = slice.reduce((a, b) => a + b.close, 0) / period;
                        const variance = slice.reduce((a, b) => a + Math.pow(b.close - mean, 2), 0) / period;
                        const sd = Math.sqrt(variance);
                        bbData.upper.push({ time: data[i].time, value: mean + (stdDev * sd) });
                        bbData.middle.push({ time: data[i].time, value: mean });
                        bbData.lower.push({ time: data[i].time, value: mean - (stdDev * sd) });
                    }
                    return bbData;
                };

                fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=1000`)
                    .then(res => res.json())
                    .then(data => {
                        if (!isMounted) return;
                        const candleData = data.map((d: any) => ({
                            time: (d[0] / 1000) as Time,
                            close: parseFloat(d[4]),
                        }));

                        const chart = chartInstance.current;
                        if (!chart) return;

                        // Only remove if they belong to the current chartInstance
                        [ema20Ref, ema50Ref, ema200Ref, bbUpperRef, bbLowerRef, predictionRef].forEach(ref => {
                            if (ref.current) {
                                try {
                                    chart.removeSeries(ref.current);
                                } catch (err) {
                                    console.warn("Could not remove series:", err);
                                }
                                ref.current = null;
                            }
                        });

                        if (!showAuraIndicator) return;

                        const ema20Data = calculateEMA(candleData, 20);
                        const ema50Data = calculateEMA(candleData, 50);
                        const ema200Data = calculateEMA(candleData, 200);

                        // Render Institutional Liquidity Envelopes (The "Two Lines")
                        if (liquidityBands.upper.length > 0) {
                            bbUpperRef.current = chart.addSeries(LineSeries, {
                                color: '#ef4444',
                                lineWidth: 2,
                                lineStyle: 0,
                                title: 'LIQUIDITY CEILING (REVERSAL ZONE)',
                            });
                            bbUpperRef.current.setData(liquidityBands.upper);

                            bbLowerRef.current = chart.addSeries(LineSeries, {
                                color: '#22c55e',
                                lineWidth: 2,
                                lineStyle: 0,
                                title: 'LIQUIDITY FLOOR (REVERSAL ZONE)',
                            });
                            bbLowerRef.current.setData(liquidityBands.lower);
                        }

                        // Futuristic Prediction Path (Projected Trajectory)
                        if (predictionPath.length > 0) {
                            predictionRef.current = chart.addSeries(LineSeries, {
                                color: '#00f2ff', // Vibrant Cyan
                                lineWidth: 4,
                                lineStyle: 0, // Solid
                                title: 'INSTITUTIONAL ROAD',
                                lastValueVisible: true,
                                priceLineVisible: false,
                            });
                            predictionRef.current.setData(predictionPath);
                        }
                        // Render EMA Ribbon
                        ema20Ref.current = chart.addSeries(AreaSeries, {
                            lineColor: '#3b82f6',
                            topColor: 'rgba(59, 130, 246, 0.1)',
                            bottomColor: 'rgba(59, 130, 246, 0.0)',
                            lineWidth: 2,
                            title: 'EMA 20',
                        });
                        ema20Ref.current.setData(ema20Data);

                        ema50Ref.current = chart.addSeries(LineSeries, {
                            color: '#8b5cf6',
                            lineWidth: 2,
                            title: 'EMA 50',
                        });
                        ema50Ref.current.setData(ema50Data);

                        ema200Ref.current = chart.addSeries(LineSeries, {
                            color: '#f59e0b',
                            lineWidth: 2,
                            lineStyle: 2,
                            title: 'EMA 200',
                        });
                        ema200Ref.current.setData(ema200Data);

                    });

                const s = series as any;
                if (typeof s.setMarkers === 'function') {
                    s.setMarkers(showAuraIndicator ? markers : []);
                }
            } catch (e) {
                console.warn("Failed to set markers:", e);
            }
        }
        return () => { isMounted = false; };
    }, [series, markers, symbol, interval, showAuraIndicator, predictionPath]);

    return (
        <div ref={chartContainerRef} className="w-full h-full relative" />
    );
}

export default memo(LightweightChart);
