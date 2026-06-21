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
        cryptoDescription: 'Send the equivalent of $100 to the USDT (TRC20) address below. After payment, you must sign up or log in to submit your transaction proof.',
        walletAddress: 'Wallet Address (USDT TRC20)',
        copy: 'Copy',
        copied: 'Copied!',
        cardTitle: 'Pay with Bank Card',
        cardDescription: 'Click the button below to proceed with the payment via our secure partner. After payment, you must sign up or log in to submit your proof for manual activation.',
        payNow: 'Pay Now ($100)',
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


// This is a simplified, public version of the pricing page.
// It does not require user authentication.


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
            name: 'Premium',
            price: '$100',
            originalPrice: '$200',
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
        }
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
                <div className="flex items-center gap-3">
                    <AuraAcademyLogo iconOnly className="h-10 w-10" />
                    <span className="font-headline text-2xl font-bold">AURA</span>
                </div>
            </header>
            <main className="container mx-auto px-4 py-12 md:py-20 flex justify-center">
                <div className="flex flex-col gap-8">
                    <div className="flex w-full flex-col gap-2 text-center">
                        <h1 className="font-headline text-4xl font-bold tracking-tighter">
                            Choose Your Plan
                        </h1>
                        <p className="mx-auto max-w-xl text-muted-foreground">
                            Select the plan that fits your trading style and unlock powerful analysis.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-1 max-w-md mx-auto">
                        {initialPlans.map((plan) => {
                            const buttonAction = () => {
                                if (plan.ctaLink) {
                                    return (
                                        <Button asChild className="w-full" variant={plan.isPrimary ? 'default' : 'secondary'}>
                                            <Link href={plan.ctaLink} target={plan.isExternal ? '_blank' : '_self'}>{plan.cta}</Link>
                                        </Button>
                                    );
                                }

                                if (plan.name === 'Premium') {
                                    return (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full" variant={plan.isPrimary ? 'default' : 'secondary'}>
                                                    {plan.cta}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle className="flex items-center gap-2">
                                                        <Bitcoin className="h-5 w-5 text-amber-500" />
                                                        {t.cryptoTitle}
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        {t.cryptoDescription}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg border border-border/50 gap-4">
                                                    <div className="p-4 bg-background rounded-xl border shadow-inner">
                                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${WALLET_ADDRESS}`} alt="USDT Wallet QR Code" className="w-32 h-32 rounded-lg" />
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2 w-full">
                                                        <span className="text-sm font-medium text-muted-foreground">{t.walletAddress}</span>
                                                        <div className="flex items-center gap-2 w-full">
                                                            <Input readOnly value={WALLET_ADDRESS} className="font-mono text-xs text-center font-bold tracking-wider" />
                                                        </div>
                                                    </div>
                                                    <Alert className="mt-2 bg-primary/10 text-primary border-primary/20">
                                                        <Info className="h-4 w-4" />
                                                        <AlertTitle>{t.loginRequired}</AlertTitle>
                                                        <AlertDescription className="text-xs">
                                                            {t.loginRequiredDesc}
                                                        </AlertDescription>
                                                    </Alert>
                                                </div>
                                                <div className="flex flex-col gap-2 w-full mt-2">
                                                    <Button asChild className="w-full">
                                                        <Link href="/auth">{t.loginToSubmit}</Link>
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    );
                                }

                                return (
                                    <Button
                                        className="w-full"
                                        variant={plan.isPrimary ? 'default' : 'secondary'}
                                        onClick={() => {
                                            if (plan.ctaLink) {
                                                window.location.href = plan.ctaLink;
                                            } else {
                                                window.location.href = '/auth';
                                            }
                                        }}
                                    >
                                        {plan.cta}
                                    </Button>
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
                                                    <span className="text-lg text-muted-foreground font-medium">/ month</span>
                                                    {plan.discount && <Badge variant="destructive">{plan.discount}</Badge>}
                                                </div>
                                                {plan.originalPrice && (
                                                    <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
                                                )}
                                                <p className="text-sm text-muted-foreground mt-2 font-medium bg-muted/50 px-3 py-1 rounded-full inline-block">Billed automatically every month. Cancel anytime.</p>
                                            </div>
                                            <CardDescription className="mt-4">{plan.description}</CardDescription>
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
                                        <CardFooter className="flex flex-col gap-3">
                                            {buttonAction()}
                                            <div className="text-center w-full">
                                                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                                    <Info className="h-3 w-3" />
                                                    Recurring subscription. You can cancel at any time.
                                                </p>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* JVZoo Disclaimer removed */}
                    </div>
                </main>
            </div>
        );
    }
