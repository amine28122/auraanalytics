'use client';
import { AuraAcademyLogo } from "@/components/logo";
import Image from "next/image";

type CertificateProps = {
    name: string;
    score: number;
    date: string;
    awardedByText: string;
    completionText: string;
    gradeText: string;
    theme: 'light' | 'dark';
};

export function Certificate({ name, score, date, awardedByText, completionText, gradeText, theme }: CertificateProps) {
    const isMaster = score >= 95;
    
    return (
        <div className="w-[1200px] h-[830px] bg-background flex items-center justify-center p-8 font-body">
            <div className="w-full h-full border-8 border-blue-900/80 rounded-lg p-2 relative">
                 <div className="w-full h-full border-2 border-blue-500/80 rounded-md p-6 flex flex-col items-center relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 border-8 border-primary/20 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-24 -right-16 w-72 h-72 border-4 border-blue-500/20 rounded-full opacity-40"></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                    
                    <div className="z-10 flex flex-col items-center text-center w-full">
                        <div className="w-full flex justify-between items-start">
                            <p className="font-serif text-3xl tracking-widest text-muted-foreground text-left flex-1">Certificate of Achievement</p>
                            <p className="font-serif text-lg text-muted-foreground text-right flex-1">{awardedByText}</p>
                        </div>
                        
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-grow bg-muted-foreground/30 w-32"></div>
                            <AuraAcademyLogo iconOnly className="h-24 w-24 text-primary" />
                            <div className="h-px flex-grow bg-muted-foreground/30 w-32"></div>
                        </div>

                        <p className="text-xl text-muted-foreground">PROUDLY PRESENTED TO</p>
                        <p className="font-serif text-7xl font-bold text-foreground mt-4">
                            {name || "Valued Student"}
                        </p>

                        <p className="text-xl text-muted-foreground mt-8 max-w-3xl leading-relaxed">
                          {completionText}
                        </p>
                        
                        <p className="mt-4 text-3xl font-bold text-primary tracking-wider">{gradeText}</p>
                        
                        <div className="mt-16 flex items-end justify-center gap-32 w-full max-w-5xl mx-auto">
                           <div className="text-center w-1/4 px-4">
                                <p className="font-serif text-lg text-foreground mb-2">Nabil Hamdoun</p>
                                <hr className="border-muted-foreground/50" />
                            </div>
                            <div className="text-center w-1/4 px-4">
                                <p className="font-serif text-lg text-foreground mb-2">El Amine</p>
                                <hr className="border-muted-foreground/50" />
                            </div>
                        </div>

                         <div className="mt-8 text-center w-full">
                            <p className="text-sm text-muted-foreground mt-2">Issued on: {date}</p>
                        </div>
                    </div>
                    <div className="absolute bottom-12 right-12 z-20">
                        <Image 
                            src={theme === 'light' ? "/sin1.png" : "/sin2.png"}
                            alt="AURA Seal" 
                            width={120} 
                            height={120}
                            className="opacity-90"
                        />
                    </div>
                 </div>
            </div>
            <style jsx>{`
                .font-serif {
                    font-family: "Times New Roman", Times, serif;
                }
                 .bg-grid-pattern {
                    background-image:
                        linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                        linear-gradient(to right, hsl(var(--border)) 1px, hsl(var(--background)) 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>
    );
}
