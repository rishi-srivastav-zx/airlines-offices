"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { 
  Check, 
  User, 
  Calendar, 
  PhoneOutgoing, 
  Clock, 
  Tag, 
  ChevronRight,
  Share2,
  Bookmark,
  MessageCircle
} from "lucide-react";
import BlogAuthor from "./BlogAuthor";
import { blogService } from "@/services/api";
import { toast, Toaster } from "react-hot-toast";

// NEW: JSON-LD Structured Data Component for SEO
function BlogStructuredData({ blog, slug }) {
  if (!blog) return null;
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.metaDescription || blog.introduction,
    "image": blog.featuredImage,
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "author": {
      "@type": "Person",
      "name": blog.author?.name || "Admin"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Your Website Name",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blogs/${slug}`
    },
    "url": `${siteUrl}/blogs/${slug}`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// NEW: FAQ Structured Data for rich snippets
function FAQStructuredData({ faq }) {
  if (!faq || faq.length === 0) return null;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// MODIFIED: Accept props instead of using useParams
const BlogContent = ({ initialData, slug }) => {
  const router = useRouter();
  
  // Use initialData if available, otherwise null
  const [pageData, setPageData] = useState(initialData?.post || null);
  const [loading, setLoading] = useState(!initialData); // Only load if no initialData
  const [error, setError] = useState("");
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Reading progress indicator
  useEffect(() => {
    const updateReadingProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  const fetchRelatedBlogs = async (currentSlug) => {
    try {
      setRelatedLoading(true);
      const response = await blogService.getAllPosts({ limit: 5 });

      if (response.success && response.data.length > 0) {
        const relatedBlogs = response.data.filter(blog => blog.slug !== currentSlug);
        setRelatedBlogs(relatedBlogs.slice(0, 3));
      } else {
        setRelatedBlogs([]); 
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
      setRelatedBlogs([]);
    } finally {
      setRelatedLoading(false);
    }
  };



const fetchBlogContent = async (slug) => {
  try {
    setLoading(true);
    
    const response = await blogService.getPostBySlug(slug);
    
    if (response.success) {
      setPageData(response.data.post);
      setError("");
    } else {
      setError("Failed to load blog content");
      toast.error("Failed to load blog content");
    }
  } catch (err) {
    console.error("Error fetching blog content:", err);
    setError("Failed to load blog content: " + err.message);
    toast.error("Failed to load blog content");
  } finally {
    setLoading(false);
  }
};

  // MODIFIED: Use slug from props
  useEffect(() => {
    if (!slug) return;
    
    // Only fetch if we don't have pageData yet
    if (!pageData) {
      fetchBlogContent(slug);
    }
    
    fetchRelatedBlogs(slug);
  }, [slug, pageData]);

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pageData?.title,
          text: pageData?.introduction,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    // ... your existing loading JSX
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 mx-auto opacity-50"></div>
          </div>
          <p className="text-slate-600 font-medium animate-pulse">
            Loading amazing content...
          </p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    // ... your existing error JSX
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-slate-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* NEW: Add Structured Data for SEO */}
      <BlogStructuredData blog={pageData} slug={slug} />
      <FAQStructuredData faq={pageData.faq} />
      
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

       <article className="min-h-screen bg-white">
        {/* Hero Header */}
        <header className="relative bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="container mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-6 lg:py-8">

            {/* Title */}
            <h1 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              {pageData.title}
            </h1>

            {/* Meta Info Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-600">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {pageData.author?.name?.charAt(0) || "A"}
                </div>
                <span className="font-medium text-slate-900">{pageData.author?.name || "Admin"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-500" />
                <time dateTime={pageData.createdAt}>
                  {new Date(pageData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-green-500" />
                <span>{Math.ceil(pageData.content?.length / 1000) || 5} min read</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <button 
                  onClick={handleShare}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="Bookmark">
                  <Bookmark className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Content */}
            <main className="lg:col-span-8">
              {/* Featured Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 sm:mb-12 group">
                {pageData.featuredImage ? (
                  <img
                    src={pageData.featuredImage}
                    alt={pageData.title}
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/placeholder-blog.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <span className="text-slate-400 font-medium">No image available</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Container */}
              <div className="prose prose-lg max-w-none">
                {/* Introduction */}
                {pageData.introduction && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-xl">
                    <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium italic">
                      {pageData.introduction}
                    </p>
                  </div>
                )}

                {/* Main Content */}
                <div className="text-slate-700 leading-relaxed space-y-6">
                  {pageData.content && pageData.content.trim() ? (
                    <div 
                      className="prose-headings:text-slate-900 prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg"
                      dangerouslySetInnerHTML={{ __html: pageData.content }}
                    />
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-amber-900 mb-2">Content Coming Soon</h3>
                      <p className="text-amber-700">This article is currently being crafted. Check back soon!</p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {pageData.tags && pageData.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-bold text-slate-900">Related Topics</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pageData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ Section */}
                {pageData.faq && pageData.faq.length > 0 && (
                  <section id="faq" className="mt-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <span className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Check className="w-5 h-5 text-blue-600" />
                      </span>
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      {pageData.faq.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                          <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                            <span className="text-blue-500 font-black">Q.</span>
                            {item.question}
                          </h3>
                          <p className="text-slate-600 leading-relaxed pl-7">
                            <span className="text-green-500 font-bold mr-2">A.</span>
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Author Section */}
                {pageData.author && (
                  <section className="mt-12 pt-8 border-t border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">About the Author</h2>
                    <BlogAuthor author={pageData.author} />
                  </section>
                )}
              </div>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="lg:sticky lg:top-8 space-y-6">
                {/* Related Blogs */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                      Related Stories
                    </h3>
                  </div>
                  
                  <div className="p-6">
                    {relatedLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex gap-4 animate-pulse">
                            <div className="w-20 h-20 bg-slate-200 rounded-lg flex-shrink-0"></div>
                            <div className="flex-1 space-y-2 py-2">
                              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : relatedBlogs.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <p>No related stories found</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {relatedBlogs.map((post, index) => (
                          <article
                            key={post._id}
                            className="group cursor-pointer"
                            onClick={() => router.push(`/blogs/${post.slug}`)}
                          >
                            <div className="flex gap-4">
                              <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                                <img
                                  src={post.featuredImage || "/placeholder-blog.jpg"}
                                  alt={post.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  onError={(e) => {
                                    e.target.src = "/placeholder-blog.jpg";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              </div>

                              <div className="flex-1 flex flex-col justify-center">
                                <h4 className="font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                                  {post.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Calendar className="w-3 h-3" />
                                  <time dateTime={post.createdAt}>
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </time>
                                </div>
                              </div>
                            </div>
                            {index !== relatedBlogs.length - 1 && (
                              <div className="mt-6 border-b border-slate-100"></div>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-xl">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                      <PhoneOutgoing className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                    <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                      Our travel experts are available 24/7 to assist with your bookings and inquiries.
                    </p>
                    <button className="w-full bg-white text-blue-700 font-bold py-3 px-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg flex flex-col sm:flex-row items-center justify-center gap-2 group">
                      <span className="text-lg">+1-833-842-6011</span>
                      <span className="text-xs font-normal text-blue-500 group-hover:text-blue-600">Toll-Free</span>
                    </button>
                  </div>
                </div>

                {/* Newsletter Mini */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Travel Tips</h4>
                  <p className="text-sm text-slate-600 mb-4">Get the latest travel deals and tips delivered to your inbox.</p>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Your email"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogContent;