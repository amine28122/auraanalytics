import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Apple Stock Forecast 2026: The AI Revolution & $350 Target | AURA',
    description: 'A deep dive into Apple Inc. (AAPL) stock for 2026. Analysis of the AI-driven iPhone 18 cycle, services revenue growth, and technical roadmap to new all-time highs.',
    openGraph: {
        title: 'Apple Stock Forecast 2026: The AI Revolution & $350 Target | AURA',
        description: 'Apple (AAPL) 2026 analysis. AI integration and growth catalysts.',
        type: 'article',
        images: ['/APPLE.png'],
        publishedTime: '2026-01-01T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/apple-stock-forecast-2026?lang=ar',
            'en-US': '/blog/apple-stock-forecast-2026?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
