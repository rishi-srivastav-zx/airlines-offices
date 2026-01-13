import { NextResponse } from "next/server";

export async function POST(req) {
    const body = await req.json();

    const backendRes = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
        return NextResponse.json(data, { status: backendRes.status });
    }

    const token = data.token; // backend must send token in JSON

    if (!token) {
        return NextResponse.json(
            { message: "Token not received from backend" },
            { status: 500 }
        );
    }

    // Forward user data and set cookie
    const response = NextResponse.json({
        message: "Login successful",
        user: data.user, // Forward user data to client
    });

    response.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 24 * 60 * 60, // 1 day
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    return response;
}
