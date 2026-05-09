'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, getDoc, updateDoc, collection, query, where, getDocs, increment } from 'firebase/firestore';
import { useAuth } from '@/firebase';
import GoogleIcon from '@/components/icons/google-icon';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const translations = {
  en: {
    continueWithGoogle: 'Continue with Google',
    languageLabel: 'Language',
    referralLabel: 'Referral Code (Optional)',
    authErrorTitle: 'Authentication Error',
    errors: {
      'auth/popup-closed-by-user': 'The sign-in window was closed. Please try again.',
      default: 'Authentication failed. Please try again.',
    },
  },
  ar: {
    continueWithGoogle: 'المتابعة باستخدام جوجل',
    languageLabel: 'اللغة',
    referralLabel: 'كود الإحالة (اختياري)',
    authErrorTitle: 'خطأ في المصادقة',
    errors: {
      'auth/popup-closed-by-user': 'تم إغلاق نافذة تسجيل الدخول. يرجى المحاولة مرة أخرى.',
      default: 'فشلت المصادقة. يرجى المحاولة مرة أخرى.',
    },
  },
  es: {
    continueWithGoogle: 'Continuar con Google',
    languageLabel: 'Idioma',
    referralLabel: 'Código de Referido (Opcional)',
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
  const [referralCode, setReferralCode] = useState('');
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

    // Check for referral code in session storage
    const storedRef = sessionStorage.getItem('aura_ref');
    if (storedRef) {
      setReferralCode(storedRef);
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
      handleAuthError({ code: 'firestore-not-initialized', message: 'Firestore or Auth is not available.' });
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
        // Handle Referrals
        let referredBy = null;
        const codeToUse = referralCode.trim();

        if (codeToUse) {
          try {
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("referralCode", "==", codeToUse.toUpperCase()));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              referredBy = querySnapshot.docs[0].id;
            }
          } catch (err) {
            console.error("Error finding referrer:", err);
          }
        }

        // Generate unique referral code for the new user
        const newReferralCode = user.uid.substring(0, 8).toUpperCase();

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
          referralCode: newReferralCode,
          referredBy: referredBy,
          totalReferrals: 0,
          activeReferrals: 0,
          totalEarnings: 0,
          pendingEarnings: 0,
        });

        // Increment Referrer's total count
        if (referredBy) {
          const referrerDocRef = doc(firestore, "users", referredBy);
          const referrerDoc = await getDoc(referrerDocRef);
          if (referrerDoc.exists()) {
            await updateDoc(referrerDocRef, {
              totalReferrals: increment(1)
            });
          }
        }

        // Handle JVZoo Pending Registrations
        try {
          const salesRef = collection(firestore, "jvzooSales");
          const pendingQuery = query(salesRef, where("email", "==", user.email), where("status", "==", "pending_registration"));
          const pendingDocs = await getDocs(pendingQuery);
          
          if (!pendingDocs.empty) {
            const saleDoc = pendingDocs.docs[0];
            // Immediately activate Premium for this user since they paid before registering
            await updateDoc(userDocRef, { 
              plan: 'Premium', 
              planStartDate: serverTimestamp() 
            });
            await updateDoc(doc(firestore, "jvzooSales", saleDoc.id), { 
              status: 'activated', 
              userId: user.uid 
            });
          }
        } catch (e) {
          console.error("Error checking pending JVZoo sales:", e);
        }

        // Clear stored ref after successful registration
        sessionStorage.removeItem('aura_ref');
      } else {
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
    <div className="w-full space-y-4">
      <Button variant="outline" className="w-full" type="button" disabled={loading} onClick={handleGoogleSignIn}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        {t.continueWithGoogle}
      </Button>
      <div className="space-y-2">
        <Label htmlFor="language">{t.languageLabel}</Label>
        <Select
          value={language}
          onValueChange={(value) => setLanguage(value as keyof typeof translations)}
        >
          <SelectTrigger id="language" className="w-full h-11">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="referral" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t.referralLabel}
        </Label>
        <Input
          id="referral"
          placeholder="E.g. AURA123"
          className="h-11 font-mono uppercase tracking-widest bg-muted/30 focus:bg-background transition-all"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />
      </div>
    </div>
  );
}
