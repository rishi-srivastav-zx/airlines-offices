import { Suspense } from "react";
import Directory from "@/components/Directory";
import CallBanner from "@/components/callbanner"; 
import { APP_URL } from "@/components/constdata";

export const metadata = {
  title: "Airline Directory | All Airlines Offices Worldwide",
  description:
    "Browse complete airline directory. Find airline offices, contact numbers, addresses, and customer support details by country and city worldwide.",
  
  keywords: [
    "airline directory",
    "all airline offices",
    "international airline contact numbers",
    "airline office list",
    "global airline offices"
  ],

  alternates: {
    canonical: `${APP_URL}/directoryAirlines`,
  },

  openGraph: {
    title: "Airline Directory | Global Airlines Offices",
    description:
      "Explore the complete airline office directory worldwide. Search by airline name or city.",
    url: `${APP_URL}/directoryAirlines`,
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function DirectoryPage() {
  return (
    <>

     {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Global Airlines Directory",
            url: APP_URL,
            description:
              "Airline office contact numbers and addresses worldwide.",
          }),
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <Directory />
      </Suspense>

      <div className="pb-10">
        <CallBanner />
      </div>
    </>
  );
}
