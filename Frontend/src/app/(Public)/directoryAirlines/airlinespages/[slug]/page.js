"use client";
import OfficeTemplate from "@/airlinespages/templets";
import CallBanner from "@/components/callbanner";

export default function OfficePage() {
    return (
        <>
            <OfficeTemplate />
            <div className="pb-10">
                <CallBanner />
            </div>
        </>
    );
}
