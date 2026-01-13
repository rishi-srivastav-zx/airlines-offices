"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProfessionalLoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "Email is required";
        if (!emailRegex.test(email)) return "Please enter a valid email";
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 6)
            return "Password must be at least 6 characters";
        return "";
    };

    const handleEmailBlur = () => {
        const error = validateEmail(formData.email);
        setErrors((prev) => ({ ...prev, email: error }));
    };

    const handlePasswordBlur = () => {
        const error = validatePassword(formData.password);
        setErrors((prev) => ({ ...prev, password: error }));
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async () => {
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post(
                "/api/auth/login",
                { email: formData.email, password: formData.password },
                { withCredentials: true }
            );

            const user = res.data.user;

            if (!user) {
                toast.error("Login failed");
                setIsLoading(false);
                return;
            }

            // Store user in localStorage for client-side access
            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(user));
            }

            toast.success("Login successful");
            setShowSuccess(true);

            // Wait a moment for cookie to be set, then redirect using window.location
            // This ensures the cookie is available when the page loads
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 500);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Invalid email or password"
            );
            setErrors((prev) => ({
                ...prev,
                password:
                    err.response?.data?.message ||
                    "Login failed. Please try again.",
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-md">
                {!showSuccess ? (
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-slate-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    className="w-8 h-8"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                Welcome back
                            </h2>
                            <p className="text-slate-600 text-sm">
                                Sign in to your account to continue
                            </p>
                        </div>

                        {/* Form */}
                        <div className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="w-5 h-5 text-slate-400"
                                        >
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        onBlur={handleEmailBlur}
                                        onKeyPress={handleKeyPress}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                                            errors.email
                                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                : "border-slate-300 focus:ring-slate-900 focus:border-slate-900"
                                        }`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="w-5 h-5 text-slate-400"
                                        >
                                            <rect
                                                x="3"
                                                y="11"
                                                width="18"
                                                height="11"
                                                rx="2"
                                                ry="2"
                                            />
                                            <path d="M7 11V7a5 5 0 0110 0v4" />
                                        </svg>
                                    </div>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        onBlur={handlePasswordBlur}
                                        onKeyPress={handleKeyPress}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                                            errors.password
                                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                : "border-slate-300 focus:ring-slate-900 focus:border-slate-900"
                                        }`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="w-5 h-5"
                                            >
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line
                                                    x1="1"
                                                    y1="1"
                                                    x2="23"
                                                    y2="23"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="w-5 h-5"
                                            >
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Options */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.remember}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                remember: e.target.checked,
                                            }))
                                        }
                                        className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                                    />
                                    <span className="ml-2 text-sm text-slate-700">
                                        Remember me
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-sm text-slate-900 hover:text-slate-700 font-medium transition-colors"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="ml-2">
                                            Signing in...
                                        </span>
                                    </div>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-600">
                                Don't have an account?{" "}
                                <a
                                    href="#"
                                    className="text-slate-900 font-medium hover:text-slate-700 transition-colors"
                                >
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="w-8 h-8 text-green-600"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            Success!
                        </h3>
                        <p className="text-slate-600">
                            Redirecting to your dashboard...
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}
