'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, query, doc, updateDoc, Timestamp, writeBatch, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Edit, CalendarDays, RefreshCw, AlertCircle, Check, Paperclip, ExternalLink, Mail, KeySquare, Users, Crown, Gem, DollarSign, BarChart2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
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
import { approveActivationRequest } from '@/lib/actions';
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
        description: `${request.email}'s plan has been upgraded to Premium.`,
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
              <TableHead>Transaction ID</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map(req => (
              <TableRow key={req.id}>
                <TableCell><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground"/>{req.email}</div></TableCell>
                <TableCell><div className="flex items-center gap-2 font-mono"><KeySquare className="h-4 w-4 text-muted-foreground"/>{req.transactionId}</div></TableCell>
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

    const totalRevenue = premiumUsers * 20;

    return { totalUsers, premiumUsers, freeUsers, auraPlanUsers, totalRevenue };
  }, [users]);


  const handleOpenDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setNewPlan(user.plan);
    setIsDialogOpen(true);
  }

  const handleUpdatePlan = async () => {
    if (!firestore || !selectedUser) return;
    setUpdatingPlan(true);

    const userDocRef = doc(firestore, "users", selectedUser.uid);
    
    const planData: { 
        plan: 'Free' | 'Premium' | 'Aura Plan', 
        planStartDate?: Timestamp | null, 
        planEndDate?: Timestamp | null,
        analysisCount: number,
        lastAnalysisDate: null | Timestamp
    } = { 
        plan: newPlan,
        analysisCount: 0,
        lastAnalysisDate: null
    };

    if (newPlan === 'Premium') {
      const startDate = Timestamp.now();
      const endDate = new Timestamp(startDate.seconds + 30 * 24 * 60 * 60, startDate.nanoseconds);
      planData.planStartDate = startDate;
      planData.planEndDate = endDate;
    } else {
      // Clear dates if switching to Free or Aura Plan
      planData.planStartDate = null;
      planData.planEndDate = null;
    }

    try {
      await updateDoc(userDocRef, planData);
      toast({
        title: "Plan Updated",
        description: `${selectedUser.displayName}'s plan has been updated to ${newPlan}.`,
      });
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
        </div>


        <ActivationRequests />

        <Card className="card-glow">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>A list of all users registered in your application. Found {users.length} users.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      {getPlanBadge(user.plan)}
                    </TableCell>
                    <TableCell>
                      {getUsageInfo(user)}
                    </TableCell>
                     <TableCell>
                      {getPremiumStatus(user)}
                    </TableCell>
                    <TableCell>{user.joined && user.joined.toDate ? formatDistanceToNow(user.joined.toDate(), { addSuffix: true }) : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(user)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit Plan</span>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
    </>
  );
}

export default function AdminPage() {
    return <AdminDashboard />;
}

    
