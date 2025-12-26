'use client';
import React, { useEffect, useRef, memo } from 'react';
import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useState } from 'react';

type UserProfile = {
  language?: 'en' | 'ar' | 'es';
}

type Theme = 'light' | 'dark';

function EconomicCalendarWidget({ theme = 'dark' }: { theme?: Theme }) {
  const container = useRef<HTMLDivElement>(null);
  const { user, firestore } = useAuth();
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

  useEffect(() => {
    const containerRef = container.current;
    if (!containerRef) return;

    // Clear previous widget
    containerRef.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.async = true;
    script.type = "text/javascript";

    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      isTransparent: false,
      locale: lang,
      countryFilter:
        "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu",
      importanceFilter: "1,2,3", // Show all importance levels
      width: "100%",
      height: "100%"
    });

    containerRef.appendChild(script);

    return () => {
      // Check if the container reference is still valid before cleaning up
      if (containerRef && containerRef.contains(script)) {
         try {
            containerRef.removeChild(script);
         } catch (e) {
            // ignore errors during cleanup
         }
      }
    }

  }, [lang, theme]);

  return (
    <div
      ref={container}
      className="tradingview-widget-container"
      style={{ width: "100%", height: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default memo(EconomicCalendarWidget);
