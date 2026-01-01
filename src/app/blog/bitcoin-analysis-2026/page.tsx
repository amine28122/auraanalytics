import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Bitcoin Price Forecast 2026: The $200,000 Milestone | AURA',
    description: 'Deep dive into Bitcoin (BTC) market analysis for 2026. Understanding institutional adoption, ETFs, and the technical journey toward the $250k target.',
    openGraph: {
        title: 'Bitcoin Price Forecast 2026: The $200,000 Milestone | AURA',
        description: 'Comprehensive analysis of Bitcoin (BTC) in 2026. Institutional inflows and technical targets.',
        type: 'article',
        images: ['/BITCOIN.png'],
        publishedTime: '2026-01-01T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/bitcoin-analysis-2026?lang=ar',
            'en-US': '/blog/bitcoin-analysis-2026?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
