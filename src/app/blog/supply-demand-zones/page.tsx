import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Supply and Demand Zones: The Hidden Engine of Markets | AURA',
    description: 'Learn the core principles of supply and demand zones. Discover how institutional order flow creates massive price imbalances.',
    openGraph: {
        title: 'Supply and Demand Zones: The Hidden Engine of Markets | AURA',
        description: 'Master the mechanics of market reversals using professional supply and demand analysis.',
        type: 'article',
        images: ['/1 (2).png'],
        publishedTime: '2024-12-31T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/supply-demand-zones?lang=ar',
            'en-US': '/blog/supply-demand-zones?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
