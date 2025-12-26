'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { CheckCircle } from 'lucide-react';

const features = [
  {
    icon: CheckCircle,
    title: "Advanced Analysis",
    description: "Let our proprietary engine do the heavy lifting, turning complex data into clear insights.",
  },
  {
    icon: CheckCircle,
    title: "Actionable Trade Signals",
    description: "Receive clear, structured signals with defined entry, take-profit, and stop-loss levels.",
  },
  {
    icon: CheckCircle,
    title: "Multi-Timeframe Perspective",
    description: "Understand the bigger picture with strategic analysis and find precise entries on smaller timeframes.",
  }
];

const appScreenshots = [
  { src: "/1 (2).png", alt: "App Screenshot 1", hint: "app analytics" },
  { src: "/2 (2).png", alt: "App Screenshot 2", hint: "app dashboard" },
  { src: "/3 (2).png", alt: "App Screenshot 3", hint: "app trading" },
  { src: "/4 (2).png", alt: "App Screenshot 4", hint: "app chart" },
  { src: "/5 (2).png_instrument", alt: "App Screenshot 5", hint: "app signals" },
  { src: "/6.png", alt: "App Screenshot 6", hint: "app portfolio" },
  { src: "/7.png", alt: "App Screenshot 7", hint: "app profile" },
];

export default function AppShowcase() {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <section className="py-16 sm:py-20 px-4">
         <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full max-w-sm mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 rounded-[3rem] blur-2xl opacity-40"></div>
                <Carousel
                    plugins={[plugin.current]}
                    className="relative w-full"
                    onMouseEnter={() => plugin.current.stop()}
                    onMouseLeave={() => plugin.current.reset()}
                >
                    <CarouselContent className="-ml-2">
                        {appScreenshots.map((screen, index) => (
                            <CarouselItem key={index} className="pl-2">
                                <Card className="overflow-hidden border-4 border-white/10 shadow-2xl shadow-primary/20 bg-black rounded-[2.5rem] aspect-[9/18.5]">
                                     <Image
                                        src={screen.src}
                                        alt={screen.alt}
                                        width={400}
                                        height={800}
                                        className="h-full w-full object-cover"
                                        data-ai-hint={screen.hint}
                                    />
                                </Card>
                            </CarouselItem>
                        ))}
    
                    </CarouselContent>
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
                        <CarouselPrevious className="static translate-y-0 text-white bg-white/5 hover:bg-white/10 border-white/20"/>
                        <CarouselNext className="static translate-y-0 text-white bg-white/5 hover:bg-white/10 border-white/20"/>
                    </div>
                </Carousel>
            </div>
            <div className="flex flex-col gap-8 text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold">Gain Your Analytical Edge</h2>
                 <p className="text-neutral-300 text-lg">Transform your trading with institutional-grade analysis, AI-powered signals, and a user-centric design that puts powerful insights at your fingertips.</p>
                 <div className="grid sm:grid-cols-3 gap-6">
                    {features.map((feature) => (
                       <div key={feature.title} className="flex flex-col items-center gap-3 text-center">
                           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                               <feature.icon className="h-6 w-6"/>
                           </div>
                           <div className="text-center">
                               <h4 className="font-semibold text-lg">{feature.title}</h4>
                               <p className="text-muted-foreground text-sm">{feature.description}</p>
                           </div>
                       </div>
                    ))}
                 </div>
            </div>
         </div>
    </section>
  );
}
