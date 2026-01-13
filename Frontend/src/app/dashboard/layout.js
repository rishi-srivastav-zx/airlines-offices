"use client";

import HeaderBar from "@/dashboardComponents/header";
import { Sidebar } from "@/dashboardComponents/sidebar";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/auth";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
    const router = useRouter();

    useEffect(() => {
        const user = getUser();
        if (!user) {
            router.push("/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        document.cookie = "token=; Max-Age=0; path=/";
        router.push("/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
            {/* Sidebar */}
            <Sidebar handleLogout={handleLogout} />

            {/* Right section */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Header */}
                <HeaderBar />

                {/* Main Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
