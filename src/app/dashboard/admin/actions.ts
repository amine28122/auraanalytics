'use server'

import { cookies } from 'next/headers'
import { initializeServerFirebase } from '@/firebase/server-init'

// قائمة الإيميلات الموثوقة كأدمن
const TRUSTED_ADMINS = ['jaafarirayan98@gmail.com', 'nabiltradingofff@gmail.com', 'nabiltradingbot@gmail.com'];

// التحقق من الجلسة
export async function checkAdminSession() {
    const cookieStore = await cookies()
    const hasCookie = cookieStore.has('admin_session_auth')
    return hasCookie
}

// التحقق من كلمة المرور وترقية المسؤولين
export async function verifyAdminPassword(password: string) {
    const correctPassword = process.env.ADMIN_PASSWORD

    if (!correctPassword) {
        console.error("ADMIN_PASSWORD is not set in environment variables.")
        return { success: false, error: 'Server configuration error' }
    }

    if (password === correctPassword) {
        // --- خطوة الترقية التلقائية للأدمن ---
        try {
            const { firestore } = initializeServerFirebase();
            for (const email of TRUSTED_ADMINS) {
                const snapshot = await firestore.collection('users').where('email', '==', email).get();
                if (!snapshot.empty) {
                    const batch = firestore.batch();
                    snapshot.forEach(doc => {
                        batch.update(doc.ref, { isAdmin: true });
                    });
                    await batch.commit();
                    console.log(`[AdminSync] Upgraded ${email} to Admin status.`);
                }
            }
        } catch (e) {
            console.error("Admin sync failed:", e);
        }
        // -----------------------------------

        const cookieStore = await cookies()
        cookieStore.set('admin_session_auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        })
        return { success: true }
    }

    return { success: false, error: 'Incorrect password' }
}

