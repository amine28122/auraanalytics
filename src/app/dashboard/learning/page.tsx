'use client';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BrainCircuit, Star, Target, TestTube2, CheckCircle, Lock } from 'lucide-react';
import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { translations, type Lesson, type Stage } from '@/lib/learning-content';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

type UserProfile = {
  language?: 'en' | 'ar' | 'es';
  learningProgress?: Record<string, boolean>;
}

const ICONS: { [key: string]: React.ElementType } = {
    Star,
    Target,
    BrainCircuit,
};

type Language = keyof typeof translations;

export default function LearningPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [progress, setProgress] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (user && firestore) {
            const userDocRef = doc(firestore, 'users', user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    const profile = doc.data() as UserProfile;
                    setUserProfile(profile);
                    setProgress(profile.learningProgress || {});
                }
            });
            return () => unsubscribe();
        }
    }, [user, firestore]);
    
    const lang = userProfile?.language || 'en';
    const t = translations[lang];
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    const handleProgressChange = async (lessonId: string, checked: boolean) => {
        if (!user || !firestore) return;
        
        const newProgress = { ...progress, [lessonId]: checked };
        setProgress(newProgress);

        const userDocRef = doc(firestore, 'users', user.uid);
        try {
            await updateDoc(userDocRef, {
                learningProgress: newProgress
            });
        } catch (error) {
            console.error("Failed to update progress:", error);
            setProgress(progress);
        }
    };

    const isLessonCompleted = (lesson: Lesson): boolean => {
        if (!lesson.subLessons || lesson.subLessons.length === 0) {
            return progress[lesson.id] || false;
        }
        return lesson.subLessons.every(sub => progress[sub.id]);
    };

    const areAllLessonsCompleted = () => {
        if (!t || Object.keys(progress).length === 0) return false;
        
        const allLessonIds = t.stages.flatMap(stage => 
            stage.lessons.flatMap(lesson => 
                lesson.subLessons ? lesson.subLessons.map(sl => sl.id) : [lesson.id]
            )
        );

        return allLessonIds.every(id => progress[id]);
    };

    let allPreviousLessonsCompleted = true;
    const isExamUnlocked = areAllLessonsCompleted();

    return (
        <div className="flex flex-col gap-8" dir={dir}>
            <div className="flex w-full flex-col gap-2">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <h1 className="font-headline text-3xl font-bold tracking-tighter">
                            {t.pageTitle}
                        </h1>
                    </div>
                </div>
                <p className="text-muted-foreground">
                    {t.pageDescription}
                </p>
            </div>

            <Accordion type="single" collapsible defaultValue="stage-0" className="w-full space-y-8">
                {t.stages.map((stageData, stageIndex) => {
                    const StageIcon = ICONS[stageData.icon];
                    return (
                    <AccordionItem value={`stage-${stageIndex}`} key={stageData.stage}>
                        <AccordionTrigger className="!no-underline p-0">
                             <Card className="w-full card-glow">
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                    {StageIcon && <StageIcon className="h-10 w-10 text-primary" />}
                                    <div>
                                        <CardTitle>{stageData.stage}</CardTitle>
                                        <CardDescription>{stageData.description}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </AccordionTrigger>
                        <AccordionContent className="pt-6">
                             <div className="flex flex-col gap-6 pl-4 md:pl-8 border-l-2 border-primary/20 ml-4 md:ml-8">
                                {stageData.lessons.map((lesson) => {
                                    const isLocked = !allPreviousLessonsCompleted;
                                    const currentLessonIsCompleted = isLessonCompleted(lesson);
                                    
                                    if (!isLocked) {
                                      allPreviousLessonsCompleted = currentLessonIsCompleted;
                                    }

                                    return (
                                        <div key={lesson.id} className={cn("relative transition-opacity", isLocked && "opacity-60")}>
                                            {isLocked && <div className={cn("absolute top-1/2 -translate-y-1/2 z-10 rounded-full bg-card p-1 text-muted-foreground", dir === 'rtl' ? 'right-[-20px] md:right-[-26px]' : 'left-[-20px] md:left-[-26px]')}><Lock className="h-4 w-4" /></div>}
                                            <Accordion type="single" collapsible disabled={isLocked}>
                                                <AccordionItem value={lesson.id} className="border-b-0">
                                                    <Card className="card-glow">
                                                        <CardHeader>
                                                            <AccordionTrigger className={cn("text-left p-0", isLocked && "cursor-not-allowed hover:no-underline")}>
                                                                <div className="flex items-center gap-3 w-full">
                                                                    {isLessonCompleted(lesson) ? <CheckCircle className="h-6 w-6 text-green-500" /> : <div className="h-6 w-6 rounded-full border-2 border-primary" />}
                                                                    <CardTitle className="text-xl flex-1">{lesson.title}</CardTitle>
                                                                    {isLocked && <Badge variant="secondary">{t.lessonLocked}</Badge>}
                                                                </div>
                                                            </AccordionTrigger>
                                                        </CardHeader>
                                                        <AccordionContent className="p-6 pt-0">
                                                            {lesson.subLessons && lesson.subLessons.length > 0 ? (
                                                                <div className="space-y-4">
                                                                    {lesson.subLessons.map(subLesson => (
                                                                        <div key={subLesson.id} className="space-y-2 rounded-md border p-4 bg-muted/50">
                                                                            <h4 className="font-semibold">{subLesson.title}</h4>
                                                                            <p className="whitespace-pre-wrap text-muted-foreground">{subLesson.content}</p>
                                                                             <div className="flex items-center space-x-2 pt-2">
                                                                                <Checkbox id={subLesson.id} checked={progress[subLesson.id]} onCheckedChange={(checked) => handleProgressChange(subLesson.id, !!checked)} />
                                                                                <Label htmlFor={subLesson.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                                    {t.markAsRead}
                                                                                </Label>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4">
                                                                    <p className="whitespace-pre-wrap text-muted-foreground">{lesson.content}</p>
                                                                    <div className="flex items-center space-x-2 pt-2">
                                                                        <Checkbox id={lesson.id} checked={progress[lesson.id]} onCheckedChange={(checked) => handleProgressChange(lesson.id, !!checked)} />
                                                                        <Label htmlFor={lesson.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                             {t.markAsRead}
                                                                        </Label>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </AccordionContent>
                                                    </Card>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    );
                                })}
                             </div>
                        </AccordionContent>
                    </AccordionItem>
                )})}
            </Accordion>
            

            <Card className="bg-primary/10 card-glow">
                <CardHeader className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                        <TestTube2 className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{t.finalExamCard.title}</CardTitle>
                    <CardDescription>
                        {t.finalExamCard.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="lg" disabled={!isExamUnlocked}>
                                {isExamUnlocked ? t.finalExamCard.buttonTextActive : t.finalExamCard.buttonText}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t.finalExamCard.dialogTitle}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t.finalExamCard.dialogDescription}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.finalExamCard.dialogCancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => router.push('/dashboard/learning/exam')}>{t.finalExamCard.dialogAction}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

        </div>
    );
}
