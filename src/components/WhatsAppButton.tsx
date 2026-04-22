'use client';

import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export const WhatsAppButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    if (!isVisible) return null;

    // Replace this with your actual WhatsApp number
    // Format: CountryCode + Number (e.g., 212600000000 for Morocco)
    const phoneNumber = '212664014193';
    const message = encodeURIComponent('Hello, I need support with AURA Analytics.');

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group"
            aria-label="Contact us on WhatsApp"
        >
            <MessageCircle className="w-8 h-8" />
            <span className="absolute right-16 bg-white text-black px-3 py-1 rounded-md text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Chat with us
            </span>
        </a>
    );
};
