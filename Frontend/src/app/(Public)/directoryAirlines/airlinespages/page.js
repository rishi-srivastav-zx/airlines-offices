"use client";

import Footer from "@/app/footer";
import Navbar from "@/app/navbar";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";

export default function AirlinePage() {
    const { slug } = useParams();
    const [office, setOffice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffice = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/offices/${slug}`);
                const data = await response.json();
                if (data.success) {
                    setOffice(data.data);
                }
            } catch (error) {
                console.error("Error fetching office:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchOffice();
        }
    }, [slug]);

    const breadcrumbTitle = office?.officeOverview?.airlineName || "Airline Office";

    return (
        <>
            <Navbar />
            <Breadcrumb currentTitle={breadcrumbTitle} />
            <div className="p-6">
                {loading ? (
                    <div className="text-center">Loading airline information...</div>
                ) : office ? (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">
                            {office.officeOverview.airlineName}
                        </h1>
                        {/* Add other office details here */}
                    </div>
                ) : (
                    <div className="text-center text-red-500">
                        Airline office not found
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
