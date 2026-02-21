'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/firebase';
import { getAnalyses, updateAnalysisStatus, getSharedPrices, cleanupOldAnalyses, SavedAnalysis } from '@/lib/actions';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Clock, TrendingUp, TrendingDown, CheckCircle2, XCircle, AlertCircle, Trash2, LayoutDashboard,
    ThumbsUp, ThumbsDown, BookOpen, FileText
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useFirebase } from '@/firebase';

const translations = {
    en: {
        title: 'Analysis History',
        desc: 'Watch your trade analyses evolve. Review your past performance and strategies.',
        noAnalyses: 'No analyses found. Start by analyzing a chart!',
        pending: 'Pending',
        won: 'Target Hit',
        lost: 'Stop Loss',
        entry: 'Entry',
        tp: 'TP',
        sl: 'SL',
        current: 'Current',
        backToDashboard: 'Back to Dashboard',
        lastUpdated: 'Updated just now',
        schools: 'Schools',
        analysisSummary: 'Analysis Summary',
        rateTitle: 'Did this trade work for you?',
        comprehensive: 'Comprehensive',
    },
    ar: {
        title: 'سجل التحليلات',
        desc: 'راقب تطور تحليلاتك. راجع أداءك واستراتيجياتك السابقة.',
        noAnalyses: 'لا يوجد تحليلات. ابدأ بتحليل أول شارت الآن!',
        pending: 'قيد الانتظار',
        won: 'تم ضرب الهدف',
        lost: 'ضرب الوقف',
        entry: 'الدخول',
        tp: 'الهدف',
        sl: 'الوقف',
        current: 'السعر الحالي',
        backToDashboard: 'العودة للوحة التحكم',
        lastUpdated: 'تم التحديث الآن',
        schools: 'المدارس المستخدمة',
        analysisSummary: 'ملخص التحليل',
        rateTitle: 'هل نجحت معك هذه الصفقة؟',
        comprehensive: 'تحليل شامل',
    }
};

export default function HistoryPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase(); // Need firestore for direct updates
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';
    const t = translations[lang === 'ar' ? 'ar' : 'en'];

    // Define extended type locally or use any if SafeAnalysis is strict
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAndTrack = async () => {
        if (!user) return;

        // 1. Cleanup old ones first
        await cleanupOldAnalyses(user.uid);

        // 2. Fetch current list
        const result = await getAnalyses(user.uid);
        if (result.success) {
            const items = result.items;
            setAnalyses(items);
            setLoading(false);

            // 3. Track pending items using the Shared Price Hub
            const pendingItems = items.filter(a => a.status === 'PENDING');
            if (pendingItems.length > 0) {
                // Collect unique pairs to minimize API calls
                const uniquePairs = Array.from(new Set(pendingItems.map(p => p.pair)));

                // Fetch prices from the shared global cache (Updates once per minute for everyone)
                const priceMap = await getSharedPrices(uniquePairs);

                // Check conditions
                for (const item of pendingItems) {
                    const price = priceMap[item.pair];
                    if (!price) continue;

                    let newStatus: 'WON' | 'LOST' | null = null;

                    if (item.type === 'BUY') {
                        if (price >= item.takeProfit) newStatus = 'WON';
                        else if (price <= item.stopLoss) newStatus = 'LOST';
                    } else {
                        if (price <= item.takeProfit) newStatus = 'WON';
                        else if (price >= item.stopLoss) newStatus = 'LOST';
                    }

                    if (newStatus) {
                        await updateAnalysisStatus(user.uid, item.id, newStatus, price);
                    }
                }

                // Refresh the list locally to reflect status changes
                const refreshed = await getAnalyses(user.uid);
                if (refreshed.success) setAnalyses(refreshed.items);
            }
        }
    };

    useEffect(() => {
        fetchAndTrack();
        // Refresh every 2 minutes while page is open
        const interval = setInterval(fetchAndTrack, 120000);
        return () => clearInterval(interval);
    }, [user]);

    const handleRate = async (id: string, rating: 'LIKE' | 'DISLIKE') => {
        if (!user || !firestore) return;

        // Optimistic update
        setAnalyses(prev => prev.map(a => a.id === id ? { ...a, userRating: rating } : a));

        try {
            const docRef = doc(firestore, 'users', user.uid, 'analyses', id);
            await updateDoc(docRef, { userRating: rating });
        } catch (error) {
            console.error("Failed to rate", error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground">Loading your analysis history...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">{t.title}</h1>
                    <p className="text-muted-foreground max-w-2xl mt-1">{t.desc}</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/dashboard?lang=${lang}`}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t.backToDashboard}
                    </Link>
                </Button>
            </div>

            {analyses.length === 0 ? (
                <Card className="border-dashed py-20">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                            <AlertCircle className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">{t.noAnalyses}</h3>
                            <Button asChild>
                                <Link href={`/dashboard?lang=${lang}`}>Analyze Chart Now</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {analyses.map((item) => (
                        <Card key={item.id} className="overflow-hidden flex flex-col h-full hover-glow transition-all duration-300 border-border/50 bg-card/50">
                            <div className="relative h-48 w-full group overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.pair}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-2 right-2">
                                    {item.status === 'PENDING' ? (
                                        <Badge variant="secondary" className="bg-amber-500/90 text-white backdrop-blur-md border-none">
                                            <Clock className="mr-1 h-3 w-3" /> {t.pending}
                                        </Badge>
                                    ) : item.status === 'WON' ? (
                                        <Badge className="bg-green-500/90 text-white backdrop-blur-md border-none">
                                            <CheckCircle2 className="mr-1 h-3 w-3" /> {t.won}
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive" className="bg-red-500/90 text-white backdrop-blur-md border-none">
                                            <XCircle className="mr-1 h-3 w-3" /> {t.lost}
                                        </Badge>
                                    )}
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] text-white flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5" />
                                    {(() => {
                                        const dateData = item.createdAt as any;
                                        let date: Date;

                                        if (dateData instanceof Timestamp) {
                                            date = dateData.toDate();
                                        } else if (dateData?.seconds) {
                                            date = new Date(dateData.seconds * 1000);
                                        } else if (typeof dateData === 'string') {
                                            date = new Date(dateData);
                                        } else {
                                            date = new Date();
                                        }

                                        return date.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        });
                                    })()}
                                </div>
                            </div>

                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{item.pair}</CardTitle>
                                    <div className={`flex items-center gap-1 font-bold ${item.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                        {item.type === 'BUY' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        {item.type}
                                    </div>
                                </div>
                                {/* Schools Tags */}
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {item.schools && item.schools.length > 0 ? (
                                        item.schools.map((school: string, idx: number) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="text-[10px] py-0.5 h-auto bg-primary/5 border-primary/20 whitespace-nowrap"
                                            >
                                                <BookOpen className="w-3 h-3 mr-1 inline-block" />
                                                {school}
                                            </Badge>
                                        ))
                                    ) : (
                                        <Badge variant="outline" className="text-[10px] py-0.5 h-auto bg-muted border-muted-foreground/20">
                                            {t.comprehensive}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 pt-0 flex-1 flex flex-col gap-4">
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <div className="bg-muted/50 p-2 rounded-lg text-center flex flex-col justify-center items-center">
                                        <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">{t.entry}</p>
                                        <p className="text-sm font-bold flex items-center gap-1">
                                            {item.entryLabel || (item.entry > 0 ? item.entry : "Market")}
                                            {item.orderType === 'Pending' && (
                                                <span className="text-[8px] bg-amber-500/20 text-amber-600 px-1 py-0.5 rounded uppercase font-bold tracking-wider">
                                                    Pending
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-green-500/10 p-2 rounded-lg text-center">
                                        <p className="text-[10px] uppercase text-green-600 font-semibold">{t.tp}</p>
                                        <p className="text-sm font-bold text-green-600">{item.takeProfit}</p>
                                    </div>
                                    <div className="bg-red-500/10 p-2 rounded-lg text-center">
                                        <p className="text-[10px] uppercase text-red-600 font-semibold">{t.sl}</p>
                                        <p className="text-sm font-bold text-red-600">{item.stopLoss}</p>
                                    </div>
                                </div>

                                {item.analysis && (
                                    <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground leading-relaxed max-h-24 overflow-y-auto custom-scrollbar">
                                        <div className="flex items-center gap-1 mb-1 font-bold text-foreground">
                                            <FileText className="w-3 h-3" /> {t.analysisSummary}
                                        </div>
                                        {item.analysis}
                                    </div>
                                )}

                                {item.currentPrice && (
                                    <div className="p-2 rounded-md bg-secondary flex justify-between items-center">
                                        <span className="text-xs font-medium text-muted-foreground">{t.current}</span>
                                        <span className="text-sm font-bold">{item.currentPrice}</span>
                                    </div>
                                )}

                                {/* Rating System */}
                                <div className={`mt-auto pt-4 border-t border-border/50 flex items-center justify-between ${item.userRating ? 'opacity-80' : ''}`}>
                                    <span className="text-xs font-medium text-muted-foreground">{t.rateTitle}</span>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={item.userRating === 'LIKE' ? 'default' : 'ghost'}
                                            className={`h-8 w-8 p-0 rounded-full ${item.userRating === 'LIKE' ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-500/20 hover:text-green-500'}`}
                                            onClick={() => handleRate(item.id, 'LIKE')}
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={item.userRating === 'DISLIKE' ? 'default' : 'ghost'}
                                            className={`h-8 w-8 p-0 rounded-full ${item.userRating === 'DISLIKE' ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-500/20 hover:text-red-500'}`}
                                            onClick={() => handleRate(item.id, 'DISLIKE')}
                                        >
                                            <ThumbsDown className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
