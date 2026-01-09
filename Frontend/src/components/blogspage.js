import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/components/constdata";
import { Calendar, User, PhoneOutgoing } from "lucide-react";

export default function BlogPage() {
    // Insert banner after 4 posts
    const BANNER_INDEX = 4;

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Aviation & Travel Insights
                    </h1>
                    <p className="text-gray-600 text-lg mt-2">
                        Latest updates, traveler tips, and industry news from
                        Airlines-Office.com
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:px-6">
                    {BLOG_POSTS.map((post, index) => (
                        <React.Fragment key={post.id}>
                            {/* 🔹 Banner inserted in middle */}
                            {index === BANNER_INDEX && (
                                <div className="sm:col-span-2 lg:col-span-4">
                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00ADEF] to-blue-600 text-white shadow-xl">
                                        <div className="px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">
                                                    Need Help With Airline
                                                    Bookings?
                                                </h3>
                                                <p className="text-white/90 max-w-xl">
                                                    Get expert assistance for
                                                    flight bookings,
                                                    cancellations, baggage
                                                    queries, and airline office
                                                    information worldwide.
                                                </p>
                                            </div>
                                            <Link
                                                href="tel:+18338426011"
                                                className="inline-flex items-center gap-2 bg-white text-[#00ADEF] font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base"
                                            >
                                                <PhoneOutgoing size={18} />
                                                Call Now: +1-833-842-6011(Toll
                                                Free)
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Blog Card */}
                            <Link
                                href={`/blogs/${post.id}`}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden 
                                hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>

                                {/* Content */}
                                <div className="py-6 px-4 flex flex-col flex-grow">
                                    <h2
                                        className="text-lg font-semibold text-gray-900 leading-snug 
                                        hover:text-blue-600 transition line-clamp-2"
                                    >
                                        {post.title}
                                    </h2>

                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                        {post.excerpt}
                                    </p>

                                    {/* Meta */}
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <User size={14} />
                                            <span>Travel Expert Team</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </React.Fragment>
                    ))}
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
            </div>
        </div>
    );
}
