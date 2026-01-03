"use client";

import React, { useState } from "react";
import { MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { OFFICES } from "@/components/constdata";

const WorldMap = () => {
    const [hoveredOffice, setHoveredOffice] = useState(null);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const router = useRouter();

    // Real geographic positions based on actual coordinates
    // Converted to percentage positions on a typical world map projection
    const getPosition = (city) => {
        const positions = {
            Dubai: { top: "42%", left: "61%" },
            London: { top: "32%", left: "48%" },
            Manila: { top: "48%", left: "78%" },
            "New York": { top: "38%", left: "22%" },
        };
        return positions[city] || { top: "50%", left: "50%" };
    };

    const handlePinClick = (office) => {
        setSelectedOffice(office);
    };

    const handleExploreClick = () => {
        router.push("/directory");
    };

    const handleViewOffice = (officeId) => {
        router.push(`/office/${officeId}`);
    };

    return (
        <div className="relative w-full aspect-video md:aspect-[21/9] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden shadow-2xl border border-blue-200">
            {/* Real World Map SVG Background */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1000 500"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    {/* Ocean */}
                    <linearGradient
                        id="ocean"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#EAF6FF" />
                        <stop offset="50%" stopColor="#CFEAFF" />
                        <stop offset="100%" stopColor="#B7DFFF" />
                    </linearGradient>

                    {/* Land */}
                    <radialGradient id="land" cx="50%" cy="40%" r="80%">
                        <stop
                            offset="0%"
                            stopColor="#7ED1F2"
                            stopOpacity="0.45"
                        />
                        <stop
                            offset="100%"
                            stopColor="#00ADEF"
                            stopOpacity="0.18"
                        />
                    </radialGradient>

                    {/* Coastline glow */}
                    <filter id="coastGlow">
                        <feGaussianBlur stdDeviation="1.5" />
                    </filter>

                    {/* Flight glow */}
                    <filter id="flightGlow">
                        <feGaussianBlur stdDeviation="2" />
                    </filter>

                    {/* Atmosphere */}
                    <radialGradient id="atmosphere" cx="50%" cy="50%" r="70%">
                        <stop
                            offset="0%"
                            stopColor="#ffffff"
                            stopOpacity="0.35"
                        />
                        <stop
                            offset="100%"
                            stopColor="#ffffff"
                            stopOpacity="0"
                        />
                    </radialGradient>
                </defs>

                {/* Ocean */}
                <rect width="1000" height="500" fill="url(#ocean)" />

                {/* Atmosphere */}
                <rect width="1000" height="500" fill="url(#atmosphere)" />

                {/* Continents */}
                <g fill="url(#land)" filter="url(#coastGlow)">
                    {/* North America */}
                    <path d="M140 90 L200 70 L260 80 L300 110 L310 160 L280 200 L230 220 L180 210 L150 170 Z" />

                    {/* South America */}
                    <path d="M260 240 L300 250 L315 300 L300 360 L270 400 L240 380 L230 320 Z" />

                    {/* Europe */}
                    <path d="M450 90 L500 80 L540 100 L550 130 L520 150 L480 145 L455 120 Z" />

                    {/* Africa */}
                    <path d="M480 170 L530 180 L565 230 L570 300 L540 360 L490 350 L460 300 L455 230 Z" />

                    {/* Asia */}
                    <path d="M580 70 L700 65 L810 110 L850 160 L830 200 L760 220 L650 210 L590 160 Z" />

                    {/* Australia */}
                    <path d="M760 330 L820 325 L860 360 L830 400 L770 390 Z" />
                </g>

                {/* Latitude / Longitude */}
                <g stroke="#00ADEF" strokeWidth="0.4" opacity="0.12">
                    {[...Array(9)].map((_, i) => (
                        <line
                            key={`v${i}`}
                            x1={i * 125}
                            y1="0"
                            x2={i * 125}
                            y2="500"
                        />
                    ))}
                    {[...Array(5)].map((_, i) => (
                        <line
                            key={`h${i}`}
                            x1="0"
                            y1={i * 100}
                            x2="1000"
                            y2={i * 100}
                        />
                    ))}
                </g>

                {/* Flight Paths */}
                <g fill="none" filter="url(#flightGlow)">
                    <path
                        d="M 220 190 C 420 120 580 140 720 170"
                        stroke="#F5A623"
                        strokeWidth="2"
                        strokeDasharray="6 8"
                        opacity="0.6"
                    />
                    <path
                        d="M 520 170 C 650 220 760 260 840 310"
                        stroke="#00ADEF"
                        strokeWidth="2"
                        strokeDasharray="6 8"
                        opacity="0.6"
                    />
                </g>
            </svg>

            {/* Office Location Pins */}
            {OFFICES.map((office) => {
                const pos = getPosition(office.city);
                const isHovered = hoveredOffice?.id === office.id;
                const isSelected = selectedOffice?.id === office.id;

                return (
                    <div
                        key={office.id}
                        className="absolute cursor-pointer z-10 group/pin"
                        style={{ top: pos.top, left: pos.left }}
                        onMouseEnter={() => setHoveredOffice(office)}
                        onMouseLeave={() => setHoveredOffice(null)}
                        onClick={() => handlePinClick(office)}
                    >
                        {/* Pin Ripple Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="h-12 w-12 bg-[#00ADEF] rounded-full opacity-20 animate-ping" />
                        </div>

                        {/* Pin Icon */}
                        <div className="relative">
                            <MapPin
                                className={`h-10 w-10 drop-shadow-lg transition-all duration-300 ${
                                    isHovered || isSelected
                                        ? "scale-125 text-[#F5A623]"
                                        : "scale-100 text-[#00ADEF]"
                                }`}
                                fill="white"
                                strokeWidth={2.5}
                            />

                            {/* Hover Tooltip */}
                            {isHovered && (
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-100 transition-opacity whitespace-nowrap bg-white px-4 py-2.5 rounded-xl shadow-2xl border border-gray-200 z-20 min-w-[200px]">
                                    <p className="text-sm font-bold text-[#333333] mb-1">
                                        {office.airlineName}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-2">
                                        {office.city}, {office.country}
                                    </p>
                                    <p className="text-xs text-[#00ADEF] font-semibold">
                                        Click for details
                                    </p>
                                    {/* Tooltip Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                                        <div className="border-8 border-transparent border-t-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Selected Office Card */}
            {selectedOffice && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative transform transition-all animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setSelectedOffice(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="mb-4">
                            <span className="inline-block bg-[#F5A623] text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-3">
                                {selectedOffice.airlineName}
                            </span>
                            <h3 className="text-2xl font-bold text-[#333333] mb-2">
                                {selectedOffice.city} Office
                            </h3>
                            <p className="text-sm text-gray-600">
                                {selectedOffice.country}
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="h-5 w-5 text-[#00ADEF] flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">
                                    {selectedOffice.address}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-gray-900 font-semibold">
                                    📞 {selectedOffice.phone}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-gray-700">
                                    🕒 {selectedOffice.hours}
                                </span>
                            </div>
                        </div>

                        {selectedOffice.description && (
                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                {selectedOffice.description}
                            </p>
                        )}

                        <button
                            onClick={() => handleViewOffice(selectedOffice.id)}
                            className="w-full bg-gradient-to-r from-[#00ADEF] to-[#0096d6] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            View Full Details
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-20">
                <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-[#333333] mb-1">
                            Global Network Coverage
                        </h3>
                        <p className="text-xs text-gray-600">
                            {OFFICES.length}+ verified airline offices worldwide
                        </p>
                    </div>
                    <button
                        onClick={handleExploreClick}
                        className="bg-gradient-to-r from-[#00ADEF] to-[#0096d6] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                        Explore All Locations
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorldMap;
