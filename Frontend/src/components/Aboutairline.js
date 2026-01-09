"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { airlineAbout } from "./constdata";

export default function AboutAirline({ airlineId, airlineName, city }) {
    const [open, setOpen] = useState(false);

    const data = airlineAbout[airlineId];
    if (!data) return null;

    return (
        <div className="bg-white rounded-lg sm:p-8 p-4 shadow-xl border border-gray-100">
            <h2 className="sm:text-3xl text-xl font-bold text-[#333333] mb-4">
                About {airlineName} {city} Office
            </h2>

            {/* Always visible */}
            <p className="text-gray-600 sm:text-lg text-sm mb-4">
                The {airlineName} {city} office is located at {data.location}.
            </p>

            {/* Collapsible Preview */}
            <div
                className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
                    open ? "max-h-[1200px] opacity-100" : "max-h-48 opacity-90"
                }`}
            >
                <div className="space-y-3 sm:text-lg text-sm text-gray-600 text-justify">
                    <p>{data.overview}</p>
                    <p>{data.network}</p>
                    <p>{data.fleet}</p>
                    <p>{data.cabins}</p>
                    <p>{data.alliance}</p>
                    <p>{data.services}</p>
                    <p>{data.baggage}</p>
                    <p>{data.loyalty}</p>
                    <p>{data.airportServices}</p>
                    <p>{data.targetCustomers}</p>
                    <p>{data.support}</p>
                </div>

                {/* Fade overlay when collapsed */}
                {!open && (
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent" />
                )}
            </div>

            {/* Toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="mt-4 flex items-center gap-2 text-[#00ADEF] font-semibold text-lg hover:underline"
            >
                {open ? "Read less" : "Read more"}
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
        </div>
    );
}
