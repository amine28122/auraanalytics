'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Users, MapPin, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const teamMembers = [
  {
    name: 'Mr. Nabil Hamdoun',
    role: 'Global Financial Markets Analyst & Trader | Data Analytics Scientist',
    country: 'Morocco',
    avatarUrl: `/NABIL-sq.jpg`,
    avatarFallback: 'NH',
    skills: ['Data Analytics', 'Data Science', 'Trading', 'Market Analysis'],
    icon: BrainCircuit,
    aiHint: 'person tech analyst',
  },
  {
    name: 'Mr. El Amine',
    role: 'Expert Market Analyst | Developer | Data Specialist',
    country: 'France',
    avatarUrl: `/amine-sq.jpeg`,
    avatarFallback: 'EA',
    skills: ['Market Analysis', 'Development', 'Data Engineering', 'Trading Strategy'],
    icon: TrendingUp,
    aiHint: 'person developer',
  },
  ];

export default function AboutUsPage() {
  const [selectedMember, setSelectedMember] = useState<(typeof teamMembers)[0] | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-bold tracking-tighter">
            About Our Team
          </h1>
        </div>
        <p className="text-muted-foreground">
          Meet the experts behind AURA. Click on a member to learn more.
        </p>
      </div>

      <Dialog>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {teamMembers.map((member) => (
            <DialogTrigger asChild key={member.name} onClick={() => setSelectedMember(member)}>
              <Card className="group flex cursor-pointer flex-col overflow-hidden text-center transition-all hover:scale-[1.02] hover:shadow-primary/20 card-glow">
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <img src={member.avatarUrl} alt={member.name} data-ai-hint={member.aiHint} className="h-full w-full object-cover object-center" />
                </div>
                <CardHeader className="items-center">
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
               <Avatar className="h-36 w-36 border-4 border-primary/50">
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
    </div>
  );
}
