'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Users, MapPin, TrendingUp, Target, ShieldCheck, History } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AuraAcademyLogo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Script from 'next/script';

const teamMembers = [
  {
    name: 'Ms. Hajar',
    role: 'Founder & CEO | Lead Market Strategist',
    bio: 'With over 8 years of experience in financial markets and data science, Hajar founded AURA to bridge the gap between complex institutional data and retail trading. Her expertise in predictive modeling and algorithmic strategy has helped thousands of traders navigate volatile markets. She believes that every trader deserves access to the same high-fidelity analysis used by major banks.',
    country: 'Morocco',
    avatarUrl: `/hajar.png`,
    avatarFallback: 'H',
    skills: ['Market Analysis', 'Strategic Planning', 'Data Science', 'Financial Research'],
    icon: Users,
    aiHint: 'person female analyst',
  },
  {
    name: 'Mr. Nabil Hamdoun',
    role: 'Chief Data Scientist | Quant Trader',
    bio: 'Nabil is a veteran trader and deep learning specialist with a focus on quantitative finance. He leads the development of AURA\'s proprietary algorithms, integrating Elliott Wave Theory with machine learning to identify high-probability market turns. His background in engineering allows him to build robust, scalable trading systems that adapt to changing market dynamics.',
    country: 'Morocco',
    avatarUrl: `/NABIL.jpg`,
    avatarFallback: 'NH',
    skills: ['Quant Trading', 'Deep Learning', 'Market Dynamics', 'Predictive Modeling'],
    icon: BrainCircuit,
    aiHint: 'person tech analyst',
  },
  {
    name: 'Mr. El Amine',
    role: 'CTO | Lead Fintech Infrastructure',
    bio: 'Amine is a full-stack developer and blockchain enthusiast with a passion for building seamless user experiences. He oversees AURA\'s technological infrastructure, ensuring real-time data delivery and a secure environment for our users. His mission is to make advanced financial tools intuitive and accessible to everyone, regardless of their technical background.',
    country: 'France',
    avatarUrl: `/amine.jpeg`,
    avatarFallback: 'EA',
    skills: ['Blockchain', 'Cloud Architecture', 'Real-time Systems', 'UX/UI Design'],
    icon: TrendingUp,
    aiHint: 'person developer',
  },
];

export default function PublicAboutUsPage() {
  const [selectedMember, setSelectedMember] = useState<(typeof teamMembers)[0] | null>(null);

  const teamSchema = teamMembers.map(member => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": member.name,
    "jobTitle": member.role,
    "nationality": member.country,
    "knowsAbout": member.skills,
    "image": member.avatarUrl,
    "description": member.bio
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
        <Script
            id="team-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
        />
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b">
            <Link href="/" className="flex items-center gap-3">
            <AuraAcademyLogo iconOnly className="h-10 w-10" />
            <span className="font-headline text-2xl font-bold tracking-tighter">AURA ANALYTICS</span>
            </Link>
            <div className="flex gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/blog">Market Analysis</Link>
                </Button>
                <Button asChild>
                    <Link href="/auth">Sign In</Link>
                </Button>
            </div>
        </header>

        <main className="container mx-auto px-4 pt-32 pb-20 max-w-6xl">
            {/* Hero / Vision Section */}
            <div className="text-center space-y-8 mb-20">
                <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20">About AURA Analytics</Badge>
                <h1 className="font-headline text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
                    Democratizing Institutional <br /> <span className="text-primary">Market Intelligence</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    We started AURA with a single goal: to empower retail traders with the same precision, data, and strategies that institutional powerhouses use daily.
                </p>
            </div>

            {/* Our Story Section - CRITICAL FOR EZOIC */}
            <section className="mb-32 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                        <History className="h-6 w-6" />
                        <h2 className="text-3xl font-bold">Our Story & Motivation</h2>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        In 2022, after years of navigating the chaotic world of retail trading, our founders noticed a recurring pattern: retail traders were consistently losing because they lacked the sophisticated tools and clear, unbiased analysis available to professional funds.
                    </p>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        We saw a market flooded with "get-rich-quick" schemes and "black box" indicators that left traders confused and frustrated. We decided to change that. AURA Analytics was born from the desire to provide a transparent, educational, and data-driven ecosystem where traders can actually learn the 'why' behind market movements.
                    </p>
                </div>
                <div className="bg-muted/30 rounded-3xl p-8 border border-border/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <AuraAcademyLogo className="h-40 w-40" />
                    </div>
                    <div className="space-y-8 relative z-10">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                <Target className="h-5 w-5 text-primary" /> Our Objective
                            </h3>
                            <p className="text-muted-foreground">To become the world's most trusted partner for independent traders seeking clarity in financial markets.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                <ShieldCheck className="h-5 w-5 text-primary" /> Our Promise
                            </h3>
                            <p className="text-muted-foreground">Complete transparency. No hidden agendas. Just high-fidelity data and expert-led education.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <div className="mb-20 text-center space-y-4">
                <h2 className="font-headline text-4xl font-bold">The Minds Behind AURA</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Meet the team of veteran market analysts, data scientists, and developers dedicated to your success.
                </p>
            </div>

            <Dialog>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-32">
                {teamMembers.map((member) => (
                    <DialogTrigger asChild key={member.name} onClick={() => setSelectedMember(member)}>
                    <Card className="flex cursor-pointer flex-col transition-all hover:scale-105 hover:shadow-primary/20 card-glow border-border/50 bg-card/50">
                        <CardHeader className="items-center text-center">
                        <Avatar className="h-32 w-32 border-4 border-primary/20 ring-4 ring-primary/5">
                            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.aiHint} />
                            <AvatarFallback>{member.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="pt-6 text-2xl font-bold">{member.name}</CardTitle>
                        <p className="text-primary font-medium text-sm mt-1">{member.role}</p>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-6">{member.bio}</p>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>Based in {member.country}</span>
                            </div>
                        </CardContent>
                    </Card>
                    </DialogTrigger>
                ))}
                </div>

                {selectedMember && (
                <DialogContent className="max-w-2xl">
                    <DialogHeader className="items-center text-center">
                    <Avatar className="h-32 w-32 border-4 border-primary/20 ring-4 ring-primary/5">
                        <AvatarImage src={selectedMember.avatarUrl} alt={selectedMember.name} data-ai-hint={selectedMember.aiHint} />
                        <AvatarFallback>{selectedMember.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="pt-4 text-3xl font-bold">{selectedMember.name}</DialogTitle>
                    <p className="text-primary font-semibold">{selectedMember.role}</p>
                    </DialogHeader>
                    <div className="py-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-2">Professional Background</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {selectedMember.bio}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-2">Core Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedMember.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="px-3 py-1">{skill}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                )}
            </Dialog>

            {/* Core Values Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-t border-border/50">
                <div className="space-y-4 text-center md:text-left">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto md:mx-0">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Unwavering Integrity</h3>
                    <p className="text-muted-foreground">We provide objective, data-backed analysis. Our loyalty is to the truth of the chart, not to any broker or external interest.</p>
                </div>
                <div className="space-y-4 text-center md:text-left">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto md:mx-0">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Continuous Innovation</h3>
                    <p className="text-muted-foreground">The markets evolve, and so do we. We are constantly refining our AI models and strategies to stay ahead of market shifts.</p>
                </div>
                <div className="space-y-4 text-center md:text-left">
                    <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mx-auto md:mx-0">
                        <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Trader-First Community</h3>
                    <p className="text-muted-foreground">AURA is more than a tool; it's a movement. We are dedicated to building a community of educated, disciplined investors.</p>
                </div>
            </div>
        </main>
        <footer className="border-t py-12 bg-muted/20">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
                <p>© {new Date().getFullYear()} AURA Analytics. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-4">
                    <Link href="/privacy-policy" className="hover:text-primary transition-colors text-sm">Privacy Policy</Link>
                    <Link href="/terms-of-service" className="hover:text-primary transition-colors text-sm">Terms of Service</Link>
                </div>
            </div>
        </footer>
    </div>
  );
}

