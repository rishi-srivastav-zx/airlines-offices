"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight, Mail, Star } from "lucide-react";
import SafeImage from "./safeImage";

const OfficeCard = ({ office }) => {
    return (
        <Link href={`/office/${office.id}`}>
            <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col cursor-pointer">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden bg-gray-100 flex-shrink-0">
                    <SafeImage
                        src={office.image}
                        alt={`${office.city} ${office.airlineName} office`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Country Badge - Bottom Left */}
                    <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                        <span className="text-sm font-semibold text-[#00ADEF]">
                            {office.country}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col bg-white">
                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 group-hover:text-[#00ADEF] transition-colors duration-300">
                        {office.city} Office
                    </h3>

                    {/* Info List */}
                    <div className="space-y-2 flex-grow">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-50 p-2.5 rounded-lg flex-shrink-0 mt-0.5">
                                <MapPin
                                    className="h-5 w-5 text-[#00ADEF]"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <span className="text-sm text-gray-700 leading-relaxed">
                                {office.address}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2.5 rounded-lg flex-shrink-0">
                                <Phone
                                    className="h-5 w-5 text-[#00ADEF]"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <span className="text-sm text-gray-900 font-semibold">
                                {office.phone}
                            </span>
                        </div>

                        {office.email && (
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2.5 rounded-lg flex-shrink-0">
                                    <Mail
                                        className="h-5 w-5 text-[#00ADEF]"
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <span className="text-sm text-gray-700 truncate">
                                    {office.email}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <div className="bg-amber-50 p-2.5 rounded-lg flex-shrink-0">
                                <Clock
                                    className="h-5 w-5 text-[#F5A623]"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <span className="text-sm text-gray-700">
                                {office.hours}
                            </span>
                        </div>
                    </div>


                    {/* CTA Link */}
                    <div className="inline-flex items-center text-sm font-semibold text-[#00ADEF] mt-auto">
                        View Details
                        <ArrowRight
                            className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-300"
                            strokeWidth={2.5}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default OfficeCard;
