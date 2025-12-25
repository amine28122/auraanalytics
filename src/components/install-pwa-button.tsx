'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, MoreVertical } from 'lucide-react';
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
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    if(isAppInstalled) return;

    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
    } else {
      setShowInstructions(true);
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

  return (
    <>
        <Button onClick={handleInstallClick} aria-label="Get The App" size="lg" className="futuristic-button group">
            <Download className="mr-2 h-5 w-5 cta-icon" />
            <span>Install App</span>
        </Button>

        <AlertDialog open={showInstructions} onOpenChange={setShowInstructions}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>How to Install</AlertDialogTitle>
                    <AlertDialogDescription>
                        You can install this app on your device for a better experience. Follow the instructions for your browser.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4 space-y-3">
                   <p className="text-sm text-muted-foreground">
                      <strong>On iPhone/iPad:</strong> Tap the <Share className="inline h-4 w-4 mx-1"/> icon, then scroll down and tap 'Add to Home Screen'.
                   </p>
                   <p className="text-sm text-muted-foreground">
                      <strong>On Android/Other:</strong> Tap the <MoreVertical className="inline h-4 w-4 mx-1"/> menu icon in your browser and look for an 'Install app' or 'Add to Home Screen' option.
                   </p>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction>Got It</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
