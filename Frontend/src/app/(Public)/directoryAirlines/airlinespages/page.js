// Server Component - handles listing page
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Dynamic metadata for SEO
export async function generateMetadata() {
  return {
    title: "Airline Offices Directory | Find Airline Offices Worldwide",
    description: "Find airline offices worldwide. Get addresses, phone numbers, working hours and locations for all major airlines.",
    keywords: "airline offices, airline office directory, airline contact, airline customer service",
    alternates: {
      canonical: "/directoryAirlines/airlinespages"
    },
  };
}

// Generate static params for build-time optimization
export async function generateStaticParams() {
  try {
    const response = await fetch(`${API_BASE}/api/offices?limit=1000`);
    const data = await response.json();
    
    return data.data?.map((office) => ({
      slug: office.slug,
    })) || [];
  } catch (error) {
    return [];
  }
}

export default async function AirlinesPagesListing() {
  return {
    redirect: {
      destination: '/directoryAirlines',
      permanent: false,
    },
  };
}