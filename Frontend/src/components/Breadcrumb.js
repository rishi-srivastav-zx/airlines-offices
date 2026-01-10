"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";

export default function Breadcrumb() {
    const pathname = usePathname();
    if (pathname === "/") return null;
    const segments = pathname.split("/").filter(Boolean);
    // ❌ Remove numeric segments (IDs)
    const filteredSegments = segments.filter((segment) =>
        isNaN(Number(segment))
    );
    const crumbs = filteredSegments.map((segment, index) => {
        const href = "/" + filteredSegments.slice(0, index + 1).join("/");
        return {
            label: segment.replace(/-/g, " "),
            href,
        };
    });
    return (
        <nav
            aria-label="Breadcrumb"
            className="sticky top-0 z-40 bg-transparent"
        >
            <ol className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap">
                {/* Home */}
                <li className="flex items-center gap-1">
                    <Home className="w-4 h-4 text-[#00ADEF]" />
                    <Link
                        href="/"
                        className="font-semibold text-gray-700 hover:text-[#00ADEF]"
                    >
                        Home
                    </Link>
                </li>
                {crumbs.map((crumb, index) => (
                    <li key={crumb.href} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {/* 🚫 Last breadcrumb = text only */}
                        {index === crumbs.length - 1 ? (
                            <span className="font-bold text-gray-900 capitalize cursor-default">
                                {crumb.label}
                            </span>
                        ) : (
                            <Link
                                href={crumb.href}
                                className="text-gray-600 hover:text-[#00ADEF] capitalize"
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}