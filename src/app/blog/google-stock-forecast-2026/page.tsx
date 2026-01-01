import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Google Stock (Alphabet) Forecast 2026: Gemini AI Dominance | AURA',
    description: 'In-depth analysis of Alphabet Inc. (GOOGL) for 2026. Explore the growth of Google Cloud ($155B backlog), Gemini AI integration, and the $385 target.',
    openGraph: {
        title: 'Google Stock Forecast 2026: Gemini AI Dominance | AURA',
        description: 'Google (GOOGL) 2026 analysis. AI cloud growth and price targets.',
        type: 'article',
        images: ['/GOOGLE.png'],
        publishedTime: '2026-01-01T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/google-stock-forecast-2026?lang=ar',
            'en-US': '/blog/google-stock-forecast-2026?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
