'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import imgCompression from 'browser-image-compression';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, Loader2, Upload, Bitcoin, Copy, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useFirebase } from '@/firebase';
import { collection, query, where, onSnapshot, doc, Unsubscribe } from 'firebase/firestore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { submitActivationRequest, type ActivationFormState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
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
        cryptoDescription: 'Send the equivalent of $50 to the USDT (TRC20) address below. After payment, upload a screenshot and your transaction ID.',
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
        payNow: 'Pay Now ($50)',
        paymentProofNote: 'After successful payment, please come back and submit the proof via the "Pay with Crypto" option, using your payment receipt screenshot.',
        selectPayment: 'Select Payment Method',
        selectPaymentDesc: 'Choose how you would like to pay for the Premium plan.',
        requestPending: 'Request Pending',
        requestPendingDesc: 'Your activation request is currently under review. We will notify you once it is approved.',
        newYearOffer: "NEW YEAR'S",
        newYearOfferSub: 'OFFER',
        days: 'Days',
        hours: 'Hours',
        minutes: 'Mins',
        seconds: 'Secs',
    },
    ar: {
        cryptoTitle: 'الدفع بالعملات الرقمية',
        cryptoDescription: 'أرسل ما يعادل 50 دولارًا إلى عنوان USDT (TRC20) أدناه. بعد الدفع، قم بتحميل لقطة شاشة ومعرف المعاملة الخاص بك.',
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
        payNow: 'ادفع الآن (50$)',
        paymentProofNote: 'بعد الدفع بنجاح، يرجى العودة وتقديم الإثبات عبر خيار "الدفع بالعملات الرقمية"، باستخدام لقطة شاشة من إيصال الدفع.',
        selectPayment: 'اختر طريقة الدفع',
        selectPaymentDesc: 'اختر كيف ترغب في الدفع مقابل الخطة المميزة.',
        requestPending: 'الطلب قيد المراجعة',
        requestPendingDesc: 'طلب التفعيل الخاص بك قيد المراجعة حاليًا. سنقوم بإعلامك بمجرد الموافقة عليه.',
        newYearOffer: "NEW YEAR'S",
        newYearOfferSub: 'OFFER',
        days: 'أيام',
        hours: 'ساعات',
        minutes: 'دقائق',
        seconds: 'ثواني',
    },
    es: {
        cryptoTitle: 'Pagar con Criptomonedas',
        cryptoDescription: 'Envíe el equivalente a $50 a la dirección USDT (TRC20) a continuación. Después del pago, suba una captura de pantalla y su ID de transacción.',
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
        payNow: 'Pagar Ahora ($50)',
        paymentProofNote: 'Después de un pago exitoso, por favor regrese y presente la prueba a través de la opción "Pagar con Criptomonedas", usando la captura de pantalla de su recibo de pago.',
        selectPayment: 'Seleccione el Método de Pago',
        selectPaymentDesc: 'Elija cómo le gustaría pagar el plan Premium.',
        requestPending: 'Solicitud Pendiente',
        requestPendingDesc: 'Su solicitud de activación está actualmente en revisión. Le notificaremos una vez que sea aprobada.',
        newYearOffer: "NEW YEAR'S",
        newYearOfferSub: 'OFFER',
        days: 'Días',
        hours: 'Horas',
        minutes: 'Minutos',
        seconds: 'Segundos',
    },
};

const WALLET_ADDRESS = "TBEJ333HrfBnsdJqWn3x2tV5GZ3hY3g5R7";
const OFFER_END_DATE = '2026-01-01T00:00:00Z';

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

function CryptoPaymentForm({ userProfile, t, setDialogOpen }: { userProfile: UserProfile | null, t: any, setDialogOpen: (open: boolean) => void }) {
    const initialState: ActivationFormState = { error: null, message: null };
    const [state, formAction] = useActionState(submitActivationRequest, initialState);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>('');
    const [transactionId, setTransactionId] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(WALLET_ADDRESS).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    };

    useEffect(() => {
        if (state.error) {
            toast({
                variant: 'destructive',
                title: t.submissionError,
                description: state.error,
            });
        }
        if (state.message) {
            toast({
                title: t.requestSubmitted,
                description: t.requestSubmittedDesc,
            });
            setDialogOpen(false);
        }
    }, [state, t, toast, setDialogOpen]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
            };

            const compressedFile = await imgCompression(file, options);
            const dataUrl = await imgCompression.getDataUrlFromFile(compressedFile);
            setPreview(dataUrl);
            setScreenshotDataUrl(dataUrl);
        } catch (error) {
            console.error("Payment image error:", error);
            toast({
                variant: 'destructive',
                title: 'Image Error',
                description: 'Failed to process the screenshot. Please try again.',
            });
        } finally {
            e.target.value = '';
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const isFormEnabled = transactionId.trim() !== '' && screenshotDataUrl !== '';

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="userId" value={userProfile?.uid || ''} />
            <input type="hidden" name="email" value={userProfile?.email || ''} />
            <input type="hidden" name="screenshotDataUrl" value={screenshotDataUrl} />
            <input type="hidden" name="planName" value="Premium" />

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

            <div className="space-y-2">
                <label htmlFor="transactionId" className="text-sm font-medium">{t.transactionId}</label>
                <Input
                    id="transactionId"
                    name="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID or hash"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">{t.paymentScreenshot}</label>
                <div
                    className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed bg-muted text-muted-foreground transition-colors hover:border-primary/50"
                    onClick={handleImageClick}
                >
                    {preview ? (
                        <Image src={preview} alt="Screenshot preview" width={400} height={225} className="h-full w-full rounded-md object-contain" />
                    ) : (
                        <>
                            <Upload className="h-8 w-8" />
                            <span>{t.uploadScreenshot}</span>
                        </>
                    )}
                </div>
                <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                />
            </div>

            <SubmitButton t={t} isEnabled={isFormEnabled} />
        </form>
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
            <p className="text-xs text-muted-foreground">{t.paymentProofNote}</p>
        </div>
    );
}

function UpgradeDialog({ children, userProfile, t }: { children: React.ReactNode, userProfile: UserProfile | null, t: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card' | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setPaymentMethod(null);
        }
    }, [isOpen]);

    const renderContent = () => {
        if (paymentMethod === 'crypto') {
            return <CryptoPaymentForm userProfile={userProfile} t={t} setDialogOpen={setIsOpen} />;
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
        return t.selectPayment;
    };

    const getDialogDescription = () => {
        if (paymentMethod === 'crypto') return t.cryptoDescription;
        if (paymentMethod === 'card') return "";
        return t.selectPaymentDesc;
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


export default function PricingPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
            price: '$50 / month',
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
                        if (isCurrentPlan || !isPremium) {
                            return (
                                <Button
                                    className="w-full"
                                    variant={plan.isPrimary ? 'default' : 'secondary'}
                                    disabled
                                >
                                    {isCurrentPlan ? 'Your Current Plan' : plan.cta}
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

                        return (
                            <UpgradeDialog userProfile={userProfile} t={t}>
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
                                <div className="flex flex-col items-center gap-1">
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
