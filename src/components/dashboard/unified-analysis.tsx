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
  Upload, Loader2, Info, Zap, Trash2, Camera, VideoOff, BrainCircuit, X, PlusCircle, Lock, CheckCircle2, TrendingUp
} from 'lucide-react';

import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { TradeSignals } from './trade-signals';
import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot, Unsubscribe, Timestamp, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import imgCompression from 'browser-image-compression';

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
    schoolsLockedFree: 'Only RSI and MACD are available in the Free plan. Upgrade to unlock all analysis schools.',
    upgradeToUnlock: 'Upgrade to unlock all schools',
    premiumOnly: 'Premium Only',
    proTipsTitle: 'Pro Tips for Best Results',
    tipCleanChart: 'Clean Charts: Remove distracting indicators for clearer price action.',
    tipPriceScale: 'Price Scale: Ensure the right-side price values are visible in your screenshot.',
    tipHighRes: 'High Resolution: Use clear, high-quality images for accurate candle detection.',
    tipDualTF: 'Trend & Entry: HTF (e.g. H4) for trend, LTF (e.g. M15) for entry confirmation.',
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
    schoolsLockedFree: 'فقط RSI و MACD متاحان في الخطة المجانية. قم بالترقية لفتح جميع مدارس التحليل.',
    upgradeToUnlock: 'قم بالترقية لفتح جميع المدارس',
    premiumOnly: 'للخطة المدفوعة فقط',
    proTipsTitle: 'نصائح احترافية لأفضل النتائج',
    tipCleanChart: 'شارت نظيف: أزل المؤشرات المزدحمة لرؤية حركة سعر أوضح.',
    tipPriceScale: 'مقياس السعر: تأكد من وضوح قيم السعر على الجانب الأيمن في الصورة.',
    tipHighRes: 'دقة عالية: استخدم صوراً واضحة بجودة جيدة لتمييز الشموع بدقة.',
    tipDualTF: 'الاتجاه والدخول: الإطار الكبير (H4) للاتجاه، والصغير (M15) لتأكيد الدخول.',
  },
};

const analysisSchoolsList = [
  "RSI",
  "MACD",
  "Fibonacci",
  "ICT",
  "SMC",
  "Elliott Wave Theory",
  "Support & Resistance",
  "Trend Lines & Channels",
  "Chart Patterns",
  "Japanese Candlesticks",
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
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      const event = { target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>;
      onFileChange(event);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-primary/80 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {title}
        </h3>
        {imageData && (
          <Badge variant="outline" className="text-[9px] bg-primary/5 border-primary/20 text-primary">
            Image Loaded
          </Badge>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 transition-all duration-500",
          imageData
            ? "border-primary/30 bg-black/40 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
            : isDragging
              ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_30px_rgba(var(--primary),0.2)]"
              : "border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
        )}
      >
        {/* Futuristic Background Grid */}
        {!imageData && (
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />
        )}

        {imageData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-full w-full p-2 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <Image src={imageData} alt="Preview" fill className="object-contain rounded-lg shadow-2xl" />

            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-9 px-4 rounded-full shadow-xl bg-red-600 hover:bg-red-700"
                onClick={onRemove}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t.remove}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-6 p-6 text-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-inner group-hover:border-primary/50 transition-colors">
                <Upload className={cn("h-8 w-8 transition-all duration-500", isDragging ? "text-primary scale-110" : "text-muted-foreground")} />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground tracking-wide">
                Drop your chart here or use tools below
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                PNG, JPG up to 10MB
              </p>
            </div>

            <div className="flex items-center gap-3 w-full max-w-[280px]">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] border-white/5 h-10"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {t.upload}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] border-white/5 h-10"
                onClick={onCameraClick}
              >
                <Camera className="mr-2 h-4 w-4" />
                {t.capture}
              </Button>
            </div>

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Scan Line Animation (only when image is present) */}
        {imageData && (
          <motion.div
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-primary/40 shadow-[0_0_15px_rgba(var(--primary),1)] z-30 pointer-events-none"
          />
        )}
      </div>
    </div>
  )
}


function AnalysisSchoolsSelector({ t, userPlan }: { t: any; userPlan?: 'Free' | 'Premium' | 'Aura Plan' }) {
  const form = useFormContext<z.infer<typeof FormSchema>>();
  const selectedSchools = form.watch('analysisSchools') || [];
  const { firestore, user } = useFirebase();
  const isFreePlan = userPlan === 'Free' || !userPlan;

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
    // Check if school is locked for free plan
    if (isFreePlan && school !== 'RSI' && school !== 'MACD') {
      return; // Don't allow toggling locked schools
    }
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
        {isFreePlan && (
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <Lock className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">{t.upgradeToUnlock}</AlertTitle>
            <AlertDescription className="text-amber-500/80">
              {t.schoolsLockedFree}
            </AlertDescription>
          </Alert>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              {t.selectSchools}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t.selectSchools}</DialogTitle>
              <DialogDescription>{t.analysisMethodologyDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              {analysisSchoolsList.map((school) => {
                const isLocked = isFreePlan && school !== 'RSI' && school !== 'MACD';
                return (
                  <div
                    key={school}
                    className={cn(
                      "flex items-center justify-between rounded-md p-2",
                      isLocked ? "opacity-50" : "hover:bg-muted"
                    )}
                  >
                    <Label htmlFor={school} className={cn("flex-1 font-medium", isLocked ? "cursor-not-allowed" : "cursor-pointer")}>
                      {school}
                      {isLocked && <span className="ml-2 text-xs text-muted-foreground">({t.premiumOnly})</span>}
                    </Label>
                    <Button
                      size="sm"
                      variant={selectedSchools.includes(school) ? 'secondary' : 'default'}
                      onClick={() => handleToggleSchool(school)}
                      disabled={isLocked}
                    >
                      {isLocked && <Lock className="mr-2 h-3 w-3" />}
                      {selectedSchools.includes(school) ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <PlusCircle className="mr-2 h-4 w-4" />
                      )}
                      {selectedSchools.includes(school) ? t.remove : t.add}
                    </Button>
                  </div>
                );
              })}
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

function AnalysisTips({ t }: { t: any }) {
  return (
    <div className="space-y-3 mt-6">
      <h4 className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-wider">
        <Zap className="h-4 w-4 fill-primary/20" />
        {t.proTipsTitle}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, text: t.tipCleanChart },
          { icon: <TrendingUp className="h-4 w-4 text-blue-500" />, text: t.tipPriceScale },
          { icon: <Camera className="h-4 w-4 text-purple-500" />, text: t.tipHighRes },
          { icon: <PlusCircle className="h-4 w-4 text-amber-500" />, text: t.tipDualTF },
        ].map((tip, i) => (
          <div key={i} className="flex gap-2 p-3 rounded-lg border bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-colors shadow-sm">
            <div className="mt-0.5">{tip.icon}</div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


export function UnifiedAnalysis() {
  const initialState: AnalysisFormState = { data: null, error: null, message: null };
  const [state, formAction] = useActionState(getTradeSignals, initialState);

  const [largeImageData, setLargeImageData] = useState<string | null>(null);
  const [smallImageData, setSmallImageData] = useState<string | null>(null);
  const [cameraTarget, setCameraTarget] = useState<'large' | 'small' | null>(null);
  const lastSavedRef = useRef<string | null>(null);

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

    // Auto-save analysis result
    const currentAnalysisId = state?.data?.signals?.[0] ?
      (state.data.signals[0].pair + state.data.signals[0].entryPrice) : null;

    if (state?.data?.signals && state.data.signals.length > 0 && user && firestore && largeImageData && lastSavedRef.current !== currentAnalysisId) {
      const autoSave = async () => {
        try {
          if (!currentAnalysisId) return;
          lastSavedRef.current = currentAnalysisId;
          const signal = state.data!.signals![0]; // Save the primary signal

          // Compress image for Firestore Base64 storage
          const options = {
            maxSizeMB: 0.1, // 100KB max
            maxWidthOrHeight: 800,
            useWebWorker: true,
          };

          // Convert dataURL to file for compression
          const response = await fetch(largeImageData);
          const blob = await response.blob();
          const file = new File([blob], "chart.jpg", { type: "image/jpeg" });

          const compressedFile = await imgCompression(file, options);
          const compressedBase64 = await imgCompression.getDataUrlFromFile(compressedFile);

          await addDoc(collection(firestore, 'users', user.uid, 'analyses'), {
            pair: signal.pair,
            type: signal.type,
            entry: parseFloat(signal.entryPrice) || 0,
            stopLoss: parseFloat(signal.stopLoss) || 0,
            takeProfit: parseFloat(signal.takeProfit[0]) || 0,
            status: 'PENDING',
            image: compressedBase64,
            schools: selectedSchools,
            analysis: state.data?.analysisSummary || "",
            orderType: signal.orderType,
            entryLabel: signal.entryPrice,
            createdAt: serverTimestamp(),
          });

          console.log("Analysis saved successfully");
        } catch (error) {
          console.error("Failed to auto-save analysis:", error);
        }
      };
      autoSave();
    }
  }, [state, toast, user, firestore, largeImageData]);

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<string | null>>) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5, // 500KB is plenty for analysis
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      const compressedFile = await imgCompression(file, options);
      const dataUrl = await imgCompression.getDataUrlFromFile(compressedFile);
      setter(dataUrl);
    } catch (error) {
      console.error("Image processing error:", error);
      toast({
        variant: 'destructive',
        title: 'Image Error',
        description: 'Failed to process the image. Please try a different one or reduce the size.',
      });
    } finally {
      e.target.value = ''; // Always reset
    }
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

  const handleCapture = async (dataUrl: string) => {
    try {
      // Also compress camera captures
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      const compressedFile = await imgCompression(file, options);
      const finalDataUrl = await imgCompression.getDataUrlFromFile(compressedFile);

      if (cameraTarget === 'large') {
        setLargeImageData(finalDataUrl);
      } else if (cameraTarget === 'small') {
        setSmallImageData(finalDataUrl);
      }
    } catch (error) {
      console.error("Capture compression error:", error);
      // Fallback to original if compression fails
      if (cameraTarget === 'large') {
        setLargeImageData(dataUrl);
      } else if (cameraTarget === 'small') {
        setSmallImageData(dataUrl);
      }
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

              <AnalysisSchoolsSelector t={t} userPlan={userProfile?.plan} />

              <input type="hidden" name="chartDataLarge" value={largeImageData || ''} />
              <input type="hidden" name="chartDataSmall" value={smallImageData || ''} />
              <input type="hidden" name="userId" value={user?.uid || ''} />
              <input type="hidden" name="userLang" value={lang} />
              <input type="hidden" name="analysisSchools" value={selectedSchools ? selectedSchools.join(',') : ''} />

              <AnalysisTips t={t} />
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
