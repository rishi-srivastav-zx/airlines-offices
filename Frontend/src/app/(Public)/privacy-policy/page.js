"use client";

import React from "react";
import { Shield, Lock, Eye, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Your privacy is important to us. Learn how we protect your data.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                        <p className="text-gray-500 text-sm mb-8">
                            Last updated: February 2025
                        </p>

                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center">
                                    <Lock className="h-6 w-6 text-[#00ADEF] mr-2" />
                                    Information We Collect
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We collect information that you provide directly to us, including when you fill out a contact form, subscribe to our newsletter, or interact with our services. This may include your name, email address, phone number, and any other information you choose to provide.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center">
                                    <Eye className="h-6 w-6 text-[#00ADEF] mr-2" />
                                    How We Use Your Information
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Respond to your comments, questions, and requests</li>
                                    <li>Send you technical notices, updates, and support messages</li>
                                    <li>Communicate with you about products, services, and events</li>
                                    <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center">
                                    <UserCheck className="h-6 w-6 text-[#00ADEF] mr-2" />
                                    Information Sharing
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center">
                                    <Shield className="h-6 w-6 text-[#00ADEF] mr-2" />
                                    Data Security
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. All sensitive information you provide is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our database to be only accessed by those authorized with special access rights to our systems.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#333333] mb-4">
                                    Third-Party Links
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#333333] mb-4">
                                    Changes to Our Privacy Policy
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    If we decide to change our privacy policy, we will post those changes on this page and update the privacy policy modification date above. This policy was last modified on the date indicated at the top of this page.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#333333] mb-4">
                                    Contact Us
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    If you have any questions about this Privacy Policy, please contact us at:
                                </p>
                                <ul className="mt-4 text-gray-600 space-y-2">
                                    <li>Email: info@airlines-office.com</li>
                                    <li>Phone: +1-833-842-6011</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
