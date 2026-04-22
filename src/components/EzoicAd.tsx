'use client';

import React, { useEffect } from 'react';

interface EzoicAdProps {
  id: number;
}

/**
 * EzoicAd component for rendering Ezoic ad placeholders in a React application.
 * It uses the ezstandalone library to initialize and show ads when the component mounts.
 */
export function EzoicAd({ id }: EzoicAdProps) {
  useEffect(() => {
    try {
      // Access the ezstandalone global object
      const win = window as any;
      if (typeof win !== 'undefined') {
        win.ezstandalone = win.ezstandalone || {};
        win.ezstandalone.cmd = win.ezstandalone.cmd || [];

        win.ezstandalone.cmd.push(() => {
          // Define the placeholder and show the ad
          win.ezstandalone.showAds(id);
        });
      }
    } catch (e) {
      console.error('Ezoic ad loading failed:', e);
    }
  }, [id]);

  return (
    <div className="ezoic-ad-container my-4 flex justify-center overflow-hidden min-h-[50px]">
      <div id={`ezoic-pub-ad-placeholder-${id}`}></div>
    </div>
  );
}
