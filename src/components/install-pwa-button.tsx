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
        const checkInstalled = () => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsAppInstalled(true);
            }
        };
        checkInstalled();

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            // Only set the prompt if the app is not already installed
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                setPrompt(event);
            }
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
  
  // Determine button properties based on state
  let buttonText: string;
  let buttonDisabled: boolean;
  let onClickHandler: () => void = () => {};

  if (isAppInstalled) {
      buttonText = 'Installed';
      buttonDisabled = true;
  } else if (prompt) {
      buttonText = 'Install App';
      buttonDisabled = false;
      onClickHandler = handleInstallClick;
  } else {
      // This state is shown initially, and for unsupported browsers.
      buttonText = 'Install Not Supported';
      buttonDisabled = true;
  }

  return (
    <Button
      onClick={onClickHandler}
      disabled={buttonDisabled}
      aria-label="Get The App"
      size="lg"
      className="futuristic-button group"
    >
      <Download className="mr-2 h-5 w-5 cta-icon" />
      <span>{buttonText}</span>
    </Button>
  );
}
