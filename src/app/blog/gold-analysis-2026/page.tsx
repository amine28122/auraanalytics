import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Gold Price Analysis 2026: The Path to $5,000 | AURA',
    description: 'Comprehensive analysis of Gold (XAU/USD) in 2026. Explore key support levels, resistance zones, and the fundamental drivers behind the gold bull run.',
    openGraph: {
        title: 'Gold Price Analysis 2026: The Path to $5,000 | AURA',
        description: 'Comprehensive analysis of Gold (XAU/USD) in 2026. Key levels and fundamental drivers.',
        type: 'article',
        images: ['/stock_indices_mastery_banner.png'],
        publishedTime: '2026-01-01T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/gold-analysis-2026?lang=ar',
            'en-US': '/blog/gold-analysis-2026?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
