'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { examQuestions } from '@/lib/exam-questions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Award, Download, Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Certificate } from '@/components/dashboard/certificate';
import { Input } from '@/components/ui/input';
import { toPng } from 'html-to-image';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type UserProfile = {
  language?: 'en' | 'ar' | 'es';
};

type AnswersState = {
  [key: number]: number;
};

type Theme = 'light' | 'dark';

function ExamResults({ score, totalQuestions, lang, dir, onRetry }: { score: number, totalQuestions: number, lang: 'en' | 'ar' | 'es', dir: 'ltr' | 'rtl', onRetry: () => void }) {
  const t = examQuestions[lang];
  const finalPercentage = (score / totalQuestions) * 100;
  const isPass = finalPercentage >= t.passingScore;
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const [userName, setUserName] = useState(user?.displayName || '');
  const [theme, setTheme] = useState<Theme>('dark');
  
  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(currentTheme);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleDownloadCertificate = useCallback(() => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    
    toPng(certificateRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: theme === 'dark' ? '#0A0A0A' : '#FFFFFF',
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `AURA_Academy_Certificate_${userName.replace(' ', '_')}.png`;
        link.href = dataUrl;
        link.click();
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error('Failed to generate certificate', err);
        setIsGenerating(false);
      });
  }, [userName, theme]);

  return (
    <main className="flex w-full flex-col items-center justify-center p-4 gap-8" dir={dir}>
      <Card className="w-full max-w-lg text-center card-glow">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="mt-4">{t.resultsTitle}</CardTitle>
          <CardDescription>{isPass ? t.passMessage : t.failMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center">
            <p className="text-6xl font-bold text-primary">{finalPercentage.toFixed(0)}%</p>
            <p className="text-muted-foreground">{t.scoreText(score, totalQuestions)}</p>
          </div>
          {isPass && (
            <div className="space-y-4 pt-4 border-t">
              <Label htmlFor="fullName" className="text-left block">{t.certificateName}</Label>
              <Input
                id="fullName"
                placeholder={t.certificateNamePlaceholder}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Button onClick={handleDownloadCertificate} disabled={isGenerating || !userName} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {t.downloadCertificate}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/learning">{t.backToLearning}</Link>
          </Button>
           {!isPass && (
             <Button onClick={onRetry} className="w-full">{t.retryExam}</Button>
           )}
        </CardFooter>
      </Card>
      
      {isPass && (
        <div className="absolute -left-[9999px] top-0">
           <div ref={certificateRef}>
              <Certificate 
                  name={userName} 
                  score={finalPercentage} 
                  date={new Date().toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
                  awardedByText={t.certificate.awardedBy}
                  completionText={t.certificate.completionText}
                  gradeText={finalPercentage >= 95 ? t.certificate.gradeMaster : t.certificate.gradePass}
                  theme={theme}
              />
            </div>
        </div>
      )}
    </main>
  );
}


export default function ExamPage() {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [answers, setAnswers] = useState<AnswersState>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showError, setShowError] = useState(false);
  
  const lang = userProfile?.language || 'en';
  const t = examQuestions[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  const totalQuestions = t.pages.reduce((acc, page) => acc + page.questions.length, 0);
  const questionsPerPageIndex = t.pages.map(p => p.questions.length).reduce((acc, len, i) => {
    acc.push((acc[i-1] || 0) + len);
    return acc;
  }, [] as number[]);
  
  const getQuestionGlobalIndex = (pageIndex: number, questionIndex: number) => {
      const baseIndex = pageIndex > 0 ? questionsPerPageIndex[pageIndex - 1] : 0;
      return baseIndex + questionIndex;
  };

  const resetExam = () => {
    setAnswers({});
    setIsFinished(false);
    setScore(0);
    setCurrentPage(0);
  }

  useEffect(() => {
    if (user && firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data() as UserProfile);
        }
      });
      return () => unsubscribe();
    }
  }, [user, firestore]);

  const handleAnswerSelect = (globalIndex: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [globalIndex]: answerIndex }));
  };
  
  const areAllQuestionsOnPageAnswered = () => {
      const page = t.pages[currentPage];
      const baseIndex = currentPage > 0 ? questionsPerPageIndex[currentPage - 1] : 0;
      for(let i = 0; i < page.questions.length; i++) {
          if (answers[baseIndex + i] === undefined) {
              return false;
          }
      }
      return true;
  }

  const handleNextPage = () => {
      if(areAllQuestionsOnPageAnswered()) {
          setShowError(false);
          if (currentPage < t.pages.length - 1) {
              setCurrentPage(p => p + 1);
          }
      } else {
          setShowError(true);
      }
  }

  const handlePrevPage = () => {
      if (currentPage > 0) {
          setCurrentPage(p => p - 1);
      }
  }

  const handleSubmit = () => {
    if(!areAllQuestionsOnPageAnswered()){
        setShowError(true);
        return;
    }

    let finalScore = 0;
    t.pages.forEach((page, pageIndex) => {
        page.questions.forEach((q, qIndex) => {
            const globalIndex = getQuestionGlobalIndex(pageIndex, qIndex);
            if (answers[globalIndex] === q.correctAnswer) {
                finalScore++;
            }
        });
    });
    setScore(finalScore);
    setIsFinished(true);
  };
  
  const currentQuestions = t.pages[currentPage].questions;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  if (isFinished) {
    return <ExamResults score={score} totalQuestions={totalQuestions} lang={lang} dir={dir} onRetry={resetExam} />
  }

  return (
    <div className="flex flex-col gap-8" dir={dir}>
      <div className="flex w-full flex-col gap-4">
        <div className='flex justify-between items-center'>
            <div>
                 <h1 className="font-headline text-3xl font-bold tracking-tighter">
                    {t.examTitle}
                </h1>
                <p className="text-muted-foreground">
                    {t.pages[currentPage].title}
                </p>
            </div>
            <p className="font-semibold text-primary">{t.pageIndicator(currentPage + 1, t.pages.length)}</p>
        </div>
        <Progress value={progress} />
      </div>

      <div className="space-y-8">
        {currentQuestions.map((question, qIndex) => {
            const globalIndex = getQuestionGlobalIndex(currentPage, qIndex);
            return (
                <Card key={globalIndex} className="card-glow">
                    <CardContent className="pt-6">
                    <p className="mb-4 text-lg font-semibold">
                        {`${qIndex + 1}. ${question.question}`}
                    </p>
                    
                    {question.image && (
                         <div className="relative mb-4 aspect-video w-full max-w-md mx-auto overflow-hidden rounded-md border">
                            <Image src={question.image} alt="Exam Question" layout="fill" objectFit="contain" data-ai-hint={question.aiHint}/>
                        </div>
                    )}
                    
                    <RadioGroup 
                        value={answers[globalIndex] !== undefined ? String(answers[globalIndex]) : undefined}
                        onValueChange={(value) => handleAnswerSelect(globalIndex, parseInt(value))}
                        className={cn("space-y-3", dir === 'rtl' && 'space-x-reverse')}
                    >
                        {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-3 space-x-reverse">
                            <RadioGroupItem value={String(oIndex)} id={`q${globalIndex}-o${oIndex}`} />
                            <Label htmlFor={`q${globalIndex}-o${oIndex}`} className="flex-1 text-base">
                            {option}
                            </Label>
                        </div>
                        ))}
                    </RadioGroup>
                    </CardContent>
                </Card>
            )
        })}
      </div>
      
       {showError && (
         <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Incomplete Page</AlertTitle>
            <AlertDescription>
                Please answer all questions on this page before proceeding.
            </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between mt-4">
          <Button onClick={handlePrevPage} disabled={currentPage === 0} variant="outline" size="lg">
              <ChevronLeft className="mr-2 h-5 w-5" />
              {t.prevButton}
          </Button>

          {currentPage === t.pages.length - 1 ? (
             <Button onClick={handleSubmit} size="lg">
                {t.submitButton}
            </Button>
          ): (
            <Button onClick={handleNextPage} size="lg">
              {t.nextButton}
              <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          )}
      </div>
    </div>
  );
}
