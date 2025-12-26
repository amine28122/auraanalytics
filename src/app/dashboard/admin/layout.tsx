'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// This layout protects the admin route with a password.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Redirect to home if user is not logged in after loading state is resolved.
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError('');

    // Hardcoded password check. In a real app, this should be more secure.
    if (password === '123456') {
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password. Please try again.');
    }
    setIsChecking(false);
  };

  // While checking auth status from Firebase
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged in, but not yet authenticated for the admin panel
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4">Admin Access Required</CardTitle>
            <CardDescription>
              Please enter the password to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isChecking}>
                {isChecking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Unlock
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated, render the admin page content
  return <div className="min-h-screen bg-background p-4 md:p-8">{children}</div>;
}
