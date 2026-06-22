'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// You have now verified your custom domain in Resend.
const SENDER_EMAIL = 'support@auraanalyticspro.com';

export async function sendWelcomeEmail(toEmail: string, name: string) {
  try {
    const data = await resend.emails.send({
      from: `Aura Analytics <${SENDER_EMAIL}>`,
      to: toEmail,
      subject: 'أهلاً بك في منصة Aura Analytics Pro 🚀',
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #09090b; color: #ffffff; border-radius: 12px; border: 1px solid #27272a;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #27272a;">
            <img src="https://www.auraanalyticspro.com/ico.png" alt="Aura Analytics" style="height: 70px; margin-bottom: 10px; object-fit: contain;" />
            <h1 style="color: #10b981; margin: 0; font-size: 26px;">AURA ANALYTICS PRO</h1>
          </div>
          <div style="font-size: 16px; color: #e4e4e7; line-height: 1.8; margin-top: 30px;">
            <p style="margin-bottom: 15px;"><strong>أهلاً بك يا ${name}،</strong></p>
            <p style="margin-bottom: 15px;">نحن سعداء جداً بانضمامك إلى مجتمع التداول الخاص بنا.</p>
            <p style="margin-bottom: 15px;">أنت الآن على <strong>الخطة المجانية</strong> والتي تتيح لك الوصول إلى أدوات التحليل الأساسية. جرب رفع شارتك الآن واحصل على تحليل فوري!</p>
            <p style="margin-bottom: 15px;">إذا كنت مستعداً لنقل تداولك إلى المستوى التالي، فكر في الترقية للخطة المدفوعة للحصول على تحليلات غير محدودة وميزات احترافية.</p>
          </div>
          <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
            <a href="https://www.auraanalyticspro.com/dashboard/" style="background-color: #10b981; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; display: inline-block;">
              الدخول للمنصة الآن
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #27272a; margin-top: 30px;" />
          <p style="font-size: 14px; color: #71717a; text-align: center; margin-top: 20px;">
            مع تحيات،<br/>
            <strong style="color: #10b981;">فريق Aura Analytics</strong>
          </p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendActivationEmail(toEmail: string, planName: string) {
  try {
    const data = await resend.emails.send({
      from: `Aura Analytics <${SENDER_EMAIL}>`,
      to: toEmail,
      subject: 'تم تفعيل اشتراكك بنجاح! 👑',
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #09090b; color: #ffffff; border-radius: 12px; border: 1px solid #27272a;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #27272a;">
            <img src="https://www.auraanalyticspro.com/ico.png" alt="Aura Analytics" style="height: 70px; margin-bottom: 10px; object-fit: contain;" />
            <h1 style="color: #10b981; margin: 0; font-size: 26px;">AURA ANALYTICS PRO</h1>
          </div>
          <div style="font-size: 16px; color: #e4e4e7; line-height: 1.8; margin-top: 30px;">
            <p style="margin-bottom: 15px;"><strong>أخبار رائعة!</strong> 🎉</p>
            <p style="margin-bottom: 15px;">لقد تم التأكد من الدفع وتفعيل حسابك بنجاح على خطة <strong>${planName}</strong>.</p>
            <p style="margin-bottom: 15px;">أنت الآن تمتلك الصلاحية الكاملة للوصول إلى أدوات التحليل المتقدمة والميزات الاحترافية التي ستساعدك في اتخاذ قرارات تداول أدق.</p>
          </div>
          <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
            <a href="https://www.auraanalyticspro.com/dashboard/" style="background-color: #10b981; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; display: inline-block;">
              ابدأ التداول الآن
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #27272a; margin-top: 30px;" />
          <p style="font-size: 14px; color: #71717a; text-align: center; margin-top: 20px;">
            شكراً لثقتك بنا،<br/>
            <strong style="color: #10b981;">فريق Aura Analytics</strong>
          </p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to send activation email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendBroadcastEmail(toEmails: string[], subject: string, htmlContent: string) {
  try {
    // Resend free tier might restrict batch sending without a domain.
    // For now, we will loop and send individually.
    const results = [];
    for (const email of toEmails) {
      const data = await resend.emails.send({
        from: `Aura Analytics <${SENDER_EMAIL}>`,
        to: email,
        subject: subject,
        html: htmlContent,
      });
      results.push(data);
    }
    return { success: true, results };
  } catch (error: any) {
    console.error('Failed to send broadcast emails:', error);
    return { success: false, error: error.message };
  }
}
