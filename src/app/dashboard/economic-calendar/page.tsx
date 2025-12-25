'use client';
import EconomicCalendarWidget from '@/components/dashboard/economic-calendar-widget';
import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type UserProfile = {
    language?: 'en' | 'ar' | 'es';
}

type Theme = 'light' | 'dark';

const translations = {
    en: {
        title: 'Economic Calendar',
        description: 'Stay updated with important financial events from around the world.',
    },
    ar: {
        title: 'التقويم الاقتصادي',
        description: 'ابق على اطلاع على الأحداث المالية الهامة من جميع أنحاء العالم.',
    },
    es: {
        title: 'Calendario Económico',
        description: 'Manténgase actualizado con los eventos financieros importantes de todo el mundo.',
    }
}

export default function EconomicCalendarPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        // Function to check theme
        const checkTheme = () => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setTheme(currentTheme);
        };

        // Initial check
        checkTheme();

        // Set up a mutation observer to watch for class changes on the <html> element
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // Clean up the observer on component unmount
        return () => {
        observer.disconnect();
        };
    }, []);


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
        <div className="flex flex-col gap-8 h-full" dir={dir}>
             <div className="flex w-full flex-col gap-2">
                <h1 className="font-headline text-3xl font-bold tracking-tighter">
                    {t.title}
                </h1>
                <p className="text-muted-foreground">
                    {t.description}
                </p>
            </div>
            <div className="flex-grow">
                <EconomicCalendarWidget theme={theme} />
            </div>
        </div>
    );
}
