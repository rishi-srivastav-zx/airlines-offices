"use client";

import React, { useState, useEffect } from "react";
import AboutAirline from "@/components/Aboutairline";
import { useRouter, useParams } from "next/navigation";
import {
    Plane,
    Phone,
    Mail,
    MapPin,
    Clock,
    Info,
    Building,
    ExternalLink,
    Layers,
    Star,
    Navigation,
} from "lucide-react";
import {
    OFFICES,
    aircraftByAirline,
    servicesList,
    getAirlineById,
} from "@/components/constdata";
import { officeInquiries } from "@/components/constdata";
import SafeImage from "@/components/safeImage";
import OfficeInquiryList from "@/components/InquiryTable";

// InfoTable Component
const InfoTable = ({ icon: Icon, title, rows }) => {
    return (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
                <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
                {Icon && (
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                )}
                <span className="break-words">{title}</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
                {rows.map((row, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-2 sm:py-3 border-b border-slate-100 last:border-0 gap-1 sm:gap-4"
                    >
                        <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-tighter sm:min-w-[140px]">
                            {row.label}
                        </span>
                        <div className="sm:text-right flex-1 text-sm font-semibold text-slate-800 break-words">
                            {row.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// MapSection Component
const MapSection = ({ airlineName, city, address, country }) => {
    // Generate Google Maps URLs
    const mapQuery = encodeURIComponent(`${address}, ${city}, ${country}`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
    // Using place search which works without API key for basic embeds
    const googleMapsEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

    // Default rating (you can add this to office data later)
    const rating = 4.0;
    const reviewCount = 606;

    return (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                    <span className="break-words">Office Location Map</span>
                </h2>
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center gap-1 w-fit"
                >
                    Open in Maps
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                </a>
            </div>

            {/* Map Container */}
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                {/* Google Maps Embed */}
                <iframe
                    src={googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                ></iframe>

                {/* Information Card Overlay */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white rounded-lg shadow-xl max-w-[calc(100%-1rem)] sm:max-w-sm w-full border border-gray-200">
                    {/* Office Name */}
                    <div className="p-3 sm:p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-tight break-words">
                            {airlineName} - {city}
                        </h3>
                    </div>

                    {/* Address */}
                    <div className="p-3 sm:p-4 border-b border-gray-100">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                            {address}, {city}, {country}
                        </p>
                    </div>

                    {/* Rating */}
                    <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                        i < Math.floor(rating)
                                            ? "fill-orange-400 text-orange-400"
                                            : i < rating
                                            ? "fill-orange-200 text-orange-200"
                                            : "fill-gray-200 text-gray-200"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                            {rating}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500">
                            ({reviewCount} reviews)
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="p-3 sm:p-4 flex flex-col gap-2">
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                        >
                            <Navigation className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            Directions
                        </a>
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium text-center"
                        >
                            View larger map
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OfficeTemplate = () => {
    const router = useRouter();
    const params = useParams();
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Get office ID from URL params
        if (!params) return;

        const officeId = params.id;
        if (officeId) {
            const found = OFFICES.find((o) => o.id === officeId);
            if (found) {
                setSelectedOffice(found);
                return;
            }
        }

        // Fallback to first office if not found
        if (OFFICES.length > 0) {
            setSelectedOffice(OFFICES[0]);
        }
    }, [params]);

    const handleOfficeSelect = (office) => {
        setSelectedOffice(office);
        router.push(`/airlinespages/${office.id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsMenuOpen(false);
    };

    if (!selectedOffice) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center">
                    <p className="text-gray-600 text-sm sm:text-base">
                        Loading office information...
                    </p>
                </div>
            </div>
        );
    }

    const airline = getAirlineById(selectedOffice.airlineId);
    const aircraft = aircraftByAirline[selectedOffice.airlineId] || [];

    // Default values for missing fields
    const website =
        airline?.website ||
        `https://www.${selectedOffice.airlineName
            .toLowerCase()
            .replace(/\s+/g, "")}.com`;
    const headquarterAddress =
        selectedOffice.headquarterAddress ||
        `${selectedOffice.city}, ${selectedOffice.country}`;
    const headquarterPhone =
        selectedOffice.headquarterPhone || selectedOffice.phone;
    const airportName =
        selectedOffice.airportName ||
        `${selectedOffice.city} International Airport`;
    const airportAddress =
        selectedOffice.airportAddress ||
        `${airportName}, Terminal Information Available`;
    const airportCode =
        selectedOffice.airportCode ||
        selectedOffice.city.substring(0, 3).toUpperCase();
    const airportContact =
        selectedOffice.airportContact || selectedOffice.phone;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <main className="flex-grow">
                {/* Hero / Header Section */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-8 sm:py-12 md:py-16 lg:py-20 px-4">
                    <div className="container mx-auto w-full text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-blue-300 animate-pulse"></span>
                            <span className="whitespace-nowrap">
                                Verified Airline Office Info
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight break-words">
                            {selectedOffice.airlineName} {selectedOffice.city}{" "}
                            Office
                        </h1>
                        <p className="text-blue-50 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto md:mx-0 opacity-90 leading-relaxed font-medium">
                            Official contact details, airport coordinates, and
                            headquarter information for{" "}
                            {selectedOffice.airlineName} in{" "}
                            {selectedOffice.country}.
                        </p>
                    </div>
                </div>

                {/* Content Container */}
                <div className="container mx-auto px-4 w-full -mt-6 sm:-mt-8 md:-mt-12 pb-12 sm:pb-16 md:pb-20">
                    <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
                        {/* Left Column (Primary Info) */}
                        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                            {/* Quick Action Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a
                                    href={`tel:${selectedOffice.phone.replace(
                                        /\s/g,
                                        ""
                                    )}`}
                                    className="flex items-center gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-500 hover:shadow-lg transition-all"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                                        <Phone className="text-base sm:text-lg" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                            Call Now
                                        </p>
                                        <p className="font-bold text-slate-800 text-sm sm:text-base break-words">
                                            <b>+1-833-842-6011</b> (Toll-Free)
                                        </p>
                                    </div>
                                </a>
                                <a
                                    href={`mailto:${selectedOffice.email}`}
                                    className="flex items-center gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-500 hover:shadow-lg transition-all"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors flex-shrink-0">
                                        <Mail className="text-base sm:text-lg" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                            Email Inquiry
                                        </p>
                                        <p className="font-bold text-slate-800 text-sm sm:text-base break-all">
                                            {selectedOffice.email}
                                        </p>
                                    </div>
                                </a>
                            </div>

                            <AboutAirline
                                airlineId={selectedOffice.airlineId}
                                airlineName={selectedOffice.airlineName}
                                city={selectedOffice.city}
                            />

                            {/* Detailed Info Tables */}
                            <InfoTable
                                icon={Info}
                                title="Office Overview"
                                rows={[
                                    {
                                        label: "Address",
                                        value: (
                                            <span className="text-blue-600 break-words">
                                                {selectedOffice.address}
                                            </span>
                                        ),
                                    },
                                    {
                                        label: "Phone Number",
                                        value: selectedOffice.phone,
                                    },
                                    {
                                        label: "Operation Hours",
                                        value: (
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-orange-500 w-4 h-4 flex-shrink-0" />{" "}
                                                <span className="break-words">
                                                    {selectedOffice.hours}
                                                </span>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: "Official Website",
                                        value: (
                                            <a
                                                href={website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline flex items-center gap-1 break-all"
                                            >
                                                <span className="break-all">
                                                    {website}
                                                </span>{" "}
                                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                            </a>
                                        ),
                                    },
                                ]}
                            />

                            <InfoTable
                                icon={Plane}
                                title="Airport Liaison"
                                rows={[
                                    {
                                        label: "Airport Name",
                                        value: airportName,
                                    },
                                    {
                                        label: "Terminal Info",
                                        value: airportAddress,
                                    },
                                    {
                                        label: "IATA Code",
                                        value: (
                                            <span className="inline-block bg-slate-800 text-white px-2 py-0.5 rounded text-xs font-mono">
                                                {airportCode}
                                            </span>
                                        ),
                                    },
                                    {
                                        label: "Counter Contact",
                                        value: airportContact,
                                    },
                                ]}
                            />

                            {/* Map Section */}
                            <MapSection
                                airlineName={selectedOffice.airlineName}
                                city={selectedOffice.city}
                                address={selectedOffice.address}
                                country={selectedOffice.country}
                            />

                            <OfficeInquiryList data={officeInquiries} />

                            {/* Services Grid */}
                            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
                                    <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
                                    <span className="break-words">
                                        Available Services
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    {servicesList.map((service, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 sm:gap-3 group"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-blue-200 group-hover:bg-blue-600 transition-colors flex-shrink-0"></div>
                                            <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors break-words">
                                                {service}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Aircraft Types */}
                            <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl text-white shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Plane className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 relative z-10">
                                    <Layers className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                                    <span className="break-words">
                                        Fleet Operations
                                    </span>
                                </h2>
                                <div className="flex flex-wrap gap-2 relative z-10">
                                    {aircraft.map((plane, i) => (
                                        <span
                                            key={i}
                                            className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-white/20 transition-all cursor-default break-words"
                                        >
                                            {plane}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Sidebar) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Office Image / Featured Content */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <SafeImage
                                    src={selectedOffice.image}
                                    alt={selectedOffice.city}
                                    className="w-full h-48 sm:h-56 object-cover"
                                    fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
                                />
                                <div className="p-4 sm:p-6">
                                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic break-words">
                                        "{selectedOffice.description}"
                                    </p>
                                </div>
                            </div>

                            {/* Related Offices */}
                            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-5 break-words">
                                    Browse More Offices
                                </h3>
                                <div className="space-y-3">
                                    {OFFICES.filter(
                                        (o) => o.id !== selectedOffice.id
                                    ).map((o) => (
                                        <button
                                            key={o.id}
                                            onClick={() =>
                                                handleOfficeSelect(o)
                                            }
                                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left"
                                        >
                                            <SafeImage
                                                src={o.image}
                                                alt={o.city}
                                                className="w-14 h-10 sm:w-16 sm:h-12 rounded-lg object-cover flex-shrink-0"
                                                fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-[10px] sm:text-xs font-bold text-blue-600 leading-tight break-words">
                                                    {o.airlineName}
                                                </p>
                                                <p className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                                                    {o.city} Office
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter / CTA */}
                            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 sm:p-8 rounded-3xl text-white shadow-2xl shadow-blue-200">
                                <h3 className="text-lg sm:text-xl font-black mb-2 sm:mb-3 italic break-words">
                                    Need Help?
                                </h3>
                                <p className="text-xs sm:text-sm text-blue-50 mb-4 sm:mb-6 opacity-80 break-words">
                                    Our support team is available 24/7 for
                                    urgent ticketing and travel inquiries.
                                </p>
                                <button className="w-full bg-white text-blue-600 font-black py-3 sm:py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-lg text-sm sm:text-base">
                                    Live Chat Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OfficeTemplate;
