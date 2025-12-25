'use client';

import React, { useEffect, useRef, useState, useActionState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { getTradeSignals, type AnalysisFormState } from '@/lib/actions';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils';

import {
  Upload, Loader2, Info, Zap, Trash2, Camera, VideoOff, BrainCircuit, X, PlusCircle
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { TradeSignals } from './trade-signals';
import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot, Unsubscribe, Timestamp, updateDoc } from 'firebase/firestore';

const translations = {
  en: {
    uploadLarge: 'Upload Large Timeframe',
    uploadSmall: 'Upload Small Timeframe (Optional)',
    analyzing: 'Analyzing...',
    generateSignals: 'Generate Signals',
    dailyLimitReached: 'Daily Limit Reached',
    upgradePlan: 'Upgrade Plan',
    usageInfo: (used: number, limit: number | string) => `Usage: ${used}/${limit} analyses used today.`,
    infoTitle: 'Multi-Timeframe Analysis',
    infoDescription: 'For a more robust analysis, upload a chart for a large timeframe (e.g., H4, Daily) and an optional second chart for a smaller timeframe (e.g., M15) for a precise entry.',
    limitReachedFree: 'You have used all your analyses for today.',
    limitReachedPremium: 'You have used all your analyses for today. More analyses will be available tomorrow.',
    largeTimeframe: 'Large Timeframe',
    smallTimeframe: 'Small Timeframe',
    remove: 'Remove',
    capture: 'Capture',
    cancel: 'Cancel',
    cameraAccessRequired: 'Camera Access Required',
    allowCameraAccess: 'Please allow camera access in your browser settings to use this feature.',
    upload: 'Upload',
    startCamera: 'Start Camera',
    cameraDialogTitle: 'Capture Chart Image',
    analysisMethodology: 'Analysis Methodology',
    analysisMethodologyDesc: 'Select the schools of thought to focus the analysis on. Leave blank for a comprehensive analysis.',
    selectSchools: 'Select Analysis Schools',
    selectedSchools: 'Selected Schools',
    noSchoolsSelected: 'Comprehensive analysis will be performed.',
    add: 'Add',
  },
  ar: {
    uploadLarge: 'رفع الإطار الزمني الكبير',
    uploadSmall: 'رفع الإطار الزمني الصغير (اختياري)',
    analyzing: 'جاري التحليل...',
    generateSignals: 'توليد الإشارات',
    dailyLimitReached: 'تم الوصول للحد اليومي',
    upgradePlan: 'ترقية الخطة',
    usageInfo: (used: number, limit: number | string) => `الاستخدام: ${used}/${limit} تحليلات مستخدمة اليوم.`,
    infoTitle: 'تحليل متعدد الأطر الزمنية',
    infoDescription: 'لتحليل أكثر قوة، قم برفع شارت للإطار الزمني الكبير (مثل 4 ساعات، يومي) وشارت ثانٍ اختياري لإطار زمني أصغر (مثل 15 دقيقة) لنقطة دخول دقيقة.',
    limitReachedFree: 'لقد استخدمت كل تحليلاتك لهذا اليوم.',
    limitReachedPremium: 'لقد استخدمت كل تحليلاتك لهذا اليوم. سيتم توفير المزيد من التحليلات غدًا.',
    largeTimeframe: 'الإطار الزمني الكبير',
    smallTimeframe: 'الإطار الزمني الصغير',
    remove: 'إزالة',
    capture: 'التقاط',
    cancel: 'إلغاء',
    cameraAccessRequired: 'الوصول إلى الكاميرا مطلوب',
    allowCameraAccess: 'الرجاء السماح بالوصول إلى الكاميرا في إعدادات المتصفح لاستخدام هذه الميزة.',
    upload: 'تحميل',
    startCamera: 'تشغيل الكاميرا',
    cameraDialogTitle: 'التقاط صورة الرسم البياني',
    analysisMethodology: 'منهجية التحليل',
    analysisMethodologyDesc: 'اختر مدارس الفكر التي سيركز عليها التحليل. اتركها فارغة لتحليل شامل.',
    selectSchools: 'اختر مدارس التحليل',
    selectedSchools: 'المدارس المختارة',
    noSchoolsSelected: 'سيتم إجراء تحليل شامل.',
    add: 'إضافة',
  },
};

const analysisSchoolsList = [
  "ICT",
  "SMC",
  "Elliott Wave Theory",
  "Support & Resistance",
  "Trend Lines & Channels",
  "Chart Patterns",
  "Japanese Candlesticks",
  "RSI",
  "MACD",
  "Fibonacci",
  "Quantitative Analysis",
] as const;

const FormSchema = z.object({
  analysisSchools: z.array(z.string()),
});


type UserProfile = {
  plan?: 'Free' | 'Premium' | 'Aura Plan';
  language?: 'en' | 'ar' | 'es';
  analysisCount?: number;
  lastAnalysisDate?: Timestamp;
  preferredAnalysisSchools?: string[];
};

const PLAN_LIMITS = {
  Free: 1,
  Premium: 5,
  'Aura Plan': Infinity,
};

function SubmitButton({ disabled, t }: { disabled: boolean; t: any }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t.analyzing}
        </>
      ) : (
        t.generateSignals
      )}
    </Button>
  );
}

const CameraDialog = ({ open, onOpenChange, onCapture, t }: { open: boolean, onOpenChange: (open: boolean) => void, onCapture: (dataUrl: string) => void, t: any }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startAndAssignStream = async () => {
             if (open) {
                if (!navigator.mediaDevices?.getUserMedia) {
                    toast({ variant: 'destructive', title: t.cameraAccessRequired, description: "Your browser doesn't support camera access." });
                    setHasPermission(false);
                    return;
                }
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setHasPermission(true);
                } catch (err) {
                    console.error("Camera Error:", err);
                    setHasPermission(false);
                    toast({ variant: 'destructive', title: t.cameraAccessRequired, description: t.allowCameraAccess });
                }
            }
        }
        startAndAssignStream();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
             if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setHasPermission(null);
        }
    }, [open, t, toast]);


    const handleCapture = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                onCapture(dataUrl);
                onOpenChange(false);
            }
        }
    };
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 flex flex-col w-full sm:max-w-xs">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{t.cameraDialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-[9/16] w-full overflow-hidden bg-slate-900">
            <video ref={videoRef} playsInline autoPlay muted className="h-full w-full object-cover" />
            {hasPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-4 text-center">
                <VideoOff className="h-8 w-8 text-destructive" />
                <p className="mt-2 font-semibold text-white">{t.cameraAccessRequired}</p>
                <p className="mt-1 text-xs text-slate-300">{t.allowCameraAccess}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 p-4 pt-0">
            <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">{t.cancel}</Button>
            <Button onClick={handleCapture} disabled={!hasPermission} className="w-full">
              <Camera className="mr-2 h-4 w-4" /> {t.capture}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
};


const ImageUploader = ({ 
    title, 
    imageData, 
    onFileChange, 
    onRemove,
    onCameraClick,
    t
}: {
    title: string,
    imageData: string | null,
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onRemove: () => void,
    onCameraClick: () => void,
    t: any
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
            <div 
                className="relative flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed bg-muted/50 p-2 text-muted-foreground"
            >
                {imageData ? (
                     <>
                        <Image src={imageData} alt="Preview" fill className="object-contain rounded-md p-1" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-1 top-1 h-7 w-7 z-10"
                            onClick={onRemove}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </>
                ) : (
                   <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full justify-center px-4">
                        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => fileInputRef.current?.click()}>
                           <Upload className="mr-2 h-5 w-5" />
                           {t.upload}
                        </Button>
                        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onCameraClick}>
                            <Camera className="mr-2 h-5 w-5" />
                            {t.capture}
                        </Button>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onFileChange}
                            className="hidden"
                        />
                   </div>
                )}
            </div>
        </div>
    )
}

function AnalysisSchoolsSelector({ t }: { t: any }) {
  const form = useFormContext<z.infer<typeof FormSchema>>();
  const selectedSchools = form.watch('analysisSchools') || [];
  const { firestore, user } = useFirebase();

  const updatePreferredSchools = useCallback(async (schools: string[]) => {
    if (user && firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      try {
        await updateDoc(userDocRef, { preferredAnalysisSchools: schools });
      } catch (error) {
        console.error("Failed to update preferred schools:", error);
      }
    }
  }, [user, firestore]);

  const handleToggleSchool = (school: string) => {
    const newSelection = selectedSchools.includes(school)
      ? selectedSchools.filter((s) => s !== school)
      : [...selectedSchools, school];
    form.setValue('analysisSchools', newSelection, { shouldDirty: true });
    updatePreferredSchools(newSelection);
  };
  
  const handleRemoveSchool = (school: string) => {
     const newSelection = selectedSchools.filter((s) => s !== school);
     form.setValue('analysisSchools', newSelection, { shouldDirty: true });
     updatePreferredSchools(newSelection);
  }
  
  const isCrowded = selectedSchools.length > 4;

  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <BrainCircuit className="h-5 w-5 text-primary" />
          {t.analysisMethodology}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              {t.selectSchools}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.selectSchools}</DialogTitle>
              <DialogDescription>{t.analysisMethodologyDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-4">
              {analysisSchoolsList.map((school) => (
                <div
                  key={school}
                  className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
                >
                  <Label htmlFor={school} className="flex-1 cursor-pointer font-medium">
                    {school}
                  </Label>
                  <Button
                      size="sm"
                      variant={selectedSchools.includes(school) ? 'secondary' : 'default'}
                      onClick={() => handleToggleSchool(school)}
                    >
                       {selectedSchools.includes(school) ? (
                          <X className="h-4 w-4" />
                      ) : (
                        <PlusCircle className="mr-2 h-4 w-4" />
                      )}
                       {selectedSchools.includes(school) ? t.remove : t.add}
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">{t.selectedSchools}</h4>
            {selectedSchools && selectedSchools.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {selectedSchools.map((school: string) => (
                         <Badge 
                            key={school} 
                            variant="secondary"
                            className={cn(
                                "flex items-center gap-1.5",
                                isCrowded ? "text-xs py-0.5 px-2" : "text-sm py-1 px-3"
                            )}
                        >
                            <span>{school}</span>
                            <button type="button" onClick={() => handleRemoveSchool(school)} className="rounded-full hover:bg-destructive/20 text-destructive/80 hover:text-destructive">
                                <X className={cn(isCrowded ? "h-2.5 w-2.5" : "h-3 w-3")} />
                            </button>
                        </Badge>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">{t.noSchoolsSelected}</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}


export function UnifiedAnalysis() {
  const initialState: AnalysisFormState = { data: null, error: null, message: null };
  const [state, formAction] = useActionState(getTradeSignals, initialState);

  const [largeImageData, setLargeImageData] = useState<string | null>(null);
  const [smallImageData, setSmallImageData] = useState<string | null>(null);
  const [cameraTarget, setCameraTarget] = useState<'large' | 'small' | null>(null);

  const { user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const lang = userProfile?.language === 'ar' ? 'ar' : 'en';
  const t = translations[lang];

   const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      analysisSchools: [],
    },
  });

  const selectedSchools = form.watch("analysisSchools");

  useEffect(() => {
    let unsub: Unsubscribe | undefined;
    if (user && firestore) {
      unsub = onSnapshot(doc(firestore, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          const profile = doc.data() as UserProfile;
          setUserProfile(profile);
          form.reset({ analysisSchools: profile.preferredAnalysisSchools || [] });
        }
      });
    }
    return () => unsub?.();
  }, [user, firestore, form]);

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<string | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
        const img = document.createElement('img');
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Compress to 70% quality JPEG
                setter(dataUrl);
            }
        };
        img.src = loadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset file input
  };
  
  const getUsageInfo = (profile: UserProfile | null) => {
    if (!profile) return { used: 0, limit: 1, isNewDay: true };

    const plan = profile.plan || 'Free';
    const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
    let used = profile.analysisCount || 0;
    
    const lastDate = profile.lastAnalysisDate?.toDate();
    const now = new Date();

    const isNewDay = !lastDate || 
      lastDate.getUTCFullYear() !== now.getUTCFullYear() ||
      lastDate.getUTCMonth() !== now.getUTCMonth() ||
      lastDate.getUTCDate() !== now.getUTCDate();
    
    if (isNewDay) {
      used = 0;
    }
    
    return { used, limit, isNewDay };
  }
  
  const usageInfo = getUsageInfo(userProfile);
  const isLimitReached = userProfile?.plan !== 'Aura Plan' && usageInfo.used >= usageInfo.limit;
  
  const handleCapture = (dataUrl: string) => {
    if (cameraTarget === 'large') {
        setLargeImageData(dataUrl);
    } else if (cameraTarget === 'small') {
        setSmallImageData(dataUrl);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <FormProvider {...form}>
        <Card className="card-glow">
            <form action={formAction}>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    
                  <ImageUploader 
                        title={t.largeTimeframe}
                        imageData={largeImageData}
                        onFileChange={handleFileChange(setLargeImageData)}
                        onRemove={() => setLargeImageData(null)}
                        onCameraClick={() => setCameraTarget('large')}
                        t={t}
                    />

                  <ImageUploader 
                        title={t.smallTimeframe}
                        imageData={smallImageData}
                        onFileChange={handleFileChange(setSmallImageData)}
                        onRemove={() => setSmallImageData(null)}
                        onCameraClick={() => setCameraTarget('small')}
                        t={t}
                    />
                </div>
                
                <AnalysisSchoolsSelector t={t} />

                <input type="hidden" name="chartDataLarge" value={largeImageData || ''} />
                <input type="hidden" name="chartDataSmall" value={smallImageData || ''} />
                <input type="hidden" name="userId" value={user?.uid || ''} />
                <input type="hidden" name="userLang" value={lang} />
                <input type="hidden" name="analysisSchools" value={selectedSchools ? selectedSchools.join(',') : ''} />
              </CardContent>

              <CardFooter className="flex-col gap-4">
                {isLimitReached ? (
                  <Alert variant="destructive">
                    <Zap className="h-4 w-4" />
                    <AlertTitle>{t.dailyLimitReached}</AlertTitle>
                    <AlertDescription className="flex items-center justify-between gap-2">
                      <span>
                        {userProfile?.plan === 'Free' ? t.limitReachedFree : t.limitReachedPremium}
                      </span>
                      {userProfile?.plan === 'Free' && (
                        <Button asChild size="sm">
                          <Link href="/dashboard/pricing">{t.upgradePlan}</Link>
                        </Button>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>{t.infoTitle}</AlertTitle>
                    <AlertDescription>
                      {t.infoDescription}
                      <br />
                      <span className="font-medium text-muted-foreground">
                        {userProfile?.plan !== 'Aura Plan' && t.usageInfo(usageInfo.used, usageInfo.limit === Infinity ? '∞' : usageInfo.limit)}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
              
                <SubmitButton disabled={!largeImageData || isLimitReached} t={t} />
              </CardFooter>
            </form>
        </Card>
      </FormProvider>

      <TradeSignals result={state} />

      <CameraDialog 
        open={!!cameraTarget}
        onOpenChange={(isOpen) => !isOpen && setCameraTarget(null)}
        onCapture={handleCapture}
        t={t}
      />
    </div>
  );
}
