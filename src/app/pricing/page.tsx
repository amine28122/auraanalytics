'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Bitcoin, Copy, Check, Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AuraAcademyLogo } from '@/components/logo';
import Script from 'next/script';

const WALLET_ADDRESS = "TVucHVCkqCvk2mB1KJi2uvyBd3dkhzCvPx";

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['1 analysis per day', 'Basic chart tools', 'Email support'],
    cta: 'Get Started Free',
    isPrimary: false,
    isOffer: false,
    type: 'free',
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
    type: 'premium',
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
    isPrimary: false,
    isOffer: false,
    type: 'aura',
  },
];

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "AURA Pricing Plans",
  "itemListElement": plans.filter(p => p.price.startsWith('$') && p.price !== '$0').map((plan, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Product",
      "name": `AURA - ${plan.name} Plan`,
      "description": plan.description,
      "offers": {
        "@type": "Offer",
        "price": plan.price.replace('$', ''),
        "priceCurrency": "USD",
        "availability": "https://schema.org/OnlineOnly",
      }
    }
  }))
};

export default function PublicPricingPage() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="pricing-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />

      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="flex items-center gap-3">
          <AuraAcademyLogo iconOnly className="h-10 w-10" />
          <span className="font-headline text-2xl font-bold">AURA</span>
        </Link>
        <Link href="/auth">
          <Button variant="outline" size="sm">Log In</Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col gap-8">

          {/* Title */}
          <div className="flex w-full flex-col gap-2 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter">
              Choose Your Plan
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Select the plan that fits your trading style and unlock powerful AI analysis.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto w-full">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  'flex flex-col card-glow relative overflow-hidden',
                  plan.isPrimary ? 'border-primary ring-2 ring-primary' : ''
                )}
              >
                {/* Offer Badge */}
                {plan.isOffer && (
                  <Badge className="absolute top-2 right-2 flex flex-col items-center border-amber-400 bg-amber-500/10 px-2 py-1 text-amber-300 backdrop-blur-sm leading-tight text-center">
                    <span className="text-xs font-bold">LIMITED</span>
                    <span className="text-[0.6rem] font-semibold">OFFER</span>
                  </Badge>
                )}

                {/* Card Header */}
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

                {/* Features */}
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                {/* Footer / CTA */}
                <CardFooter>
                  {plan.type === 'free' && (
                    <Button asChild className="w-full" variant="secondary">
                      <Link href="/auth">{plan.cta}</Link>
                    </Button>
                  )}

                  {plan.type === 'aura' && (
                    <Button asChild className="w-full" variant="secondary">
                      <a href="https://tawk.to/youssef.bennani99" target="_blank" rel="noopener noreferrer">
                        {plan.cta} <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  {plan.type === 'premium' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="default">{plan.cta}</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Bitcoin className="h-5 w-5 text-amber-500" />
                            Pay with Crypto (USDT TRC20)
                          </DialogTitle>
                          <DialogDescription>
                            Send the equivalent of $50 to the USDT (TRC20) address below. After payment, log in and submit your screenshot for activation.
                          </DialogDescription>
                        </DialogHeader>

                        {/* QR & Wallet */}
                        <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg border border-border/50 gap-3">
                          <div className="p-2 bg-background rounded-xl border shadow-inner">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${WALLET_ADDRESS}`}
                              alt="USDT Wallet QR Code"
                              className="w-28 h-28 rounded-lg"
                            />
                          </div>
                          <div className="flex flex-col items-center gap-1 w-full">
                            <span className="text-xs font-medium text-muted-foreground">Wallet Address (USDT TRC20)</span>
                            <div className="flex items-center gap-2 w-full">
                              <Input readOnly value={WALLET_ADDRESS} className="font-mono text-xs text-center font-bold tracking-wider h-8" />
                              <Button type="button" size="sm" variant="outline" onClick={copyToClipboard} className="h-8 px-2 shrink-0">
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Login Notice */}
                        <Alert className="bg-primary/10 border-primary/20">
                          <Info className="h-4 w-4 text-primary" />
                          <AlertTitle className="text-primary">Login Required to Submit</AlertTitle>
                          <AlertDescription className="text-xs">
                            After sending the payment, please log in to your account to upload the screenshot and submit your activation request.
                          </AlertDescription>
                        </Alert>

                        <Button asChild className="w-full">
                          <Link href="/auth">Log In to Submit Proof</Link>
                        </Button>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            For the Aura Plan, please contact us through the live chat support.
          </p>
        </div>
      </main>
    </div>
  );
}
