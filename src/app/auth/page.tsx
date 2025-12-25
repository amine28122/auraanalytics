'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SocialSignInButtons } from '@/components/auth/auth-form';
import { FirebaseClientProvider, useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { AuraAcademyLogo } from '@/components/logo';

function AuthenticationContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
         <AuraAcademyLogo iconOnly className="h-16 w-16" />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-6">
        <AuraAcademyLogo />
        <SocialSignInButtons />
    </div>
  );
}

export default function AuthenticationPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
          <FirebaseClientProvider>
            <AuthenticationContent />
          </FirebaseClientProvider>
        </Suspense>
      </div>
    </main>
  );
}
