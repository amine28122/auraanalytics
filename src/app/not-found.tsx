'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="text-center">
        <h1 className="font-headline text-8xl md:text-9xl font-bold text-primary">404</h1>
        <p className="mt-4 text-2xl md:text-3xl font-semibold text-foreground">Page Not Found</p>
        <p className="mt-2 text-md text-muted-foreground">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8">
          <Button asChild className="futuristic-button">
            <Link href="/">Go back to Homepage</Link>
          </Button>
        </div>
      </div>
       <style jsx>{`
        .light .futuristic-button {
          color: white;
          background: linear-gradient(45deg, hsl(var(--primary) / 0.9), hsl(280, 80%, 50%));
        }

        .dark .futuristic-button {
          color: white;
          background: linear-gradient(45deg, hsl(var(--primary) / 0.9), hsl(280, 80%, 50%));
        }
      `}</style>
    </div>
  );
}
