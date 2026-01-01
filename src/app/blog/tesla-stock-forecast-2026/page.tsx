import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Tesla Stock Forecast 2026: The Robotaxi Pivot & $800 Goal | AURA',
    description: 'A comprehensive analysis of Tesla Inc. (TSLA) for 2026. Understanding the commercialization of Robotaxis, FSD v13 evolution, and the path to a $3T market cap.',
    openGraph: {
        title: 'Tesla Stock Forecast 2026: The Robotaxi Pivot & $800 Goal | AURA',
        description: 'Tesla (TSLA) 2026 analysis. Robotaxis and autonomous driving catalysts.',
        type: 'article',
        images: ['/TESLA.png'],
        publishedTime: '2026-01-01T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/tesla-stock-forecast-2026?lang=ar',
            'en-US': '/blog/tesla-stock-forecast-2026?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
