'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export function InstallPwaButton() {
  const [prompt, setPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setIsIos(/iPhone|iPad|iPod/i.test(navigator.userAgent));

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
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
    } else if (isIos) {
        setShowIosInstructions(true);
    }
  };

  if (isAppInstalled) {
    return (
        <Button disabled size="lg" className="futuristic-button group">
            <Download className="mr-2 h-5 w-5" />
            <span>Installed</span>
        </Button>
    );
  }

  // PWA is installable via prompt, or it's iOS (manual install)
  if (prompt || isIos) {
      return (
        <>
            <Button onClick={handleInstallClick} aria-label="Get The App" size="lg" className="futuristic-button group">
                <Download className="mr-2 h-5 w-5 cta-icon" />
                <span>Install App</span>
            </Button>

            <AlertDialog open={showIosInstructions} onOpenChange={setShowIosInstructions}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Install on iPhone</AlertDialogTitle>
                        <AlertDialogDescription>
                            To install the app, tap the Share button and then select 'Add to Home Screen'.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 text-center">
                       <p className="text-sm text-muted-foreground">1. Tap the <Share className="inline h-4 w-4 mx-1"/> icon in the browser menu.</p>
                       <p className="text-sm text-muted-foreground mt-2">2. Scroll down and tap 'Add to Home Screen'.</p>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction>Got It</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
      );
  }

  // Fallback for non-supported browsers (that are not iOS)
  return (
    <Button disabled size="lg" className="futuristic-button group">
        <Download className="mr-2 h-5 w-5" />
        <span>Install Not Supported</span>
    </Button>
  );
}
