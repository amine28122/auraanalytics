// Import the functions you need from the SDKs you need
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCixfnelhBuxvaSlDQiCldJyIZOhXU2E_Q",
  authDomain: "aura-analytics-d2902.firebaseapp.com",
  projectId: "aura-analytics-d2902",
  storageBucket: "aura-analytics-d2902.appspot.com",
  messagingSenderId: "974014316090",
  appId: "1:974014316090:web:259dbbd8fc2ce67ecfff03",
  measurementId: "G-52XLZD9J8L"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

export { app };
