"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Check,
    ArrowLeft,
    User,
    Calendar,
} from "lucide-react";
import { BLOG_CONTENT, BLOG_POSTS } from "@/components/constdata";

const BlogTemplate = () => {
    const router = useRouter();
    const params = useParams();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get blog ID from URL params
        if (!params) return;

        const blogId = params.id;
        if (blogId && BLOG_CONTENT[blogId]) {
            setPageData(BLOG_CONTENT[blogId]);
            setLoading(false);
        } else {
            // Fallback to first blog if not found
            const firstBlogId = Object.keys(BLOG_CONTENT)[0];
            if (firstBlogId) {
                setPageData(BLOG_CONTENT[firstBlogId]);
                setLoading(false);
            }
        }
    }, [params]);

    if (loading || !pageData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Loading blog content...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header with Title and Meta */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        {pageData.title}
                    </h1>

                    {/* Author and Date */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Travel Expert Team</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Mon Jan 05 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Image Grid - Top Section */}
                        <div className="bg-white rounded-lg overflow-hidden mb-8">
                            <div className="grid grid-cols-2 gap-2">
                                {/* Large Image */}
                                <div className="col-span-2">
                                    <img
                                        src={pageData.clubClass.image}
                                        alt={pageData.title}
                                        className="w-full h-100 object-cover"
                                    />
                                </div>
                            </div>

                            {/* Title overlay on grid */}
                            <div className="bg-white py-4 text-center">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-wide">
                                    {pageData.title}
                                </h2>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-6">
                            {/* Introduction */}
                            <section>
                                <p className="text-gray-700 text-base leading-relaxed mb-4">
                                    {pageData.intro.text}
                                </p>
                                <p className="text-gray-700 text-base leading-relaxed">
                                    {pageData.intro.additionalText}
                                </p>
                            </section>

                            {/* Cabin Classes */}
                            <section id="cabin-classes">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                    {pageData.cabinClasses.title}
                                </h2>
                                <p className="text-gray-700 text-base leading-relaxed mb-6">
                                    {pageData.cabinClasses.intro}
                                </p>

                                <div className="space-y-4">
                                    {pageData.cabinClasses.classes.map(
                                        (classItem, idx) => (
                                            <div
                                                key={idx}
                                                className="border-l-2 border-gray-300 pl-4"
                                            >
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                    {classItem.title}
                                                </h3>
                                                {classItem.subtitle && (
                                                    <p className="text-gray-600 text-sm mb-2">
                                                        {classItem.subtitle}
                                                    </p>
                                                )}
                                                {classItem.description && (
                                                    <p className="text-gray-700 text-base">
                                                        {classItem.description}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>

                            {/* Club Class */}
                            <section id="club-class">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    {pageData.clubClass.title}
                                </h2>
                                <p className="text-gray-700 text-[15px] leading-relaxed mb-4">
                                    {pageData.clubClass.description}
                                </p>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    {pageData.clubClass.subtitle}
                                </h3>
                                <p className="text-gray-700 text-[15px] leading-relaxed mb-5">
                                    {pageData.clubClass.additionalInfo}
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-lg">
                                    {pageData.clubClass.benefits.map(
                                        (benefit, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3"
                                            >
                                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700 text-[14px]">
                                                    {benefit}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>

                            {/* Upgrade Methods */}
                            <section id="upgrade-methods">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                    {pageData.upgradeMethods.title}
                                </h2>
                                <p className="text-gray-700 text-base leading-relaxed mb-4">
                                    {pageData.upgradeMethods.intro}
                                </p>

                                {/* Online Method */}
                                <div id="online" className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        {pageData.upgradeMethods.online.title}
                                    </h3>
                                    <div className="space-y-2">
                                        {pageData.upgradeMethods.online.steps.map(
                                            (step, idx) => (
                                                <p
                                                    key={idx}
                                                    className="text-gray-700 text-base"
                                                >
                                                    {idx + 1}. {step}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Auction Method */}
                                <div id="auction">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        {pageData.upgradeMethods.auction.title}
                                    </h3>
                                    <p className="text-gray-700 text-base leading-relaxed mb-3">
                                        {
                                            pageData.upgradeMethods.auction
                                                .description
                                        }
                                    </p>
                                    <div className="space-y-2 mb-4">
                                        {pageData.upgradeMethods.auction.steps.map(
                                            (step, idx) => (
                                                <p
                                                    key={idx}
                                                    className="text-gray-700 text-base"
                                                >
                                                    {idx + 1}. {step}
                                                </p>
                                            )
                                        )}
                                    </div>
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                                        <p className="text-gray-700 text-sm">
                                            <strong>Note:</strong>{" "}
                                            {
                                                pageData.upgradeMethods.auction
                                                    .note
                                            }
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Is Upgrading Worth It */}
                            <section id="worth-it">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                    {pageData.worthIt.title}
                                </h2>
                                <div className="space-y-3">
                                    {pageData.worthIt.points.map(
                                        (point, idx) => (
                                            <p
                                                key={idx}
                                                className="text-gray-700 text-base leading-relaxed"
                                            >
                                                • {point}
                                            </p>
                                        )
                                    )}
                                </div>
                            </section>

                            {/* Upgrade Cost */}
                            <section id="cost">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                    {pageData.upgradeCost.title}
                                </h2>
                                <p className="text-gray-700 text-base leading-relaxed">
                                    {pageData.upgradeCost.content}
                                </p>
                            </section>

                            {/* Conclusion */}
                            <section>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                    {pageData.conclusion.title}
                                </h2>
                                <p className="text-gray-700 text-base leading-relaxed">
                                    {pageData.conclusion.content}
                                </p>
                            </section>

                            {/* FAQ */}
                            <section id="faq">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    {pageData.faq.map((item, idx) => (
                                        <div key={idx}>
                                            <h3 className="text-base font-bold text-gray-900 mb-1">
                                                {item.question}
                                            </h3>
                                            <p className="text-gray-700 text-base">
                                                {item.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Sidebar - Related Blogs */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    Related Blogs
                                </h3>
                                <div className="space-y-5">
                                    {BLOG_POSTS.slice(0, 5).map((post) => (
                                        <div
                                            key={post.id}
                                            className="group cursor-pointer"
                                            onClick={() =>
                                                router.push(`/blogs/${post.id}`)
                                            }
                                        >
                                            <div className="flex gap-3">
                                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="inline-block text-[10px] font-semibold text-blue-600 uppercase mb-1">
                                                        {post.category}
                                                    </span>
                                                    <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">
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
                            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 sm:p-8 rounded-3xl text-white shadow-2xl shadow-blue-200 mt-10">
                                <h3 className="text-lg sm:text-xl font-black mb-2 sm:mb-3 italic break-words">
                                    Need Help?
                                </h3>
                                <p className="text-xs sm:text-sm text-blue-50 mb-4 sm:mb-6 opacity-80 break-words">
                                    Our support team is available 24/7 for
                                    urgent ticketing and travel inquiries.
                                </p>
                                <button className="w-full bg-white text-blue-600 font-black py-3 sm:py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-lg text-sm sm:text-base">
                                    📞 Call Now: +1-833-842-6011 (Toll-Free)
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BlogTemplate;
