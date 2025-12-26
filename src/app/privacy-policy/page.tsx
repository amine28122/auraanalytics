'use client';

import { ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AuraAcademyLogo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const translations = {
    en: {
        title: 'Privacy Policy',
        description: 'Last updated: July 27, 2024',
        content: [
            {
                title: '1. Introduction',
                body: 'AURA ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by our application. This policy applies to our application named AURA and its associated services. By using our Service, you agree to the collection and use of information in accordance with this policy.'
            },
            {
                title: '2. Information We Collect',
                body: `We collect several types of information for various purposes to provide and improve our Service to you.
- **Personal Identification Information:** When you register, we collect your Name, and Email Address.
- **Account Information:** We store your chosen Language Preference, subscription plan (Free, Premium, Aura Plan), and learning progress.
- **Usage Data:** We track your analysis usage (analysisCount, lastAnalysisDate) to enforce plan limits.
- **User-Provided Content:** We process chart images and camera captures that you provide for analysis. For payment activation, we collect the Transaction ID and a Screenshot of your payment receipt.`
            },
            {
                title: '3. How We Use Your Information',
                body: `We use the collected data for the following purposes:
- To provide and maintain our Service.
- To manage your account, including processing plan upgrades and activations.
- To personalize your experience by providing content in your preferred language.
- To monitor your usage to prevent abuse and enforce subscription limits.
- To improve our application and services.
- To communicate with you, including responding to customer service requests.`
            },
            {
                title: '4. Data Sharing and Third-Party Services',
                body: `Your privacy is important to us. We do not sell your personal data. However, we may share information with certain third-party service providers to operate our application:
- **Cloud & Database Providers:** For user authentication, data storage, and backend infrastructure.
- **Service Providers for Analysis:** The chart images you submit are sent to our partners to process them and generate trade signals. We do not send personal identification information with these images.
- **Embedded Content Providers:** For market data widgets and charts. Your interaction with this content may be subject to their respective privacy policies.
- **Customer Support Platforms:** To provide you with real-time support. Information you share in these communications is subject to their privacy policies.`
            },
            {
                title: '5. Data Security',
                body: "We implement a variety of security measures to maintain the safety of your personal information. All payment-related data you submit for activation is stored securely and is only accessible by authorized personnel for verification purposes. However, no method of transmission over the Internet or method of electronic storage is 100% secure."
            },
            {
                title: '6. Your Consent',
                body: 'By using our app, registering an account, and submitting content for analysis, you consent to our Privacy Policy.'
            },
            {
                title: '7. Changes to This Privacy Policy',
                body: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.'
            }
        ]
    }
};

export default function PublicPrivacyPolicyPage() {
    const t = translations.en; // Default to English for public page
    const dir = 'ltr';

    return (
        <div className="min-h-screen bg-background">
            <header className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center gap-3">
                    <AuraAcademyLogo iconOnly className="h-10 w-10" />
                    <span className="font-headline text-2xl font-bold">AURA</span>
                </Link>
                <Button asChild>
                    <Link href="/auth">Sign In</Link>
                </Button>
            </header>
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="flex flex-col gap-8" dir={dir}>
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                            <h1 className="font-headline text-3xl font-bold tracking-tighter">
                                {t.title}
                            </h1>
                        </div>
                        <p className="text-muted-foreground">
                            {t.description}
                        </p>
                    </div>
                    
                    <Card className="card-glow">
                        <CardContent className="pt-6">
                            <div className="prose prose-sm dark:prose-invert max-w-full space-y-6 text-muted-foreground">
                            {t.content.map((section, index) => (
                                <div key={index}>
                                    <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                                    <p className="whitespace-pre-wrap">{section.body}</p>
                                </div>
                            ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}