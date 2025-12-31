import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Forex Market Mastery: Trading the Worlds Largest Market | AURA',
    description: 'Master the secrets of currency trading. Learn about interest rates, NFP, and institutional liquidity in the global Forex market.',
    openGraph: {
        title: 'Forex Market Mastery: Trading the Worlds Largest Market | AURA',
        description: 'Master the secrets of currency trading. Explore our comprehensive guide to Forex.',
        type: 'article',
        images: ['/forex_market_mastery_banner.png'],
        publishedTime: '2024-12-31T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/forex-market-mastery?lang=ar',
            'en-US': '/blog/forex-market-mastery?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
