'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Wallet, TrendingUp, TrendingDown, RefreshCcw, RotateCcw, Pencil, Loader2 } from 'lucide-react';
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

    // Live Price Updates & Auto SL/TP logic
    useEffect(() => {
        if (!symbol) return;
        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const price = parseFloat(data.p);

            setCurrentPrice(price);
            setPriceColor(price >= lastPrice ? 'text-green-500' : 'text-red-500');
            setLastPrice(price);

            // Check SL/TP for positions matching current symbol
            for (const pos of positions) {
                if (pos.symbol === `${symbol}/USDT` && !closingRef.current.has(pos.id)) {
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
    }, [symbol, positions, lastPrice]);

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

        const priceDiff = currentPrice - pos.entryPrice;
        const finalPnl = pos.type === 'LONG' ? priceDiff * pos.lotSize : -priceDiff * pos.lotSize;

        try {
            const userDocRef = doc(firestore, 'users', user.uid);
            const posRef = doc(firestore, 'users', user.uid, 'simulatorPositions', id.toString());
            const histRef = collection(firestore, 'users', user.uid, 'simulatorHistory');

            await addDoc(histRef, {
                ...pos,
                pnl: finalPnl,
                currentPrice: currentPrice,
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
        const diff = currentPrice - pos.entryPrice;
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
        <div className="flex flex-col gap-4 p-2 md:p-6 lg:p-8 lg:h-[calc(100vh-4rem)] h-auto overflow-y-auto lg:overflow-hidden">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        {symbol === 'PAXG' ? 'GOLD' : symbol === 'EUR' ? 'EUR/USD' : symbol === 'GBP' ? 'GBP/USD' : `${symbol}/USDT`}
                        <span className="flex items-center text-xs md:text-sm font-normal text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md whitespace-nowrap">
                            <RefreshCcw className="w-3 h-3 mr-1 animate-spin-slow" /> Live
                        </span>
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row gap-4 flex-1 justify-center items-center">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 max-w-full no-scrollbar mask-fade">
                        {['BTC', 'PAXG', 'EUR', 'GBP'].map((s) => (
                            <Button
                                key={s}
                                variant={symbol === s ? "default" : "outline"}
                                onClick={() => setSymbol(s)}
                                size="sm"
                            >
                                {s === 'PAXG' ? 'GOLD' : s === 'EUR' ? 'EUR/USD' : s === 'GBP' ? 'GBP/USD' : s}
                            </Button>
                        ))}
                    </div>

                    <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 max-w-full no-scrollbar">
                        {['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'].map((i) => (
                            <Button
                                key={i}
                                variant={interval === i ? "secondary" : "ghost"}
                                onClick={() => setInterval(i)}
                                size="sm"
                                className="h-8 text-xs px-2"
                            >
                                {i}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Card className="flex items-center gap-3 border-primary/20 bg-primary/5 px-4 py-2 w-full md:w-auto relative group">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div className="flex-1 md:flex-none">
                            <p className="text-xs font-medium text-muted-foreground">Virtual Equity</p>
                            <div className="flex flex-row items-baseline gap-2 md:flex-col md:gap-0">
                                <p className="text-lg font-bold text-foreground">${equity.toFixed(2)}</p>
                                {totalPnl !== 0 && (
                                    <span className={`text-xs font-bold ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {totalPnl > 0 ? '+' : ''}{totalPnl.toFixed(2)}$
                                    </span>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={async () => {
                                if (confirm('Reset demo account? This will clear all positions.') && user && firestore) {
                                    await updateDoc(doc(firestore, 'users', user.uid), { simulatorBalance: 10000 });
                                    for (const p of positions) {
                                        await deleteDoc(doc(firestore, 'users', user.uid, 'simulatorPositions', p.id));
                                    }
                                }
                            }}
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </Card>
                </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-4 lg:overflow-hidden">
                <Card className="col-span-1 border-border lg:col-span-3 bg-card overflow-hidden flex flex-col h-[400px] md:h-[500px] lg:h-auto">
                    <LightweightChart
                        symbol={symbol}
                        interval={interval}
                        positions={positions}
                        selectedPositionId={selectedPositionId}
                        theme={theme}
                        onUpdatePosition={handleUpdatePosition}
                    />
                </Card>

                <div className="flex flex-col gap-4 lg:overflow-y-auto pr-0 lg:pr-1">
                    <Card className="flex-none p-4 flex flex-col">
                        <h3 className="mb-4 font-semibold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Place Order
                        </h3>
                        <div className="space-y-4">
                            <div className="rounded-lg border bg-background/50 p-4 text-center">
                                <span className="text-sm text-muted-foreground block mb-1">
                                    Market Price ({symbol === 'PAXG' ? 'GOLD' : symbol === 'EUR' ? 'EUR/USD' : symbol === 'GBP' ? 'GBP/USD' : symbol})
                                </span>
                                <span className={`text-2xl font-mono font-bold ${priceColor}`}>
                                    {currentPrice ? currentPrice.toFixed(2) : '...'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Lot Size</label>
                                <input
                                    type="number"
                                    value={lotSize}
                                    onChange={(e) => setLotSize(e.target.value)}
                                    step="0.01"
                                    className="w-full bg-background border rounded-md px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button onClick={() => handleTrade('LONG')} className="bg-green-500 hover:bg-green-600 text-white font-bold h-12">Buy</Button>
                                <Button onClick={() => handleTrade('SHORT')} className="bg-red-500 hover:bg-red-600 text-white font-bold h-12">Sell</Button>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Stop Loss</label>
                                    <Input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="Price" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Take Profit</label>
                                    <Input type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="Price" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="flex-1 min-h-[300px] lg:min-h-0 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between p-3 border-b bg-muted/20">
                            <div className="flex gap-1">
                                <Button variant={activeTab === 'active' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('active')} size="sm" className="h-7 text-xs">
                                    Active ({positions.length})
                                </Button>
                                <Button variant={activeTab === 'history' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('history')} size="sm" className="h-7 text-xs">
                                    History
                                </Button>
                            </div>
                        </div>

                        <div className="p-0 overflow-y-auto flex-1 h-0">
                            {activeTab === 'active' ? (
                                positions.length === 0 ? (
                                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground p-4">No active positions</div>
                                ) : (
                                    <div className="divide-y">
                                        {positions.map((pos) => {
                                            const diff = currentPrice - pos.entryPrice;
                                            const pnl = pos.type === 'LONG' ? diff * pos.lotSize : -diff * pos.lotSize;
                                            return (
                                                <div
                                                    key={pos.id}
                                                    className={`flex justify-between items-center p-3 cursor-pointer ${selectedPositionId === pos.id ? 'bg-primary/5' : ''}`}
                                                    onClick={() => {
                                                        setSelectedPositionId(pos.id);
                                                        const cleanSymbol = pos.symbol.split('/')[0];
                                                        if (cleanSymbol !== symbol) setSymbol(cleanSymbol);
                                                    }}
                                                >
                                                    <div>
                                                        <div className="font-bold text-sm">{pos.symbol} <span className={pos.type === 'LONG' ? 'text-green-500' : 'text-red-500'}>{pos.type}</span></div>
                                                        <div className="text-xs text-muted-foreground">Entry: {pos.entryPrice} | x{pos.lotSize}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`font-bold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{pnl.toFixed(2)}$</div>
                                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setEditingPosition(pos); }}><Pencil className="h-3 w-3" /></Button>
                                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); closePosition(pos.id); }}>×</Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            ) : (
                                history.length === 0 ? (
                                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground p-4">No closed positions</div>
                                ) : (
                                    <div className="divide-y">
                                        <div className="p-4 bg-muted/30 flex justify-between items-center border-b">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total History P&L</span>
                                            <span className={`font-bold ${history.reduce((s, p) => s + (p.pnl || 0), 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {history.reduce((s, p) => s + (p.pnl || 0), 0).toFixed(2)}$
                                            </span>
                                        </div>
                                        {history.map((pos) => {
                                            const closeDate = pos.closedAt?.toDate ? pos.closedAt.toDate() : new Date(pos.closedAt);
                                            const timeStr = closeDate.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                                            return (
                                                <div key={pos.id} className="p-3 opacity-90 hover:opacity-100 transition-opacity flex flex-col gap-1 border-b last:border-0 hover:bg-muted/30">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-bold text-sm tracking-tight">
                                                                {pos.symbol} <span className={pos.type === 'LONG' ? 'text-green-500' : 'text-red-500'}>{pos.type}</span>
                                                            </div>
                                                            <div className="text-[10px] text-muted-foreground font-medium uppercase">{timeStr}</div>
                                                        </div>
                                                        <div className={`font-bold text-sm ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}$
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1 text-[11px]">
                                                        <div className="flex justify-between text-muted-foreground">
                                                            <span>Entry:</span>
                                                            <span className="font-mono text-foreground">{pos.entryPrice?.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between text-muted-foreground">
                                                            <span>Exit:</span>
                                                            <span className="font-mono text-foreground">{pos.currentPrice?.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between text-muted-foreground">
                                                            <span>SL:</span>
                                                            <span className="font-mono text-red-400/80">{pos.sl ? pos.sl.toLocaleString() : 'None'}</span>
                                                        </div>
                                                        <div className="flex justify-between text-muted-foreground">
                                                            <span>TP:</span>
                                                            <span className="font-mono text-green-400/80">{pos.tp ? pos.tp.toLocaleString() : 'None'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <Dialog open={!!editingPosition} onOpenChange={(open) => !open && setEditingPosition(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Position</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Stop Loss</Label>
                            <Input type="number" value={editSl} onChange={(e) => setEditSl(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Take Profit</Label>
                            <Input type="number" value={editTp} onChange={(e) => setEditTp(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveEdit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
