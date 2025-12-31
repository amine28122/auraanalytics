import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Harmonic Patterns: Advanced Geometric Trading | AURA',
    description: 'Master the art of harmonic trading. Learn about Gartley, Bat, Butterfly, and Fibonacci-based geometric patterns.',
    openGraph: {
        title: 'Harmonic Patterns: Advanced Geometric Trading | AURA',
        description: 'Discover the mathematical beauty of markets with our deep guide to Harmonic Patterns.',
        type: 'article',
        images: ['/2 (2).png'],
        publishedTime: '2024-12-31T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/harmonic-patterns-trading?lang=ar',
            'en-US': '/blog/harmonic-patterns-trading?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
