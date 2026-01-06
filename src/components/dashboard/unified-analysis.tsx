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
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 }); // Refs for direct access during event handlers

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (open) {
      // Reset state on open
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      positionRef.current = { x: 0, y: 0 };

      const startAndAssignStream = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
          toast({ variant: 'destructive', title: t.cameraAccessRequired, description: "Your browser doesn't support camera access." });
          setHasPermission(false);
          return;
        }
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          });
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
      startAndAssignStream();
    }

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

  // Pan Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newPos = {
      x: positionRef.current.x + dx,
      y: positionRef.current.y + dy
    };

    setPosition(newPos);

    // Don't update ref here, only on up or we lose the delta logic 
    // Actually, for smooth dragging usually we do:
    // current = start + delta. 
    // To do that we need to keep 'start' refers to the position at the BEGINNING of the drag.
    // Let's adjust:
    // We need to know the 'base' position when drag started.
  };

  // Better Pan Logic
  const handlePanStart = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePanMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handlePanEnd = (e: React.PointerEvent) => {
    setIsDragging(false);
    positionRef.current = position; // Sync ref
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleCapture = () => {
    if (videoRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // We want to capture exactly what is visible in the container
      const canvas = document.createElement('canvas');
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      const context = canvas.getContext('2d');

      if (context) {
        // Calculate the draw parameters
        // The video is drawn at (position.x, position.y) with scale (zoom)
        // Center of scaling should be considered, but here we applied simply styles

        // CSS Transform Origin is usually center (50% 50%) by default on some elements, but we are just translating
        // Simulating the CSS transform in Canvas:

        // 1. Fill background (optional)
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Apply transforms
        // We need to translate to the center if we want zoom-from-center, but our simple pan logic moves the whole thing
        // Let's assume the video is centered by flexbox initially? 
        // No, in our CSS below we should precise positioning.

        // Let's rely on the math:
        // Rendered Width = VideoWidth * Zoom
        // Rendered Height = VideoHeight * Zoom
        // Rendered X = Position.X + (ContainerWidth - RenderedWidth) / 2  <-- If centered initially

        // To simplify: We will style the video with `transform: translate(x, y) scale(z)`
        // And we replicate that in canvas

        const vid = videoRef.current;
        const vWidth = vid.videoWidth;
        const vHeight = vid.videoHeight;

        // Aspect Fit logic initial:
        // We usually want the video to cover or contain. 
        // Let's assume we render the video at intrinsic size * zoom, centered + offset.

        context.save();

        // Move to center of canvas
        context.translate(canvas.width / 2, canvas.height / 2);

        // Apply Pan
        context.translate(position.x, position.y);

        // Apply Zoom
        context.scale(zoom, zoom);

        // Draw video centered at the new origin
        context.drawImage(vid, -vWidth / 2, -vHeight / 2, vWidth, vHeight);

        context.restore();

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 flex flex-col w-full sm:max-w-md overflow-hidden bg-background">
        <DialogHeader className="p-4 bg-muted/30 border-b">
          <DialogTitle>{t.cameraDialogTitle}</DialogTitle>
          <DialogDescription className="text-xs">
            Drag to move • Pinch/Slider to Zoom
          </DialogDescription>
        </DialogHeader>

        <div
          ref={containerRef}
          className="relative w-full aspect-[3/4] overflow-hidden bg-slate-950 cursor-move touch-none"
          onPointerDown={handlePanStart}
          onPointerMove={handlePanMove}
          onPointerUp={handlePanEnd}
          onPointerLeave={handlePanEnd}
        >
          {!hasPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="max-w-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  width: 'auto',
                  height: 'auto',
                  // Ensure video is large enough to be useful?
                  // Actually let's just let it be its natural size and centered by flex above?
                  // No, 'max-w-none' and absolute positioning might be better for precise control.
                  // Let's use the canvas logic: Centered by default.
                }}
              />
            </div>
          )}

          {hasPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-4 text-center z-10">
              <VideoOff className="h-8 w-8 text-destructive" />
              <p className="mt-2 font-semibold text-white">{t.cameraAccessRequired}</p>
              <p className="mt-1 text-xs text-slate-300">{t.allowCameraAccess}</p>
            </div>
          )}

          {/* Grid Overlay for framing */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="w-full h-full border-2 border-white/20"></div>
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20"></div>
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20"></div>
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20"></div>
          </div>
        </div>

        <div className="p-4 space-y-4 bg-background border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" /> {/* Should be ZoomOut but let's use generic */}
              <span className="text-xs">Zoom</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs w-8 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
              {t.cancel}
            </Button>
            <Button onClick={handleCapture} disabled={!hasPermission} className="flex-1">
              <Camera className="mr-2 h-4 w-4" /> {t.capture}
            </Button>
          </div>
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
            analysis: state.data.analysisSummary || "",
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
