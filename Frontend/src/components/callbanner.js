import { PhoneOutgoing } from "lucide-react";
import React from "react";
import Link from "next/link";


export default function CallBanner() {
    return (
        <Link href="tel:+18338426011"className="fixed bottom-0 w-full bg-[#FDB515] z-50">
            <div className="flex items-center justify-center gap-2 py-2 px-4 cursor-pointer">
                <PhoneOutgoing size={18} className="text-black shrink-0" />
                <span className="text-black font-semibold text-sm md:text-base">
                 <b>+1-833-842-6011</b> (Toll-Free)
                </span>
            </div>
        </Link>
    );
}
