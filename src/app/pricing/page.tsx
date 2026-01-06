'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, Upload, Bitcoin, Copy, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AuraAcademyLogo } from '@/components/logo';
import Script from 'next/script';

// This is a simplified, public version of the pricing page.
// It does not require user authentication.

const translations = {
    en: {
        cryptoTitle: 'Pay with Crypto',
        cryptoDescription: 'Send the equivalent of $50 to the USDT (TRC20) address below. After payment, you must sign up or log in to submit your transaction proof.',
        walletAddress: 'Wallet Address (USDT TRC20)',
        copy: 'Copy',
        copied: 'Copied!',
        cardTitle: 'Pay with Bank Card',
        cardDescription: 'Click the button below to proceed with the payment via our secure partner. After payment, you must sign up or log in to submit your proof for manual activation.',
        payNow: 'Pay Now ($50)',
        loginToSubmit: 'Log In to Submit Proof',
        loginRequired: 'Login Required',
        loginRequiredDesc: 'Please log in to your account to submit your payment proof and activate your premium plan.',
        newYearOffer: "LIMITED",
        newYearOfferSub: 'OFFER',
        days: 'Days',
        hours: 'Hours',
        minutes: 'Mins',
        seconds: 'Secs',
    },
    // Add other languages if needed
};

const WALLET_ADDRESS = "TBEJ333HrfBnsdJqWn3x2tV5GZ3hY3g5R7";
const OFFER_END_DATE = '2026-01-21T00:00:00Z';


function CryptoPaymentInfo({ t }: { t: any }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(WALLET_ADDRESS).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">{t.walletAddress}</label>
                <div className="flex items-center gap-2">
                    <Input
                        readOnly
                        value={WALLET_ADDRESS}
                        className="font-mono text-sm"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
                        {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
                {isCopied && <p className="text-xs text-green-500 text-center">{t.copied}</p>}
            </div>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>{t.loginRequired}</AlertTitle>
                <AlertDescription>
                    {t.loginRequiredDesc}
                </AlertDescription>
            </Alert>
            <Button asChild className="w-full">
                <Link href="/auth">{t.loginToSubmit}</Link>
            </Button>
        </div>
    );
}


function CardPaymentInfo({ t }: { t: any }) {
    const handlePayNowClick = () => {
        const paymentUrl = 'https://tawk.to/youssef.bennani99';
        const width = 600;
        const height = 800;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);
        window.open(paymentUrl, 'paymentWindow', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`);
    };

    return (
        <div className="space-y-4 text-center">
            <p>{t.cardDescription}</p>
            <Button onClick={handlePayNowClick} className="w-full">{t.payNow}</Button>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>{t.loginRequired}</AlertTitle>
                <AlertDescription>
                    {t.loginRequiredDesc}
                </AlertDescription>
            </Alert>
            <Button asChild className="w-full" variant="secondary">
                <Link href="/auth">{t.loginToSubmit}</Link>
            </Button>
        </div>
    );
}

function UpgradeDialog({ children, t }: { children: React.ReactNode, t: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card' | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setPaymentMethod(null);
        }
    }, [isOpen]);

    const renderContent = () => {
        if (paymentMethod === 'crypto') {
            return <CryptoPaymentInfo t={t} />;
        }

        if (paymentMethod === 'card') {
            return <CardPaymentInfo t={t} />;
        }

        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button onClick={() => setPaymentMethod('crypto')} className="flex flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center transition-all hover:border-primary hover:bg-primary/5">
                    <Bitcoin className="h-10 w-10 text-primary" />
                    <span className="font-semibold">{t.cryptoTitle}</span>
                </button>
                <button onClick={() => setPaymentMethod('card')} className="flex flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center transition-all hover:border-primary hover:bg-primary/5">
                    <CreditCard className="h-10 w-10 text-primary" />
                    <span className="font-semibold">{t.cardTitle}</span>
                </button>
            </div>
        );
    };

    const getDialogTitle = () => {
        if (paymentMethod === 'crypto') return t.cryptoTitle;
        if (paymentMethod === 'card') return t.cardTitle;
        return "Select Payment Method";
    };

    const getDialogDescription = () => {
        if (paymentMethod === 'crypto') return t.cryptoDescription;
        if (paymentMethod === 'card') return "";
        return "Choose how you would like to pay for the Premium plan.";
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                    {getDialogDescription() && <DialogDescription>{getDialogDescription()}</DialogDescription>}
                </DialogHeader>
                <div className="py-4">
                    {renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}

const CountdownTimer = ({ t }: { t: any }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(OFFER_END_DATE) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents: JSX.Element[] = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!(timeLeft as any)[interval]) {
            if (Object.keys(timeLeft).length > 1 && interval === 'seconds') {
                // If it is not the only interval, we should show it even if it's 0
            } else {
                return;
            }
        }

        timerComponents.push(
            <div key={interval} className="flex flex-col items-center">
                <span className="text-xl font-bold">{(timeLeft as any)[interval]}</span>
                <span className="text-xs text-muted-foreground">{t[interval]}</span>
            </div>
        );
    });

    if (!timerComponents.length) {
        return null;
    }

    return (
        <div className="mt-2 flex justify-center gap-4 rounded-lg bg-muted p-2">
            {timerComponents}
        </div>
    );
};


export default function PublicPricingPage() {
    const initialPlans = [
        {
            name: 'Free',
            price: '$0',
            description: 'Perfect for getting started',
            features: ['1 analysis per day', 'Basic chart tools', 'Email support'],
            cta: 'Get Started',
            ctaLink: '/auth',
        },
        {
            name: 'Premium',
            price: '$50',
            originalPrice: '$100',
            discount: '-50%',
            description: 'For active traders',
            features: [
                '5 analyses per day',
                'Advanced chart tools',
                'Priority email support',
                'Access to exclusive webinars',
            ],
            cta: 'Upgrade to Premium',
            isPrimary: true,
            isOffer: true,
        },
        {
            name: 'Aura Plan',
            price: 'Contact Us',
            description: 'For institutions and professionals',
            features: [
                'Unlimited analyses',
                'All Premium features',
                'Direct line to analysts',
                'Personalized strategy sessions',
            ],
            cta: 'Contact for Access',
            ctaLink: 'https://tawk.to/youssef.bennani99',
            isExternal: true
        },
    ];

    const lang: keyof typeof translations = 'en'; // Default to English for public page
    const t = translations[lang];

    const pricingSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "AURA Pricing Plans",
        "itemListElement": initialPlans.filter(p => p.price.startsWith('$')).map((plan, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": `AURA - ${plan.name} Plan`,
                "description": plan.description,
                "offers": {
                    "@type": "Offer",
                    "price": plan.price.replace('$', '').split(' ')[0],
                    "priceCurrency": "USD",
                    "name": plan.name,
                    "description": plan.features.join('. '),
                    "availability": "https://schema.org/OnlineOnly",
                    "priceValidUntil": "2025-12-31"
                }
            }
        }))
    };


    return (
        <div className="min-h-screen bg-background">
            <Script
                id="pricing-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
            />
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
                <div className="flex flex-col gap-8">
                    <div className="flex w-full flex-col gap-2 text-center">
                        <h1 className="font-headline text-4xl font-bold tracking-tighter">
                            Choose Your Plan
                        </h1>
                        <p className="mx-auto max-w-xl text-muted-foreground">
                            Select the plan that fits your trading style and unlock powerful analysis.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {initialPlans.map((plan) => {
                            const buttonAction = () => {
                                if (plan.ctaLink) {
                                    return (
                                        <Button asChild className="w-full" variant={plan.isPrimary ? 'default' : 'secondary'}>
                                            <Link href={plan.ctaLink} target={plan.isExternal ? '_blank' : '_self'}>{plan.cta}</Link>
                                        </Button>
                                    );
                                }

                                return (
                                    <UpgradeDialog t={t}>
                                        <Button
                                            className="w-full"
                                            variant={plan.isPrimary ? 'default' : 'secondary'}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </UpgradeDialog>
                                );
                            };

                            return (
                                <Card
                                    key={plan.name}
                                    className={cn(
                                        'flex flex-col card-glow relative overflow-hidden',
                                        plan.isPrimary ? 'border-primary ring-2 ring-primary' : ''
                                    )}
                                >
                                    {plan.isOffer && (
                                        <Badge className="absolute top-2 right-2 flex flex-col items-center border-amber-400 bg-amber-500/10 px-2 py-1 text-amber-300 backdrop-blur-sm leading-tight text-center">
                                            <span className="text-xs font-bold">{t.newYearOffer}</span>
                                            <span className="text-[0.6rem] font-semibold">{t.newYearOfferSub}</span>
                                        </Badge>
                                    )}
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-4xl font-bold">{plan.price}</p>
                                                {plan.discount && <Badge variant="destructive">{plan.discount}</Badge>}
                                            </div>
                                            {plan.originalPrice && (
                                                <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
                                            )}
                                        </div>
                                        <CardDescription>{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-3">
                                                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {plan.isOffer && <CountdownTimer t={t} />}
                                    </CardContent>
                                    <CardFooter>
                                        {buttonAction()}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                        <p>For the Aura Plan, please contact us through our chat support.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
