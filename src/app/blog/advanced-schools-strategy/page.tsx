import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Advanced Schools Strategy: Institutional Trading Deep Dive | AURA',
    description: 'Master the markets with our Advanced Schools methodology. Combining Elliott Wave and ICT for institutional-grade precision.',
    openGraph: {
        title: 'Advanced Schools Strategy: Institutional Trading Deep Dive | AURA',
        description: 'Master the markets with our Advanced Schools methodology. Combining Elliott Wave and ICT for institutional-grade precision.',
        type: 'article',
        images: ['/6.png'],
        publishedTime: '2024-12-30T00:00:00.000Z',
        authors: ['AURA Analytics'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Advanced Schools Strategy: Institutional Trading Deep Dive | AURA',
        description: 'Master the markets with our Advanced Schools methodology.',
        images: ['/6.png'],
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/advanced-schools-strategy?lang=ar',
            'en-US': '/blog/advanced-schools-strategy?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
