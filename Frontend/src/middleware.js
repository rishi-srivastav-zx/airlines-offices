import { NextResponse } from "next/server";

// Simple protection: require a "token" cookie to access /dashboard routes.
// Detailed role-based checks are handled on the backend.
export function middleware(req) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/dashboard")) {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
