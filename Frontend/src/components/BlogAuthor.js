"use client";
import React from "react";

const BlogAuthor = ({ author }) => {
    
    const {
        name = "Travel Expert",
        role = "Content Writer", 
        avatar,
        website,
        facebook,
        twitter,
        linkedin,
        instagram,
        bio = "Passionate about travel and helping people explore the world with confidence and ease."
    } = author || {};
    
    
    const hasSocialLinks = website || facebook || twitter || linkedin || instagram;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Author Image */}
                <div className="flex-shrink-0 relative">
                    {avatar ? (
                        <div className="relative group">
                            <img
                                src={avatar}
                                alt={name}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                            />

                        </div>
                    ) : (
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                <svg
                                    className="w-14 h-14 md:w-20 md:h-20 text-gray-400 dark:text-gray-600"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
                {/* Author Info */}
                <div className="flex-1 text-center md:text-left">
                    <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                            {name}
                        </h3>
                        <p className="text-sm md:text-base font-medium text-blue-600 mb-3">
                            {role}
                        </p>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl">
                            {bio}
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        {(website || website) && (
                            <a
                                href={website || website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                                aria-label="Website"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                    />
                                </svg>
                            </a>
                        )}

                        {(facebook || facebook) && (
                            <a
                                href={facebook || facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800 transition-colors"
                                aria-label="Facebook"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                                </svg>
                            </a>
                        )}

                        {(twitter || twitter) && (
                            <a
                                href={twitter || twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-600 hover:text-sky-800 transition-colors"
                                aria-label="Twitter"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        )}

                        {(linkedin || linkedin) && (
                            <a
                                href={linkedin || linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-900 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                                </svg>
                            </a>
                        )}

                        {(instagram || instagram) && (
                            <a
                                href={instagram || instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-600 hover:text-pink-800 transition-colors"
                                aria-label="Instagram"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogAuthor;