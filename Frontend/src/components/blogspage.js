"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, PhoneOutgoing, FileText } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

// Skeleton Card Component
const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        <div className="relative h-40 w-full bg-gray-200"></div>
        <div className="py-6 px-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
        </div>
    </div>
);

// No Data Component
const NoDataFound = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                <FileText size={48} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Blog Posts Found
            </h3>
            <p className="text-gray-600 mb-6">
                We don't have any published blog posts at the moment. Please
                check back later for exciting aviation and travel content!
            </p>
            <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
                Go to Homepage
            </Link>
        </div>
    </div>
);

export default function BlogPage() {
    // Insert banner after 4 posts
    const BANNER_INDEX = 4;
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const api = axios.create({
        baseURL: "http://localhost:3001/api",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });

    const fetchBlogPosts = async () => {
        try {
            setLoading(true);
            setError(""); // Clear previous errors
            const res = await api.get("/blogs/posts", {
                params: {
                    status: "published", // Only show published blogs on public page
                },
            });

            const mappedPosts = res.data.data.map((blog) => ({
                id: blog._id,
                title: blog.title,
                image: blog.featuredImage,
                excerpt:
                    blog.introduction || "Read more about this blog post...",
                date: new Date(blog.createdAt).toLocaleDateString(),
                category: blog.category || "Aviation",
            }));

            setBlogPosts(mappedPosts);
        } catch (err) {
            console.error("Error fetching blog posts:", err);
            setError("Failed to load blog posts. Please try again.");
            toast.error("Failed to load blog posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />

            <div className="min-h-screen bg-blue-50 py-6 px-2 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            Aviation & Travel Insights
                        </h1>
                        <p className="text-gray-600 text-lg mt-2">
                            Latest updates, traveler tips, and industry news
                            from Airlines-Office.com
                        </p>
                    </div>

                    {/* Loading State - Skeleton */}
                    {loading && (
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:px-6">
                                {[...Array(8)].map((_, index) => (
                                    <SkeletonCard key={index} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="min-h-[60vh] flex items-center justify-center">
                            <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
                                <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Oops! Something Went Wrong
                                </h3>
                                <p className="text-gray-600 mb-6">{error}</p>
                                <button
                                    onClick={fetchBlogPosts}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* No Data State */}
                    {!loading && !error && blogPosts.length === 0 && (
                        <NoDataFound />
                    )}

                    {/* Blog Grid - Success State */}
                    {!loading && !error && blogPosts.length > 0 && (
                        <>
                            <div className="max-w-7xl mx-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:px-6">
                                    {blogPosts.map((post, index) => (
                                        <React.Fragment key={post.id}>
                                            {/* Banner */}
                                            {index === BANNER_INDEX && (
                                                <div className="sm:col-span-2 lg:col-span-4">
                                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00ADEF] to-blue-600 text-white shadow-xl">
                                                        <div className="px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                                            <div>
                                                                <h3 className="text-2xl font-bold mb-2">
                                                                    Need Help
                                                                    With Airline
                                                                    Bookings?
                                                                </h3>
                                                                <p className="text-white/90 max-w-xl">
                                                                    Get expert
                                                                    assistance
                                                                    for flight
                                                                    bookings,
                                                                    cancellations,
                                                                    baggage
                                                                    queries, and
                                                                    airline
                                                                    office
                                                                    information
                                                                    worldwide.
                                                                </p>
                                                            </div>
                                                            <Link
                                                                href="tel:+18338426011"
                                                                className="inline-flex items-center gap-2 bg-white text-[#00ADEF] font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base whitespace-nowrap"
                                                            >
                                                                <PhoneOutgoing
                                                                    size={18}
                                                                />
                                                                Call Now:
                                                                +1-833-842-6011
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Blog Card */}
                                            <Link
                                                href={`/blogs/${post.title
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}`}
                                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
                          hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                                            >
                                                <div className="relative h-40 w-full bg-gray-100">
                                                    <Image
                                                        src={post.image}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "/placeholder-blog.jpg"; // Fallback image
                                                        }}
                                                    />
                                                </div>

                                                <div className="py-6 px-4 flex flex-col flex-grow">
                                                    <h2 className="text-lg font-semibold text-gray-900 leading-snug hover:text-blue-600 transition line-clamp-2">
                                                        {post.title}
                                                    </h2>

                                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>

                                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <User size={14} />
                                                            <span>
                                                                Travel Expert
                                                                Team
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar
                                                                size={14}
                                                            />
                                                            <span>
                                                                {post.date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-20 flex justify-center space-x-2">
                                <button className="w-10 h-10 rounded-full bg-[#00ADEF] text-white flex items-center justify-center font-bold shadow-lg shadow-[#00ADEF]/20">
                                    1
                                </button>
                                <button className="w-10 h-10 rounded-full bg-white border border-gray-100 font-bold text-[#333333] hover:bg-[#00ADEF] hover:text-white transition">
                                    2
                                </button>
                                <button className="w-10 h-10 rounded-full bg-white border border-gray-100 font-bold text-[#333333] hover:bg-[#00ADEF] hover:text-white transition">
                                    3
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
