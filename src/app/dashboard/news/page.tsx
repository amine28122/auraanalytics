import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { getNews } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewsPage(props: { searchParams: Promise<{ lang?: string }> }) {
  const searchParams = await props.searchParams;
  const lang = (searchParams.lang || 'en') as 'en' | 'ar' | 'es';

  const newsLang = lang === 'ar' ? 'ar' : 'en';
  const result = await getNews(newsLang);

  const translations = {
    en: {
      title: 'Market News',
      desc: 'Stay informed with the latest global forex market updates.',
      readMore: 'Read Full Article',
      error: 'Unable to load feed',
      noNews: 'No news articles found at the moment.',
      lastUpdate: 'Last updated',
    },
    ar: {
      title: 'أخبار السوق',
      desc: 'ابق على اطلاع بآخر مستجدات سوق الفوركس العالمي.',
      readMore: 'اقرأ المقال كاملاً',
      error: 'تعذر تحميل الأخبار',
      noNews: 'لا توجد مقالات إخبارية في الوقت الحالي.',
      lastUpdate: 'آخر تحديث',
    }
  };

  const t = translations[newsLang as keyof typeof translations];

  return (
    <div className="flex flex-col gap-8" dir={newsLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Newspaper className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-headline text-3xl font-bold tracking-tighter">
            {t.title}
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          {t.desc}
        </p>
      </div>

      {!result.success || !result.items ? (
        <Card className="py-12 border-destructive/20 bg-destructive/5">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <CardTitle className="text-destructive">{t.error}</CardTitle>
            <p className="text-muted-foreground max-w-xs mx-auto">
              {result.error || 'The news feed is temporarily unavailable. Please try again later.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.items.length > 0 ? (
            result.items.map((item, index) => (
              <Card key={index} className="flex flex-col h-full card-glow hover:border-primary/40 transition-all group overflow-hidden">
                {item.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden flex-none">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized // Since these are external RSS images
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
                  </div>
                )}
                <CardHeader className="flex-none">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    {item.isoDate ? formatDistanceToNow(new Date(item.isoDate), { addSuffix: true }) : item.pubDate}
                  </div>
                  <CardTitle className="text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {item.contentSnippet}
                  </p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant="outline" className="w-full gap-2 group/btn" asChild>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {t.readMore}
                      <ExternalLink className="h-4 w-4 opacity-70 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <CardDescription>{t.noNews}</CardDescription>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
