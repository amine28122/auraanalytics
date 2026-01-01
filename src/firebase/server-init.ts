import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const adminConfig: any = {
      projectId: "aura-analytics-d2902",
    };

    // هذا الجزء مخصص لجعل النظام يعمل في "وضع الإنتاج" تلقائياً
    // وأيضاً يدعم العمل محلياً إذا وضعت المفتاح في .env.local
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const cert = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        adminConfig.credential = admin.credential.cert(cert);
      } catch (e) {
        console.error("The FIREBASE_SERVICE_ACCOUNT variable is not valid JSON.");
      }
    }

    admin.initializeApp(adminConfig);
    console.log("Firebase Admin Initialized");
  } catch (error: any) {
    console.error("Firebase Admin Error:", error.message);
  }
}

export function initializeServerFirebase() {
  return {
    app: admin.app(),
    firestore: admin.firestore(),
    storage: admin.storage(),
  };
}



