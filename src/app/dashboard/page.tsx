'use client';

import { UnifiedAnalysis } from '@/components/dashboard/unified-analysis';
import { MarketSessions } from '@/components/dashboard/market-sessions';
import { AILiveStatus } from '@/components/dashboard/ai-live-status';
import { MorningIntel } from '@/components/dashboard/morning-intel';

import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Users, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type UserProfile = {
    language?: 'en' | 'ar' | 'es';
    totalReferrals?: number;
    pendingEarnings?: number;
    totalEarnings?: number;
};

const translations = {
    en: {
        title: 'Unified Chart Analysis',
        description: 'Get trade signals by uploading or capturing a chart.',
        referTitle: 'Refer & Earn',
        referBtn: 'View Program',
        balance: 'Balance',
        referrals: 'Referrals',
        perUser: '$10 per user',
        noReferrals: 'No referrals yet — start sharing!',
    },
    ar: {
        title: 'تحليل موحد للرسوم البيانية',
        description: 'احصل على إشارات تداول عن طريق رفع أو التقاط صورة للرسم البياني.',
        referTitle: 'أحل واكسب',
        referBtn: 'عرض البرنامج',
        balance: 'الرصيد',
        referrals: 'الإحالات',
        perUser: '10$ لكل مستخدم',
        noReferrals: 'لا توجد إحالات بعد — ابدأ المشاركة!',
    },
    es: {
        title: 'Análisis de Gráficos Unificado',
        description: 'Obtenga señales de trading subiendo o capturando un gráfico.',
        referTitle: 'Referir y Ganar',
        referBtn: 'Ver Programa',
        balance: 'Balance',
        referrals: 'Referidos',
        perUser: '$10 por usuario',
        noReferrals: '¡Aún no tienes referidos!',
    },
};

export default function DashboardPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (user && firestore) {
            const userDocRef = doc(firestore, 'users', user.uid);
            const unsubscribe = onSnapshot(userDocRef, (snap) => {
                if (snap.exists()) {
                    setUserProfile(snap.data() as UserProfile);
                }
            });
            return () => unsubscribe();
        }
    }, [user, firestore]);

    const lang = (userProfile?.language || 'en') as 'en' | 'ar' | 'es';
    const t = translations[lang] || translations.en;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    const totalReferrals = userProfile?.totalReferrals ?? 0;
    const pendingEarnings = userProfile?.pendingEarnings ?? 0;
    const totalEarnings = userProfile?.totalEarnings ?? 0;
    const hasReferrals = totalReferrals > 0;

    return (
        <div className="flex flex-col gap-8" dir={dir}>
            <MarketSessions />

            {/* ── AURA Intelligence Section ── */}
            <MorningIntel lang={lang} />

            {/* ── Page title & AI Live Status ── */}

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="font-headline text-3xl font-bold tracking-tighter">
                        {t.title}
                    </h1>
                    <p className="text-muted-foreground text-sm">{t.description}</p>
                </div>
                <div className="w-fit max-w-full">
                    <AILiveStatus />
                </div>
            </div>

            {/* ── Refer & Earn compact banner ── */}
            <div className="relative rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-600/8 via-purple-500/5 to-indigo-500/8 overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />
                    <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 px-5 py-4">

                    {/* Icon + label */}
                    <div className="flex items-center gap-3 sm:w-auto w-full">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/25 flex-shrink-0">
                            <Gift className="h-4 w-4 text-violet-400" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-foreground leading-tight">{t.referTitle}</p>
                            <p className="text-[10px] text-violet-400 font-bold">{t.perUser}</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block h-10 w-px bg-border/60" />

                    {/* Stats: Referrals + Balance */}
                    <div className="flex items-center gap-5 flex-1">

                        {/* Referral count */}
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50">
                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-none">
                                    {t.referrals}
                                </p>
                                <p className={`text-lg font-black tabular-nums leading-tight ${hasReferrals ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                                    {totalReferrals}
                                </p>
                            </div>
                        </div>

                        {/* Vertical mini divider */}
                        <div className="h-8 w-px bg-border/40" />

                        {/* Available balance */}
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-none">
                                    {t.balance}
                                </p>
                                <p className={`text-lg font-black tabular-nums font-mono leading-tight ${pendingEarnings > 0 ? 'text-emerald-500' : 'text-muted-foreground/40'}`}>
                                    ${pendingEarnings.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Total earned (only show if > 0) */}
                        {totalEarnings > 0 && (
                            <>
                                <div className="h-8 w-px bg-border/40" />
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
                                        <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-none">
                                            Total
                                        </p>
                                        <p className="text-lg font-black tabular-nums font-mono leading-tight text-violet-400">
                                            ${totalEarnings.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* No referrals hint */}
                        {!hasReferrals && (
                            <p className="hidden md:block text-[10px] text-muted-foreground/50 italic flex-1">
                                {t.noReferrals}
                            </p>
                        )}
                    </div>

                    {/* CTA Button */}
                    <Button
                        size="sm"
                        className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white gap-1.5 text-xs font-bold sm:w-auto w-full"
                        asChild
                    >
                        <Link href={`/dashboard/affiliate?lang=${lang}`}>
                            {t.referBtn}
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
            </div>

            <UnifiedAnalysis />
        </div >
    );
}
