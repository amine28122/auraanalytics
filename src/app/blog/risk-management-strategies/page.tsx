import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Risk Management Strategies: Secure Your Portfolio | AURA',
    description: 'Master the 1% rule and risk-to-reward ratios. Protect your trading account against volatility and build long-term sustainable wealth.',
    openGraph: {
        title: 'Risk Management Strategies: Secure Your Portfolio | AURA',
        description: 'Master the 1% rule and risk-to-reward ratios. Protect your trading account against volatility.',
        type: 'article',
        images: ['/risk_management_visualization.png'],
        publishedTime: '2024-12-30T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/risk-management-strategies?lang=ar',
            'en-US': '/blog/risk-management-strategies?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
