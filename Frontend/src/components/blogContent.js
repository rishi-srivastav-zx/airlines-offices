"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    ChevronRight,
    Plane,
    Star,
    CreditCard,
    Check,
    Menu,
    X,
    ArrowLeft,
} from "lucide-react";
import { BLOG_CONTENT } from "@/components/constdata";

const BlogTemplate = () => {
    const router = useRouter();
    const params = useParams();
    const [activeSection, setActiveSection] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    const scrollToSection = (id) => {
        setActiveSection(id);
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

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
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={pageData.heroImage}
                        alt="Air Transat Flight"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative container mx-auto px-4 py-12 sm:py-16 md:py-20">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">
                            Back to Blogs
                        </span>
                    </button>
                    <div className="max-w-4xl">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                            {pageData.title}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-2xl">
                            {pageData.subtitle}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Table of Contents - Desktop */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Menu className="w-5 h-5 text-blue-600" />
                                Table of Contents
                            </h2>
                            <nav className="space-y-2">
                                {pageData.tableOfContents.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                            activeSection === item.id
                                                ? "bg-blue-100 text-blue-700 font-semibold"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {item.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Mobile TOC Toggle */}
                    <div className="lg:hidden fixed bottom-4 right-4 z-50">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile TOC Menu */}
                    {mobileMenuOpen && (
                        <div
                            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-lg font-bold text-gray-800 mb-4">
                                    Table of Contents
                                </h2>
                                <nav className="space-y-2">
                                    {pageData.tableOfContents.map(
                                        (item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() =>
                                                    scrollToSection(item.id)
                                                }
                                                className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                                            >
                                                {item.title}
                                            </button>
                                        )
                                    )}
                                </nav>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <main className="lg:col-span-9 space-y-8 sm:space-y-12">
                        {/* Introduction */}
                        <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <img
                                src={pageData.heroImage}
                                alt="Air Transat Cabin"
                                className="w-full h-48 sm:h-64 md:h-80 object-cover"
                            />
                            <div className="p-6 sm:p-8 md:p-10">
                                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                                    {pageData.intro.text}
                                </p>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed italic">
                                    {pageData.intro.additionalText}
                                </p>
                            </div>
                        </section>

                        {/* Cabin Classes */}
                        <section
                            id="cabin-classes"
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-10"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
                                <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                                {pageData.cabinClasses.title}
                            </h2>

                            <img
                                src={pageData.cabinClasses.image}
                                alt="Cabin Classes"
                                className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-xl mb-6 sm:mb-8"
                            />

                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-8 sm:mb-12">
                                {pageData.cabinClasses.intro}
                            </p>

                            <div className="space-y-8 sm:space-y-10">
                                {pageData.cabinClasses.classes.map(
                                    (classItem, idx) => (
                                        <div
                                            key={idx}
                                            id={classItem.title
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}
                                        >
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                                                {classItem.title}
                                            </h3>
                                            {classItem.subtitle && (
                                                <p className="text-gray-600 text-sm sm:text-base mb-3 italic">
                                                    {classItem.subtitle}
                                                </p>
                                            )}
                                            {classItem.description && (
                                                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                                    {classItem.description}
                                                </p>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </section>

                        {/* Club Class */}
                        <section
                            id="club-class"
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 p-6 sm:p-8 md:p-10"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
                                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                                {pageData.clubClass.title}
                            </h2>

                            <img
                                src={pageData.clubClass.image}
                                alt="Club Class"
                                className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-xl mb-6 sm:mb-8"
                            />

                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                                {pageData.clubClass.description}
                            </p>

                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                                {pageData.clubClass.subtitle}
                            </h3>

                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                                {pageData.clubClass.additionalInfo}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                                {pageData.clubClass.benefits.map(
                                    (benefit, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm"
                                        >
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 text-sm sm:text-base">
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
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-10"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                                {pageData.upgradeMethods.title}
                            </h2>

                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                                {pageData.upgradeMethods.intro}
                            </p>

                            {/* Online Method */}
                            <div id="online" className="mb-8 sm:mb-12">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                                    {pageData.upgradeMethods.online.title}
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {pageData.upgradeMethods.online.steps.map(
                                        (step, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 sm:gap-4 bg-blue-50 p-4 sm:p-5 rounded-xl"
                                            >
                                                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-gray-700 text-sm sm:text-base flex-1">
                                                    {step}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Auction Method */}
                            <div id="auction">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                                    {pageData.upgradeMethods.auction.title}
                                </h3>
                                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                                    {
                                        pageData.upgradeMethods.auction
                                            .description
                                    }
                                </p>
                                <div className="space-y-3 sm:space-y-4 mb-6">
                                    {pageData.upgradeMethods.auction.steps.map(
                                        (step, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 sm:gap-4 bg-indigo-50 p-4 sm:p-5 rounded-xl"
                                            >
                                                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-gray-700 text-sm sm:text-base flex-1">
                                                    {step}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 sm:p-5 rounded-r-xl">
                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                        <strong>Note:</strong>{" "}
                                        {pageData.upgradeMethods.auction.note}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Is Upgrading Worth It */}
                        <section
                            id="worth-it"
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-10"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
                                {pageData.worthIt.title}
                            </h2>

                            <div className="space-y-4 sm:space-y-5">
                                {pageData.worthIt.points.map((point, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-gray-100 last:border-0"
                                    >
                                        <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed flex-1">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Upgrade Cost */}
                        <section
                            id="cost"
                            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-6 sm:p-8 md:p-10"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
                                {pageData.upgradeCost.title}
                            </h2>

                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                {pageData.upgradeCost.content}
                            </p>
                        </section>

                        {/* Conclusion */}
                        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
                                {pageData.conclusion.title}
                            </h2>

                            <p className="text-blue-50 text-sm sm:text-base leading-relaxed">
                                {pageData.conclusion.content}
                            </p>
                        </section>

                        {/* FAQ */}
                        <section
                            id="faq"
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-10"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
                                Frequently Asked Questions
                            </h2>

                            <div className="space-y-6 sm:space-y-8">
                                {pageData.faq.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="border-l-4 border-blue-600 pl-4 sm:pl-6"
                                    >
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                                            {item.question}
                                        </h3>
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* CTA */}
                        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 text-center">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                                Ready to Upgrade Your Flight?
                            </h2>
                            <p className="text-indigo-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
                                Experience the comfort and luxury of Club Class
                                on your next Air Transat flight.
                            </p>
                            <button className="bg-white text-indigo-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105">
                                Book Your Upgrade Now
                            </button>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default BlogTemplate;
