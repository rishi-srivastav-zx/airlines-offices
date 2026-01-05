"use client";

import OfficeTemplate from "@/airlinespages/templets";
import Footer from "@/app/footer";
import Navbar from "@/app/navbar";
import CallBanner from "@/components/callbanner";

export default function OfficePage() {
    return (
        <>
            <Navbar/>
            <OfficeTemplate />
            <Footer/>
            <div className="pb-10">
           
             <CallBanner/>
            </div>
        </>
    );
}
