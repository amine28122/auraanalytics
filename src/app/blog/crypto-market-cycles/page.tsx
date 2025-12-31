import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Crypto Market Cycles: On-Chain Analysis Insights | AURA',
    description: 'Understand Bitcoin halving cycles and Altseason dynamics. Learn how to use on-chain data to time your entries and exits in the crypto market.',
    openGraph: {
        title: 'Crypto Market Cycles: On-Chain Analysis Insights | AURA',
        description: 'Understand Bitcoin halving cycles and Altseason dynamics. Learn how to use on-chain data to time your market moves.',
        type: 'article',
        images: ['/crypto_market_analysis_modern.png'],
        publishedTime: '2024-12-29T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/crypto-market-cycles?lang=ar',
            'en-US': '/blog/crypto-market-cycles?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
