import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Institutional Liquidity & ICT Logic: The Invisible Game | AURA',
    description: 'Understand how big banks move the market. A deep dive into liquidity grabs, PO3, and institutional footprints.',
    openGraph: {
        title: 'Institutional Liquidity & ICT Logic: The Invisible Game | AURA',
        description: 'Understand how big banks move the market. A deep dive into liquidity grabs, PO3, and institutional footprints.',
        type: 'article',
        images: ['/7.png'],
        publishedTime: '2024-12-28T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/institutional-liquidity-ict?lang=ar',
            'en-US': '/blog/institutional-liquidity-ict?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
