import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'AURA Demo Account: Learn Trading Risk-Free | AURA',
    description: 'The complete guide to using the AURA Analytics demo environment. Learn how to test institutional strategies without financial risk.',
    openGraph: {
        title: 'AURA Demo Account: Learn Trading Risk-Free | AURA',
        description: 'Explore the AURA demo environment. Master our advanced tools in a safe, simulated market.',
        type: 'article',
        images: ['/6.png'],
        publishedTime: '2024-12-31T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/aura-demo-account-guide?lang=ar',
            'en-US': '/blog/aura-demo-account-guide?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
