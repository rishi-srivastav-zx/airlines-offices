

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes
          '/admin/',         // Admin panel
          '/private/',       // Private pages
          '/blogs/draft/',   // Draft blog posts (if you have)
          '/*/edit',         // Edit pages
          '/*/delete',       // Delete pages
        ],
      },
      
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
        ],
      },
    ],
    
    sitemap: `${baseUrl}/sitemap.xml`,
    
    host: baseUrl,
  };
}