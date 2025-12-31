import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

export const metadata: Metadata = {
    title: 'Elliott Wave Prediction: Forecast Major Market Reversals | AURA',
    description: 'Learn the power of Elliott Wave Theory. Predict market cycles and high-probability reversal zones using mathematical wave patterns.',
    openGraph: {
        title: 'Elliott Wave Prediction: Forecast Major Market Reversals | AURA',
        description: 'Learn the power of Elliott Wave Theory. Predict market cycles and high-probability reversal zones using mathematical wave patterns.',
        type: 'article',
        images: ['/8.png'],
        publishedTime: '2024-12-25T00:00:00.000Z',
    },
    alternates: {
        languages: {
            'ar-SA': '/blog/elliott-wave-forecasting?lang=ar',
            'en-US': '/blog/elliott-wave-forecasting?lang=en',
        },
    }
};

export default function Page() {
    return <ArticleContent />;
}
