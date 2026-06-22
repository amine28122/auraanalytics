'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useLanguage } from '@/context/LanguageContext';


export default function PlanComparison() {
    const { t } = useLanguage();
    return (
        <section className="py-20 px-4 bg-black/20">
            <div className="container mx-auto flex flex-col items-center gap-12">
                <div className="text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">{t.pricing_title}</h2>
                    <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                        {t.pricing_subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full max-w-5xl">
                    {/* Free Plan */}
                    <Card className="bg-background/5 border-border/50 h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-3xl">{t.free}</CardTitle>
                            <CardDescription>{t.free_desc}</CardDescription>
                            <p className="text-4xl font-bold pt-4">$0 <span className="text-lg font-normal text-muted-foreground">{t.forever}</span></p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-4">
                                {t.free_features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full" asChild>
                                <Link href="/auth">{t.get_started}</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Premium Plan */}
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur-lg opacity-60 animate-pulse-slow"></div>
                        <Card className="relative bg-background border-primary/50 h-full flex flex-col ring-2 ring-primary/80">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-3xl">{t.premium}</CardTitle>
                                    <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{t.recommended}</span>
                                </div>
                                <CardDescription>{t.premium_desc}</CardDescription>
                                <div className="flex items-baseline gap-2 pt-4">
                                    <p className="text-4xl font-bold">$50</p>
                                    <p className="text-2xl font-bold text-muted-foreground line-through">$100</p>
                                    <p className="text-lg font-normal text-muted-foreground">{t.month}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 bg-muted/50 px-2 py-1 rounded-md inline-block w-fit">
                                    Billed automatically every month. Cancel anytime.
                                </p>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-4">
                                    {t.premium_features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0" />
                                            <span className="font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full futuristic-button" asChild>
                                    <Link href="/pricing">{t.upgrade_to_premium}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
