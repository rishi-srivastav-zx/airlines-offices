import React from "react";
import Link from "next/link";
import Image from "next/image";
// import { BLOG_POSTS } from "@/data/mockData";
import { BLOG_POSTS } from "@/components/constdata";

export default function BlogPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-16 animate-fade-in">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
                        Aviation & Travel Insights
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Latest updates, traveler tips, and industry news from
                        Airlines-Office.com
                    </p>
                </div>

                {/* Featured Post */}
                <div className="mb-16">
                    <Link href={`/blog/${BLOG_POSTS[0].id}`}>
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl flex flex-col lg:flex-row border border-gray-100 group cursor-pointer">
                            <div className="lg:w-3/5 h-[400px] overflow-hidden relative">
                                <Image
                                    src={BLOG_POSTS[0].image}
                                    alt={BLOG_POSTS[0].title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="lg:w-2/5 p-12 flex flex-col justify-center">
                                <span className="text-[#00ADEF] font-bold text-xs uppercase tracking-[0.2em] mb-4">
                                    Featured Story
                                </span>
                                <h2 className="text-3xl font-bold text-[#333333] mb-6 leading-tight group-hover:text-[#00ADEF] transition-colors">
                                    {BLOG_POSTS[0].title}
                                </h2>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    {BLOG_POSTS[0].excerpt} Read more to find out
                                    how to save time on your next booking...
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                                    <div>
                                        <p className="text-sm font-bold text-[#333333]">
                                            By Travel Expert Team
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {BLOG_POSTS[0].date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Blog Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {[
                        "All Posts",
                        "Travel Tips",
                        "Aviation News",
                        "Reviews",
                        "Support Guides",
                    ].map((cat, idx) => (
                        <button
                            key={idx}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                                idx === 0
                                    ? "bg-[#00ADEF] text-white shadow-lg shadow-[#00ADEF]/20"
                                    : "bg-white text-gray-400 hover:text-[#00ADEF] shadow-sm border border-gray-100"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Post Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full ">
                    {BLOG_POSTS.map((post) => (
                        <Link key={post.id} href={`/blog/${post.id}`}>
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col group cursor-pointer h-full">
                                <div className="relative h-60 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#F5A623] uppercase">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8 flex-grow flex flex-col">
                                    <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wider">
                                        {post.date}
                                    </p>
                                    <h3 className="text-xl font-bold text-[#333333] mb-4 group-hover:text-[#00ADEF] line-clamp-2 leading-snug">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-sm font-bold text-[#333333]">
                                            5 min read
                                        </span>
                                        <span className="w-8 h-8 rounded-full bg-blue-50 text-[#00ADEF] flex items-center justify-center group-hover:bg-[#00ADEF] group-hover:text-white transition-all">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {/* Mock extra cards for grid visual */}
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col group cursor-pointer h-full"
                        >
                            <div className="relative h-60 overflow-hidden">
                                <Image
                                    src={`https://picsum.photos/seed/travel${i}/800/600`}
                                    alt="Travel update"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#F5A623] uppercase">
                                    Travel Update
                                </div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wider">
                                    February {10 + i}, 2025
                                </p>
                                <h3 className="text-xl font-bold text-[#333333] mb-4 group-hover:text-[#00ADEF] line-clamp-2 leading-snug">
                                    New Flight Routes Announced for Summer 2025
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                    Major airlines are expanding their networks
                                    with over 50 new international destinations
                                    being added this season...
                                </p>
                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-sm font-bold text-[#333333]">
                                        3 min read
                                    </span>
                                    <span className="w-8 h-8 rounded-full bg-blue-50 text-[#00ADEF] flex items-center justify-center group-hover:bg-[#00ADEF] group-hover:text-white transition-all">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-20 flex justify-center space-x-2">
                    <button className="w-10 h-10 rounded-full bg-[#00ADEF] text-white flex items-center justify-center font-bold shadow-lg shadow-[#00ADEF]/20 transition-all">
                        1
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center font-bold text-[#333333] hover:bg-[#00ADEF] hover:text-white transition-all">
                        2
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center font-bold text-[#333333] hover:bg-[#00ADEF] hover:text-white transition-all">
                        3
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center font-bold text-[#333333] hover:bg-[#00ADEF] hover:text-white transition-all">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
