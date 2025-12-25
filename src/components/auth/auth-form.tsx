'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/firebase';
import GoogleIcon from '@/components/icons/google-icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const translations = {
  en: {
    continueWithGoogle: 'Continue with Google',
    authErrorTitle: 'Authentication Error',
    errors: {
      'auth/popup-closed-by-user': 'The sign-in window was closed. Please try again.',
      default: 'Authentication failed. Please try again.',
    },
  },
  ar: {
    continueWithGoogle: 'المتابعة باستخدام جوجل',
    authErrorTitle: 'خطأ في المصادقة',
    errors: {
      'auth/popup-closed-by-user': 'تم إغلاق نافذة تسجيل الدخول. يرجى المحاولة مرة أخرى.',
      default: 'فشلت المصادقة. يرجى المحاولة مرة أخرى.',
    },
  },
  es: {
    continueWithGoogle: 'Continuar con Google',
    authErrorTitle: 'Error de Autenticación',
    errors: {
      'auth/popup-closed-by-user': 'Se cerró la ventana de inicio de sesión. Por favor, inténtalo de nuevo.',
      default: 'Falló la autenticación. Por favor, inténtalo de nuevo.',
    },
  },
};

export function SocialSignInButtons() {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<keyof typeof translations>('en');
  const { auth, firestore } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = translations[language];

  useEffect(() => {
    const lang = searchParams.get('lang');
    if (lang && translations[lang as keyof typeof translations]) {
      setLanguage(lang as keyof typeof translations);
    }
  }, [searchParams]);

  const handleAuthError = (error: any) => {
    setLoading(false);
    const errorCode = error.code as keyof typeof t.errors;
    const errorMessage = t.errors[errorCode] || t.errors.default;
    toast({
      variant: 'destructive',
      title: t.authErrorTitle,
      description: errorMessage,
    });
  };

  const redirectToDashboard = (lang: string) => {
    router.push(`/dashboard?lang=${lang}`);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    if (!firestore || !auth) {
      handleAuthError({ code: 'firestore-not-initialized', message: 'Firestore or Auth is not available.'});
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      let userLang = language;

      if (!userDoc.exists()) {
        // If user is new, create a new document
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          plan: 'Free',
          joined: serverTimestamp(),
          language: language,
          analysisCount: 0,
          lastAnalysisDate: null,
          learningProgress: {},
          preferredAnalysisSchools: [],
        });
      } else {
        // If user exists, update language if different and get their preferred lang
        const userData = userDoc.data();
        userLang = userData.language || language;
        if (userData.language !== language) {
          await updateDoc(userDocRef, { language });
        }
      }
      
      redirectToDashboard(userLang);
    } catch (error) {
      handleAuthError(error);
    }
  };

  return (
    <div className="w-full">
       <Button variant="outline" className="w-full" type="button" disabled={loading} onClick={handleGoogleSignIn}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        {t.continueWithGoogle}
      </Button>
    </div>
  );
}
