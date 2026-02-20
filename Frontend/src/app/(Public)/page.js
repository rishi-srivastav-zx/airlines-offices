import { APP_URL } from "@/components/constdata";   
import Home from "../home";

export const metadata = {
  metadataBase: new URL(`${APP_URL}`),

  title: "Airline Offices Worldwide 2026 | Contact Numbers & Addresses",
  
  description:
    "Find airline offices worldwide including contact numbers, office addresses, customer care details, and working hours. Updated global airline office directory.",

  applicationName: "Global Airlines Directory",
  category: "travel",

  authors: [{ name: "Global Airlines Directory Team" }],

  keywords: [
    "airline offices worldwide",
    "airline contact number",
    "airline customer care",
    "emirates office address",
    "air india office contact",
    "qatar airways office",
    "airline office near me",
    "international airline directory"
  ],

  alternates: {
    canonical: `${APP_URL}`,
  },

  openGraph: {
    title: "Airline Offices Worldwide 2026 | Global Directory",
    description:
      "Search airline offices by country and city. Get verified contact numbers and office details worldwide.",
    url: `${APP_URL}`,
    siteName: "Global Airlines Directory",
    images: [
      {
        url: "/airline-banner.png",
        width: 1200,
        height: 630,
        alt: "Global Airline Offices Directory",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Airline Offices Worldwide 2026",
    description:
      "Find airline office contact numbers, addresses & support details worldwide.",
    images: ["/airline-banner.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function HomePage() {
  return (
    <>

    {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Airline Offices Worldwide 2026",
            url: APP_URL,
            description:
            "Find airline offices worldwide including contact numbers, office addresses, customer care details, and working hours. Updated global airline office directory.",
          }),
        }}
      />
      <Home />
    </>

  )
}
