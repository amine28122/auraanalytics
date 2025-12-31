import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Technical vs Fundamental Analysis: A Unified Strategy | AURA',
    description: 'Bridge the gap between news and charts. Learn how to combine fundamental context with technical execution.',
    openGraph: {
        title: 'Technical vs Fundamental Analysis: A Unified Strategy | AURA',
        description: 'Build a unified trading strategy by combining economic reality and chart precision.',
        type: 'article',
        images: ['/3 (2).png'],
        publishedTime: '2024-12-31T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/technical-vs-fundamental?lang=ar',
            'en-US': '/blog/technical-vs-fundamental?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
