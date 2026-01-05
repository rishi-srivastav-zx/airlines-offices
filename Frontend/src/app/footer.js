"use client";

import React from "react";
import Link from "next/link";
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
} from "lucide-react";

export default function Footer() {
    return (
        <>
            <footer className="bg-[#333333] text-white pt-12 pb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {/* About */}
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <span className="text-2xl font-bold">
                                    <span className="text-white">Airlines</span>
                                    <span className="text-[#00ADEF]">
                                        -Office
                                    </span>
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Your reliable companion for finding airline
                                contact and location details across the globe.
                                We simplify travel support.
                            </p>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="hover:text-[#00ADEF] transition-colors"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    className="hover:text-[#00ADEF] transition-colors"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    className="hover:text-[#00ADEF] transition-colors"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-6">
                                Quick Links
                            </h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li>
                                    <Link
                                        href="/directory"
                                        className="hover:text-white"
                                    >
                                        Airlines Directory
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/blog"
                                        className="hover:text-white"
                                    >
                                        Travel Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="hover:text-white"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Support */}
                        <div>
                            <h4 className="text-lg font-bold mb-6">
                                Contact Support
                            </h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li className="flex items-center space-x-3">
                                    <Phone className="h-4 w-4 text-[#F5A623]" />
                                    <span>+1-833-842-6011 (Toll-Free)</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Mail className="h-4 w-4 text-[#F5A623]" />
                                    <span>info@airlines-office.com</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <MapPin className="h-4 w-4 text-[#F5A623] mt-1" />
                                    <span>
                                        Worldwide Coverage from our Remote
                                        Support Hubs
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-lg font-bold mb-6">
                                Newsletter
                            </h4>
                            <p className="text-sm text-gray-400 mb-4">
                                Stay updated with the latest travel insights.
                            </p>
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="bg-gray-800 border-none rounded-md px-4 py-2 text-white text-sm focus:ring-2 focus:ring-[#00ADEF]"
                                />
                                <button className="bg-[#00ADEF] hover:bg-[#007bbd] text-white font-bold py-2 rounded-md text-sm transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <p className="text-xs text-center text-gray-500 italic mb-4">
                            Disclaimer: Airlines-Office.com is an independent
                            directory and is not affiliated with, endorsed by,
                            or sponsored by any airline mentioned.
                        </p>
                        <p className="text-xs text-center text-gray-500">
                            Copyright &copy; 2025 Airlines-Office.com. All
                            Rights Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
