import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'The US Dollar Index (DXY) Analysis 2026: Facing a Structural Shift | AURA',
    description: 'Analyzing the US Dollar Index (DXY) in 2026. Will the dollar continue its descent toward 90? Exploring the impact of Fed interest rate cuts and global de-dollarization.',
    openGraph: {
        title: 'The US Dollar Index (DXY) Analysis 2026: Facing a Structural Shift | AURA',
        description: 'Deep dive into DXY in 2026. Key levels and macroeconomic trends.',
        type: 'article',
        images: ['/forex_market_mastery_banner.png'],
        publishedTime: '2026-01-01T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/dollar-index-analysis-2026?lang=ar',
            'en-US': '/blog/dollar-index-analysis-2026?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
