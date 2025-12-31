import { Metadata } from 'next';
import BlogListingClient from './BlogListingClient';

export const metadata: Metadata = {
    title: 'AURA Education Blog | Master Institutional Trading Strategies',
    description: 'Explore deep-dive articles on Elliott Wave Theory, ICT Concepts, and SMC. Level up your trading with AURA Analytics experts.',
    openGraph: {
        title: 'AURA Education Blog | Master Institutional Trading Strategies',
        description: 'Explore deep-dive articles on Elliott Wave Theory, ICT Concepts, and SMC. Level up your trading with AURA Analytics experts.',
        type: 'website',
    }
};

export default function BlogListingPage() {
    return <BlogListingClient />;
}
