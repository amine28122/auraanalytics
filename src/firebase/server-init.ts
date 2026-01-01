import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;

export function initializeServerFirebase(): { app: FirebaseApp; firestore: Firestore | null; storage: FirebaseStorage | null; } {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  try {
    firestore = getFirestore(app);
  } catch (e) {
    console.error("Firestore could not be initialized on the server:", e);
  }

  try {
    storage = getStorage(app);
  } catch (e) {
    console.error("Storage could not be initialized on the server:", e);
  }

  return { app, firestore, storage };
}
