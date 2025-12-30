'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, query, doc, updateDoc, Timestamp, writeBatch, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Loader2, Edit, CalendarDays, RefreshCw, AlertCircle, Check, Paperclip,
  ExternalLink, Mail, KeySquare, Users, Crown, Gem, DollarSign,
  BarChart2, Search, Wallet, Activity, TrendingUp
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogDescription as DialogDescriptionComponent,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { approveActivationRequest, approveWithdrawRequest, updateUserPlan, adjustUserBalance } from '@/lib/actions';
import Image from 'next/image';

type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  plan: 'Free' | 'Premium' | 'Aura Plan';
  joined: Timestamp | null;
  language: string;
  planStartDate?: Timestamp;
  planEndDate?: Timestamp;
  analysisCount?: number;
  lastAnalysisDate?: Timestamp;
  referralCode?: string;
  totalReferrals?: number;
  activeReferrals?: number;
  totalEarnings?: number;
  pendingEarnings?: number;
  referredBy?: string;
  affiliateCommissionPaid?: boolean;
  simulatorBalance?: number;
}

const PLAN_LIMITS = {
  Free: 1,
  Premium: 5,
  'Aura Plan': Infinity,
};

type ActivationRequest = {
  id: string;
  userId: string;
  email: string;
  transactionId: string;
  screenshotDataUrl: string; // Changed from screenshotUrl
  status: 'pending' | 'approved';
  planName?: string;
  createdAt: Timestamp;
}

type WithdrawRequest = {
  id: string;
  userId: string;
  email: string;
  amount: number;
  walletAddress: string;
  status: 'pending' | 'approved';
  createdAt: Timestamp;
}

function ActivationRequests() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ActivationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore) return;
    const q = query(collection(firestore, 'activationRequests'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivationRequest));
      setRequests(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [firestore]);

  const handleApprove = async (request: ActivationRequest) => {
    setApprovingId(request.id);
    const result = await approveActivationRequest(request.id, request.userId);
    if (result.success) {
      toast({
        title: 'Plan Activated',
        description: `${request.email}'s plan has been upgraded to ${request.planName || 'Premium'}.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Activation Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
    setApprovingId(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8"><Loader2 className="mr-2 h-6 w-6 animate-spin" /><span>Loading Activation Requests...</span></div>;
  }

  if (requests.length === 0) {
    return null; // Don't render the card if there are no pending requests
  }

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle>Plan Activation Requests</CardTitle>
        <CardDescription>Review and approve pending premium plan activations. Found {requests.length} pending requests.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Requested Plan</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map(req => (
              <TableRow key={req.id}>
                <TableCell><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{req.email}</div></TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "font-bold",
                    req.planName === 'Aura Plan' ? "border-amber-500 text-amber-500 bg-amber-500/5" : "border-primary text-primary bg-primary/5"
                  )}>
                    {req.planName || 'Premium'}
                  </Badge>
                </TableCell>
                <TableCell><div className="flex items-center gap-2 font-mono"><KeySquare className="h-4 w-4 text-muted-foreground" />{req.transactionId}</div></TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" /> View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Payment Screenshot</DialogTitle>
                        <DialogDescriptionComponent>
                          For user: {req.email}
                        </DialogDescriptionComponent>
                      </DialogHeader>
                      <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-md border">
                        <Image src={req.screenshotDataUrl} alt="Payment Screenshot" width={800} height={450} style={{ objectFit: 'contain' }} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>{req.createdAt.toDate ? formatDistanceToNow(req.createdAt.toDate(), { addSuffix: true }) : 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(req)}
                    disabled={approvingId === req.id}
                  >
                    {approvingId === req.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function WithdrawalRequests({ users }: { users: UserProfile[] }) {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore) return;
    const q = query(collection(firestore, 'withdrawRequests'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawRequest));
      setRequests(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [firestore]);

  const handleApproveWithdrawal = async (request: WithdrawRequest) => {
    setApprovingId(request.id);
    const result = await approveWithdrawRequest(request.id, request.userId, request.amount);

    if (result.success) {
      toast({
        title: 'Payout Approved',
        description: `Successfully processed $${request.amount} withdrawal for ${request.email}.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Approval Failed',
        description: result.error || 'Check user balance or network.',
      });
    }
    setApprovingId(null);
  };

  const getUserBalance = (userId: string) => {
    const user = users.find(u => u.uid === userId);
    return user?.pendingEarnings || 0;
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8"><Loader2 className="mr-2 h-6 w-6 animate-spin" /><span>Loading Withdrawal Requests...</span></div>;
  }

  return (
    <Card className="card-glow border-amber-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-amber-500" />
          Withdrawal Requests
        </CardTitle>
        <CardDescription>Found {requests.length} pending payouts. Verify payments before approving.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User / Wallet</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map(req => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{req.email}</span>
                      <span className="text-[10px] font-mono text-muted-foreground break-all max-w-[200px]">{req.walletAddress}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-muted-foreground">${getUserBalance(req.userId).toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-amber-500 text-lg">${req.amount.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 uppercase text-[10px]">
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                      onClick={() => handleApproveWithdrawal(req)}
                      disabled={approvingId === req.id || getUserBalance(req.userId) < req.amount}
                    >
                      {approvingId === req.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      Approve & Deduct
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm italic">
                  No pending withdrawal requests.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


function AdminDashboard() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newPlan, setNewPlan] = useState<'Free' | 'Premium' | 'Aura Plan'>('Free');
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Balance Adjustment State
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('0');
  const [adjustingBalance, setAdjustingBalance] = useState(false);

  // Network Detail State
  const [isNetworkDialogOpen, setIsNetworkDialogOpen] = useState(false);
  const [referringUser, setReferringUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      setError("Firestore is not available.");
      return;
    }

    setLoading(true);
    const usersQuery = query(collection(firestore, "users"));

    const unsubscribe = onSnapshot(usersQuery,
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ ...doc.data() as Omit<UserProfile, 'uid'>, uid: doc.id }));
        setUsers(usersData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore snapshot error:", err);
        setError(`Failed to fetch users. You might not have the correct permissions in your Firestore rules. Error: ${err.message}`);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [firestore]);


  const stats = useMemo(() => {
    const totalUsers = users.length;
    const premiumUsers = users.filter(u => u.plan === 'Premium').length;
    const freeUsers = users.filter(u => u.plan === 'Free').length;
    const auraPlanUsers = users.filter(u => u.plan === 'Aura Plan').length;

    const totalRevenue = (premiumUsers * 50) + (auraPlanUsers * 100);
    const totalAffiliateEarnings = users.reduce((acc, u) => acc + (u.totalEarnings || 0), 0);

    return { totalUsers, premiumUsers, freeUsers, auraPlanUsers, totalRevenue, totalAffiliateEarnings };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const filteredAffiliates = useMemo(() => {
    return filteredUsers;
  }, [filteredUsers]);


  const handleOpenDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setNewPlan(user.plan);
    setIsDialogOpen(true);
  }

  const handleUpdatePlan = async () => {
    if (!firestore || !selectedUser) return;
    setUpdatingPlan(true);

    try {
      const result = await updateUserPlan(selectedUser.uid, newPlan);

      if (result.success) {
        toast({
          title: "Plan Updated",
          description: `${selectedUser.displayName}'s plan has been updated to ${newPlan}. Affiliate rewards processed if applicable.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: `Could not update plan. Error: ${error.message}`,
      });
    } finally {
      setUpdatingPlan(false);
      setIsDialogOpen(false);
    }
  }

  const handleAdjustBalance = async () => {
    if (!selectedUser || !balanceAmount) return;
    setAdjustingBalance(true);

    try {
      const amount = parseFloat(balanceAmount);
      if (isNaN(amount)) throw new Error("Invalid amount");

      const result = await adjustUserBalance(selectedUser.uid, amount);
      if (result.success) {
        toast({
          title: "Balance Adjusted",
          description: `Successfully ${amount >= 0 ? 'added' : 'deducted'} $${Math.abs(amount).toFixed(2)} to ${selectedUser.displayName}'s balance.`,
        });
        setIsBalanceDialogOpen(false);
        setBalanceAmount('0');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Adjustment Failed",
        description: error.message,
      });
    } finally {
      setAdjustingBalance(false);
    }
  };

  const handleResetAllUsers = async () => {
    if (!firestore || users.length === 0) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "No users to reset or Firestore is unavailable.",
      });
      return;
    }

    setIsResetting(true);

    const batch = writeBatch(firestore);
    users.forEach(user => {
      const userDocRef = doc(firestore, "users", user.uid);
      batch.update(userDocRef, {
        analysisCount: 0,
        lastAnalysisDate: null
      });
    });

    try {
      await batch.commit();
      toast({
        title: "All Users Reset",
        description: `Successfully reset analysis counts for all ${users.length} users.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: `Could not reset user data. Error: ${error.message}`,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetEarnings = async (userId: string) => {
    if (!firestore) return;

    try {
      const userDocRef = doc(firestore, "users", userId);
      await updateDoc(userDocRef, {
        pendingEarnings: 0
      });
      toast({
        title: "Balance Reset",
        description: "User earnings have been reset to zero after payout.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: error.message,
      });
    }
  };

  const handleGenerateMissingCodes = async () => {
    if (!firestore || users.length === 0) return;
    setIsResetting(true); // Using same loading state for simplicity or add new one

    const batch = writeBatch(firestore);
    let count = 0;

    users.forEach(user => {
      if (!user.referralCode) {
        const userDocRef = doc(firestore, "users", user.uid);
        batch.update(userDocRef, {
          referralCode: user.uid.substring(0, 8).toUpperCase(),
          totalReferrals: user.totalReferrals || 0,
          activeReferrals: user.activeReferrals || 0,
          totalEarnings: user.totalEarnings || 0,
          pendingEarnings: user.pendingEarnings || 0,
        });
        count++;
      }
    });

    try {
      if (count > 0) {
        await batch.commit();
        toast({
          title: "Referral Codes Generated",
          description: `Successfully assigned unique codes to ${count} users.`,
        });
      } else {
        toast({
          title: "No Missing Codes",
          description: "All users already have referral codes.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: error.message,
      });
    } finally {
      setIsResetting(false);
    }
  };


  const getPlanBadge = (plan: UserProfile['plan']) => {
    const planClasses = {
      Free: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      Premium: 'bg-primary text-primary-foreground hover:bg-primary/90',
      'Aura Plan': 'bg-amber-500 text-white hover:bg-amber-600',
    };
    return <Badge className={cn(planClasses[plan] || planClasses.Free)}>{plan}</Badge>
  }

  const getPremiumStatus = (user: UserProfile) => {
    if (user.plan !== 'Premium' || !user.planEndDate) return null;

    const endDate = user.planEndDate.toDate();
    const remainingDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    if (remainingDays < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1.5">
        <CalendarDays className="h-3 w-3" />
        {remainingDays} {remainingDays === 1 ? 'day left' : 'days left'}
      </Badge>
    );
  }

  const getUsageInfo = (user: UserProfile) => {
    if (user.plan === 'Aura Plan') {
      return <Badge variant="outline">Unlimited</Badge>;
    }

    const lastDate = user.lastAnalysisDate?.toDate();
    const now = new Date();

    const isNewDay = !lastDate ||
      lastDate.getUTCFullYear() !== now.getUTCFullYear() ||
      lastDate.getUTCMonth() !== now.getUTCMonth() ||
      lastDate.getUTCDate() !== now.getUTCDate();

    const used = isNewDay ? 0 : (user.analysisCount || 0);
    const limit = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS];

    return (
      <div className="flex items-center gap-2">
        <BarChart2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono">{used} / {limit}</span>
      </div>
    );
  };

  const getReferrerInfo = (referredById?: string) => {
    if (!referredById) return <span className="text-muted-foreground opacity-30 italic text-[10px]">Direct</span>;
    const referrer = users.find(u => u.uid === referredById);
    if (!referrer) return <span className="text-amber-500 text-[10px] font-mono">{referredById.substring(0, 5)}...</span>;
    return (
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-foreground/80">{referrer.displayName}</span>
        <span className="text-[9px] text-muted-foreground leading-none">{referrer.email}</span>
      </div>
    );
  };


  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading Admin Panel...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-8">
        <Card className="w-full max-w-md card-glow">
          <CardHeader>
            <CardTitle className="text-destructive">Permission Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <p className="mt-4 text-xs text-muted-foreground">Please check your Firestore security rules to ensure you have permissions to list documents in the 'users' collection.</p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex w-full flex-col gap-2">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="font-headline text-3xl font-bold tracking-tighter">
              Admin Panel
            </h1>
            <div className="flex gap-2 flex-wrap">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isResetting}>
                    {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Reset All Users' Usage
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset the analysis count and usage timer for ALL users. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetAllUsers}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" onClick={handleGenerateMissingCodes} disabled={isResetting}>
                {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeySquare className="mr-2 h-4 w-4" />}
                Generate Missing Referral Codes
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Manage your application users and view statistics from Firestore.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From {stats.premiumUsers} premium users</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.premiumUsers}</div>
              <p className="text-xs text-muted-foreground">Currently active premium plans</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.freeUsers}</div>
              <p className="text-xs text-muted-foreground">Users on the free tier</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aura Plan Users</CardTitle>
              <Gem className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.auraPlanUsers}</div>
              <p className="text-xs text-muted-foreground">Institutional &amp; pro users</p>
            </CardContent>
          </Card>
          <Card className="card-glow border-amber-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Affiliate Payouts</CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">${stats.totalAffiliateEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total commissions earned by users</p>
            </CardContent>
          </Card>
        </div>


        <Tabs defaultValue="users" className="w-full">
          <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
            <TabsList className="bg-background/50 border">
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="affiliates" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Affiliates
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2 relative">
                <RefreshCw className="h-4 w-4" />
                Plan Requests
              </TabsTrigger>
              <TabsTrigger value="withdrawals" className="gap-2 relative">
                <Wallet className="h-4 w-4" />
                Withdrawals
              </TabsTrigger>
              <TabsTrigger value="simulator" className="gap-2">
                <Activity className="h-4 w-4" />
                Simulator
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                className="pl-9 bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="users" className="space-y-6">
            <Card className="card-glow border-primary/10 shadow-xl">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Found {filteredUsers.length} users matching your criteria.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Premium Status</TableHead>
                      <TableHead>Referred By</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.uid} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{user.displayName}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getPlanBadge(user.plan)}</TableCell>
                          <TableCell>{getUsageInfo(user)}</TableCell>
                          <TableCell>{getPremiumStatus(user)}</TableCell>
                          <TableCell>{getReferrerInfo(user.referredBy)}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {user.joined && user.joined.toDate ? formatDistanceToNow(user.joined.toDate(), { addSuffix: true }) : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No users found matching "{searchQuery}"
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-6">
            <Card className="card-glow border-amber-500/10 shadow-xl">
              <CardHeader>
                <CardTitle>Affiliate Management</CardTitle>
                <CardDescription>Track partner performance and payouts.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead>Active / Inactive</TableHead>
                      <TableHead>Earnings & Payouts</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAffiliates.length > 0 ? (
                      filteredAffiliates.map((user) => (
                        <TableRow key={user.uid + "-aff"} className="hover:bg-amber-500/5 transition-colors">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.displayName}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "font-mono bg-background",
                              !user.referralCode && "text-muted-foreground opacity-50 border-dashed"
                            )}>
                              {user.referralCode || user.uid.substring(0, 8).toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              className="h-auto p-1 flex items-center gap-2 hover:bg-primary/10 transition-colors rounded-lg group"
                              onClick={() => {
                                setReferringUser(user);
                                setIsNetworkDialogOpen(true);
                              }}
                            >
                              <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span className="font-bold underline decoration-dotted underline-offset-4 group-hover:text-primary transition-colors">{user.totalReferrals || 0}</span>
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                                <Check className="h-3 w-3" /> Paid: {user.activeReferrals || 0}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <AlertCircle className="h-3 w-3" /> Free: {(user.totalReferrals || 0) - (user.activeReferrals || 0)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 font-black text-emerald-500 text-lg">
                                <DollarSign className="h-4 w-4" />
                                ${(user.pendingEarnings || 0).toFixed(2)}
                                <span className="text-[10px] text-muted-foreground font-normal">Balance</span>
                              </div>
                              <div className="flex flex-col gap-0.5 mt-1">
                                <span className="text-[10px] text-blue-500 uppercase font-bold tracking-tighter bg-blue-500/5 px-2 py-0.5 rounded-full w-fit">
                                  Withdrawn: ${((user.totalEarnings || 0) - (user.pendingEarnings || 0)).toFixed(2)}
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter px-2">
                                  Lifetime: ${(user.totalEarnings || 0).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" asChild className="hover:bg-blue-500 hover:text-white transition-all">
                                <Link href={`mailto:${user.email}?subject=Aura Affiliate Payout`}>Contact</Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm" disabled={!user.pendingEarnings}>
                                    <RefreshCw className="h-4 w-4 mr-1" /> Reset
                                  </Button>
                                </AlertDialogTrigger>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-success text-success hover:bg-success hover:text-white"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsBalanceDialogOpen(true);
                                  }}
                                >
                                  <DollarSign className="h-4 w-4 mr-1" /> Adjust
                                </Button>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Payout Reset</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reset {user.displayName}'s balance? Only do this AFTER you have sent them their payment.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleResetEarnings(user.uid)}>Yes, Reset Balance</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No affiliates found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <ActivationRequests />
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-6">
            <WithdrawalRequests users={users} />
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <Card className="card-glow border-blue-500/10 shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Simulator Analytics</CardTitle>
                    <CardDescription>Monitor user performance and virtual equity in the trading simulator.</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Total Virtual Equity</p>
                    <p className="text-2xl font-bold text-primary">
                      ${users.reduce((acc, u) => acc + (u.simulatorBalance || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trader</TableHead>
                      <TableHead>Virtual Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead className="text-right">Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.sort((a, b) => (b.simulatorBalance || 0) - (a.simulatorBalance || 0)).map((user) => {
                        const balance = user.simulatorBalance ?? 10000;
                        const pnl = balance - 10000;
                        const isActive = balance !== 10000;

                        return (
                          <TableRow key={user.uid + "-sim"} className="hover:bg-blue-500/5 transition-colors">
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.displayName}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                                <span className="font-mono font-bold text-lg">${balance.toLocaleString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {isActive ? (
                                <Badge className="bg-emerald-500 text-white gap-1">
                                  <TrendingUp className="h-3 w-3" /> Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="opacity-50">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{getPlanBadge(user.plan)}</TableCell>
                            <TableCell className="text-right">
                              <div className={`font-bold ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}$
                                <span className="text-[10px] ml-1 opacity-70">
                                  ({((pnl / 10000) * 100).toFixed(2)}%)
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No traders found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Plan</DialogTitle>
            <DialogDescriptionComponent>
              Change the subscription plan for {selectedUser?.displayName}. This will reset their analysis count.
            </DialogDescriptionComponent>
          </DialogHeader>
          <div className="py-4">
            <Select value={newPlan} onValueChange={(value: 'Free' | 'Premium' | 'Aura Plan') => setNewPlan(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Premium">Premium (30 days)</SelectItem>
                <SelectItem value="Aura Plan">Aura Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdatePlan} disabled={updatingPlan}>
              {updatingPlan && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Balance Adjustment Dialog */}
      <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Partner Balance</DialogTitle>
            <DialogDescriptionComponent>
              Manually add or subtract funds from {selectedUser?.displayName}'s affiliate earnings.
              Use negative numbers to subtract.
            </DialogDescriptionComponent>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Balance: ${selectedUser?.pendingEarnings?.toFixed(2) || '0.00'}</label>
              <Input
                type="number"
                placeholder="Amount (e.g. 10 or -10)"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBalanceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdjustBalance} disabled={adjustingBalance}>
              {adjustingBalance ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <DollarSign className="h-4 w-4 mr-2" />}
              Update Balance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Network Details Dialog */}
      <Dialog open={isNetworkDialogOpen} onOpenChange={setIsNetworkDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Referral Network: {referringUser?.displayName}</DialogTitle>
            <DialogDescriptionComponent>
              Complete list of users referred by this partner and their reward status.
            </DialogDescriptionComponent>
          </DialogHeader>

          <div className="flex-grow overflow-auto mt-4 px-1">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow>
                  <TableHead>User Email</TableHead>
                  <TableHead>Current Plan</TableHead>
                  <TableHead className="text-right">Bonus Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.filter(u => u.referredBy === referringUser?.uid).length > 0 ? (
                  users.filter(u => u.referredBy === referringUser?.uid).map((refUser) => (
                    <TableRow key={refUser.uid}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{refUser.email}</span>
                          <span className="text-[10px] text-muted-foreground">
                            Joined: {refUser.joined?.toDate ? refUser.joined.toDate().toLocaleDateString() : 'Direct'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-[10px] px-2 py-0",
                          refUser.plan !== 'Free' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "opacity-50"
                        )}>
                          {refUser.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {refUser.affiliateCommissionPaid ? (
                          <Badge className="bg-emerald-500 text-white gap-1 text-[10px] px-2 py-0.5">
                            <Check className="h-2 w-2" /> Paid
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground italic">
                      No referrals found for this user.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsNetworkDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminPage() {
  return <AdminDashboard />;
}


