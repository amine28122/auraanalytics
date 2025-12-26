'use client';

import { User, onAuthStateChanged, Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  storage: FirebaseStorage | null;
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export interface FirebaseProviderProps {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore | null;
  storage: FirebaseStorage | null;
}

export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
  storage,
}: FirebaseProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, router]);

  const value = useMemo(() => {
    return { app, auth, firestore, storage, user, loading };
  }, [app, auth, firestore, storage, user, loading]);


  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = (): FirebaseContextValue => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useAuth = () => {
    const context = useContext(FirebaseContext);
    if (context === null) {
        throw new Error('useAuth must be used within a FirebaseProvider');
    }
    return { user: context.user, loading: context.loading, auth: context.auth, firestore: context.firestore };
};

export const useFirestore = () => {
    const context = useContext(FirebaseContext);
    if (context === null) {
        throw new Error('useFirestore must be used within a FirebaseProvider');
    }
    return context.firestore;
}

// These are placeholders for the hooks that will be created.
// You can remove this comment once the actual hooks are implemented.
const useCollection = () => { console.warn("useCollection hook not implemented"); return { data: [], loading: true, error: null }; };
const useDoc = () => { console.warn("useDoc hook not implemented"); return { data: null, loading: true, error: null }; };
const useUser = () => { console.warn("useUser hook not implemented"); return { user: null, loading: true }; };

export { useCollection, useDoc, useUser };
