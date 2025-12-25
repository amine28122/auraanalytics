'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/firebase';
import GoogleIcon from '@/components/icons/google-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const translations = {
  en: {
    continueWithGoogle: 'Continue with Google',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    signInButton: 'Sign In',
    languageLabel: 'Language',
    authErrorTitle: 'Authentication Error',
    errors: {
      'auth/popup-closed-by-user': 'The sign-in window was closed. Please try again.',
      'auth/user-not-found': 'No user found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      default: 'Authentication failed. Please try again.',
    },
  },
  ar: {
    continueWithGoogle: 'المتابعة باستخدام جوجل',
    emailLabel: 'البريد الإلكتروني',
    passwordLabel: 'كلمة المرور',
    signInButton: 'تسجيل الدخول',
    languageLabel: 'اللغة',
    authErrorTitle: 'خطأ في المصادقة',
    errors: {
      'auth/popup-closed-by-user': 'تم إغلاق نافذة تسجيل الدخول. يرجى المحاولة مرة أخرى.',
      'auth/user-not-found': 'لم يتم العثور على مستخدم بهذا البريد الإلكتروني.',
      'auth/wrong-password': 'كلمة مرور غير صحيحة. يرجى المحاولة مرة أخرى.',
      default: 'فشلت المصادقة. يرجى المحاولة مرة أخرى.',
    },
  },
  es: {
    continueWithGoogle: 'Continuar con Google',
    emailLabel: 'Correo Electrónico',
    passwordLabel: 'Contraseña',
    signInButton: 'Iniciar Sesión',
    languageLabel: 'Idioma',
    authErrorTitle: 'Error de Autenticación',
    errors: {
      'auth/popup-closed-by-user': 'Se cerró la ventana de inicio de sesión. Por favor, inténtalo de nuevo.',
      'auth/user-not-found': 'No se encontró ningún usuario con este correo electrónico.',
      'auth/wrong-password': 'Contraseña incorrecta. Por favor, inténtalo de nuevo.',
      default: 'Falló la autenticación. Por favor, inténtalo de nuevo.',
    },
  },
};

export function SocialSignInButtons() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!auth) {
      handleAuthError({ code: 'auth-not-initialized', message: 'Auth is not available.'});
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      let userLang = language;
      if(userDoc.exists()) {
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
    <div className="w-full space-y-4">
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <Label htmlFor="email">{t.emailLabel}</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">{t.passwordLabel}</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="language">{t.languageLabel}</Label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as keyof typeof translations)}
            className="w-full p-2 border rounded-md"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="es">Español</option>
          </select>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t.signInButton}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
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
