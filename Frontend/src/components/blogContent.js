"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Check, User, Calendar, PhoneOutgoing } from "lucide-react";
import { BLOG_CONTENT, BLOG_POSTS } from "@/components/constdata";
import BlogAuthor from "./BlogAuthor";

const BlogTemplate = () => {
    const router = useRouter();
    const params = useParams();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params) return;

        const blogId = params.id;
        if (blogId && BLOG_CONTENT[blogId]) {
            setPageData(BLOG_CONTENT[blogId]);
            setLoading(false);
        } else {
            const firstBlogId = Object.keys(BLOG_CONTENT)[0];
            if (firstBlogId) {
                setPageData(BLOG_CONTENT[firstBlogId]);
                setLoading(false);
            }
        }
    }, [params]);

    if (loading || !pageData) {
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

    return (
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
                                Travel Expert
                            </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                                Jan 05 2026
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-8 overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Image Grid - Top Section */}
                        <div className="bg-white rounded-lg overflow-hidden mb-4 sm:mb-6 md:mb-8">
                            <div className="grid grid-cols-1">
                                {/* Large Image */}
                                <div className="w-full">
                                    <img
                                        src={pageData.clubClass.image}
                                        alt={pageData.title}
                                        className="w-full h-40 sm:h-48 md:h-64 lg:h-80 xl:h-96 object-cover"
                                    />
                                </div>
                            </div>

                            {/* Title overlay on grid */}
                            <div className="bg-white py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 text-center">
                                <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 uppercase tracking-wide leading-tight break-words">
                                    {pageData.title}
                                </h2>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-4 sm:space-y-6 md:space-y-8">
                            {/* Introduction */}
                            <section className="break-words">
                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mb-2 sm:mb-3">
                                    {pageData.intro.text}
                                </p>
                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                                    {pageData.intro.additionalText}
                                </p>
                            </section>

                            {/* Cabin Classes */}
                            <section id="cabin-classes" className="break-words">
                                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                                    {pageData.cabinClasses.title}
                                </h2>
                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 md:mb-6">
                                    {pageData.cabinClasses.intro}
                                </p>

                                <div className="space-y-3 sm:space-y-4">
                                    {pageData.cabinClasses.classes.map(
                                        (classItem, idx) => (
                                            <div
                                                key={idx}
                                                className="border-l-2 border-gray-300 pl-2.5 sm:pl-3 md:pl-4 break-words"
                                            >
                                                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1">
                                                    {classItem.title}
                                                </h3>
                                                {classItem.subtitle && (
                                                    <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm mb-1 sm:mb-1.5">
                                                        {classItem.subtitle}
                                                    </p>
                                                )}
                                                {classItem.description && (
                                                    <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                                                        {classItem.description}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>

                            {/* Club Class */}
                            <section id="club-class" className="break-words">
                                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                                    {pageData.clubClass.title}
                                </h2>
                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mb-2 sm:mb-3">
                                    {pageData.clubClass.description}
                                </p>
                                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                                    {pageData.clubClass.subtitle}
                                </h3>
                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 md:mb-5">
                                    {pageData.clubClass.additionalInfo}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg">
                                    {pageData.clubClass.benefits.map(
                                        (benefit, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-1.5 sm:gap-2 break-words"
                                            >
                                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700 text-xs sm:text-sm leading-snug">
                                                    {benefit}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>

                            {/* Upgrade Methods */}
                            <section
                                id="upgrade-methods"
                                className="break-words"
                            >
                                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                                    {pageData.upgradeMethods.title}
                                </h2>
                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4">
                                    {pageData.upgradeMethods.intro}
                                </p>

                                {/* Online Method */}
                                <div id="online" className="mb-4 sm:mb-5">
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                                        {pageData.upgradeMethods.online.title}
                                    </h3>
                                    <div className="space-y-1.5 sm:space-y-2">
                                        {pageData.upgradeMethods.online.steps.map(
                                            (step, idx) => (
                                                <p
                                                    key={idx}
                                                    className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed"
                                                >
                                                    {idx + 1}. {step}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Auction Method */}
                                <div id="auction">
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                                        {pageData.upgradeMethods.auction.title}
                                    </h3>
                                    <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mb-2">
                                        {
                                            pageData.upgradeMethods.auction
                                                .description
                                        }
                                    </p>
                                    <div className="space-y-1.5 sm:space-y-2 mb-2.5 sm:mb-3">
                                        {pageData.upgradeMethods.auction.steps.map(
                                            (step, idx) => (
                                                <p
                                                    key={idx}
                                                    className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed"
                                                >
                                                    {idx + 1}. {step}
                                                </p>
                                            )
                                        )}
                                    </div>
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2.5 sm:p-3 md:p-4 break-words">
                                        <p className="text-gray-700 text-[10px] sm:text-xs md:text-sm leading-relaxed">
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
                            <section id="worth-it" className="break-words">
                                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                                    {pageData.worthIt.title}
                                </h2>
                                <div className="space-y-1.5 sm:space-y-2">
                                    {pageData.worthIt.points.map(
                                        (point, idx) => (
                                            <p
                                                key={idx}
                                                className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed"
                                            >
                                                • {point}
                                            </p>
                                        )
                                    )}
                                </div>
                            </section>

                            {/* Upgrade Cost */}
                            <section id="cost" className="break-words">
                                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                                    {pageData.upgradeCost.title}
                                </h2>
                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                                    {pageData.upgradeCost.content}
                                </p>
                            </section>

                            {/* Conclusion */}
                            <section className="break-words">
                                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                                    {pageData.conclusion.title}
                                </h2>
                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                                    {pageData.conclusion.content}
                                </p>
                            </section>

                            {/* FAQ */}
                            <section id="faq" className="break-words">
                                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-3 sm:space-y-4">
                                    {pageData.faq.map((item, idx) => (
                                        <div key={idx}>
                                            <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-1">
                                                {item.question}
                                            </h3>
                                            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 sm:mt-6 md:mt-8">
                                    <BlogAuthor />
                                </div>
                            </section>
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
    );
};

export default BlogTemplate;
