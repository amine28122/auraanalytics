'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import imgCompression from 'browser-image-compression';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, Loader2, Upload, Bitcoin, Copy, Check, Clock, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useFirebase } from '@/firebase';
import { collection, query, where, onSnapshot, doc, Unsubscribe } from 'firebase/firestore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { submitActivationRequest, type ActivationFormState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type UserProfile = {
    plan?: 'Free' | 'Premium' | 'Aura Plan';
    email?: string;
    uid?: string;
};

const translations = {
    en: {
        cryptoTitle: 'Pay with Crypto',
        cryptoDescription: 'Send the equivalent of $100 to the USDT (TRC20) address below. After payment, upload a screenshot and your transaction ID.',
        walletAddress: 'Wallet Address (USDT TRC20)',
        copy: 'Copy',
        copied: 'Copied!',
        transactionId: 'Transaction ID',
        paymentScreenshot: 'Payment Screenshot',
        uploadScreenshot: 'Click to upload a screenshot',
        submitRequest: 'Submit Activation Request',
        submitting: 'Submitting...',
        requestSubmitted: 'Request Submitted',
        requestSubmittedDesc: 'Your request has been sent for review. Activation may take some time.',
        submissionError: 'Submission Error',
        cardTitle: 'Pay with Bank Card',
        cardDescription: 'Click the button below to proceed with the payment via our secure partner. After payment, you must submit proof for manual activation.',
        payNow: 'Pay Now ($100)',
        paymentProofNote: 'After successful payment, please come back and submit the proof via the "Pay with Crypto" option, using your payment receipt screenshot.',
        selectPayment: 'Select Payment Method',
        selectPaymentDesc: 'Choose how you would like to pay for the Premium plan.',
        requestPending: 'Request Pending',
        requestPendingDesc: 'Your activation request is currently under review. We will notify you once it is approved.',
        newYearOffer: "LIMITED",
        newYearOfferSub: 'OFFER',
        days: 'Days',
        hours: 'Hours',
        minutes: 'Mins',
        seconds: 'Secs',
    },
    ar: {
        cryptoTitle: 'الدفع بالعملات الرقمية',
        cryptoDescription: 'أرسل ما يعادل 100 دولارًا إلى عنوان USDT (TRC20) أدناه. بعد الدفع، قم بتحميل لقطة شاشة ومعرف المعاملة الخاص بك.',
        walletAddress: 'عنوان المحفظة (USDT TRC20)',
        copy: 'نسخ',
        copied: 'تم النسخ!',
        transactionId: 'معرف المعاملة',
        paymentScreenshot: 'لقطة شاشة الدفع',
        uploadScreenshot: 'انقر لتحميل لقطة شاشة',
        submitRequest: 'إرسال طلب التفعيل',
        submitting: 'جارٍ الإرسال...',
        requestSubmitted: 'تم إرسال الطلب',
        requestSubmittedDesc: 'تم إرسال طلبك للمراجعة. قد يستغرق التفعيل بعض الوقت.',
        submissionError: 'خطأ في الإرسال',
        cardTitle: 'الدفع بالبطاقة البنكية',
        cardDescription: 'انقر على الزر أدناه للمتابعة إلى الدفع عبر شريكنا الآمن. بعد الدفع، يجب عليك تقديم إثبات للتفعيل اليدوي.',
        payNow: 'ادفع الآن (100$)',
        paymentProofNote: 'بعد الدفع بنجاح، يرجى العودة وتقديم الإثبات عبر خيار "الدفع بالعملات الرقمية"، باستخدام لقطة شاشة من إيصال الدفع.',
        selectPayment: 'اختر طريقة الدفع',
        selectPaymentDesc: 'اختر كيف ترغب في الدفع مقابل الخطة المميزة.',
        requestPending: 'الطلب قيد المراجعة',
        requestPendingDesc: 'طلب التفعيل الخاص بك قيد المراجعة حاليًا. سنقوم بإعلامك بمجرد الموافقة عليه.',
        newYearOffer: "عرض",
        newYearOfferSub: 'محدود',
        days: 'أيام',
        hours: 'ساعات',
        minutes: 'دقائق',
        seconds: 'ثواني',
    },
    es: {
        cryptoTitle: 'Pagar con Criptomonedas',
        cryptoDescription: 'Envíe el equivalente a $100 a la dirección USDT (TRC20) a continuación. Después del pago, suba una captura de pantalla y su ID de transacción.',
        walletAddress: 'Dirección de la Billetera (USDT TRC20)',
        copy: 'Copiar',
        copied: '¡Copiado!',
        transactionId: 'ID de Transacción',
        paymentScreenshot: 'Captura de Pantalla del Pago',
        uploadScreenshot: 'Haga clic para subir una captura de pantalla',
        submitRequest: 'Enviar Solicitud de Activación',
        submitting: 'Enviando...',
        requestSubmitted: 'Solicitud Enviada',
        requestSubmittedDesc: 'Su solicitud ha sido enviada para su revisión. La activación puede tardar un tiempo.',
        submissionError: 'Error de Envío',
        cardTitle: 'Pagar con Tarjeta Bancaria',
        cardDescription: 'Haga clic en el botón de abajo para proceder con el pago a través de nuestro socio seguro. Después del pago, debe presentar una prueba para la activación manual.',
        payNow: 'Pagar Ahora ($100)',
        paymentProofNote: 'Después de un pago exitoso, por favor regrese y presente la prueba a través de la opción "Pagar con Criptomonedas", usando la captura de pantalla de su recibo de pago.',
        selectPayment: 'Seleccione el Método de Pago',
        selectPaymentDesc: 'Elija cómo le gustaría pagar el plan Premium.',
        requestPending: 'Solicitud Pendiente',
        requestPendingDesc: 'Su solicitud de activación está actualmente en revisión. Le notificaremos una vez que sea aprobada.',
        newYearOffer: "OFERTA",
        newYearOfferSub: 'LIMITADA',
        days: 'Días',
        hours: 'Horas',
        minutes: 'Minutos',
        seconds: 'Segundos',
    },
};

const WALLET_ADDRESS = "TBEJ333HrfBnsdJqWn3x2tV5GZ3hY3g5R7";
const OFFER_END_DATE = '2026-01-21T00:00:00Z';

function SubmitButton({ t, isEnabled }: { t: any, isEnabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending || !isEnabled} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.submitting}
                </>
            ) : (
                t.submitRequest
            )}
        </Button>
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


export default function PricingPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formState, formAction] = useActionState(submitActivationRequest, { error: null, message: null });
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const initialPlans = [
        {
            name: 'Free',
            price: '$0',
            description: 'Perfect for getting started',
            features: ['1 analysis per day', 'Basic chart tools', 'Email support'],
            cta: 'Your Current Plan',
        },
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
        },
    ];

    useEffect(() => {
        if (!user || !firestore) {
            setIsLoading(false);
            return;
        };

        const userDocRef = doc(firestore, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                setUserProfile({ ...doc.data(), uid: user.uid, email: user.email } as UserProfile);
            }
        });

        const requestsQuery = query(
            collection(firestore, 'activationRequests'),
            where('userId', '==', user.uid),
            where('status', '==', 'pending')
        );

        const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
            setHasPendingRequest(!snapshot.empty);
            setIsLoading(false);
        });

        return () => {
            unsubscribeUser();
            unsubscribeRequests();
        };
    }, [user, firestore]);

    const lang: keyof typeof translations = 'en';
    const t = translations[lang];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(WALLET_ADDRESS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsCompressing(true);
        try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
            const compressedFile = await imgCompression(file, options);
            setScreenshotFile(compressedFile);

            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => {
                setScreenshotPreview(reader.result as string);
            };
        } catch (error) {
            console.error('Compression error:', error);
            toast({ title: 'Error', description: 'Failed to process image.', variant: 'destructive' });
        } finally {
            setIsCompressing(false);
        }
    };

    useEffect(() => {
        if (formState?.message) {
            toast({ title: 'Success', description: formState.message });
            setScreenshotFile(null);
            setScreenshotPreview(null);
            setIsModalOpen(false);
        } else if (formState?.error) {
            toast({ title: 'Error', description: formState.error, variant: 'destructive' });
        }
    }, [formState, toast]);

    return (
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
                    const isCurrentPlan = userProfile?.plan === plan.name;
                    const isPremium = plan.name === 'Premium';

                    const buttonAction = () => {
                        if (isCurrentPlan || plan.name === 'Aura Plan') {
                            const ctaText = isCurrentPlan ? 'Your Current Plan' : plan.cta;
                            const link = plan.name === 'Aura Plan' ? 'https://tawk.to/youssef.bennani99' : '#';
                            
                            if (plan.name === 'Aura Plan') {
                                return (
                                    <Button asChild className="w-full" variant="secondary">
                                        <a href={link} target="_blank" rel="noopener noreferrer">{ctaText}</a>
                                    </Button>
                                );
                            }

                            return (
                                <Button
                                    className="w-full"
                                    variant={plan.isPrimary ? 'default' : 'secondary'}
                                    disabled
                                >
                                    {ctaText}
                                </Button>
                            );
                        }

                        if (isLoading) {
                            return (
                                <Button className="w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </Button>
                            );
                        }

                        if (hasPendingRequest) {
                            return (
                                <Button className="w-full" disabled>
                                    <Clock className="mr-2 h-4 w-4" />
                                    {t.requestPending}
                                </Button>
                            );
                        }

                        if (plan.name === 'Premium') {
                            return (
                                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full" variant={plan.isPrimary ? 'default' : 'secondary'}>
                                            {plan.cta}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <Bitcoin className="h-5 w-5 text-amber-500" />
                                                {t.cryptoTitle}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {t.cryptoDescription}
                                            </DialogDescription>
                                        </DialogHeader>
                                        
                                        <form action={formAction} className="flex flex-col gap-4 mt-2">
                                            {user?.uid && <input type="hidden" name="userId" value={user.uid} />}
                                            {user?.email && <input type="hidden" name="email" value={user.email} />}
                                            <input type="hidden" name="planName" value={plan.name} />
                                            {screenshotPreview && <input type="hidden" name="screenshotDataUrl" value={screenshotPreview} />}

                                            <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg border border-border/50 gap-3">
                                                <div className="p-2 bg-background rounded-xl border shadow-inner">
                                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${WALLET_ADDRESS}`} alt="USDT Wallet QR Code" className="w-24 h-24 rounded-lg" />
                                                </div>
                                                <div className="flex flex-col items-center gap-1 w-full">
                                                    <span className="text-xs font-medium text-muted-foreground">{t.walletAddress}</span>
                                                    <div className="flex items-center gap-2 w-full">
                                                        <Input readOnly value={WALLET_ADDRESS} className="font-mono text-xs text-center font-bold tracking-wider h-8" />
                                                        <Button type="button" size="sm" variant="outline" onClick={copyToClipboard} className="h-8 px-2 shrink-0">
                                                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="transactionId" className="text-xs font-semibold">{t.transactionId}</Label>
                                                <Input id="transactionId" name="transactionId" placeholder="e.g. TX123456789" required className="h-9 text-sm" />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold">{t.paymentScreenshot}</Label>
                                                <div 
                                                    className="border-2 border-dashed border-border/50 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/30 transition-colors"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    {screenshotPreview ? (
                                                        <div className="relative w-full flex justify-center">
                                                            <img src={screenshotPreview} alt="Screenshot preview" className="max-h-32 object-contain rounded-md" />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                                                                <span className="text-white text-xs font-medium">Change Image</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground text-center">
                                                                {isCompressing ? 'Processing...' : t.uploadScreenshot}
                                                            </span>
                                                        </>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="hidden" 
                                                        ref={fileInputRef}
                                                        onChange={handleImageUpload}
                                                    />
                                                </div>
                                            </div>

                                            <SubmitButton t={t} isEnabled={!!screenshotPreview} />
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            );
                        }

                        return (
                            <Button
                                className="w-full"
                                variant={plan.isPrimary ? 'default' : 'secondary'}
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
            {hasPendingRequest && (
                <Alert className="max-w-md mx-auto card-glow">
                    <Clock className="h-4 w-4" />
                    <AlertTitle>{t.requestPending}</AlertTitle>
                    <AlertDescription>
                        {t.requestPendingDesc}
                    </AlertDescription>
                </Alert>
            )}
            <div className="text-center text-sm text-muted-foreground">
                <p>For the Aura Plan, please contact us through the Tawk.to chat support.</p>
            </div>
        </div>
    );
}
