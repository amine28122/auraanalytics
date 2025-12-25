'use client';

import { UnifiedAnalysis } from '@/components/dashboard/unified-analysis';
import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';


type UserProfile = {
    language?: 'en' | 'ar' | 'es';
}

const translations = {
    en: {
        title: 'Unified Chart Analysis',
        description: 'Get trade signals by uploading or capturing a chart.',
    },
    ar: {
        title: 'تحليل موحد للرسوم البيانية',
        description: 'احصل على إشارات تداول عن طريق رفع أو التقاط صورة للرسم البياني.',
    },
    es: {
        title: 'Análisis de Gráficos Unificado',
        description: 'Obtenga señales de trading subiendo o capturando un gráfico.',
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
            <UnifiedAnalysis />
        </div>
    );
}
