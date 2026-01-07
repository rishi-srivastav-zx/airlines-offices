"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { airlineAbout } from "./constdata";

export default function AboutAirline({ airlineId, airlineName, city }) {
    const [open, setOpen] = useState(false);

    const data = airlineAbout[airlineId];

    if (!data) return null;

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">
                About {airlineName} {city} Office
            </h2>

            {/* Always visible */}
            <p className="text-gray-600 text-lg mb-4">
                The {airlineName} {city} office is located at {data.location}
            </p>

            {/* Collapsible content */}
            <div
                className={`overflow-hidden transition-all duration-500 ${
                    open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="space-y-3 text-lg text-gray-600">
                    <p>{data.overview}</p>
                    <p>{data.network}</p>
                    <p>{data.fleet}</p>
                    <p>{data.alliance}</p>
                    <p>{data.support}</p>
                </div>
            </div>

            {/* Toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="mt-4 flex items-center gap-2 text-[#00ADEF] font-semibold text-lg hover:underline"
            >
                {open ? "Read less" : "Read more"}
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
        </div>
    );
}
