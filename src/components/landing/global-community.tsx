'use client';

import { Button } from '../ui/button';
import Link from 'next/link';

export default function GlobalCommunity() {
  return (
    <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background"></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(#2d3748_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-30">
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto relative z-10 text-center">
        <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
          Join a Network of Global Traders
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          From beginners to seasoned professionals, traders worldwide are leveraging AURA to gain a deeper understanding of the markets.
        </p>
        <div className="mt-10">
            <Button size="lg" className="futuristic-button" asChild>
                <Link href="/pricing">Become a Member</Link>
            </Button>
        </div>

        {/* Floating Avatars */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center opacity-30 animate-float-slow">
            <span className="font-bold text-sm text-slate-400">DE</span>
        </div>
         <div className="absolute -bottom-16 right-24 w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center opacity-30 animate-float">
            <span className="font-bold text-slate-400">FR</span>
        </div>
        <div className="absolute top-24 -right-12 w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center opacity-30 animate-float-delay">
            <span className="font-bold text-sm text-slate-400">MA</span>
        </div>
         <div className="absolute bottom-20 -left-20 w-28 h-28 bg-slate-800 rounded-full flex items-center justify-center opacity-20 animate-float">
        </div>
        <div className="absolute top-1/2 -right-1/4 w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center opacity-10 animate-float-slow">
        </div>
      </div>

       <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
           animation: float 7s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
}