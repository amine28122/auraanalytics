'use client';

import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;

function initializeFirebase(): { app: FirebaseApp; auth: Auth; firestore: Firestore | null; storage: FirebaseStorage | null; } {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Use initializeAuth to ensure persistence is set correctly, especially on the client.
  // This avoids re-creating the auth instance unnecessarily.
  try {
    auth = getAuth(app);
  } catch (e) {
    auth = initializeAuth(app, {
        persistence: browserLocalPersistence
    });
  }

  try {
      firestore = getFirestore(app);
  } catch (e) {
      console.error("Firestore could not be initialized:", e);
  }

  try {
      storage = getStorage(app);
  } catch (e) {
      console.error("Storage could not be initialized:", e);
  }
  
  return { app, auth, firestore, storage };
}


export { initializeFirebase };

export { FirebaseClientProvider } from './client-provider';
export { FirebaseProvider, useFirebase, useAuth, useFirestore, useCollection, useDoc, useUser } from './provider';
export { useMemoFirebase } from './use-memo-firebase';
