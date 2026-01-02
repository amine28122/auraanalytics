'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSharedPrices } from '@/lib/actions';

interface RadarContextType {
    signalsCount: number;
    lastSignalTime: number | null;
}

const RadarContext = createContext<RadarContextType>({
    signalsCount: 0,
    lastSignalTime: null,
});

export const useRadar = () => useContext(RadarContext);

const PAIRS_TO_SCAN = ['XAU/USD', 'EUR/USD', 'BTC/USD', 'GBP/USD', 'USD/JPY', 'ETH/USD', 'AUD/USD', 'USD/CAD'];

export function RadarProvider({ children }: { children: React.ReactNode }) {
    const [signalsCount, setSignalsCount] = useState(0);
    const [lastSignalTime, setLastSignalTime] = useState<number | null>(null);
    const [lastPrices, setLastPrices] = useState<Record<string, number>>({});

    useEffect(() => {
        const scan = async () => {
            try {
                const newPrices = await getSharedPrices(PAIRS_TO_SCAN);
                let newCount = 0;
                let latestTime: number | null = null;

                PAIRS_TO_SCAN.forEach(pair => {
                    const current = newPrices[pair];
                    const prev = lastPrices[pair];

                    if (current && prev) {
                        const change = ((current - prev) / prev) * 100;
                        // نفس المعادلة التي استخدمناها في الرادار
                        if (Math.abs(change) > 0.005) {
                            newCount++;
                            latestTime = Date.now();
                        }
                    }
                });

                setLastPrices(newPrices);

                if (newCount > 0) {
                    setSignalsCount(prev => prev + newCount);
                    setLastSignalTime(latestTime);
                }

                // تصفير العداد بعد فترة إذا لم يكن هناك جديد (اختياري، لكي لا يبقى الرقم للأبد)
                // setTimeout(() => setSignalsCount(0), 10000); 

            } catch (e) {
                console.error("Background Radar Scan Error", e);
            }
        };

        const interval = setInterval(scan, 30000); // كل 30 ثانية
        return () => clearInterval(interval);
    }, [lastPrices]);

    return (
        <RadarContext.Provider value={{ signalsCount, lastSignalTime }}>
            {children}
        </RadarContext.Provider>
    );
}
