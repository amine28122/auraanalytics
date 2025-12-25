'use client';
import { GenerateTradeSignalsOutput, TradeSignal } from "@/ai/flows/generate-trade-signals";
import { AuraAcademyLogo } from "../logo";
import { Badge } from "../ui/badge";
import { ArrowDown, ArrowUp, CheckCircle, DollarSign, Target, TrendingDown, TrendingUp } from "lucide-react";

type ShareableImageProps = {
    result: {
        data: (GenerateTradeSignalsOutput & { chartImage?: string }) | null;
    },
    theme: 'light' | 'dark';
}

const translations = {
    en: {
        technicalSummary: "Technical Summary",
        confidence: "Confidence",
        support: "Support",
        resistance: "Resistance",
        signals: "Trade Signals",
        buy: "BUY",
        sell: "SELL",
        entry: "Entry",
        takeProfit: "TP",
        stopLoss: "SL",
    },
    ar: {
        technicalSummary: "الملخص الفني",
        confidence: "الثقة",
        support: "الدعم",
        resistance: "المقاومة",
        signals: "إشارات التداول",
        buy: "شراء",
        sell: "بيع",
        entry: "الدخول",
        takeProfit: "جني الأرباح",
        stopLoss: "وقف الخسارة",
    }
}

const SignalCard = ({ signal, t, theme }: { signal: TradeSignal, t: typeof translations.en, theme: 'light' | 'dark' }) => {
    const isBuy = signal.type === 'BUY';
    const isLight = theme === 'light';

    const baseBg = isBuy ? (isLight ? 'bg-green-500' : 'bg-green-600') : (isLight ? 'bg-red-500' : 'bg-red-600');
    const baseText = isBuy ? 'text-green-400' : 'text-red-400';
    const baseBorder = isBuy ? 'border-green-500/50' : 'border-red-500/50';
    const textColor = isLight ? 'text-gray-800' : 'text-white';
    const mutedTextColor = isLight ? 'text-gray-500' : 'text-gray-400';
    const subBg = isLight ? (isBuy ? 'bg-green-100' : 'bg-red-100') : (isBuy ? 'bg-green-500/20' : 'bg-red-500/20');
    const signalTextColor = isLight ? (isBuy ? 'text-green-700' : 'text-red-700') : (isBuy ? 'text-green-300' : 'text-red-300');


    return (
        <div className={`rounded-xl p-4 shadow-lg ${subBg} border ${baseBorder}`}>
            <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${subBg}`}>
                    {isBuy ? <ArrowUp className={`h-6 w-6 ${isLight ? 'text-green-600' : 'text-green-400'}`} /> : <ArrowDown className={`h-6 w-6 ${isLight ? 'text-red-600' : 'text-red-400'}`} />}
                </div>
                <p className={`text-2xl font-bold tracking-wider ${signalTextColor}`}>{isBuy ? t.buy : t.sell} <span className={`text-lg font-normal ${textColor}`}>@ {signal.entryPrice}</span></p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm font-mono">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <div className="flex flex-col">
                        <span className={`text-xs ${mutedTextColor}`}>{t.takeProfit}</span>
                        <span className={textColor}>{signal.takeProfit.join(', ')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
                    <DollarSign className="h-4 w-4" />
                     <div className="flex flex-col">
                        <span className={`text-xs ${mutedTextColor}`}>{t.stopLoss}</span>
                        <span className={textColor}>{signal.stopLoss}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ShareableImage({ result, theme }: ShareableImageProps) {
    if (!result.data) return null;

    const { signals, supportLevels, resistanceLevels, confidenceLevel, analysisSummary, chartImage } = result.data;
    const lang = analysisSummary.match(/[\u0600-\u06FF]/) ? 'ar' : 'en';
    const t = translations[lang];
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const confidence = Math.round(confidenceLevel * 100);

    const isLight = theme === 'light';
    const containerClasses = isLight 
        ? 'bg-white text-gray-900' 
        : 'bg-background text-white';
    const cardBgClass = isLight ? 'bg-gray-50/50' : 'bg-card';
    const cardBorderClass = isLight ? 'border-gray-200' : 'border-card';
    const mutedTextClass = isLight ? 'text-gray-500' : 'text-gray-400';
    const headingTextClass = isLight ? 'text-gray-800' : 'text-gray-200';
    const footerTextClass = isLight ? 'text-gray-400' : 'text-gray-500';

    return (
        <div className={theme} style={{ width: 1080, height: 1080 }}>
            <div className={`flex h-full w-full flex-col p-12 font-body ${containerClasses}`} dir={dir}>
                
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <AuraAcademyLogo iconOnly className="h-20 w-20" />
                        <span className="font-headline text-4xl font-bold tracking-wider">AURA</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className={`text-lg font-medium ${mutedTextClass}`}>{t.confidence}</p>
                        <p className="text-5xl font-bold text-primary">{confidence}%</p>
                    </div>
                </header>

                <main className="mt-8 grid flex-grow grid-cols-5 gap-8">
                    {/* Left Column */}
                    <div className="col-span-3 flex flex-col gap-6">
                        {chartImage && (
                            <div className={`relative aspect-video w-full overflow-hidden rounded-2xl border-2 ${cardBorderClass} shadow-2xl`}>
                                 <img src={chartImage} alt="Chart" className="h-full w-full object-cover" />
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            <h3 className={`flex items-center gap-3 text-2xl font-headline`}>
                                <Target className="h-6 w-6 text-primary" />
                                {t.signals}
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {signals.slice(0, 2).map((signal, i) => <SignalCard key={i} signal={signal} t={t} theme={theme} />)}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className={`col-span-2 flex flex-col gap-8 rounded-2xl p-6 border ${cardBgClass} ${cardBorderClass}`}>
                        <div className="space-y-2">
                            <h3 className={`text-2xl font-headline`}>{t.technicalSummary}</h3>
                            <p className={`text-base leading-relaxed line-clamp-[11] ${mutedTextClass}`}>{analysisSummary}</p>
                        </div>
                         
                        <div className="space-y-4">
                             <h3 className={`flex items-center gap-3 font-semibold text-lg ${headingTextClass}`}>
                                <TrendingDown className="h-5 w-5 text-green-400" />
                                {t.support}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {supportLevels.map((level, i) => <Badge key={i} className="border-green-500/50 bg-green-500/10 text-green-300 font-mono text-base px-3 py-1">{level}</Badge>)}
                            </div>
                        </div>
                        <div className="space-y-4">
                             <h3 className={`flex items-center gap-3 font-semibold text-lg ${headingTextClass}`}>
                                <TrendingUp className="h-5 w-5 text-red-400" />
                                {t.resistance}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {resistanceLevels.map((level, i) => <Badge key={i} className="border-red-500/50 bg-red-500/10 text-red-300 font-mono text-base px-3 py-1">{level}</Badge>)}
                            </div>
                        </div>
                    </div>
                </main>

                <footer className={`mt-8 text-center text-sm ${footerTextClass}`}>
                    <p>Generated by AURA. Not financial advice. Trade responsibly.</p>
                </footer>
            </div>
        </div>
    );
}
