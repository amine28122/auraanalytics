'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowUp, Loader2, TrendingUp, DollarSign, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';


const AnalysisOverlay = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 text-white p-4 rounded-lg bg-black/50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="font-bold text-xl">AURA is analyzing...</p>
                <p className="text-sm text-muted-foreground">Identifying patterns & signals</p>
            </div>
        </div>
    )
}

const ResultOverlay = () => {
    return (
        <>
            {/* Dashed Lines for TP/SL for a SELL scenario */}
            <div className="absolute w-full border-t-2 border-dashed border-red-500" style={{ top: '25%' }} />
            <div className="absolute w-full border-t-2 border-dashed border-primary" style={{ top: '40%' }} />
            <div className="absolute w-full border-t-2 border-dashed border-green-400" style={{ top: '75%' }} />

            {/* Labels for lines for a SELL scenario */}
            <Badge variant="secondary" className="absolute border-red-500/50 bg-red-500/10 text-red-300 font-mono" style={{ top: '22%', right: '1rem' }}>
                Stop Loss
            </Badge>
            <Badge variant="secondary" className="absolute border-primary/50 bg-primary/10 text-primary-foreground font-mono" style={{ top: '37%', right: '1rem' }}>
                SELL Entry
            </Badge>
             <Badge variant="secondary" className="absolute border-green-500/50 bg-green-500/10 text-green-300 font-mono" style={{ top: '72%', right: '1rem' }}>
                Take Profit
            </Badge>

            {/* Success Pill */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-green-600/80 px-4 py-2 text-white shadow-lg backdrop-blur-sm">
                <TrendingDown className="h-6 w-6" />
                <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight">Profit Secured</span>
                    <span className="text-lg font-bold leading-tight font-mono">+$1,280.50</span>
                </div>
            </div>
        </>
    )
}


export default function SuccessStory() {
  const chartImage = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">From Analysis to Profit</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                See how AURA's analysis engine accurately predicts market movements, turning complex charts into clear, actionable opportunities.
            </p>
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col gap-4">
                    <Badge variant="secondary" className="w-fit mx-auto text-lg py-1 px-4">Before AURA's Signal</Badge>
                    <Card className="relative overflow-hidden border-2 border-border/50 aspect-video">
                        <Image src={chartImage} alt="Chart before analysis" layout="fill" objectFit="cover" className="w-full" data-ai-hint="stock chart" />
                        <AnalysisOverlay />
                    </Card>
                </div>
                <div className="flex flex-col gap-4">
                     <Badge variant="default" className="w-fit mx-auto text-lg py-1 px-4">After: Market Followed Prediction</Badge>
                    <Card className="relative overflow-hidden border-2 border-primary/50 aspect-video">
                        <Image src={chartImage} alt="Chart after analysis showing profit" layout="fill" objectFit="cover" className="w-full" data-ai-hint="stock chart profit" />
                        <ResultOverlay />
                    </Card>
                </div>
            </div>
        </div>
    </section>
  );
}
