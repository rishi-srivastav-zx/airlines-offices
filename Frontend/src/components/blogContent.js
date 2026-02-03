"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Check, User, Calendar, PhoneOutgoing } from "lucide-react";
import { BLOG_POSTS } from "@/components/constdata";
import BlogAuthor from "./BlogAuthor";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const BlogTemplate = () => {
    const router = useRouter();
    const params = useParams();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const api = axios.create({
        baseURL: "http://localhost:3001/api",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });

    const fetchBlogContent = async (slug) => {
        try {
            setLoading(true);
            const response = await api.get(`/blogs/posts/${slug}`);
            if (response.data.success) {
                setPageData(response.data.data.post);
                setError("");
            } else {
                setError("Failed to load blog content");
                toast.error("Failed to load blog content");
            }
        } catch (err) {
            console.error("Error fetching blog content:", err);
            setError("Failed to load blog content");
            toast.error("Failed to load blog content");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!params || !params.id) return;

        const blogSlug = params.id;
        fetchBlogContent(blogSlug);
    }, [params]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 px-3 sm:px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 sm:h-12 md:h-16 w-10 sm:w-12 md:w-16 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                        Loading blog content...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !pageData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 px-3 sm:px-4">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Blog</h3>
                    <p className="text-gray-600 text-sm">{error}</p>
                    <button 
                        onClick={() => router.push('/')} 
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-white">
            {/* Header with Title and Meta */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight break-words">
                        {pageData.title}
                    </h1>

                    {/* Author and Date */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs md:text-sm text-gray-600">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                                {pageData.author?.name || "Admin"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                                {new Date(pageData.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-8 overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Featured Image */}
                        <div className="bg-white rounded-lg overflow-hidden mb-4 sm:mb-6 md:mb-8">
                            <div className="grid grid-cols-1">
                                <div className="w-full">
                                    {pageData.featuredImage ? (
                                        <img
                                            src={pageData.featuredImage}
                                            alt={pageData.title}
                                            className="w-full h-40 sm:h-48 md:h-64 lg:h-80 xl:h-96 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-40 sm:h-48 md:h-64 lg:h-80 xl:h-96 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">No image available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="space-y-4 sm:space-y-6 md:space-y-8">
                            {/* Introduction */}
                            <section className="break-words">
                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                                    {pageData.introduction || "No introduction available."}
                                </p>
                            </section>

                            {/* Content */}
                            <section className="break-words">
                                <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                                    {pageData.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
                                    ) : (
                                        <p className="text-gray-500">No content available.</p>
                                    )}
                                </div>
                            </section>

                            {/* Tags */}
                            {pageData.tags && pageData.tags.length > 0 && (
                                <section className="break-words">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3">
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {pageData.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* FAQ */}
                            {pageData.faq && pageData.faq.length > 0 && (
                                <section id="faq" className="break-words">
                                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                                        Frequently Asked Questions
                                    </h2>
                                    <div className="space-y-3 sm:space-y-4">
                                        {pageData.faq.map((item, idx) => (
                                            <div key={idx} className="border-b pb-3 sm:pb-4">
                                                <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-1">
                                                    {item.question}
                                                </h3>
                                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Author Info */}

                        </div>
                    </div>

                    {/* Sidebar - Related Blogs */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-8">
                            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                                    Related Blogs
                                </h3>
                                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                                    {BLOG_POSTS.slice(0, 5).map((post) => (
                                        <div
                                            key={post.id}
                                            className="group cursor-pointer"
                                            onClick={() =>
                                                router.push(`/blogs/${post.id}`)
                                            }
                                        >
                                            <div className="flex gap-2 sm:gap-3">
                                                <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="inline-block text-[9px] sm:text-[10px] md:text-xs font-semibold text-blue-600 uppercase mb-0.5 sm:mb-1">
                                                        {post.category}
                                                    </span>
                                                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight sm:leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-0.5 sm:mb-1 break-words">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 flex-shrink-0" />
                                                        <span className="text-[9px] sm:text-xs text-gray-500 whitespace-nowrap">
                                                            {post.date}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter Subscription Box */}
                            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl text-white shadow-2xl shadow-blue-200 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
                                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black mb-1.5 sm:mb-2 italic">
                                    Need Help?
                                </h3>
                                <p className="text-[10px] sm:text-xs md:text-sm text-blue-50 mb-3 sm:mb-4 md:mb-6 opacity-90 leading-relaxed">
                                    Our support team is available 24/7 for
                                    urgent ticketing and travel inquiries.
                                </p>
                                <button className="w-full bg-white flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 md:gap-2 text-blue-600 font-black py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-blue-50 transition-colors shadow-lg text-xs sm:text-sm md:text-base">
                                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                                        <PhoneOutgoing
                                            size={14}
                                            className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] shrink-0"
                                        />
                                        <span className="text-[11px] sm:text-sm md:text-base break-all sm:whitespace-nowrap">
                                            +1-833-842-6011
                                        </span>
                                    </div>
                                    <span className="text-[9px] sm:text-xs font-normal text-blue-500">
                                        (Toll-Free)
                                    </span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
        </div>
      </div>
    </>
  );
};

export default BlogTemplate;
