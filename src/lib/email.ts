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
      subject: 'Welcome to Aura Analytics! 🎉',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Welcome to Aura Analytics, ${name}!</h2>
          <p>We are thrilled to have you join our trading community.</p>
          <p>You currently have the <strong>Free Plan</strong> which gives you access to our basic AI analysis tools. Upload your charts and get instant insights!</p>
          <p>If you're ready to take your trading to the next level, consider upgrading to our Premium plan for unlimited analysis and advanced features.</p>
          <br/>
          <p>Happy Trading,</p>
          <p><strong>The Aura Analytics Team</strong></p>
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
      subject: 'Account Upgraded Successfully! 🚀',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Your account has been upgraded!</h2>
          <p>Great news! Your payment has been verified and your account is now active on the <strong>${planName}</strong>.</p>
          <p>You now have access to all premium features, including unlimited AI chart analysis, advanced technical indicators, and priority support.</p>
          <p><a href="https://auraanalytics.com/dashboard" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Go to Dashboard</a></p>
          <br/>
          <p>Thank you for choosing Aura Analytics!</p>
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
