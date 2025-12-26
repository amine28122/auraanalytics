'use client';

import { useEffect, useState } from 'react';
import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, Users, DollarSign, TrendingUp, CheckCircle2, Info, Loader2, Wallet, History, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { submitWithdrawRequest } from '@/lib/actions';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type AffiliateData = {
    referralCode?: string;
    totalReferrals?: number;
    activeReferrals?: number;
    totalEarnings?: number;
    pendingEarnings?: number;
};

type WithdrawRequest = {
    id: string;
    amount: number;
    walletAddress: string;
    status: 'pending' | 'approved';
    createdAt: any;
};

export default function AffiliatePage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
    const [withdrawHistory, setWithdrawHistory] = useState<WithdrawRequest[]>([]);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (user && firestore) {
            // Stats Listener
            const userDocRef = doc(firestore, 'users', user.uid);
            const unsubStats = onSnapshot(userDocRef, async (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    const code = data.referralCode || user.uid.substring(0, 8).toUpperCase();

                    // Proactively save code if missing for old users
                    if (!data.referralCode) {
                        try {
                            const { updateDoc } = await import('firebase/firestore');
                            await updateDoc(userDocRef, { referralCode: code });
                        } catch (err) {
                            console.error("Failed to auto-save referral code:", err);
                        }
                    }

                    setAffiliateData({
                        referralCode: code,
                        totalReferrals: data.totalReferrals || 0,
                        activeReferrals: data.activeReferrals || 0,
                        totalEarnings: data.totalEarnings || 0,
                        pendingEarnings: data.pendingEarnings || 0,
                    });
                }
            });

            // Withdraw History Listener
            const q = query(collection(firestore, 'withdrawRequests'), where('userId', '==', user.uid));
            const unsubHistory = onSnapshot(q, (snapshot) => {
                const history = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as WithdrawRequest[];
                setWithdrawHistory(history.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
            });

            return () => {
                unsubStats();
                unsubHistory();
            };
        }
    }, [user, firestore]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount < 50) {
            toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Minimum withdrawal is $50' });
            return;
        }

        if (amount > (affiliateData?.pendingEarnings || 0)) {
            toast({ variant: 'destructive', title: 'Insufficient Balance', description: 'You cannot withdraw more than your balance' });
            return;
        }

        setIsSubmitting(true);
        const result = await submitWithdrawRequest({
            userId: user.uid,
            email: user.email || '',
            amount,
            walletAddress
        });

        setIsSubmitting(false);
        if (result.error) {
            toast({ variant: 'destructive', title: 'Request Failed', description: result.error });
        } else {
            toast({ title: 'Success!', description: 'Your withdrawal request has been sent and will be processed soon.' });
            setIsWithdrawOpen(false);
            setWithdrawAmount('');
            setWalletAddress('');
        }
    };

    const PRODUCTION_URL = 'https://auraanalytics.vercel.app';
    const referralLink = affiliateData?.referralCode
        ? `${PRODUCTION_URL}?ref=${affiliateData.referralCode}`
        : '';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast({
            title: 'Copied!',
            description: 'Referral link copied to clipboard',
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyCode = () => {
        if (affiliateData?.referralCode) {
            navigator.clipboard.writeText(affiliateData.referralCode);
            toast({
                title: 'Copied!',
                description: 'Referral code copied to clipboard',
            });
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-10">
            {/* Hero Section */}
            <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border border-primary/10 p-10 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-amber-500 bg-clip-text text-transparent">
                    Partner Program
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    Join the AURA Analytics elite partner network. Empower your audience with professional AI analysis and earn high-yield rewards.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Network', value: affiliateData?.totalReferrals || 0, icon: Users, desc: 'Users joined via your link' },
                    { label: 'Active Partners', value: affiliateData?.activeReferrals || 0, icon: TrendingUp, desc: 'Currently active subscriptions' },
                    { label: 'Total Revenue', value: `$${(affiliateData?.totalEarnings || 0).toFixed(2)}`, icon: DollarSign, desc: 'Lifetime earnings' },
                    { label: 'Unpaid Balance', value: `$${(affiliateData?.pendingEarnings || 0).toFixed(2)}`, icon: DollarSign, desc: 'Ready for payout', color: 'text-amber-500' }
                ].map((stat, i) => (
                    <Card key={i} className="border-primary/5 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                            <stat.icon className={cn("h-5 w-5", stat.color || "text-primary")} />
                        </CardHeader>
                        <CardContent>
                            <div className={cn("text-4xl font-black tracking-tight", stat.color)}>{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium opacity-70">{stat.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Referral Controls */}
                <Card className="lg:col-span-2 overflow-hidden border-primary/20 bg-primary/[0.02] backdrop-blur-sm shadow-xl">
                    <CardHeader className="border-b border-primary/5 pb-6">
                        <CardTitle className="text-2xl">Affiliate Control Center</CardTitle>
                        <CardDescription>Manage and distribute your professional partner link</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground/80">Your Global Referral Link</label>
                            <div className="flex gap-3">
                                <Input value={referralLink} readOnly className="bg-background/50 h-12 font-mono text-primary border-primary/20 focus-visible:ring-primary/30" />
                                <Button onClick={handleCopyLink} className="shrink-0 h-12 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all space-x-2">
                                    {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-6 bg-background/50 rounded-2xl border border-primary/10 group hover:border-primary/30 transition-colors">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Promo Code</p>
                                    <p className="text-3xl font-black font-mono tracking-widest text-primary">{affiliateData?.referralCode}</p>
                                </div>
                                <Button onClick={handleCopyCode} variant="ghost" size="icon" className="hover:bg-primary/10 rounded-xl">
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20 flex flex-col justify-center">
                                <p className="text-xs font-bold text-primary/80 uppercase mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="font-bold text-lg">Active Partner</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Commission Box */}
                <Card className="border-amber-500/20 shadow-2xl shadow-amber-500/10 bg-gradient-to-b from-amber-500/[0.03] to-transparent">
                    <CardHeader>
                        <CardTitle className="text-xl">Yield Breakdown</CardTitle>
                        <CardDescription>Maximized commission tier</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="p-5 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 group hover:bg-emerald-500/[0.08] transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold">Premium Tier</span>
                                <Badge variant="outline" className="text-lg font-black text-emerald-500 border-emerald-500/30 px-3">$10</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-snug">Earn a flat <span className="text-emerald-500 font-bold">$10.00</span> commission for every successful premium activation.</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 group hover:bg-amber-500/[0.08] transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold">Aura Tier</span>
                                <Badge variant="outline" className="text-lg font-black text-amber-500 border-amber-500/30 px-3">$25</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-snug">Earn a premium <span className="text-amber-500 font-bold">$25.00</span> commission for institutional level referrals.</p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-primary/5">
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 tracking-widest uppercase">
                                <TrendingUp className="h-3 w-3" />
                                Payout Frequency: Monthly
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* System Guide & Payout */}
            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="border-blue-500/10 shadow-lg">
                    <CardHeader className="bg-blue-500/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-blue-500/10 shadow-inner"><Info className="h-6 w-6 text-blue-500" /></div>
                            <CardTitle className="text-xl font-bold">How the Engine Works</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="relative border-l-2 border-primary/10 ml-4 space-y-10">
                            {[
                                { t: 'Strategic Tracking', d: 'Our tracking engine uses session signatures to identify your referrals even before they sign up.' },
                                { t: 'Permanence Link', d: 'Once a user registers via your link, they are tied to your ID permanently in our secure database.' },
                                { t: 'Payment Verification', d: "Our analysts verify the payment transaction ID and screenshot within 2-24 hours." },
                                { t: 'Automated Settlement', d: 'Upon plan approval, the commission is instantly computed and credited to your partner balance.' }
                            ].map((step, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className="absolute -left-[13px] top-0 flex items-center justify-center w-6 h-6 bg-background border-2 border-primary rounded-full z-10">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground/90 mb-1">{step.t}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{step.d}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-primary/10 shadow-lg overflow-hidden">
                        <CardHeader className="bg-primary/[0.02] flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">Settlement Center</CardTitle>
                                <CardDescription>Withdraw your earned commissions</CardDescription>
                            </div>
                            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        disabled={(affiliateData?.pendingEarnings || 0) < 50}
                                        className="shadow-xl shadow-primary/20 space-x-2"
                                    >
                                        <Wallet className="h-4 w-4" />
                                        <span>Request Payout</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Request Commission Withdrawal</DialogTitle>
                                        <DialogDescription>
                                            Transfer your earnings to your personal USDT TRC20 wallet.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleWithdraw} className="space-y-6 pt-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-sm font-bold">Withdrawal Amount ($)</label>
                                                <span className="text-xs text-muted-foreground">Available: ${(affiliateData?.pendingEarnings || 0).toFixed(2)}</span>
                                            </div>
                                            <Input
                                                type="number"
                                                placeholder="Min. 50"
                                                min="50"
                                                step="0.01"
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">USDT TRC20 Wallet Address</label>
                                            <Input
                                                placeholder="Enter TRC20 address"
                                                value={walletAddress}
                                                onChange={(e) => setWalletAddress(e.target.value)}
                                                required
                                            />
                                            <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" /> Double check address. Wrong address = lost funds.
                                            </p>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <DollarSign className="h-4 w-4 mr-2" />}
                                                Confirm Withdrawal
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-muted/30 border border-primary/5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Status</p>
                                    <p className="text-sm font-bold mt-1">Ready for Payout</p>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 text-right">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Min. Threshold</p>
                                    <p className="text-sm font-bold mt-1">$50.00 USD</p>
                                </div>
                            </div>

                            {(affiliateData?.pendingEarnings || 0) < 50 && (
                                <Alert className="bg-amber-500/5 border-amber-500/10">
                                    <Info className="h-4 w-4 text-amber-500" />
                                    <AlertDescription className="text-xs text-amber-600/80">
                                        You need at least <strong>$50.00</strong> to request a payout. You currently have <strong>${(affiliateData?.pendingEarnings || 0).toFixed(2)}</strong>.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-primary/10 shadow-lg h-full">
                        <CardHeader className="bg-muted/30">
                            <div className="flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Withdrawal History</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/10">
                                        <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Amount</TableHead>
                                        <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Status</TableHead>
                                        <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {withdrawHistory.length > 0 ? (
                                        withdrawHistory.map((req) => (
                                            <TableRow key={req.id} className="hover:bg-muted/20 transition-colors">
                                                <TableCell className="py-4 px-6 font-mono font-bold">${req.amount.toFixed(2)}</TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <Badge
                                                        variant={req.status === 'approved' ? 'default' : 'secondary'}
                                                        className={cn(
                                                            "capitalize font-bold text-[10px]",
                                                            req.status === 'approved' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                        )}
                                                    >
                                                        {req.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-xs text-muted-foreground">
                                                    {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleDateString() : 'Pending...'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-32 text-center text-muted-foreground text-xs italic">
                                                No withdrawal history yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
