"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Globe,
    ShieldCheck,
    Clock,
    ArrowRight,
    Plane,
    Phone,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import WorldMap from "@/components/worldMap";
import SafeImage from "@/components/safeImage";
import OfficeCard from "@/components/officeCard";

const BLOG_POSTS = [
    {
        id: 1,
        title: "How to Contact Airlines During Travel Disruptions",
        excerpt:
            "Essential tips for reaching airline support when your plans change unexpectedly.",
        date: "Jan 15, 2025",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc0f?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 2,
        title: "Understanding Global Airline Office Hours",
        excerpt:
            "Navigate time zones and office schedules to get help when you need it most.",
        date: "Jan 10, 2025",
        image: "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 3,
        title: "Best Practices for Booking Changes",
        excerpt:
            "Learn the most efficient ways to modify your flight reservations.",
        date: "Jan 5, 2025",
        image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 4,
        title: "Finding Local Airline Representatives",
        excerpt:
            "Tips for locating and contacting airline offices in your destination city.",
        date: "Dec 28, 2024",
        image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800",
    },
];

// Skeleton Components
const AirlineCardSkeleton = () => (
    <div className="group flex flex-col items-center p-6 rounded-2xl border border-gray-100 animate-pulse">
        <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
    </div>
);

const OfficeCardSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
    </div>
);

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const [offices, setOffices] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const officesRes = await axios.get(
                    "http://localhost:3001/api/offices",
                );
                setOffices(officesRes.data.data);

                const uniqueAirlines = [
                    ...new Map(
                        officesRes.data.data.map((item) => [
                            item.about?.airlineId,
                            {
                                id: item.about?.airlineId,
                                name: item.officeOverview?.airlineName,
                                logo:
                                    item.logo ||
                                    `https://via.placeholder.com/40x40/00ADEF/FFFFFF?text=${item.officeOverview?.airlineName?.charAt(0) || "✈"}`,
                            },
                        ]),
                    ).values(),
                ].filter((airline) => airline.id);

                setAirlines(uniqueAirlines);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(
                `/directoryAirlines?q=${encodeURIComponent(searchQuery)}`,
            );
        }
    };

    return (
        <div className="flex flex-col">
            <Toaster position="top-right" />

            {/* Hero Section */}
            <section className="relative min-h-[94vh] flex items-center justify-center text-center px-4 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed brightness-75"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2070)",
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>

                <div className="relative z-10 max-w-5xl w-full">
                    <div className="inline-flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-white text-xs">
                        <span className="text-yellow-400">✈</span>
                        <span>Trusted by 1M+ Travelers Worldwide</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                        Find Airline Offices
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                            Anywhere in the World
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                        Get instant access to contact details, locations, and
                        office hours for
                        <br />
                        {loading ? (
                            <span className="inline-block h-6 w-32 bg-white/20 rounded animate-pulse mx-1"></span>
                        ) : (
                            `${airlines.length}+ major airlines across ${offices.length}+ cities.`
                        )}
                    </p>

                    <form
                        onSubmit={handleSearch}
                        className="relative max-w-3xl mx-auto"
                    >
                        <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Find Airline Office Worldwide..."
                                className="w-full bg-transparent border-none py-5 px-8 text-base text-gray-700 focus:outline-none placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-5 font-semibold transition-all flex items-center gap-2"
                            >
                                <Search className="h-5 w-5" />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        {["Dubai", "London", "New York", "Manila", "Doha"].map(
                            (city) => (
                                <button
                                    key={city}
                                    onClick={() =>
                                        router.push(
                                            `/directoryAirlines?city=${city}`,
                                        )
                                    }
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm border border-white/20 transition-all"
                                >
                                    {city}
                                </button>
                            ),
                        )}
                    </div>
                </div>
            </section>

            {/* Global Directory Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
                        Browse by Airline Category
                    </h2>
                    <div className="w-24 h-1 bg-[#00ADEF] mx-auto rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                        {loading
                            ? Array.from({ length: 8 }).map((_, index) => (
                                  <AirlineCardSkeleton key={index} />
                              ))
                            : airlines.slice(0, 8).map((airline) => (
                                  <div
                                      key={airline.id}
                                      onClick={() =>
                                          router.push(
                                              `/directoryAirlines?airline=${airline.id}`,
                                          )
                                      }
                                      className="group cursor-pointer flex flex-col items-center p-6 rounded-2xl border border-gray-100 hover:border-[#00ADEF] hover:shadow-xl transition-all"
                                  >
                                      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#00ADEF]/5 overflow-hidden transition-colors">
                                          <SafeImage
                                              src={`http://localhost:3001${airline.logo}`}
                                              alt={airline.name}
                                              className="w-10 h-10 object-contain"
                                              fallbackSrc="https://via.placeholder.com/40x40/00ADEF/FFFFFF?text=✈"
                                          />
                                      </div>
                                      <p className="text-sm font-bold text-[#333333] group-hover:text-[#00ADEF] text-center">
                                          {airline.name}
                                      </p>
                                  </div>
                              ))}
                    </div>
                </div>
            </section>

            {/* Featured Offices */}
            <section className="py-20 bg-gray-50">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
                            Featured Airline Offices
                        </h2>
                        <p className="text-gray-500">
                            Discover popular hubs and contact terminals
                            worldwide.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/directoryAirlines")}
                        className="hidden md:flex items-center text-[#00ADEF] font-bold group"
                    >
                        View All Offices
                        <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading
                            ? Array.from({ length: 8 }).map((_, index) => (
                                  <OfficeCardSkeleton key={index} />
                              ))
                            : offices
                                  .slice(0, 8)
                                  .map((office) => (
                                      <OfficeCard
                                          key={office._id || office.slug}
                                          office={office}
                                      />
                                  ))}
                    </div>
                </div>
            </section>

            {/* Interactive Map */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
                            Global Network Map
                        </h2>
                        <p className="text-gray-500">
                            Our database covers every corner of the world, from
                            international hubs to regional support centers.
                        </p>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <WorldMap />
                </div>
            </section>

            {/* Features Checklist */}
            <section className="relative py-20 text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=2000&q=80')",
                    }}
                />
                <div className="absolute inset-0 bg-black/70" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                            <Globe className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">
                            Global Directory
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Access office details for over{" "}
                            {loading ? "..." : airlines.length} airlines in{" "}
                            {loading ? "..." : offices.length}+ cities globally.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="h-16 w-16 bg-[#F5A623] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">
                            Verified Information
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Our team regularly updates contact phone numbers and
                            office addresses.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                            <Clock className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">
                            Instant Access
                        </h3>
                        <p className="text-gray-300 text-sm">
                            No sign-up required. Get the info you need to
                            resolve travel issues instantly.
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Highlights */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
                        Travel Tips & Insights
                    </h2>
                    <p className="text-gray-500">
                        The latest news from the world of aviation and travel
                        support.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {BLOG_POSTS.slice(0, 4).map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row group cursor-pointer hover:shadow-2xl transition-all"
                        >
                            <div className="md:w-1/3 overflow-hidden bg-gray-100">
                                <SafeImage
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc0f?auto=format&fit=crop&q=80&w=800"
                                />
                            </div>
                            <div className="p-8 md:w-2/3 flex flex-col justify-center">
                                <p className="text-[#00ADEF] text-xs font-bold uppercase tracking-wider mb-2">
                                    {post.date}
                                </p>
                                <h3 className="text-xl font-bold mb-4 text-[#333333] group-hover:text-[#00ADEF] transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {post.excerpt}
                                </p>
                                <span className="text-sm font-bold text-[#333333] flex items-center">
                                    Read More{" "}
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-16 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-700/80" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl overflow-hidden relative bg-white/10 backdrop-blur-sm">
                        <div className="absolute top-0 right-0 opacity-10 -rotate-12 translate-x-20 -translate-y-10 pointer-events-none">
                            <Plane className="w-96 h-96" />
                        </div>

                        <div className="relative z-10 md:w-2/3 mb-8 md:mb-0">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Need Immediate Assistance?
                            </h2>
                            <p className="text-xl text-blue-100 mb-8 max-w-xl">
                                Get in touch with our global support desk or
                                search our directory for the nearest airline
                                office.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => router.push("/contact")}
                                    className="bg-[#F5A623] hover:bg-[#e09820] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-colors"
                                >
                                    Contact Us
                                </button>

                                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-xl flex items-center">
                                    <Phone className="h-6 w-6 mr-3 text-[#F5A623]" />
                                    <span className="font-bold text-lg">
                                        +1-833-842-6011
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 hidden lg:block">
                            <div className="bg-white p-6 rounded-3xl shadow-2xl transform rotate-3">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <ShieldCheck className="text-[#00ADEF] h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[#333333] font-bold text-sm">
                                            Verified Directory
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            Updated daily by experts
                                        </p>
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full w-48 mb-2"></div>
                                <div className="h-2 bg-gray-100 rounded-full w-32"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
