import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Trading Psychology Mastery: Mastering Your Mind for Profits | AURA',
    description: 'Learn how to conquer fear and greed in trading. A comprehensive guide to building a professional trading mindset and probabilistic thinking.',
    openGraph: {
        title: 'Trading Psychology Mastery: Mastering Your Mind for Profits | AURA',
        description: 'Learn how to conquer fear and greed in trading. A comprehensive guide to building a professional trading mindset.',
        type: 'article',
        images: ['/psychology_trading_banner.png'],
        publishedTime: '2024-12-31T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/trading-psychology-mastery?lang=ar',
            'en-US': '/blog/trading-psychology-mastery?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
