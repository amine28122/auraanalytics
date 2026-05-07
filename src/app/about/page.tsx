'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Users, MapPin, TrendingUp, LineChart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AuraAcademyLogo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Script from 'next/script';

// This is a simplified, public version of the about page.

const teamMembers = [
  {
    name: 'Mr. Nabil Hamdoun',
    role: 'Global Financial Markets Analyst & Trader | Data Analytics Scientist',
    country: 'Morocco',
    avatarUrl: `/NABIL.jpg`,
    avatarFallback: 'NH',
    skills: ['Data Analytics', 'Data Science', 'Trading', 'Market Analysis'],
    icon: BrainCircuit,
    aiHint: 'person tech analyst',
  },
  {
    name: 'Mr. El Amine',
    role: 'Expert Market Analyst | Developer | Data Specialist',
    country: 'France',
    avatarUrl: `/amine.jpeg`,
    avatarFallback: 'EA',
    skills: ['Market Analysis', 'Development', 'Data Engineering', 'Trading Strategy'],
    icon: TrendingUp,
    aiHint: 'person developer',
  },
  {
    name: 'Mr. Josef Mamulashvili',
    role: 'Global Market Analyst | Marketing & Finance Specialist | Strategic Investor',
    country: 'Germany',
    avatarUrl: `/youssef.jpeg`,
    avatarFallback: 'JM',
    skills: ['Global Markets', 'Marketing', 'Finance', 'Investing'],
    icon: LineChart,
    aiHint: 'person trader',
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
  }));

  return (
    <div className="min-h-screen bg-background">
        <Script
            id="team-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
        />
        <header className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-3">
            <AuraAcademyLogo iconOnly className="h-10 w-10" />
            <span className="font-headline text-2xl font-bold">AURA</span>
            </Link>
            <Button asChild>
                <Link href="/auth">Sign In</Link>
            </Button>
        </header>
        <main className="container mx-auto px-4 py-12 md:py-20">
            <div className="flex flex-col gap-16">
            {/* Mission & Vision Section */}
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
                        Empowering Traders Through <span className="text-primary">Data Intelligence</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        AURA Analytics is a premier financial technology firm dedicated to bridging the gap between complex market data and actionable trading insights. Our mission is to democratize institutional-grade analytics for retail traders worldwide.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12">
                    <div className="p-8 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold">Our Mission</h2>
                        <p className="text-muted-foreground">
                            To provide traders with high-fidelity market analysis, predictive modeling, and strategic education, enabling them to navigate the global financial markets with confidence and precision.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <BrainCircuit className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold">Our Vision</h2>
                        <p className="text-muted-foreground">
                            To become the global standard for AI-driven financial analytics, fostering a community of informed, disciplined, and successful investors across all asset classes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="flex w-full flex-col gap-2 items-center text-center">
                <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="font-headline text-3xl font-bold tracking-tighter">
                    Meet Our Expert Team
                </h2>
                </div>
                <p className="text-muted-foreground max-w-2xl">
                Our team consists of veteran market analysts, data scientists, and developers with decades of combined experience in global financial markets.
                </p>
            </div>

            <Dialog>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {teamMembers.map((member) => (
                    <DialogTrigger asChild key={member.name} onClick={() => setSelectedMember(member)}>
                    <Card className="flex cursor-pointer flex-col text-center transition-all hover:scale-105 hover:shadow-primary/20 card-glow">
                        <CardHeader className="items-center">
                        <Avatar className="h-24 w-24 border-2 border-primary/50">
                            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.aiHint} />
                            <AvatarFallback>{member.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="pt-4">{member.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-grow flex-col space-y-4">
                            <p className="text-muted-foreground">{member.role}</p>
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{member.country}</span>
                            </div>
                        </CardContent>
                    </Card>
                    </DialogTrigger>
                ))}
                </div>

                {selectedMember && (
                <DialogContent>
                    <DialogHeader className="items-center text-center">
                    <Avatar className="h-28 w-28 border-4 border-primary/50">
                        <AvatarImage src={selectedMember.avatarUrl} alt={selectedMember.name} data-ai-hint={selectedMember.aiHint} />
                        <AvatarFallback>{selectedMember.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="pt-4 text-3xl">{selectedMember.name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-center">
                        <p className="text-lg text-muted-foreground">{selectedMember.role}</p>
                        <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
                            <MapPin className="h-5 w-5" />
                            <span className="font-medium">{selectedMember.country}</span>
                        </div>
                        <div className="mt-6 space-y-2">
                            <h3 className="font-semibold text-foreground">Skills</h3>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {selectedMember.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                )}
            </Dialog>
            {/* Values Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold">Transparency</h3>
                    <p className="text-sm text-muted-foreground">We believe in clear, honest analysis without hidden agendas or "black box" algorithms.</p>
                </div>
                <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold">Innovation</h3>
                    <p className="text-sm text-muted-foreground">Continuously evolving our tools with the latest AI and market theory advancements.</p>
                </div>
                <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold">Integrity</h3>
                    <p className="text-sm text-muted-foreground">Providing objective data and strategic education to foster responsible trading habits.</p>
                </div>
            </div>
            </div>
        </main>
    </div>
  );
}
