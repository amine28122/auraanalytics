'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Activity, Wallet, TrendingUp, TrendingDown, RefreshCcw, RotateCcw, Pencil, Loader2,
    ChevronUp, ChevronDown, ArrowUp, ArrowDown, Shield, Target, ChevronRight, History
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LightweightChart from '@/components/dashboard/lightweight-chart';
import { useAuth, useFirebase } from '@/firebase';
import {
    doc,
    onSnapshot,
    updateDoc,
    setDoc,
    collection,
    query,
    orderBy,
    limit,
    addDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function SimulatorPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [priceColor, setPriceColor] = useState<'text-green-500' | 'text-red-500'>('text-green-500');
    const [lastPrice, setLastPrice] = useState<number>(0);
    const [symbol, setSymbol] = useState<string>('BTC');

    // Load last visited symbol from LocalStorage
    useEffect(() => {
        const savedSymbol = localStorage.getItem('aura_sim_last_symbol');
        if (savedSymbol) {
            setSymbol(savedSymbol);
        }
    }, []);

    const handleSymbolChange = (newSymbol: string) => {
        setSymbol(newSymbol);
        localStorage.setItem('aura_sim_last_symbol', newSymbol);
    };

    const [positions, setPositions] = useState<any[]>([]);
    const [lotSize, setLotSize] = useState<string>('0.1');
    const [stopLoss, setStopLoss] = useState<string>('');
    const [takeProfit, setTakeProfit] = useState<string>('');
    const [interval, setInterval] = useState<string>('1d');
    const [balance, setBalance] = useState<number>(10000);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [markers, setMarkers] = useState<any[]>([]);
    const [extraLines, setExtraLines] = useState<any[]>([]);
    const [tradeSignalCard, setTradeSignalCard] = useState<any>(null);
    const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(true);

    // Sync theme with document dark mode
    useEffect(() => {
        const checkTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
        };

        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    const generateSimulationSignals = async () => {
        if (!symbol) return;
        setIsLoading(true);
        try {
            // Fetch extended historical data for accurate analysis
            const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}USDT&interval=${interval}&limit=500`);
            const data = await res.json();

            const candles = data.map((d: any) => ({
                time: d[0] / 1000,
                open: parseFloat(d[1]),
                high: parseFloat(d[2]),
                low: parseFloat(d[3]),
                close: parseFloat(d[4]),
                volume: parseFloat(d[5])
            }));

            const len = candles.length;
            const closes = candles.map((c: any) => c.close);
            const highs = candles.map((c: any) => c.high);
            const lows = candles.map((c: any) => c.low);
            const volumes = candles.map((c: any) => c.volume);

            // ========== LAYER 1: RSI Calculation ==========
            const period = 14;
            let gains = 0, losses = 0;
            for (let i = 1; i <= period; i++) {
                const diff = closes[i] - closes[i - 1];
                if (diff > 0) gains += diff; else losses -= diff;
            }
            let avgGain = gains / period;
            let avgLoss = losses / period;
            const rsiArray = [];
            for (let i = period + 1; i < closes.length; i++) {
                const diff = closes[i] - closes[i - 1];
                if (diff > 0) { avgGain = (avgGain * 13 + diff) / 14; avgLoss = (avgLoss * 13) / 14; }
                else { avgGain = (avgGain * 13) / 14; avgLoss = (avgLoss * 13 - diff) / 14; }
                const rs = avgGain / avgLoss;
                rsiArray.push(100 - (100 / (1 + rs)));
            }

            // ========== LAYER 2: Volume Analysis ==========
            const avgVolume = volumes.slice(len - 50).reduce((a: number, b: number) => a + b, 0) / 50;
            const volumeSpikes = [];
            for (let i = len - 50; i < len; i++) {
                if (volumes[i] > avgVolume * 2) { // 200% spike
                    volumeSpikes.push({ index: i, volume: volumes[i] });
                }
            }

            // ========== LAYER 3: Support/Resistance Zones ==========
            const recentHigh = Math.max(...highs.slice(len - 100));
            const recentLow = Math.min(...lows.slice(len - 100));
            const range = recentHigh - recentLow;

            // Key Fibonacci levels
            const fib786 = recentHigh - (range * 0.786);
            const fib618 = recentHigh - (range * 0.618);
            const fib50 = recentHigh - (range * 0.5);
            const fib382 = recentHigh - (range * 0.382);

            // ========== LAYER 4: Reversal Detection ==========
            const currentPrice = closes[len - 1];
            const currentRSI = rsiArray[rsiArray.length - 1];
            const prevRSI = rsiArray[rsiArray.length - 2];

            const newMarkers = [];
            const newLines = [];
            let reversalFound = false;
            let reversalType = '';
            let reversalScore = 0;
            let reversalReason = '';

            // BULLISH REVERSAL CONDITIONS
            const isOversold = currentRSI < 30;
            const isBullishDivergence = currentPrice < closes[len - 10] && currentRSI > rsiArray[rsiArray.length - 10];
            const isNearSupport = Math.abs(currentPrice - fib786) / currentPrice < 0.01 ||
                Math.abs(currentPrice - recentLow) / currentPrice < 0.01;
            const hasVolumeSpike = volumeSpikes.some(v => v.index >= len - 5);

            // BEARISH REVERSAL CONDITIONS
            const isOverbought = currentRSI > 70;
            const isBearishDivergence = currentPrice > closes[len - 10] && currentRSI < rsiArray[rsiArray.length - 10];
            const isNearResistance = Math.abs(currentPrice - fib382) / currentPrice < 0.01 ||
                Math.abs(currentPrice - recentHigh) / currentPrice < 0.01;

            // ========== BULLISH REVERSAL SETUP ==========
            if ((isOversold || isBullishDivergence) && isNearSupport) {
                reversalFound = true;
                reversalType = 'BULLISH';
                reversalScore = 0;
                reversalReason = '';

                if (isOversold) { reversalScore += 3; reversalReason += 'RSI Oversold (<30) • '; }
                if (isBullishDivergence) { reversalScore += 4; reversalReason += 'Bullish Divergence • '; }
                if (isNearSupport) { reversalScore += 2; reversalReason += 'At Key Support • '; }
                if (hasVolumeSpike) { reversalScore += 1; reversalReason += 'Volume Spike'; }

                const entry = currentPrice;
                const sl = recentLow * 0.995;
                const tp = fib50; // Target middle Fibonacci

                // Entry Arrow
                newMarkers.push({
                    time: candles[len - 1].time,
                    position: 'belowBar',
                    color: '#10b981',
                    shape: 'arrowUp',
                    text: `🎯 BUY (${reversalScore}/10)`,
                    size: 3
                });

                // Zone marker
                newMarkers.push({
                    time: candles[len - 5].time,
                    position: 'belowBar',
                    color: '#22c55e',
                    shape: 'circle',
                    text: '🔄 REVERSAL ZONE',
                    size: 1
                });

                // Lines
                newLines.push(
                    { price: entry, color: '#10b981', title: '📍 ENTRY: ' + entry.toFixed(2) },
                    { price: sl, color: '#ef4444', title: '🛡️ STOP LOSS: ' + sl.toFixed(2) },
                    { price: tp, color: '#22c55e', title: '🎯 TARGET: ' + tp.toFixed(2) },
                    { price: fib786, color: '#eab308', title: '✨ Fib 0.786 (Support)' },
                    { price: fib618, color: '#a855f7', title: '✨ Fib 0.618' }
                );

                setTradeSignalCard({
                    signal: 'BULLISH REVERSAL',
                    entry: entry,
                    sl: sl,
                    tp: tp,
                    trend: 'REVERSAL UP',
                    rr: ((tp - entry) / (entry - sl)).toFixed(2)
                });
            }
            // ========== BEARISH REVERSAL SETUP ==========
            else if ((isOverbought || isBearishDivergence) && isNearResistance) {
                reversalFound = true;
                reversalType = 'BEARISH';
                reversalScore = 0;
                reversalReason = '';

                if (isOverbought) { reversalScore += 3; reversalReason += 'RSI Overbought (>70) • '; }
                if (isBearishDivergence) { reversalScore += 4; reversalReason += 'Bearish Divergence • '; }
                if (isNearResistance) { reversalScore += 2; reversalReason += 'At Key Resistance • '; }
                if (hasVolumeSpike) { reversalScore += 1; reversalReason += 'Volume Spike'; }

                const entry = currentPrice;
                const sl = recentHigh * 1.005;
                const tp = fib50;

                newMarkers.push({
                    time: candles[len - 1].time,
                    position: 'aboveBar',
                    color: '#ef4444',
                    shape: 'arrowDown',
                    text: `🎯 SELL (${reversalScore}/10)`,
                    size: 3
                });

                newMarkers.push({
                    time: candles[len - 5].time,
                    position: 'aboveBar',
                    color: '#f43f5e',
                    shape: 'circle',
                    text: '🔄 REVERSAL ZONE',
                    size: 1
                });

                newLines.push(
                    { price: entry, color: '#f43f5e', title: '📍 ENTRY: ' + entry.toFixed(2) },
                    { price: sl, color: '#ef4444', title: '🛡️ STOP LOSS: ' + sl.toFixed(2) },
                    { price: tp, color: '#22c55e', title: '🎯 TARGET: ' + tp.toFixed(2) },
                    { price: fib382, color: '#eab308', title: '✨ Fib 0.382 (Resistance)' },
                    { price: fib618, color: '#a855f7', title: '✨ Fib 0.618' }
                );

                setTradeSignalCard({
                    signal: 'BEARISH REVERSAL',
                    entry: entry,
                    sl: sl,
                    tp: tp,
                    trend: 'REVERSAL DOWN',
                    rr: ((entry - tp) / (sl - entry)).toFixed(2)
                });
            }
            // ========== NO CLEAR REVERSAL ==========
            else {
                newMarkers.push({
                    time: candles[len - 1].time,
                    position: 'aboveBar',
                    color: '#94a3b8',
                    shape: 'circle',
                    text: '⏸️ NO REVERSAL SIGNAL',
                    size: 1
                });

                newLines.push(
                    { price: recentHigh, color: '#cbd5e1', title: 'Resistance' },
                    { price: recentLow, color: '#cbd5e1', title: 'Support' },
                    { price: fib618, color: '#a855f7', title: '✨ Fib 0.618 (Golden)' }
                );

                setTradeSignalCard(null);
            }

            setMarkers(newMarkers);
            setExtraLines(newLines);

            toast({
                title: reversalFound ? `${reversalType} Reversal Detected!` : "No Reversal Signal",
                description: reversalFound ? `Score: ${reversalScore}/10 | ${reversalReason}` : "Market is in consolidation. Wait for setup."
            });

        } catch (error) {
            console.error(error);
            toast({ title: "Analysis Failed", description: "Unable to fetch market data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkTheme = () => {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            setTheme(currentTheme);
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const closingRef = useRef<Set<string | number>>(new Set());
    const [selectedPositionId, setSelectedPositionId] = useState<number | string | null>(null);
    const [editingPosition, setEditingPosition] = useState<any>(null);
    const [editSl, setEditSl] = useState('');
    const [editTp, setEditTp] = useState('');

    // 1. Sync User Data (Balance, Positions, History)
    useEffect(() => {
        if (!user || !firestore) return;

        // Sync Balance
        const userDocRef = doc(firestore, 'users', user.uid);
        const unsubUser = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.simulatorBalance !== undefined) {
                    setBalance(data.simulatorBalance);
                } else {
                    updateDoc(userDocRef, { simulatorBalance: 10000 });
                }
            }
        });

        // Sync Active Positions
        const posQuery = query(collection(firestore, 'users', user.uid, 'simulatorPositions'));
        const unsubPos = onSnapshot(posQuery, (snap) => {
            const posList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPositions(posList);
            setIsLoading(false);

            // Clean up closingRef for positions that are gone
            const activeIds = new Set(posList.map(p => p.id as string | number));
            closingRef.current.forEach(id => {
                if (!activeIds.has(id)) closingRef.current.delete(id);
            });
        });

        // Sync History
        const histQuery = query(
            collection(firestore, 'users', user.uid, 'simulatorHistory'),
            orderBy('closedAt', 'desc'),
            limit(50)
        );
        const unsubHist = onSnapshot(histQuery, (snap) => {
            const histList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHistory(histList);
        });

        return () => {
            unsubUser();
            unsubPos();
            unsubHist();
        };
    }, [user, firestore]);

    // Store live prices for all tracked symbols
    const [prices, setPrices] = useState<Record<string, number>>({});

    // Live Price Updates & Auto SL/TP logic
    useEffect(() => {
        // Collect all unique symbols from active positions + current selected symbol
        const activeSymbols = new Set(positions.map(p => p.symbol.split('/')[0].toLowerCase()));
        if (symbol) activeSymbols.add(symbol.toLowerCase());

        if (activeSymbols.size === 0) return;

        // Create a combined stream string for Binance (e.g., btcusdt@trade/ethusdt@trade)
        const streams = Array.from(activeSymbols).map(s => `${s}usdt@trade`).join('/');
        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const data = message.data; // { s: 'BTCUSDT', p: '123.45', ... }

            if (!data) return;

            const streamSymbol = data.s.replace('USDT', ''); // BTC
            const price = parseFloat(data.p);

            setPrices(prev => ({
                ...prev,
                [streamSymbol]: price
            }));

            // If this update matches our currently viewed symbol, update UI state
            if (streamSymbol === symbol) {
                setCurrentPrice(price);
                setPriceColor(prices[symbol] && price >= prices[symbol] ? 'text-green-500' : 'text-red-500');
                setLastPrice(price);
            }

            // Check SL/TP for positions matching this specific update's symbol
            for (const pos of positions) {
                // Normalize symbol comparison (e.g. BTC from stream vs BTC/USDT from pos)
                const posSymbolSimple = pos.symbol.split('/')[0];

                if (posSymbolSimple === streamSymbol && !closingRef.current.has(pos.id)) {

                    const priceDiff = price - pos.entryPrice;
                    const pnl = pos.type === 'LONG' ? priceDiff * pos.lotSize : -priceDiff * pos.lotSize;

                    const isSL = pos.sl && ((pos.type === 'LONG' && price <= pos.sl) || (pos.type === 'SHORT' && price >= pos.sl));
                    const isTP = pos.tp && ((pos.type === 'LONG' && price >= pos.tp) || (pos.type === 'SHORT' && price <= pos.tp));

                    if (isSL || isTP) {
                        autoClosePosition(pos, pnl, price, isSL ? 'SL' : 'TP');
                    }
                }
            }
        };

        return () => ws.close();
    }, [symbol, positions]); // Re-connect if symbol changes or positions list changes (new asset added)

    const autoClosePosition = async (pos: any, finalPnl: number, closePrice: number, reason: string) => {
        if (!user || !firestore || closingRef.current.has(pos.id)) return;
        closingRef.current.add(pos.id);

        try {
            const userDocRef = doc(firestore, 'users', user.uid);
            const posRef = doc(firestore, 'users', user.uid, 'simulatorPositions', pos.id.toString());
            const histRef = collection(firestore, 'users', user.uid, 'simulatorHistory');

            await addDoc(histRef, {
                ...pos,
                pnl: finalPnl,
                currentPrice: closePrice,
                status: 'CLOSED',
                reason,
                closedAt: serverTimestamp()
            });

            toast({
                title: `${reason} Triggered`,
                description: `${pos.type} position on ${pos.symbol} closed. P&L: ${finalPnl.toFixed(2)}$`,
                variant: finalPnl >= 0 ? "default" : "destructive",
            });

            await deleteDoc(posRef);
            await updateDoc(userDocRef, {
                simulatorBalance: balance + finalPnl
            });
        } catch (error) {
            console.error("Auto-close failed:", error);
            closingRef.current.delete(pos.id);
        }
    };

    const handleTrade = async (type: 'LONG' | 'SHORT') => {
        if (!currentPrice || !user || !firestore) return;

        const id = Date.now().toString();
        const newPosition = {
            symbol: `${symbol}/USDT`,
            type,
            entryPrice: currentPrice,
            lotSize: parseFloat(lotSize),
            sl: stopLoss ? parseFloat(stopLoss) : null,
            tp: takeProfit ? parseFloat(takeProfit) : null,
            timestamp: new Date().toLocaleTimeString(),
            createdAt: serverTimestamp()
        };

        try {
            const posRef = doc(firestore, 'users', user.uid, 'simulatorPositions', id);
            await setDoc(posRef, newPosition);
            setSelectedPositionId(id);

            toast({
                title: "Trade Opened",
                description: `${type} ${lotSize} lot on ${symbol} at ${currentPrice.toFixed(2)}`,
            });
        } catch (error) {
            console.error("Trade failed:", error);
        }
    };

    const closePosition = async (id: string | number) => {
        if (!user || !firestore || closingRef.current.has(id)) return;
        closingRef.current.add(id);

        const pos = positions.find(p => p.id === id);
        if (!pos) return;

        const pSymbol = pos.symbol.split('/')[0];
        const closePrice = prices[pSymbol] || currentPrice; // Fallback to current if not found (should be rare)

        const priceDiff = closePrice - pos.entryPrice;
        const finalPnl = pos.type === 'LONG' ? priceDiff * pos.lotSize : -priceDiff * pos.lotSize;

        try {
            const userDocRef = doc(firestore, 'users', user.uid);
            const posRef = doc(firestore, 'users', user.uid, 'simulatorPositions', id.toString());
            const histRef = collection(firestore, 'users', user.uid, 'simulatorHistory');

            await addDoc(histRef, {
                ...pos,
                pnl: finalPnl,
                currentPrice: closePrice,
                status: 'CLOSED',
                closedAt: serverTimestamp()
            });

            await deleteDoc(posRef);
            await updateDoc(userDocRef, {
                simulatorBalance: balance + finalPnl
            });

            toast({
                title: "Position Closed",
                description: `Manual exit successful. P&L: ${finalPnl.toFixed(2)}$`,
            });

            if (selectedPositionId === id) setSelectedPositionId(null);
        } catch (error) {
            console.error("Manual close failed:", error);
            closingRef.current.delete(id);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingPosition || !user || !firestore) return;
        try {
            const posRef = doc(firestore, 'users', user.uid, 'simulatorPositions', editingPosition.id.toString());
            await updateDoc(posRef, {
                sl: editSl ? parseFloat(editSl) : null,
                tp: editTp ? parseFloat(editTp) : null
            });
            setEditingPosition(null);
        } catch (error) {
            console.error("Edit failed:", error);
        }
    };

    useEffect(() => {
        if (editingPosition) {
            setEditSl(editingPosition.sl?.toString() || '');
            setEditTp(editingPosition.tp?.toString() || '');
        }
    }, [editingPosition]);

    const handleUpdatePosition = async (id: string | number, updates: { sl?: number | null, tp?: number | null }) => {
        if (!user || !firestore) return;
        try {
            const posRef = doc(firestore, 'users', user.uid, 'simulatorPositions', id.toString());
            await updateDoc(posRef, updates);
            toast({
                title: "Position Updated",
                description: `SL/TP targets updated via chart.`,
            });
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const totalPnl = positions.reduce((sum, pos) => {
        const pSymbol = pos.symbol.split('/')[0]; // BTC
        const pPrice = prices[pSymbol] || pos.entryPrice; // Use live price if available, else entry price (0 PnL initially)

        const diff = pPrice - pos.entryPrice;
        return sum + (pos.type === 'LONG' ? diff * pos.lotSize : -diff * pos.lotSize);
    }, 0);
    const equity = balance + totalPnl;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:h-[calc(100vh-64px)] w-full bg-background text-foreground transition-colors duration-300">
            <div className="flex flex-col gap-2 p-2 md:gap-4 md:p-6 flex-1 lg:overflow-hidden">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0 px-2 md:px-0">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            {symbol === 'PAXG' ? 'GOLD' : symbol === 'EUR' ? 'EUR/USD' : symbol === 'GBP' ? 'GBP/USD' : `${symbol}/USDT`}
                            <span className="flex items-center text-[10px] md:text-sm font-normal text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md whitespace-nowrap">
                                <RefreshCcw className="w-3 h-3 mr-1 animate-spin-slow" /> Live
                            </span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1 justify-center items-center">
                        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 max-w-full no-scrollbar mask-fade">
                            {['BTC', 'PAXG', 'EUR', 'GBP'].map((s) => (
                                <Button
                                    key={s}
                                    variant={symbol === s ? "default" : "outline"}
                                    onClick={() => handleSymbolChange(s)}
                                    size="sm"
                                    className="h-8 text-[11px] md:text-sm"
                                >
                                    {s === 'PAXG' ? 'GOLD' : s === 'EUR' ? 'EUR/USD' : s === 'GBP' ? 'GBP/USD' : s}
                                </Button>
                            ))}
                        </div>

                        <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 max-w-full no-scrollbar">
                            {['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'].map((i) => (
                                <Button
                                    key={i}
                                    variant={interval === i ? "secondary" : "ghost"}
                                    onClick={() => setInterval(i)}
                                    size="sm"
                                    className="h-7 md:h-8 text-[10px] md:text-xs px-2"
                                >
                                    {i}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Card className="flex items-center gap-3 border-primary/20 bg-primary/5 px-4 py-2 w-full md:w-auto relative group">
                            <Wallet className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            <div className="flex-1 md:flex-none">
                                <p className="text-[10px] md:text-xs font-medium text-muted-foreground">Equity</p>
                                <div className="flex flex-row items-baseline gap-2 md:flex-col md:gap-0">
                                    <p className="text-base md:text-lg font-bold text-foreground">${equity.toFixed(2)}</p>
                                    {totalPnl !== 0 && (
                                        <span className={`text-[10px] md:text-xs font-bold ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {totalPnl > 0 ? '+' : ''}{totalPnl.toFixed(2)}$
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Main Trading Area */}
                <div className="flex flex-col gap-4 flex-1 lg:overflow-hidden min-h-0">
                    {/* Top Row: Chart and Execution Panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
                        <div className="lg:col-span-3 flex flex-col min-h-[550px] lg:min-h-0">
                            <Card className="border-border bg-card overflow-hidden flex flex-col flex-1 relative min-h-0 shadow-2xl transition-all">
                                <div className="absolute top-4 left-4 z-10 flex gap-2">
                                    <Button variant="outline" size="sm" className="shadow-lg gap-2 border border-primary/20 bg-background/80 backdrop-blur-md hover:bg-background/90 text-primary" onClick={generateSimulationSignals}>
                                        <Activity className="w-4 h-4 animate-pulse" />
                                        AI Signals
                                    </Button>
                                </div>

                                <LightweightChart
                                    symbol={symbol}
                                    interval={interval}
                                    positions={positions}
                                    selectedPositionId={selectedPositionId}
                                    theme={theme}
                                    markers={markers}
                                    extraLines={extraLines}
                                    onUpdatePosition={handleUpdatePosition}
                                />

                                {/* Slim Trade Signal Bar - Below Chart */}
                                {tradeSignalCard && (
                                    (() => {
                                        let status = 'ACTIVE';
                                        let statusColor = '#3b82f6';
                                        let statusIcon = '📊';
                                        let pnl = 0;

                                        if (tradeSignalCard.entry > 0 && currentPrice > 0) {
                                            const isBuy = tradeSignalCard.signal.includes('BUY');
                                            if (isBuy && currentPrice >= tradeSignalCard.tp) { status = '✅ TP HIT'; statusColor = '#22c55e'; statusIcon = '🎯'; pnl = tradeSignalCard.tp - tradeSignalCard.entry; }
                                            else if (!isBuy && currentPrice <= tradeSignalCard.tp) { status = '✅ TP HIT'; statusColor = '#22c55e'; statusIcon = '🎯'; pnl = tradeSignalCard.entry - tradeSignalCard.tp; }
                                            else if (isBuy && currentPrice <= tradeSignalCard.sl) { status = '❌ SL HIT'; statusColor = '#ef4444'; statusIcon = '🛡️'; pnl = currentPrice - tradeSignalCard.entry; }
                                            else if (!isBuy && currentPrice >= tradeSignalCard.sl) { status = '❌ SL HIT'; statusColor = '#ef4444'; statusIcon = '🛡️'; pnl = tradeSignalCard.entry - currentPrice; }
                                            else { status = '📊 ACTIVE'; pnl = isBuy ? (currentPrice - tradeSignalCard.entry) : (tradeSignalCard.entry - currentPrice); statusColor = pnl >= 0 ? '#22c55e' : '#ef4444'; }
                                        }

                                        return (
                                            <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t-2 px-3 py-2 flex items-center justify-between gap-2 text-xs animate-in slide-in-from-bottom duration-300 z-10"
                                                style={{ borderTopColor: statusColor }}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{statusIcon}</span>
                                                    <span className="font-bold hidden sm:inline" style={{ color: statusColor }}>{status}</span>
                                                    <span className="text-muted-foreground hidden md:inline">|</span>
                                                    <span className="font-semibold">{tradeSignalCard.signal}</span>
                                                </div>
                                                <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-muted-foreground hidden sm:inline">Entry:</span>
                                                        <span className="font-mono font-bold">{tradeSignalCard.entry.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded ml-2">
                                                        <span className={`font-bold font-mono ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button onClick={() => setTradeSignalCard(null)} className="text-muted-foreground hover:text-foreground transition-colors ml-2 bg-transparent border-none">✕</button>
                                            </div>
                                        );
                                    })()
                                )}
                            </Card>
                        </div>

                        <div className="lg:col-span-1 flex flex-col min-h-0 mb-20 lg:mb-0">
                            <Card className="flex-1 border-none bg-card/60 dark:bg-black/60 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col border border-border rounded-3xl transition-all">
                                {/* Compact Professional Header */}
                                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                                            <Activity className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <h3 className="font-black text-[10px] tracking-[0.2em] text-foreground/90 uppercase">Terminal</h3>
                                    </div>
                                    <Badge variant="outline" className="h-5 px-2 text-[9px] font-bold uppercase tracking-tighter bg-green-500/10 text-green-500 border-green-500/20">Live Market</Badge>
                                </div>

                                <div className="p-4 space-y-5 flex-1 overflow-y-auto no-scrollbar">
                                    {/* Simplified Price Display */}
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{symbol} / USDT</span>
                                            <span className="text-[8px] text-primary/50 font-bold uppercase tracking-tighter">Real-time Feed</span>
                                        </div>
                                        <div className={`text-2xl font-mono font-black tabular-nums tracking-tighter ${priceColor}`}>
                                            {currentPrice ? currentPrice.toFixed(2) : '0.00'}
                                        </div>
                                    </div>

                                    {/* Order Type Tabs (Visual only) */}
                                    <div className="flex p-1 bg-muted/30 rounded-xl border border-border">
                                        <button className="flex-1 py-1.5 text-[9px] font-black bg-background shadow-sm border border-border/50 rounded-lg text-foreground uppercase tracking-wider transition-all">Market</button>
                                        <button className="flex-1 py-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors cursor-not-allowed">Limit</button>
                                        <button className="flex-1 py-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors cursor-not-allowed">Stop</button>
                                    </div>

                                    {/* Lot Selection Section */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.1em]">Lot Size</label>
                                            <span className="text-[9px] font-mono text-primary font-bold">Eq: ${equity.toFixed(0)}</span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-2">
                                            <div className="col-span-3">
                                                <Input
                                                    type="number"
                                                    value={lotSize}
                                                    onChange={(e) => setLotSize(e.target.value)}
                                                    className="h-10 bg-muted/20 border-border focus:ring-1 focus:ring-primary/40 text-sm font-mono font-black text-center rounded-xl transition-all"
                                                />
                                            </div>
                                            <Button variant="outline" size="sm" className="h-10 border-border hover:bg-muted/50 text-[10px] font-bold" onClick={() => setLotSize((parseFloat(lotSize) + 0.1).toFixed(2))}>+</Button>
                                            <Button variant="outline" size="sm" className="h-10 border-border hover:bg-muted/50 text-[10px] font-bold" onClick={() => setLotSize(Math.max(0.01, parseFloat(lotSize) - 0.1).toFixed(2))}>-</Button>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                                            {['0.01', '0.10', '0.50', '1.00'].map(val => (
                                                <button key={val} onClick={() => setLotSize(val)} className={`text-[8px] font-black py-1.5 rounded-lg border transition-all ${lotSize === val ? 'bg-primary text-black border-primary' : 'bg-transparent border-border hover:bg-muted text-muted-foreground'}`}>{val}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pro SL/TP Section */}
                                    <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 border border-border rounded-2xl">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black uppercase text-red-500/60 block px-1 tracking-tighter italic">Stop Loss</label>
                                            <div className="relative">
                                                <Input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="0.00" className="h-9 bg-card/60 border-border text-[11px] font-mono text-center rounded-lg focus:border-red-500/30 transition-colors" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black uppercase text-green-500/60 block px-1 tracking-tighter italic">Take Profit</label>
                                            <div className="relative">
                                                <Input type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="0.00" className="h-9 bg-card/60 border-border text-[11px] font-mono text-center rounded-lg focus:border-green-500/30 transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons: Side by Side */}
                                    <div className="grid grid-cols-2 gap-3 shrink-0">
                                        <button
                                            onClick={() => handleTrade('LONG')}
                                            className="group relative h-14 bg-green-500 hover:bg-green-400 text-black rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-green-500/10"
                                        >
                                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"></div>
                                            Buy / Long
                                        </button>
                                        <button
                                            onClick={() => handleTrade('SHORT')}
                                            className="group relative h-14 bg-red-500 hover:bg-red-400 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-500/10"
                                        >
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"></div>
                                            Sell / Short
                                        </button>
                                    </div>

                                    <Button
                                        className="w-full h-10 bg-muted/40 hover:bg-muted text-primary border border-primary/20 font-black text-[9px] tracking-[0.2em] rounded-xl group transition-all"
                                        onClick={generateSimulationSignals}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Activity className="w-3.5 h-3.5 mr-2 group-hover:animate-pulse" />}
                                        DEEP AI DISCOVERY
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Collapsible Trading Terminal - Stick to Bottom */}
                <div
                    className={`fixed bottom-0 right-0 h-10 transition-all duration-500 z-[40] border-t border-border bg-card/80 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden group ${isTerminalCollapsed ? 'h-10' : 'h-[450px] lg:h-[450px]'} left-0 md:left-20`}
                >
                    <div onClick={() => setIsTerminalCollapsed(!isTerminalCollapsed)} className="h-10 flex items-center justify-between px-6 cursor-pointer hover:bg-muted/50 transition-colors shrink-0">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Positions</span>
                                <Badge variant="secondary" className="h-4 px-1 text-[9px] font-black">{positions.length}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">P&L</span>
                                <span className={`text-xs font-mono font-black ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}$
                                </span>
                            </div>
                            {isTerminalCollapsed ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                        </div>
                    </div>

                    {!isTerminalCollapsed && (
                        <div className="flex-1 flex flex-col overflow-hidden border-t border-border">
                            <div className="flex items-center gap-1 border-b border-border px-4 bg-muted/30">
                                <button onClick={() => setActiveTab('active')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest h-10 ${activeTab === 'active' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}`}>Active</button>
                                <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest h-10 ${activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}`}>History</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 no-scrollbar bg-background/50">
                                {activeTab === 'active' ? (
                                    positions.map(pos => {
                                        const pSymbol = pos.symbol.split('/')[0];
                                        const pPrice = prices[pSymbol] || pos.entryPrice;
                                        const pnl = pos.type === 'LONG' ? (pPrice - pos.entryPrice) * pos.lotSize : (pos.entryPrice - pPrice) * pos.lotSize;
                                        return (
                                            <div key={pos.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl mb-2 border border-border hover:border-primary/20 transition-all group">
                                                <div className="flex flex-col">
                                                    <div className="font-bold text-sm tracking-tighter flex items-center gap-2">
                                                        {pos.symbol}
                                                        <Badge className={pos.type === 'LONG' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black'}>
                                                            {pos.type}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground font-medium">{pos.lotSize} Lots / ${pos.entryPrice}</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className={`font-mono font-black text-sm ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}$
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => closePosition(pos.id)}>×</Button>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    history.map(pos => (
                                        <div key={pos.id} className="flex items-center justify-between p-3 bg-muted/10 rounded-xl mb-2 border border-border opacity-70 hover:opacity-100 transition-all">
                                            <div>
                                                <div className="font-bold text-sm flex items-center gap-2">
                                                    {pos.symbol}
                                                    <span className={`text-[10px] font-black ${pos.type === 'LONG' ? 'text-green-500' : 'text-red-500'}`}>{pos.type}</span>
                                                </div>
                                                <div className="text-[10px] text-muted-foreground font-medium">{new Date(pos.closedAt?.toDate ? pos.closedAt.toDate() : pos.closedAt).toLocaleTimeString()}</div>
                                            </div>
                                            <div className={`font-mono font-black ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {pos.pnl >= 0 ? '+' : ''}{pos.pnl?.toFixed(2)}$
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Dialog open={!!editingPosition} onOpenChange={(open) => !open && setEditingPosition(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Edit Position</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2"><Label>Stop Loss</Label><Input type="number" value={editSl} onChange={(e) => setEditSl(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Take Profit</Label><Input type="number" value={editTp} onChange={(e) => setEditTp(e.target.value)} /></div>
                        </div>
                        <DialogFooter><Button onClick={handleSaveEdit}>Save</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
