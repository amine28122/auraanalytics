'use client';

import { AuraAcademyLogo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

// Placeholder data for reviews
const reviews = [
  {
    name: 'Alex T.',
    role: 'Full-time Trader',
    review: 'AURA has revolutionized my workflow. The multi-timeframe analysis is spot-on and saves me hours of manual charting. The signals are clear and the strategy behind them is sound.',
    rating: 5,
  },
  {
    name: 'Sarah K.',
    role: 'Swing Trader',
    review: "As someone who isn't glued to the screen all day, the pending order signals are a game-changer. The accuracy is impressive. Highly recommended for any serious trader.",
    rating: 5,
  },
  {
    name: 'Mike P.',
    role: 'Beginner Trader',
    review: "The learning section is fantastic, but the analysis tool is the real star. It's like having a professional analyst guiding you. My confidence has grown immensely.",
    rating: 4,
  },
];

export default function PublicReviewsPage() {
    const reviewsSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "AURA Customer Reviews",
      "itemListElement": reviews.map((review, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Review",
          "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": "AURA"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": review.rating,
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": review.name
          },
          "reviewBody": review.review
        }
      }))
    };


  return (
    <div className="min-h-screen bg-background">
      <Script
        id="reviews-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
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
        <div className="flex flex-col gap-12">
          <div className="flex w-full flex-col gap-2 items-center text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter">
              What Our Traders Say
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Real feedback from traders who are using AURA to get an edge in the markets.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {reviews.map((item) => (
              <Card key={item.name} className="card-glow flex flex-col">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                    {Array.from({ length: 5 - item.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-muted-foreground" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <blockquote className="italic text-muted-foreground">
                    "{item.review}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>

           <div className="text-center">
                <Button size="lg" asChild>
                    <Link href="/pricing">Join the Community & Get Started</Link>
                </Button>
            </div>
        </div>
      </main>
    </div>
  );
}
