import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.auraanalyticspro.com').replace(/\/$/, '');

    const blogPosts = [
        'advanced-schools-strategy',
        'trading-psychology-mastery',
        'risk-management-strategies',
        'crypto-market-cycles',
        'supply-demand-zones',
        'harmonic-patterns-trading',
        'technical-vs-fundamental',
        'forex-market-mastery',
        'global-stock-indices',
        'aura-demo-account-guide',
        'institutional-liquidity-ict',
        'elliott-wave-forecasting'
    ];

    const routes = [
        '',
        '/about',
        '/pricing',
        '/reviews',
        '/blog',
        ...blogPosts.map(slug => `/blog/${slug}`),
        '/privacy-policy',
        '/terms-of-service',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
        languages: {
            ar: `${baseUrl}${route}`,
            en: `${baseUrl}${route}`,
        },
    }));

    return routes;
}
