'use client';

import { UnifiedAnalysis } from '@/components/dashboard/unified-analysis';
import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import Link from 'next/link';


type UserProfile = {
    language?: 'en' | 'ar' | 'es';
}

const translations = {
    en: {
        title: 'Unified Chart Analysis',
        description: 'Get trade signals by uploading or capturing a chart.',
        referTitle: 'Refer & Earn $10',
        referDesc: 'Get $10 for every new user you invite to AURA. Start building your network today.',
        referButton: 'Start Inviting',
    },
    ar: {
        title: 'تحليل موحد للرسوم البيانية',
        description: 'احصل على إشارات تداول عن طريق رفع أو التقاط صورة للرسم البياني.',
        referTitle: 'ادعُ واكسب 10$',
        referDesc: 'احصل على 10$ لكل مستخدم جديد تدعوه إلى أورا. ابدأ ببناء شبكتك اليوم.',
        referButton: 'ابدأ الدعوة',
    },
    es: {
        title: 'Análisis de Gráficos Unificado',
        description: 'Obtenga señales de trading subiendo o capturando un gráfico.',
        referTitle: 'Refiere y Gana $10',
        referDesc: 'Obtén $10 por cada nuevo usuario que invites a AURA. Comienza a construir tu red hoy.',
        referButton: 'Comenzar a Invitar',
    }
}

export default function DashboardPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (user && firestore) {
            const userDocRef = doc(firestore, 'users', user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setUserProfile(doc.data() as UserProfile);
                }
            });
            return () => unsubscribe();
        }
    }, [user, firestore]);

    const lang = userProfile?.language || 'en';
    const t = translations[lang] || translations.en;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
        <div className="flex flex-col gap-8" dir={dir}>
            <div className="flex w-full flex-col gap-2">
                <h1 className="font-headline text-3xl font-bold tracking-tighter">
                    {t.title}
                </h1>
                <p className="text-muted-foreground">
                    {t.description}
                </p>
            </div>

            <Card className="bg-gradient-to-r from-violet-600/10 via-purple-500/10 to-indigo-500/10 border-violet-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Gift className="h-32 w-32 -mr-8 -mt-8" />
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 relative z-10">
                    <div className="space-y-1">
                        <h3 className="font-headline text-lg font-bold flex items-center gap-2 text-violet-600 dark:text-violet-400">
                            <Gift className="h-5 w-5" />
                            {t.referTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            {t.referDesc}
                        </p>
                    </div>
                    <Button className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white" asChild>
                        <Link href={`/dashboard/affiliate?lang=${lang}`}>
                            {t.referButton}
                        </Link>
                    </Button>
                </div>
            </Card>

            <UnifiedAnalysis />
        </div>
    );
}
