'use client';

import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Network, RefreshCcw, Info } from 'lucide-react';
import { getMarketCorrelations } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';

const translations = {
    en: {
        title: 'Market Correlation Matrix',
        desc: 'Live Inter-market Relationships (Daily Change)',
        howToRead: 'How to read this Spider?',
        riskOn: 'Risk On',
        riskOff: 'Risk Off',
        neutral: 'Neutral',
        riskOnDesc: 'Money is flowing into assets (Stocks, Crypto). Good for Buying.',
        riskOffDesc: 'Money is fleeing to cash (USD). Good for Selling Risk Assets.',
        divergence: 'Divergence (Danger)',
        divergenceDesc: 'If Gold & DXY both extend, the market is broken. Stay safe.',
        liveData: 'Live Market Feed',
        dxy: 'DXY (Est)',
        gold: 'Gold',
        oil: 'Oil',
        yields: 'Yields',
        btc: 'BTC',
        sp500: 'S&P 500',
    },
    ar: {
        title: 'مصفوفة الترابط بين الأسواق',
        desc: 'علاقات الأسواق الحية (التغير اليومي)',
        howToRead: 'كيف تقرأ هذه الشبكة؟',
        riskOn: 'شهية مخاطرة (Risk On)',
        riskOff: 'تجنب مخاطرة (Risk Off)',
        neutral: 'محايد',
        riskOnDesc: 'السيولة تتدفق نحو الأصول (أسهم، كريبتو). وقت جيد للشراء.',
        riskOffDesc: 'السيولة تهرب نحو الكاش (الدولار). وقت جيد لبيع الأصول الخطرة.',
        divergence: 'تشتت (خطر)',
        divergenceDesc: 'إذا ارتفع الذهب والدولار معاً، السوق في حالة غير طبيعية. كن حذراً.',
        liveData: 'بيانات السوق الحية',
        dxy: 'الدولار (تقديري)',
        gold: 'الذهب',
        oil: 'النفط',
        yields: 'السندات',
        btc: 'بيتكوين',
        sp500: 'الأسهم S&P',
    }
};

const defaultData = [
    { id: 'dxy', subject: 'DXY (Est)', A: 50, rawChange: 0, fullMark: 100 },
    { id: 'gold', subject: 'Gold', A: 50, rawChange: 0, fullMark: 100 },
    { id: 'oil', subject: 'Oil', A: 50, rawChange: 0, fullMark: 100 },
    { id: 'yields', subject: 'Yields', A: 50, rawChange: 0, fullMark: 100 },
    { id: 'btc', subject: 'BTC', A: 50, rawChange: 0, fullMark: 100 },
    { id: 'sp500', subject: 'SP500', A: 50, rawChange: 0, fullMark: 100 },
];

export function CorrelationSpider() {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') === 'ar') ? 'ar' : 'en';
    const t = translations[lang];

    const [data, setData] = useState(defaultData);
    const [marketMood, setMarketMood] = useState<'Risk On' | 'Risk Off' | 'Neutral'>('Neutral');
    const [loading, setLoading] = useState(true);

    // Update subjects based on language
    const displayedData = data.map(item => ({
        ...item,
        subject: t[item.id as keyof typeof t] || item.subject
    }));

    const fetchData = async () => {
        try {
            const results = await getMarketCorrelations();
            if (!results || results.length === 0) {
                setLoading(false);
                return;
            }

            const newData = defaultData.map(item => {
                let score = 50;
                let rawChange = 0;
                const multiplier = 25;

                if (item.id === 'dxy') {
                    const eur = results.find(r => r.key === 'EURUSD');
                    if (eur) {
                        rawChange = -eur.change;
                        score = 50 + (rawChange * multiplier);
                    }
                } else if (item.id === 'gold') {
                    const gold = results.find(r => r.key === 'GOLD');
                    if (gold) {
                        rawChange = gold.change;
                        score = 50 + (rawChange * multiplier);
                    }
                } else if (item.id === 'oil') {
                    const oil = results.find(r => r.key === 'OIL');
                    if (oil) {
                        rawChange = oil.change;
                        score = 50 + (rawChange * 15);
                    }
                } else if (item.id === 'yields') {
                    const yields = results.find(r => r.key === 'YIELDS');
                    if (yields) {
                        rawChange = yields.change;
                        score = 50 + (rawChange * 15);
                    }
                } else if (item.id === 'btc') {
                    const btc = results.find(r => r.key === 'BTC');
                    if (btc) {
                        rawChange = btc.change;
                        score = 50 + (rawChange * 8);
                    }
                } else if (item.id === 'sp500') {
                    const spy = results.find(r => r.key === 'SPY');
                    if (spy) {
                        rawChange = spy.change;
                        score = 50 + (rawChange * multiplier);
                    }
                }

                return {
                    ...item,
                    rawChange: Number(rawChange.toFixed(2)),
                    A: Number(Math.min(100, Math.max(5, score)).toFixed(1))
                };
            });

            setData(newData);
        } catch (err) {
            console.error("Failed to update spider", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const dxy = data.find(d => d.id === 'dxy')!.A;
        const sp500 = data.find(d => d.id === 'sp500')!.A;
        const btc = data.find(d => d.id === 'btc')!.A;

        const riskAssetsAvg = (sp500 + btc) / 2;

        if (riskAssetsAvg > dxy + 5) setMarketMood('Risk On');
        else if (dxy > riskAssetsAvg + 5) setMarketMood('Risk Off');
        else setMarketMood('Neutral');
    }, [data]);

    const moodLabel = marketMood === 'Risk On' ? t.riskOn : (marketMood === 'Risk Off' ? t.riskOff : t.neutral);

    return (
        <Card className="w-full h-full border-none shadow-none bg-transparent overflow-visible relative" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Gradient removed for seamless look */}

            <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <Network className="w-5 h-5 text-primary" />
                            {t.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                            {t.desc}
                        </CardDescription>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className="group relative">
                            <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                            <div className={`absolute top-6 w-64 p-3 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-xl text-[10px] text-foreground invisible group-hover:visible z-50 transition-all opacity-0 group-hover:opacity-100 ring-1 ring-border ${lang === 'ar' ? 'left-0' : 'right-0'}`}>
                                <p className="font-bold mb-2 text-primary">{t.howToRead}</p>
                                <ul className="list-disc pl-3 space-y-2 text-muted-foreground">
                                    <li>
                                        <span className="text-green-500 font-bold block mb-0.5">{t.riskOn}</span>
                                        {t.riskOnDesc}
                                    </li>
                                    <li>
                                        <span className="text-red-500 font-bold block mb-0.5">{t.riskOff}</span>
                                        {t.riskOffDesc}
                                    </li>
                                    <li>
                                        <span className="text-amber-500 font-bold block mb-0.5">{t.divergence}</span>
                                        {t.divergenceDesc}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {loading && <RefreshCcw className='w-3 h-3 animate-spin text-muted-foreground' />}
                        <Badge variant={marketMood === 'Risk On' ? 'default' : marketMood === 'Risk Off' ? 'destructive' : 'secondary'} className="whitespace-nowrap">
                            {moodLabel}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={displayedData}>
                        <PolarGrid stroke="rgba(128, 128, 128, 0.2)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: lang === 'ar' ? 12 : 10, fontWeight: 'bold', fontFamily: lang === 'ar' ? 'Tajawal, sans-serif' : 'inherit' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Market Strength"
                            dataKey="A"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fill="#8b5cf6"
                            fillOpacity={0.3}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(_val: any, _name: any, props: any) => {
                                const pct = props?.payload?.rawChange ?? 0;
                                const sign = pct > 0 ? '+' : '';
                                return [`${sign}${pct}% (${props?.payload?.A ?? 50}/100)`, lang === 'ar' ? 'التغير اليومي' : 'Daily Change'];
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>

                <div className={`absolute bottom-2 text-[10px] text-muted-foreground flex items-center gap-1 opacity-70 ${lang === 'ar' ? 'left-2' : 'right-2'}`}>
                    <Activity className="w-3 h-3" /> {t.liveData}
                </div>
            </CardContent>
        </Card>
    );
}
