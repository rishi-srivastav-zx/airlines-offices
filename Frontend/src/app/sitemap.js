export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // ============================================
  // SECTION 1: STATIC PAGES
  // ============================================
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/directoryAirlines`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // ============================================
  // SECTION 2: BLOG PAGES (Dynamic from DB)
  // ============================================
  let blogPages = [];
  try {
    const res = await fetch(`${apiUrl}/api/posts`, { cache: 'no-store' });
    const data = await res.json();
    const posts = data.data || [];

    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Blog sitemap error:', error);
    // Continue with empty blogPages array
  }

  // ============================================
  // SECTION 3: AIRLINE OFFICE PAGES
  // ============================================
  let officePages = [];
  try {
    const response = await fetch(`${apiUrl}/api/offices?limit=10000`, {
      cache: 'no-store'
    });
    const data = await response.json();
    const offices = data.data || [];

    officePages = offices.map((office) => ({
      url: `${baseUrl}/directoryAirlines/airlinespages/${office.slug}`, // ✅ Fixed: removed space
      lastModified: office.updatedAt || office.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Office sitemap error:', error);
    // Continue with empty officePages array
  }

  // ============================================
  // RETURN ALL COMBINED
  // ============================================
  return [
    ...staticPages,
    ...blogPages,
    ...officePages,
  ];
}