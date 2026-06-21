import { NextResponse } from 'next/server';
import { getNews } from '@/lib/actions';

export async function POST(req: Request) {
  try {
    const { lang } = await req.json();
    const newsLang = lang === 'ar' ? 'ar' : lang === 'es' ? 'es' : 'en';

    const newsResult = await getNews(newsLang);

    if (newsResult.success && newsResult.items && newsResult.items.length > 0) {
      // Limit to 4 items to keep the section neat and slim
      return NextResponse.json({ items: newsResult.items.slice(0, 4) });
    }

    return NextResponse.json({ items: [] });
  } catch (error) {
    console.error('Morning intel error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news feed' },
      { status: 500 }
    );
  }
}
