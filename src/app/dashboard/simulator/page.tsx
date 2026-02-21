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
    writeBatch,
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
    const [positions, setPositions] = useState<any[]>([]);
    const [lotSize, setLotSize] = useState<string>('0.1');
    const [stopLoss, setStopLoss] = useState<string>('');
    const [takeProfit, setTakeProfit] = useState<string>('');
    const [interval, setInterval] = useState<string>('1d');
    const [balance, setBalance] = useState<number>(10000);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [showIndicators, setShowIndicators] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [markers, setMarkers] = useState<any[]>([]);
    const [extraLines, setExtraLines] = useState<any[]>([]);
    const [tradeSignalCard, setTradeSignalCard] = useState<any>(null);
    const [predictionPath, setPredictionPath] = useState<any[]>([]);
    const [liquidityBands, setLiquidityBands] = useState<{ upper: any[], lower: any[] }>({ upper: [], lower: [] });
    const [marketNarrative, setMarketNarrative] = useState<string>('');
    const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(true);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [selectedPositionId, setSelectedPositionId] = useState<number | string | null>(null);
    const [editingPosition, setEditingPosition] = useState<any>(null);
    const [editSl, setEditSl] = useState('');
    const [editTp, setEditTp] = useState('');

    const closingRef = useRef<Set<string | number>>(new Set());

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

    const formatSymbol = (s: string) => {
        if (!s) return '';
        const base = s.split('/')[0].toUpperCase();
        if (base === 'PAXG') return 'GOLD';
        if (base === 'EUR') return 'EUR/USD';
        if (base === 'GBP') return 'GBP/USD';
        return s.includes('/') ? s : `${s}/USDT`;
    };

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

    const generateSimulationSignals = async (force: boolean = false) => {
        if (!symbol) return;

        if (!force && showIndicators) {
            setShowIndicators(false);
            setMarkers([]);
            setExtraLines([]);
            setPredictionPath([]);
            setLiquidityBands({ upper: [], lower: [] });
            setMarketNarrative('');
            setTradeSignalCard(null);
            toast({ title: "Aura Indicators Hidden", description: "Analytical layers cleared." });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}USDT&interval=${interval}&limit=1000`);
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

            const sliceSize = 30;
            const slice = closes.slice(len - sliceSize);
            const mean = slice.reduce((a: number, b: number) => a + b, 0) / sliceSize;
            const variance = slice.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / sliceSize;
            const stdDev = Math.sqrt(variance);
            const zScore = (closes[len - 1] - mean) / (stdDev || 1);

            const bbUpper = mean + (2 * stdDev);
            const bbLower = mean - (2 * stdDev);

            const calculateEMA = (values: number[], period: number) => {
                const k = 2 / (period + 1);
                let ema = values[0];
                for (let i = 1; i < values.length; i++) ema = (values[i] - ema) * k + ema;
                return ema;
            };

            // Calculate Dynamic Liquidity Envelopes aligned 1:1 with candles
            const uBands: (number | null)[] = new Array(len).fill(null);
            const lBands: (number | null)[] = new Array(len).fill(null);

            const bandPeriod = 30;
            const multiplier = 2.8;

            for (let i = bandPeriod; i < len; i++) {
                const s = closes.slice(i - bandPeriod, i + 1);
                const m = s.reduce((a, b) => a + b, 0) / s.length;
                const v = s.reduce((a, b) => a + Math.pow(b - m, 2), 0) / s.length;
                const sd = Math.sqrt(v);
                uBands[i] = m + (multiplier * sd);
                lBands[i] = m - (multiplier * sd);
            }

            // Sync with chart State (filtering out nulls for the line series)
            setLiquidityBands({
                upper: uBands.map((v, i) => ({ time: candles[i].time, value: v })).filter(x => x.value !== null),
                lower: lBands.map((v, i) => ({ time: candles[i].time, value: v })).filter(x => x.value !== null)
            });

            const ema50 = calculateEMA(closes, 50);
            const ema200 = calculateEMA(closes, 200);

            let sumTR = 0;
            for (let i = len - 14; i < len; i++) sumTR += Math.max(highs[i] - lows[i], Math.abs(highs[i] - (closes[i - 1] || closes[i])), Math.abs(lows[i] - (closes[i - 1] || closes[i])));
            const atr = sumTR / 14;

            const price_curr = closes[len - 1];
            const newMarkers: any[] = [];
            const newLines: any[] = [];

            const currentCandle = candles[len - 1];
            const bodySize = Math.abs(currentCandle.close - currentCandle.open);
            const upperWick = currentCandle.high - Math.max(currentCandle.close, currentCandle.open);
            const lowerWick = Math.min(currentCandle.close, currentCandle.open) - currentCandle.low;

            const isHammer = lowerWick > (bodySize * 2) && upperWick < (bodySize * 0.5);
            const isShootingStar = upperWick > (bodySize * 2) && lowerWick < (bodySize * 0.5);

            const bullishTrend = ema50 > ema200;
            const bearishTrend = ema50 < ema200;

            const lastUB = uBands[len - 1] || price_curr;
            const lastLB = lBands[len - 1] || price_curr;

            const touchUpper = currentCandle.high >= lastUB * 0.998;
            const touchLower = currentCandle.low <= lastLB * 1.002;

            // Rejection Logic: Price touched but candle body closed away from the band
            const rejectionUpper = touchUpper && currentCandle.close < (currentCandle.high - (bodySize * 0.5));
            const rejectionLower = touchLower && currentCandle.close > (currentCandle.low + (bodySize * 0.5));

            const reversalHighProb = (touchUpper && zScore > 2.5) || (touchLower && zScore < -2.5) || rejectionUpper || rejectionLower;
            const oversoldQuant = zScore < -2 || price_curr <= bbLower || isHammer || touchLower || rejectionLower;
            const overboughtQuant = zScore > 2 || price_curr >= bbUpper || isShootingStar || touchUpper || rejectionUpper;

            const findZones = () => {
                const zones = [];
                for (let i = len - 100; i < len - 5; i++) {
                    const isHigh = highs[i] > highs[i - 1] && highs[i] > highs[i + 1] && highs[i] > highs[i - 2] && highs[i] > highs[i + 2];
                    const isLow = lows[i] < lows[i - 1] && lows[i] < lows[i + 1] && lows[i] < lows[i - 2] && lows[i] < lows[i + 2];
                    if (isHigh) zones.push({ price: highs[i], color: 'rgba(239, 68, 68, 0.2)', title: 'SUPPLY ZONE (SELL)' });
                    if (isLow) zones.push({ price: lows[i], color: 'rgba(34, 197, 94, 0.2)', title: 'DEMAND ZONE (BUY)' });
                }
                return zones.slice(-4);
            };
            const institutionalZones = findZones();
            newLines.push(...institutionalZones);

            const avgVol = candles.slice(len - 20).reduce((a: number, b: any) => a + b.volume, 0) / 20;
            const volSpike = currentCandle.volume > avgVol * 1.5;
            const exceptionalBullish = bullishTrend && oversoldQuant && (isHammer || volSpike);
            const exceptionalBearish = bearishTrend && overboughtQuant && (isShootingStar || volSpike);

            for (let i = len - 300; i < len; i++) {
                const c = candles[i];
                if (!c) continue;

                const slice_i = closes.slice(Math.max(0, i - 30), i + 1);
                const mean_i = slice_i.reduce((a: number, b: number) => a + b, 0) / slice_i.length;
                const std_i = Math.sqrt(slice_i.reduce((a: number, b: number) => a + Math.pow(b - mean_i, 2), 0) / slice_i.length);
                const zs_i = (c.close - mean_i) / (std_i || 1);

                const e50_i = calculateEMA(closes.slice(0, i + 1), 50);
                const e200_i = calculateEMA(closes.slice(0, i + 1), 200);
                const trendUp = e50_i > e200_i;
                const trendDown = e50_i < e200_i;

                const ub_i = uBands[i];
                const lb_i = lBands[i];

                if (ub_i && c.high >= ub_i * 0.999) {
                    // Trend-Aware: Ceiling touch in Uptrend is a "MINOR PULLBACK"
                    // Ceiling touch in Downtrend is a "MAJOR REVERSAL"
                    const isMajor = trendDown && zs_i > 2.2;
                    newMarkers.push({
                        time: c.time,
                        position: 'aboveBar',
                        color: isMajor ? '#ff0055' : '#ffaa00',
                        shape: isMajor ? 'star' : 'circle',
                        text: isMajor ? 'MAJOR REV' : 'MINOR DROP',
                        size: isMajor ? 2 : 1
                    });
                }

                if (lb_i && c.low <= lb_i * 1.001) {
                    // Floor touch in Uptrend is a "MAJOR REVERSAL" (The ideal Buy)
                    const isMajor = trendUp && zs_i < -2.2;
                    newMarkers.push({
                        time: c.time,
                        position: 'belowBar',
                        color: isMajor ? '#00ffaa' : '#cbd5e1',
                        shape: isMajor ? 'star' : 'circle',
                        text: isMajor ? 'MAJOR BUY' : 'MINOR BOUNCE',
                        size: isMajor ? 2 : 1
                    });
                }
            }

            if (exceptionalBullish) {
                const entry = price_curr;
                const sl = entry - (atr * 2.5);
                const tp = entry + (atr * 5);
                newMarkers.push({ time: candles[len - 1].time, position: 'belowBar', color: '#22c55e', shape: 'arrowUp', text: '⭐ AURA ELITE BUY', size: 2 });
                newLines.push({ price: entry, color: '#22c55e', title: 'ELITE ENTRY' }, { price: sl, color: '#ef4444', title: 'SL' }, { price: tp, color: '#10b981', title: 'TP' });
                setTradeSignalCard({ signal: '💎 ELITE QUANT BUY (INSTITUTIONAL)', entry, sl, tp, trend: `CONFIRMED: INST. REVERSAL (ZS: ${zScore.toFixed(2)})`, rr: '2.00' });
            } else if (exceptionalBearish) {
                const entry = price_curr;
                const sl = entry + (atr * 2.5);
                const tp = entry - (atr * 5);
                newMarkers.push({ time: candles[len - 1].time, position: 'aboveBar', color: '#f43f5e', shape: 'arrowDown', text: '⭐ AURA ELITE SELL', size: 2 });
                newLines.push({ price: entry, color: '#f43f5e', title: 'ELITE ENTRY' }, { price: sl, color: '#ef4444', title: 'SL' }, { price: tp, color: '#10b981', title: 'TP' });
                setTradeSignalCard({ signal: '💎 ELITE QUANT SELL (INSTITUTIONAL)', entry, sl, tp, trend: `CONFIRMED: INST. REVERSAL (ZS: ${zScore.toFixed(2)})`, rr: '2.00' });
            }

            const generateNarrative = () => {
                if (reversalHighProb) {
                    if (touchUpper) return "⚠️ HIGH ACCURACY REVERSAL DETECTED. PRICE TOUCHED LIQUIDITY CEILING. INSTITUTIONAL SELL-OFF IMMINENT.";
                    return "⚠️ HIGH ACCURACY REVERSAL DETECTED. PRICE TOUCHED LIQUIDITY FLOOR. INSTITUTIONAL BUY-BACK EXPECTED.";
                }
                if (exceptionalBullish) return "INSTITUTIONAL WHALES DETECTED. PRICE IS TARGETING TOP LIQUIDITY POOLS.";
                if (exceptionalBearish) return "DISTRIBUTION PHASE CONFIRMED. PRICE IS BEING DUMPED INTO DEMAND ZONES.";
                if (bullishTrend && zScore < -1.5) return "QUANT ANOMALY: OVERSOLD. PROJECTED TO RECLAIM EMA 50.";
                if (bearishTrend && zScore > 1.5) return "QUANT ANOMALY: OVERBOUGHT. PROJECTED TO RETEST SUPPLY ZONE.";
                return bullishTrend ? "BULLISH BIAS INTACT. PATH REMAINS POSITIVE." : bearishTrend ? "BEARISH BIAS INTACT. PATH PROJECTED DOWNWARDS." : "MARKET INDECISION. SIDEWAYS CONSOLIDATION EXPECTED.";
            };
            setMarketNarrative(generateNarrative());

            const generatePath = () => {
                const path = [];
                const lookback = 80;

                // Flexible time step calculation for all intervals
                const getStep = () => {
                    if (interval === '1w') return 604800;
                    if (interval === '1M') return 2592000;
                    const num = parseInt(interval);
                    if (interval.includes('m')) return num * 60;
                    if (interval.includes('h')) return num * 3600;
                    if (interval.includes('d')) return num * 86400;
                    return 86400;
                };
                const tStep = getStep();

                // 1. Historical Processing (The AI 'Road Map')
                for (let i = Math.max(0, len - lookback); i < len; i++) {
                    const c = candles[i];
                    const slice_i = closes.slice(0, i + 1);
                    const e20 = calculateEMA(slice_i, 20);
                    const e50 = calculateEMA(slice_i, 50);
                    path.push({ time: c.time, value: (e20 + e50) / 2 });
                }

                // 2. Future Projection (Institutional Market Maker Logic)
                const lastRoadValue = path.length > 0 ? path[path.length - 1].value : price_curr;
                const lastT = candles[len - 1].time;

                const nSup = institutionalZones.filter(z => z.price > price_curr).sort((a, b) => a.price - b.price)[0];
                const nDem = institutionalZones.filter(z => z.price < price_curr).sort((a, b) => b.price - a.price)[0];

                let pTarget = price_curr;
                let fTarget = price_curr;
                let inducement = 0; // Market Maker Fake-out

                if (exceptionalBullish) {
                    inducement = -(atr * 0.8); // Drop before the pump
                    pTarget = nSup?.price || price_curr + (atr * 4);
                    fTarget = pTarget + (atr * 2);
                }
                else if (exceptionalBearish) {
                    inducement = (atr * 0.8); // Fake rally before the crash
                    pTarget = nDem?.price || price_curr - (atr * 4);
                    fTarget = pTarget - (atr * 2);
                }
                else if (bullishTrend) {
                    inducement = -(atr * 0.4);
                    pTarget = price_curr + (atr * 2.5);
                    fTarget = pTarget + (atr * 1.5);
                }
                else if (bearishTrend) {
                    inducement = (atr * 0.4);
                    pTarget = price_curr - (atr * 2.5);
                    fTarget = pTarget - (atr * 1.5);
                }
                else {
                    pTarget = price_curr + (atr * 1);
                    fTarget = price_curr - (atr * 1);
                }

                // 20 steps of high-resolution projection
                for (let i = 1; i <= 20; i++) {
                    const prog = i / 20;
                    let val;

                    if (i <= 4) {
                        // Phase 1: Inducement (The Trap)
                        val = lastRoadValue + (inducement * (i / 4));
                    } else if (i <= 14) {
                        // Phase 2: Institutional Move (The Expansion)
                        const subProg = (i - 4) / 10;
                        const start = lastRoadValue + inducement;
                        val = start + (pTarget - start) * Math.pow(subProg, 1.2); // Exponential move
                    } else {
                        // Phase 3: Consolidation / Secondary Target
                        const subProg = (i - 14) / 6;
                        val = pTarget + (fTarget - pTarget) * subProg;
                    }

                    path.push({ time: (lastT + (i * tStep)) as any, value: val });
                }
                return path;
            };
            setPredictionPath(generatePath());

            if (!force) setShowIndicators(true);
            setMarkers(newMarkers);
            setExtraLines(newLines);
            if (!force) toast({ title: "Deep Analysis Complete", description: "Narrative engine and forward projection active." });
        } catch (e) {
            console.error(e);
            toast({ title: "Aura Engine Error", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (showIndicators) {
            generateSimulationSignals(true);
        }
    }, [symbol, interval]);

    // Firestore Syncing
    useEffect(() => {
        if (!user || !firestore) return;

        const userDocRef = doc(firestore, 'users', user.uid);
        const unsubUser = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const d = docSnap.data();
                if (d.simulatorBalance !== undefined) setBalance(d.simulatorBalance);
                else updateDoc(userDocRef, { simulatorBalance: 10000 });
            }
        });

        const posQuery = query(collection(firestore, 'users', user.uid, 'simulatorPositions'));
        const unsubPos = onSnapshot(posQuery, (snap) => {
            const posList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setPositions(posList);
            setIsLoading(false);
            const activeIds = new Set(posList.map(p => p.id as string | number));
            closingRef.current.forEach(id => { if (!activeIds.has(id)) closingRef.current.delete(id); });
        });

        const histQuery = query(collection(firestore, 'users', user.uid, 'simulatorHistory'), orderBy('closedAt', 'desc'), limit(50));
        const unsubHist = onSnapshot(histQuery, (snap) => {
            const histList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setHistory(histList);
        });

        return () => { unsubUser(); unsubPos(); unsubHist(); };
    }, [user, firestore]);

    // Live Price Updates
    useEffect(() => {
        const activeSymbols = new Set(positions.map(p => p.symbol.split('/')[0].toLowerCase()));
        if (symbol) activeSymbols.add(symbol.toLowerCase());
        if (activeSymbols.size === 0) return;

        const streams = Array.from(activeSymbols).map(s => `${s}usdt@trade`).join('/');
        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            const data = msg.data;
            if (!data) return;

            const sSym = data.s.replace('USDT', '');
            const price = parseFloat(data.p);

            setPrices(prev => ({ ...prev, [sSym]: price }));

            if (sSym === symbol) {
                setCurrentPrice(price);
                setPriceColor(prices[symbol] && price >= prices[symbol] ? 'text-green-500' : 'text-red-500');
                setLastPrice(price);
            }

            for (const pos of positions) {
                const posSym = pos.symbol.split('/')[0];
                if (posSym === sSym && !closingRef.current.has(pos.id)) {
                    const diff = price - pos.entryPrice;
                    const pnl = pos.type === 'LONG' ? diff * pos.lotSize : -diff * pos.lotSize;
                    const isSL = pos.sl && ((pos.type === 'LONG' && price <= pos.sl) || (pos.type === 'SHORT' && price >= pos.sl));
                    const isTP = pos.tp && ((pos.type === 'LONG' && price >= pos.tp) || (pos.type === 'SHORT' && price <= pos.tp));
                    if (isSL || isTP) autoClosePosition(pos, pnl, price, isSL ? 'SL' : 'TP');
                }
            }
        };

        return () => ws.close();
    }, [symbol, positions]);

    const autoClosePosition = async (pos: any, finalPnl: number, closePrice: number, reason: string) => {
        if (!user || !firestore || closingRef.current.has(pos.id)) return;
        closingRef.current.add(pos.id);
        try {
            const uRef = doc(firestore, 'users', user.uid);
            const pRef = doc(firestore, 'users', user.uid, 'simulatorPositions', pos.id.toString());
            const hRef = collection(firestore, 'users', user.uid, 'simulatorHistory');
            await addDoc(hRef, { ...pos, pnl: finalPnl, currentPrice: closePrice, status: 'CLOSED', reason, closedAt: serverTimestamp() });
            await deleteDoc(pRef);
            await updateDoc(uRef, { simulatorBalance: balance + finalPnl });
        } catch (e) {
            console.error(e);
            closingRef.current.delete(pos.id);
        }
    };

    const handleTrade = async (type: 'LONG' | 'SHORT') => {
        if (!user || !firestore) return;
        try {
            const pRef = collection(firestore, 'users', user.uid, 'simulatorPositions');
            await addDoc(pRef, {
                symbol: `${symbol}/USDT`,
                type,
                entryPrice: currentPrice,
                lotSize: parseFloat(lotSize),
                sl: stopLoss ? parseFloat(stopLoss) : null,
                tp: takeProfit ? parseFloat(takeProfit) : null,
                openedAt: serverTimestamp(),
                status: 'OPEN'
            });
            setStopLoss(''); setTakeProfit('');
            toast({ title: "Trade Executed", description: `${type} position opened for ${formatSymbol(symbol)}` });
        } catch (e) { console.error(e); }
    };

    const closePosition = async (id: string | number) => {
        if (!user || !firestore || closingRef.current.has(id)) return;
        closingRef.current.add(id);
        const pos = positions.find(p => p.id === id);
        if (!pos) { closingRef.current.delete(id); return; }
        const pSym = pos.symbol.split('/')[0];
        const cPrice = prices[pSym] || currentPrice;
        const pnl = pos.type === 'LONG' ? (cPrice - pos.entryPrice) * pos.lotSize : (pos.entryPrice - cPrice) * pos.lotSize;
        try {
            const uRef = doc(firestore, 'users', user.uid);
            const pRef = doc(firestore, 'users', user.uid, 'simulatorPositions', id.toString());
            const hRef = collection(firestore, 'users', user.uid, 'simulatorHistory');
            await addDoc(hRef, { ...pos, pnl, currentPrice: cPrice, status: 'CLOSED', closedAt: serverTimestamp() });
            await deleteDoc(pRef);
            await updateDoc(uRef, { simulatorBalance: balance + pnl });
            if (selectedPositionId === id) setSelectedPositionId(null);
        } catch (e) { console.error(e); closingRef.current.delete(id); }
    };

    const handleSaveEdit = async () => {
        if (!editingPosition || !user || !firestore) return;
        try {
            const pRef = doc(firestore, 'users', user.uid, 'simulatorPositions', editingPosition.id.toString());
            await updateDoc(pRef, { sl: editSl ? parseFloat(editSl) : null, tp: editTp ? parseFloat(editTp) : null });
            setEditingPosition(null);
        } catch (e) { console.error(e); }
    };

    const handleResetAccount = async () => {
        if (!user || !firestore) return;
        try {
            const batch = writeBatch(firestore);
            const uRef = doc(firestore, 'users', user.uid);
            batch.update(uRef, { simulatorBalance: 10000 });
            positions.forEach(p => batch.delete(doc(firestore, 'users', user.uid, 'simulatorPositions', p.id.toString())));
            history.forEach(h => batch.delete(doc(firestore, 'users', user.uid, 'simulatorHistory', h.id.toString())));
            await batch.commit();
            setIsResetDialogOpen(false);
            toast({ title: "Account Reset", description: "Demo account reset to $10,000." });
        } catch (e) { console.error(e); }
    };

    useEffect(() => { if (editingPosition) { setEditSl(editingPosition.sl?.toString() || ''); setEditTp(editingPosition.tp?.toString() || ''); } }, [editingPosition]);

    const handleUpdatePosition = async (id: string | number, updates: any) => {
        if (!user || !firestore) return;
        try {
            await updateDoc(doc(firestore, 'users', user.uid, 'simulatorPositions', id.toString()), updates);
        } catch (e) { console.error(e); }
    };

    const totalPnl = positions.reduce((sum, pos) => {
        const pSym = pos.symbol.split('/')[0];
        const pPrice = prices[pSym] || pos.entryPrice;
        const diff = pPrice - pos.entryPrice;
        return sum + (pos.type === 'LONG' ? diff * pos.lotSize : -diff * pos.lotSize);
    }, 0);
    const equity = balance + totalPnl;

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="flex flex-col lg:h-[calc(100vh-64px)] w-full bg-background text-foreground transition-colors duration-300">
            <div className="flex flex-col gap-2 p-2 md:gap-4 md:p-6 flex-1 lg:overflow-hidden">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0 px-2 md:px-0">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            {formatSymbol(symbol)}
                            <span className="flex items-center text-[10px] md:text-sm font-normal text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md whitespace-nowrap">
                                <RefreshCcw className="w-3 h-3 mr-1 animate-spin-slow" /> Live
                            </span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1 justify-center items-center">
                        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 max-w-full no-scrollbar mask-fade">
                            {['BTC', 'PAXG', 'EUR', 'GBP'].map((s) => (
                                <Button key={s} variant={symbol === s ? "default" : "outline"} onClick={() => handleSymbolChange(s)} size="sm" className="h-8 text-[11px] md:text-sm">{formatSymbol(s)}</Button>
                            ))}
                        </div>
                        <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 max-w-full no-scrollbar">
                            {['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'].map((i) => (
                                <Button key={i} variant={interval === i ? "secondary" : "ghost"} onClick={() => setInterval(i)} size="sm" className="h-7 md:h-8 text-[10px] md:text-xs px-2">{i}</Button>
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
                        <Button variant="outline" size="icon" className="h-10 w-10 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all shrink-0" onClick={() => setIsResetDialogOpen(true)} title="Reset Account">
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 flex-1 lg:overflow-hidden min-h-0">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
                        <div className="lg:col-span-3 flex flex-col min-h-[550px] lg:min-h-0">
                            <Card className="border-border bg-card overflow-hidden flex flex-col flex-1 relative min-h-0 shadow-2xl transition-all">
                                <div className="absolute top-4 left-4 z-10 flex gap-2">
                                    <Button variant="outline" size="sm" className="shadow-lg gap-2 border border-primary/20 bg-background/80 backdrop-blur-md hover:bg-background/90 text-primary" onClick={() => generateSimulationSignals()}>
                                        <Activity className="w-4 h-4 animate-pulse" />
                                        {showIndicators ? 'Hide Signals' : 'AI Signals'}
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
                                    predictionPath={predictionPath}
                                    liquidityBands={liquidityBands}
                                    showAuraIndicator={showIndicators}
                                    onUpdatePosition={handleUpdatePosition}
                                />

                                {showIndicators && marketNarrative && (
                                    <div className="absolute top-16 left-4 right-4 z-10 pointer-events-none">
                                        <div className="bg-background/40 backdrop-blur-xl border border-primary/20 rounded-xl p-4 shadow-2xl animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                                                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Aura AI Live Narrative</span>
                                            </div>
                                            <p className="text-xs md:text-sm font-medium leading-relaxed text-foreground/90 italic">"{marketNarrative}"</p>
                                        </div>
                                    </div>
                                )}

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
                                            <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t-2 px-3 py-2 flex items-center justify-between gap-2 text-xs animate-in slide-in-from-bottom duration-300 z-10" style={{ borderTopColor: statusColor }}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{statusIcon}</span>
                                                    <span className="font-bold hidden sm:inline" style={{ color: statusColor }}>{status}</span>
                                                    <span className="font-semibold">{tradeSignalCard.signal}</span>
                                                </div>
                                                <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
                                                    <span className="font-mono font-bold">{tradeSignalCard.entry.toFixed(2)}</span>
                                                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded ml-2">
                                                        <span className={`font-bold font-mono ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}</span>
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
                                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20"><Activity className="h-3.5 w-3.5 text-primary" /></div>
                                        <h3 className="font-black text-[10px] tracking-[0.2em] text-foreground/90 uppercase">Terminal</h3>
                                    </div>
                                    <Badge variant="outline" className="h-5 px-2 text-[9px] font-bold uppercase tracking-tighter bg-green-500/10 text-green-500 border-green-500/20">Live Market</Badge>
                                </div>

                                <div className="p-4 space-y-5 flex-1 overflow-y-auto no-scrollbar">
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{formatSymbol(symbol)}</span>
                                            <span className="text-[8px] text-primary/50 font-bold uppercase tracking-tighter">Real-time Feed</span>
                                        </div>
                                        <div className={`text-2xl font-mono font-black tabular-nums tracking-tighter ${priceColor}`}>{currentPrice ? currentPrice.toFixed(2) : '0.00'}</div>
                                    </div>

                                    <div className="flex p-1 bg-muted/30 rounded-xl border border-border">
                                        <button className="flex-1 py-1.5 text-[9px] font-black bg-background shadow-sm border border-border/50 rounded-lg text-foreground uppercase tracking-wider transition-all">Market</button>
                                        <button className="flex-1 py-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors cursor-not-allowed">Limit</button>
                                        <button className="flex-1 py-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors cursor-not-allowed">Stop</button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.1em]">Lot Size</label>
                                            <span className="text-[9px] font-mono text-primary font-bold">Eq: ${equity.toFixed(0)}</span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-2">
                                            <div className="col-span-3">
                                                <Input type="number" value={lotSize} onChange={(e) => setLotSize(e.target.value)} className="h-10 bg-muted/20 border-border focus:ring-1 focus:ring-primary/40 text-sm font-mono font-black text-center rounded-xl transition-all" />
                                            </div>
                                            <Button variant="outline" size="sm" className="h-10 border-border hover:bg-muted/50 text-[10px] font-bold" onClick={() => setLotSize((parseFloat(lotSize) + 0.1).toFixed(2))}>+</Button>
                                            <Button variant="outline" size="sm" className="h-10 border-border hover:bg-muted/50 text-[10px] font-bold" onClick={() => setLotSize(Math.max(0.01, parseFloat(lotSize) - 0.1).toFixed(2))}>-</Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 border border-border rounded-2xl">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black uppercase text-red-500/60 block px-1 tracking-tighter italic">Stop Loss</label>
                                            <Input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="0.00" className="h-9 bg-card/60 border-border text-[11px] font-mono text-center rounded-lg" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black uppercase text-green-500/60 block px-1 tracking-tighter italic">Take Profit</label>
                                            <Input type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="0.00" className="h-9 bg-card/60 border-border text-[11px] font-mono text-center rounded-lg" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 shrink-0">
                                        <button onClick={() => handleTrade('LONG')} className="group relative h-14 bg-green-500 hover:bg-green-400 text-black rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-green-500/10">Buy / Long</button>
                                        <button onClick={() => handleTrade('SHORT')} className="group relative h-14 bg-red-500 hover:bg-red-400 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-500/10">Sell / Short</button>
                                    </div>

                                    <Button className="w-full h-10 bg-muted/40 hover:bg-muted text-primary border border-primary/20 font-black text-[9px] tracking-[0.2em] rounded-xl group transition-all" onClick={() => generateSimulationSignals()} disabled={isLoading}>
                                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Activity className="w-3.5 h-3.5 mr-2 group-hover:animate-pulse" />}
                                        DEEP AI DISCOVERY
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className={`fixed bottom-0 right-0 h-10 transition-all duration-500 z-[40] border-t border-border bg-card/80 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden group ${isTerminalCollapsed ? 'h-10' : 'h-[450px] lg:h-[450px]'} left-0 md:left-20`}>
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
                                <span className={`text-xs font-mono font-black ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}$</span>
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
                                        const pSym = pos.symbol.split('/')[0];
                                        const pPrice = prices[pSym] || pos.entryPrice;
                                        const pnl = pos.type === 'LONG' ? (pPrice - pos.entryPrice) * pos.lotSize : (pos.entryPrice - pPrice) * pos.lotSize;
                                        return (
                                            <div key={pos.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl mb-2 border border-border hover:border-primary/20 transition-all group">
                                                <div className="flex flex-col">
                                                    <div className="font-bold text-sm tracking-tighter flex items-center gap-2">{formatSymbol(pos.symbol)}
                                                        <Badge className={pos.type === 'LONG' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}>{pos.type}</Badge>
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground font-medium">{pos.lotSize} Lots / ${pos.entryPrice}</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className={`font-mono font-black text-sm ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}$</div>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => closePosition(pos.id)}>×</Button>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    history.map(pos => (
                                        <div key={pos.id} className="flex items-center justify-between p-3 bg-muted/10 rounded-xl mb-2 border border-border opacity-70 hover:opacity-100 transition-all">
                                            <div>
                                                <div className="font-bold text-sm flex items-center gap-2">{formatSymbol(pos.symbol)}
                                                    <span className={`text-[10px] font-black ${pos.type === 'LONG' ? 'text-green-500' : 'text-red-500'}`}>{pos.type}</span>
                                                </div>
                                                <div className="text-[10px] text-muted-foreground font-medium">{new Date(pos.closedAt?.toDate ? pos.closedAt.toDate() : pos.closedAt).toLocaleTimeString()}</div>
                                            </div>
                                            <div className={`font-mono font-black ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{pos.pnl >= 0 ? '+' : ''}{pos.pnl?.toFixed(2)}$</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogContent className="sm:max-w-[425px] border-primary/20 bg-background/95 backdrop-blur-xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-500"><RotateCcw className="h-5 w-5" />Reset Demo Account</DialogTitle>
                            <DialogDescription className="pt-2">This will PERMANENTLY reset your balance to <span className="font-bold text-foreground">$10,000</span> and clear all your active positions and trade history.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setIsResetDialogOpen(false)} className="hover:bg-secondary/50">Cancel</Button>
                            <Button variant="destructive" onClick={handleResetAccount} className="bg-red-500 hover:bg-red-600">Yes, Reset Everything</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
