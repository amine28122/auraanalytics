'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

type LanguageContextType = {
    lang: Language;
    setLang: (lang: Language) => void;
    t: typeof translations['en'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Language>('en');

    // Load language preference from localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem('lang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
            setLang(savedLang);
        }
    }, []);

    const handleSetLang = (newLang: Language) => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    const value = {
        lang,
        setLang: handleSetLang,
        t: translations[lang],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
