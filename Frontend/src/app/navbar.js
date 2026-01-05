"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plane, Menu, X } from "lucide-react";
import { AIRLINES } from "@/components/constdata";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="flex items-center space-x-2 group"
                            >
                                <Plane className="h-8 w-8 text-[#00ADEF] transform group-hover:rotate-12 transition-transform" />
                                <span className="text-2xl font-bold tracking-tight">
                                    <span className="text-[#333333]">
                                        Airlines
                                    </span>
                                    <span className="text-[#00ADEF]">
                                        -Office
                                    </span>
                                </span>
                            </Link>
                        </div>

                        <div className="hidden lg:flex items-center space-x-6">
                            {AIRLINES.slice(0, 7).map((airline) => (
                                <Link
                                    key={airline.id}
                                    href={`/directory?airline=${airline.id}`}
                                    className="text-sm font-semibold text-[#333333] hover:text-[#00ADEF] transition-colors"
                                >
                                    {airline.name}
                                </Link>
                            ))}
                            <Link
                                href="/directory"
                                className="text-sm font-semibold text-[#333333] hover:text-[#00ADEF]"
                            >
                                All Airlines
                            </Link>
                            <Link
                                href="/blog"
                                className="text-sm font-semibold text-[#333333] hover:text-[#00ADEF]"
                            >
                                Blog
                            </Link>
                        </div>

                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-500 hover:text-[#00ADEF]"
                            >
                                {isOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
                        {AIRLINES.map((airline) => (
                            <Link
                                key={airline.id}
                                href={`/directory?airline=${airline.id}`}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00ADEF] hover:bg-gray-50"
                                onClick={() => setIsOpen(false)}
                            >
                                {airline.name}
                            </Link>
                        ))}
                        <Link
                            href="/blog"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00ADEF] hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Blog
                        </Link>
                    </div>
                )}
            </nav>
        </>
    );
}
