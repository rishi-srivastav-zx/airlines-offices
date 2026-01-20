"use client";

import Footer from "@/app/footer";
import Navbar from "@/app/navbar";
import { useParams } from "next/navigation";

export default function AirlinePage() {
    const { slug } = useParams(); // ✅ correct

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold">Airline Office ID: {slug}</h1>
            </div>
            <Footer />
            
        </>
    );
}
