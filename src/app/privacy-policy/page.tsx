'use client';

import { ShieldCheck, Lock, Eye, Cookie, Database, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AuraAcademyLogo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const translations = {
    en: {
        title: 'Privacy Policy',
        description: `Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        content: [
            {
                title: '1. Introduction',
                icon: ShieldCheck,
                body: 'AURA Analytics ("we," "our," or "us") is dedicated to protecting your privacy. This Privacy Policy explains our practices regarding the collection, use, and disclosure of your personal information. By accessing our Service, you consent to the data practices described in this policy.'
            },
            {
                title: '2. Ezoic Services & Monetization',
                icon: Globe,
                body: 'This website uses Ezoic to provide personalization and analytic services. Ezoic’s privacy policy is in effect and can be reviewed here: https://www.ezoic.com/privacy-policy/. Ezoic uses cookies and other tracking technologies to analyze user behavior, optimize ad delivery, and improve the overall user experience. Ezoic may process personal data and usage information as part of its platform services.'
            },
            {
                title: '3. Information We Collect',
                icon: Database,
                body: `We collect various types of information to provide and improve our Service:
• **Personal Identification Information:** Name and Email Address provided during registration.
• **Account & Subscription Data:** Language preferences, plan status, and billing history.
• **Usage & Analytics Data:** IP addresses, browser types, device information, and interaction data collected through standard web logs and partners like Ezoic.
• **Technical Content:** Chart images or market data submitted for analysis purposes.`
            },
            {
                title: '4. How We Use Your Information',
                icon: Eye,
                body: `Your data is used to:
• Maintain and optimize our analytical engine.
• Personalize your user experience and ad delivery via Ezoic.
• Process subscriptions and manage account security.
• Communicate important updates and research insights.
• Ensure compliance with legal and regulatory standards.`
            },
            {
                title: '5. Cookies and Tracking',
                icon: Cookie,
                body: 'We and our third-party partners (like Ezoic and Google Analytics) use cookies, beacons, and similar technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.'
            },
            {
                title: '6. Data Sharing & Security',
                icon: Lock,
                body: 'We do not sell your personal data. We share information only with trusted partners (Ezoic, cloud infrastructure providers, and payment processors) necessary for operations. We implement industry-standard security protocols to protect your data, though no method of transmission over the Internet is 100% secure.'
            },
            {
                title: '7. GDPR & International Rights',
                icon: ShieldCheck,
                body: 'If you are a resident of the European Economic Area (EEA), you have specific data protection rights under the GDPR, including the right to access, update, or delete your information. You can manage your consent preferences through our integrated cookie manager provided by Ezoic.'
            }
        ]
    }
};

export default function PublicPrivacyPolicyPage() {
    const t = translations.en;
    const dir = 'ltr';

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b">
                <Link href="/" className="flex items-center gap-3">
                    <AuraAcademyLogo iconOnly className="h-10 w-10" />
                    <span className="font-headline text-2xl font-bold tracking-tighter">AURA ANALYTICS</span>
                </Link>
                <div className="flex gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/about">About Us</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth">Sign In</Link>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
                <div className="space-y-12" dir={dir}>
                    <div className="text-center space-y-4">
                        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
                            {t.title}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {t.description}
                        </p>
                    </div>
                    
                    <div className="grid gap-8">
                        {t.content.map((section, index) => (
                            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm card-glow overflow-hidden">
                                <CardContent className="p-8 space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <section.icon className="h-6 w-6" />
                                        <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {section.body}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-8 text-center space-y-4">
                            <h2 className="text-xl font-bold">Questions about your privacy?</h2>
                            <p className="text-muted-foreground">
                                If you have any questions about this Privacy Policy, please contact our data protection team at support@auraanalytics.com.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <footer className="border-t py-8 bg-muted/10">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} AURA Analytics. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}