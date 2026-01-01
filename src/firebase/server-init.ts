import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

if (!admin.apps.length) {
  try {
    const adminConfig: any = {
      projectId: "aura-analytics-d2902",
    };

    // الطريقة الأولى: البحث عن ملف فعلي (هذه أسهل طريقة لك)
    const serviceAccountPath = path.join(process.cwd(), 'service-account.json');

    if (fs.existsSync(serviceAccountPath)) {
      const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
      adminConfig.credential = admin.credential.cert(JSON.parse(fileContent));
      console.log("✅ [Firebase Admin] SUCCESS: Loaded from service-account.json file.");
    }
    // الطريقة الثانية: البحث في متغيرات البيئة (للمواقع المرفوعة أونلاين)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const cleanJson = process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\n/g, '').trim();
        adminConfig.credential = admin.credential.cert(JSON.parse(cleanJson));
        console.log("✅ [Firebase Admin] SUCCESS: Loaded from Environment Variable.");
      } catch (e) {
        console.error("❌ [Firebase Admin] ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT env var.");
      }
    }

    if (adminConfig.credential) {
      admin.initializeApp(adminConfig);
    } else {
      console.warn("⚠️ [Firebase Admin] WARNING: No credentials found. Admin features will NOT work.");
      admin.initializeApp({ projectId: "aura-analytics-d2902" });
    }
  } catch (error: any) {
    console.error("❌ [Firebase Admin] CRITICAL ERROR:", error.message);
  }
}

export function initializeServerFirebase() {
  return {
    app: admin.app(),
    firestore: admin.firestore(),
    storage: admin.storage(),
  };
}
