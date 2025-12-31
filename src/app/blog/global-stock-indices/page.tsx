import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Global Stock Indices: Trading S&P 500 and NASDAQ | AURA',
    description: 'Learn how to trade global stock indices. A deep dive into NASDAQ, S&P 500, and Dow Jones with institutional analysis.',
    openGraph: {
        title: 'Global Stock Indices: Trading S&P 500 and NASDAQ | AURA',
        description: 'Master the art of trading stock indices. Comprehensive guide to major global benchmarks.',
        type: 'article',
        images: ['/stock_indices_mastery_banner.png'],
        publishedTime: '2024-12-30T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/global-stock-indices?lang=ar',
            'en-US': '/blog/global-stock-indices?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
