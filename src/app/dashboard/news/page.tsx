import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

export default function NewsPage() {
  const pageTitle = 'Forex News';
  const pageDescription = 'Latest news from DailyForex.';
  const noNewsText = 'The news feed is temporarily unavailable. Please check back later.';

  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-3xl font-bold tracking-tighter">
            {pageTitle}
            </h1>
        </div>
        <p className="text-muted-foreground">
          {pageDescription}
        </p>
      </div>
      <Card className="flex flex-col items-center justify-center text-center py-12 card-glow">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Newspaper className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{noNewsText}</p>
        </CardContent>
      </Card>
    </div>
  );
}
