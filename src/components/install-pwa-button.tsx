'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function InstallPwaButton() {
  const [prompt, setPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // This check is important to prevent errors during server-side rendering
    if (typeof window !== 'undefined') {
        // Check if the app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsAppInstalled(true);
        }

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setPrompt(event);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        const handleAppInstalled = () => {
            setIsAppInstalled(true);
            setPrompt(null);
        };
        
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }
  }, []);

  const handleInstallClick = async () => {
    if (prompt) {
      // Show the PWA install prompt
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
    }
  };

  // Only show the button if PWA installation is possible and the app isn't installed yet.
  if (!prompt || isAppInstalled) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      aria-label="Get The App"
      size="lg"
      className="futuristic-button group"
    >
      <Download className="mr-2 h-5 w-5 cta-icon" />
      <span>Install App</span>
    </Button>
  );
}
