import { notFound } from "next/navigation";
import OfficeTemplate from "@/airlinespages/templets";
import CallBanner from "@/components/callbanner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function OfficeStructuredData({ office }) {
  if (!office || !office.airline) return null;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${office.airline?.airlineName} ${office.officeOverview?.city} Office`,
    "description": office.aboutOffice?.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": office.officeOverview?.address,
      "addressLocality": office.officeOverview?.city,
      "addressCountry": office.officeOverview?.country
    },
    "telephone": office.officeOverview?.phone,
    "openingHours": office.officeOverview?.hours ? 
      `Mo-Su ${office.officeOverview.hours.start}-${office.officeOverview.hours.end}` : undefined,
    "image": office.photo ? `${API_BASE}${office.photo}` : undefined,
    "url": `https://airlines-offices.com/directoryAirlines/airlinespages/${office.slug}`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const response = await fetch(`${API_BASE}/api/offices/${slug}`, {
      next: { revalidate: 3600 }
    });
    const data = await response.json();
    
    if (!data.success) return { title: "Office Not Found" };
    
    const { officeOverview, airline } = data.data;
    
    return {
      title: `${airline?.airlineName} ${officeOverview?.city} Office | Contact & Hours`,
      description: `Find ${airline?.airlineName} ${officeOverview?.city} office address, phone number, working hours, and location.`,
      keywords: `${airline?.airlineName} ${officeOverview?.city}, ${airline?.airlineName} office, airline office ${officeOverview?.city}`,
      alternates: {
        canonical: `/directoryAirlines/airlinespages/${slug}`
      },
    };
  } catch (error) {
    return { title: "Office Not Found" };
  }
}

export default async function OfficePage({ params }) {
  const { slug } = await params;
  
  const response = await fetch(`${API_BASE}/api/offices/${slug}`, {
    next: { revalidate: 3600 }
  });
  const data = await response.json();
  
  if (!data.success) {
    notFound();
  }
  
  const office = data.data;

  return (
    <>
      <OfficeStructuredData office={office} />
      
      <OfficeTemplate initialData={office} />
      <div className="pb-10">
        <CallBanner />
      </div>
    </>
  );
}