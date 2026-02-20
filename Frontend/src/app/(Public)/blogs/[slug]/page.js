import { notFound } from 'next/navigation';
import BlogContent from "@/components/blogContent";

// Fetch blog data from your API
async function getBlog(slug) {
  if (!slug) return null;
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // FIXED: Use /api/blogs/posts/ instead of /api/posts/
    const res = await fetch(
      `${apiUrl}/api/blogs/posts/${slug}`,
      { 
        cache: "no-store",
        next: { revalidate: 60 } // Revalidate every 60 seconds (ISR)
      }
    );
    
    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText}`);
      console.error(`Failed URL: ${apiUrl}/api/blogs/posts/${slug}`);
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  const response = await getBlog(slug);
  
  // Default metadata if blog not found
  if (!response || !response.success) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const blog = response.data.post;
  
  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.introduction?.substring(0, 160),
    keywords: blog.keywords || [],
    
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.introduction?.substring(0, 160),
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: blog.author?.name ? [blog.author.name] : [],
      images: blog.featuredImage ? [{ url: blog.featuredImage }] : [],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.introduction?.substring(0, 160),
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
    
    alternates: {
      canonical: `/blogs/${slug}`,
    },
  };
}

// Main page component
export default async function Page({ params }) {
  const { slug } = await params;
  
  const response = await getBlog(slug);
  
  const blogData = response?.success ? response.data : null;
  
  // If blog not found, show 404 page
  if (!blogData) {
    notFound();
  }
  
  return <BlogContent initialData={blogData} slug={slug} />;
}