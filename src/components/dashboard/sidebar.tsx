'use client';

import Link from 'next/link';
import { AuraAcademyLogo } from '../logo';
import { SidebarNav } from './sidebar-nav';
import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Zap, Crown, Gem, User as UserIcon, LogOut, CalendarDays, Activity } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '../ui/dropdown-menu';
import { getAuth, signOut } from 'firebase/auth';
import { formatDistanceToNow } from 'date-fns';

type UserProfile = {
  plan?: 'Free' | 'Premium' | 'Aura Plan';
  language?: 'en' | 'ar' | 'es';
  planEndDate?: Timestamp;
  analysisCount?: number;
  lastAnalysisDate?: Timestamp;
};

const PLAN_LIMITS = {
  Free: 1,
  Premium: 5,
  'Aura Plan': Infinity,
};

export function Sidebar() {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const auth = getAuth();


  const lang = userProfile?.language || searchParams.get('lang') || 'en';

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
  
  const handleSignOut = () => {
    signOut(auth).then(() => {
      window.location.href = '/auth';
    });
  };
  
    const getUsageInfo = (profile: UserProfile | null) => {
      if (!profile) return { used: 0, limit: 1, isNewDay: true };

      const plan = profile.plan || 'Free';
      const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
      let used = profile.analysisCount || 0;
      
      const lastDate = profile.lastAnalysisDate?.toDate();
      const now = new Date();

      const isNewDay = !lastDate || 
        lastDate.getUTCFullYear() !== now.getUTCFullYear() ||
        lastDate.getUTCMonth() !== now.getUTCMonth() ||
        lastDate.getUTCDate() !== now.getUTCDate();
      
      if (isNewDay) {
        used = 0;
      }
      
      return { used, limit, isNewDay };
  }

  const getPlanBadge = (plan: UserProfile['plan']) => {
    switch (plan) {
      case 'Premium':
        return <Badge variant="default"><Crown className="mr-1 h-3 w-3" />Premium</Badge>;
      case 'Aura Plan':
        return (
          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
            <Gem className="mr-1 h-3 w-3" />
            Aura Plan
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <UserIcon className="mr-1 h-3 w-3" />
            Free Plan
          </Badge>
        );
    }
  };

  const getPremiumStatus = (profile: UserProfile | null) => {
    if (!profile || profile.plan !== 'Premium' || !profile.planEndDate) return null;

    const endDate = profile.planEndDate.toDate();
    const now = new Date();

    if (endDate < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1.5">
        <CalendarDays className="h-3 w-3" />
        {formatDistanceToNow(endDate, { addSuffix: true })}
      </Badge>
    );
  }

  const PlanIcon = ({ plan }: { plan: UserProfile['plan'] }) => {
    if (plan === 'Premium') return <Crown className="text-primary" />;
    if (plan === 'Aura Plan') return <Gem className="text-amber-400" />;
    return <Zap className="text-primary" />;
  };
  
  const PlanBadge = ({ plan }: { plan: UserProfile['plan'] }) => {
      if (plan === 'Premium') return <Badge variant="default" className="border-primary bg-primary/10 text-primary">Premium</Badge>;
      if (plan === 'Aura Plan') return <Badge variant="default" className="border-amber-400 bg-amber-400/10 text-amber-400">Aura Plan</Badge>;
      return null;
  }
  
  const usageInfo = getUsageInfo(userProfile);


  return (
    <div className="hidden h-screen w-72 flex-col bg-sidebar md:flex sticky top-0">
        <div className="flex h-20 items-center border-b border-sidebar-border px-6">
            <Link href={`/dashboard?lang=${lang}`} className="flex items-center gap-3">
            <AuraAcademyLogo iconOnly className="h-10 w-10" />
            <span className="font-headline text-xl font-bold text-sidebar-foreground">
                AURA
            </span>
            </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
            <SidebarNav lang={lang as 'en' | 'ar' | 'es'} className="px-4 py-2" />
        </div>
        <div className="p-4 mt-auto border-t border-sidebar-border/50">
            {userProfile?.plan === 'Free' ? (
                <Card className="bg-sidebar-accent/50 border-sidebar-border">
                    <CardHeader className="p-4 text-center">
                        <CardTitle className="flex items-center justify-center gap-2 text-base text-sidebar-foreground">
                            <Zap className="text-primary"/>
                            Upgrade to Premium
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            Unlock more features and get priority support.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <Button size="sm" className="w-full" asChild>
                        <Link href={`/dashboard/pricing?lang=${lang}`}>Upgrade</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                 <Card className="bg-sidebar-accent/50 border-sidebar-border">
                    <CardHeader className="p-4 text-center">
                         <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sidebar-accent">
                            <PlanIcon plan={userProfile?.plan} />
                         </div>
                        <CardTitle className="flex items-center justify-center gap-2 text-base text-sidebar-foreground">
                           Your Plan: <PlanBadge plan={userProfile?.plan} />
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            {userProfile?.plan !== 'Aura Plan' ? `Today's Usage: ${usageInfo.used} / ${usageInfo.limit}` : 'Unlimited analyses.'}
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-3 mt-4 text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-sidebar-ring">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>
                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <p className="text-sm font-medium leading-none">
                            {user?.displayName}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                            </p>
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 mb-2" side="top" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex justify-between">
                    <span>Plan</span>
                    {getPlanBadge(userProfile?.plan)}
                    </DropdownMenuItem>
                     {userProfile?.plan !== 'Aura Plan' && (
                        <DropdownMenuItem className="flex justify-between">
                            <span className="flex items-center gap-1.5"><Activity className="h-4 w-4"/> Usage</span>
                            <span>{usageInfo.used} / {usageInfo.limit}</span>
                        </DropdownMenuItem>
                    )}
                    {userProfile?.plan === 'Premium' && (
                    <DropdownMenuItem className="flex justify-between">
                        <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> Expires</span>
                        {getPremiumStatus(userProfile)}
                    </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  );
}
