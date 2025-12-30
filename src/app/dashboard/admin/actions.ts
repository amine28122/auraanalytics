'use server'

import { cookies } from 'next/headers'

// التحقق من الجلسة (هل المستخدم أدخل كلمة المرور سابقا؟)
export async function checkAdminSession() {
    const cookieStore = await cookies()
    const hasCookie = cookieStore.has('admin_session_auth')
    return hasCookie
}

// التحقق من كلمة المرور وإنشاء الجلسة
export async function verifyAdminPassword(password: string) {
    // استخدام متغير بيئي سري (بدون NEXT_PUBLIC)
    // Use a fallback for development if the env var is not set, but warn about it
    const correctPassword = process.env.ADMIN_PASSWORD

    if (!correctPassword) {
        console.error("ADMIN_PASSWORD is not set in environment variables.")
        return { success: false, error: 'Server configuration error' }
    }

    if (password === correctPassword) {
        // إنشاء ملف تعريف ارتباط (Cookie) آمن
        const cookieStore = await cookies()
        cookieStore.set('admin_session_auth', 'true', {
            httpOnly: true, // لا يمكن الوصول إليه عبر JavaScript في المتصفح
            secure: process.env.NODE_ENV === 'production', // تشفير في وضع الإنتاج
            maxAge: 60 * 60 * 24, // صلاحية لمدة 24 ساعة
            path: '/',
        })
        return { success: true }
    }

    return { success: false, error: 'Incorrect password' }
}
