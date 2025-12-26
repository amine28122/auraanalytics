'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useState, useActionState } from 'react';
import Image from 'next/image';
import { getTradeSignals, type AnalysisFormState } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileImage, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TradeSignals } from './trade-signals';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          Generate Signals
        </>
      )}
    </Button>
  );
}

export function ChartAnalysis() {
  const initialState: AnalysisFormState = { data: null, error: null, message: null };
  const [state, formAction] = useActionState(getTradeSignals, initialState);
  const [preview, setPreview] = useState<string | null>(PlaceHolderImages.find(img => img.id === 'chart-1')?.imageUrl || null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Chart Analysis</CardTitle>
          <CardDescription>Upload a chart image to get trade signals from our engine.</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="chartImage">Chart Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed">
                  {preview ? (
                    <Image src={preview} alt="Chart preview" fill style={{ objectFit: 'cover' }} data-ai-hint="stock chart"/>
                  ) : (
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <Input id="chartImage" name="chartImage" type="file" required accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
              </div>
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <TradeSignals result={state} />
    </div>
  );
}
