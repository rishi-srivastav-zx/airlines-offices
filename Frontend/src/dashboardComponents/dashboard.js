"use client";
import React from "react";
import {
    Building2,
    FileText,
    Clock,
    Users as UsersIcon,
    TrendingUp,
} from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MOCK_CHART_DATA = [
    { name: "Jan", offices: 4, blogs: 2 },
    { name: "Feb", offices: 7, blogs: 5 },
    { name: "Mar", offices: 5, blogs: 8 },
    { name: "Apr", offices: 12, blogs: 6 },
    { name: "May", offices: 9, blogs: 11 },
    { name: "Jun", offices: 15, blogs: 9 },
];

export const DashboardPage = () => {
    const router = useRouter();

    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                router.push("/login");
                return;
            }
            const user = JSON.parse(userStr);
            if (!user) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Error reading user from localStorage:", error);
            router.push("/login");
        }
    }, [router]);
    const stats = [
        {
            label: "Total Offices",
            value: "124",
            icon: Building2,
            color: "bg-blue-500",
            trend: "+12%",
        },
        {
            label: "Blog Posts",
            value: "48",
            icon: FileText,
            color: "bg-indigo-500",
            trend: "+5%",
        },
        {
            label: "Pending Reviews",
            value: "7",
            icon: Clock,
            color: "bg-amber-500",
            trend: "-2",
        },
        {
            label: "Active Editors",
            value: "12",
            icon: UsersIcon,
            color: "bg-emerald-500",
            trend: "+1",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500">
                        Welcome back. Here's what's happening with SkyWay today.
                    </p>
                </div>
                <div className="flex gap-2 text-xs font-medium bg-white p-1 rounded-lg border shadow-sm">
                    <button className="px-3 py-1 bg-slate-100 rounded">
                        Last 7 Days
                    </button>
                    <button className="px-3 py-1">30 Days</button>
                    <button className="px-3 py-1">12 Months</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className={`${stat.color} p-3 rounded-lg text-white`}
                            >
                                <stat.icon size={24} />
                            </div>
                            <span
                                className={`text-xs font-bold px-2 py-1 rounded ${
                                    stat.trend.startsWith("+")
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                }`}
                            >
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-slate-500 text-sm font-medium">
                                {stat.label}
                            </h3>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">
                            Content Performance
                        </h3>
                        <TrendingUp size={20} className="text-slate-400" />
                    </div>
<div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={MOCK_CHART_DATA}>
                                <defs>
                                    <linearGradient
                                        id="colorOffices"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0.1}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f1f5f9"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow:
                                            "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="offices"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorOffices)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="blogs"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={0}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {[
                            {
                                user: "Sarah Jenkins",
                                action: "submitted new office",
                                target: "Dubai Int Terminal 3",
                                time: "2 mins ago",
                            },
                            {
                                user: "Mike Ross",
                                action: "approved blog post",
                                target: "10 Tips for Solo Travelers",
                                time: "45 mins ago",
                            },
                            {
                                user: "John Doe",
                                action: "rejected office",
                                target: "Paris CDG Office",
                                time: "2 hours ago",
                            },
                            {
                                user: "Sarah Jenkins",
                                action: "created draft",
                                target: "New York JFK Lounge",
                                time: "5 hours ago",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                    {item.user
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-900">
                                        <span className="font-semibold">
                                            {item.user}
                                        </span>{" "}
                                        {item.action}
                                    </p>
                                    <p className="text-xs text-blue-600 font-medium truncate">
                                        {item.target}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                                        {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 px-4 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};
