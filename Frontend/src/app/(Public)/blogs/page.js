import BlogPage from "@/components/blogspage";
import CallBanner from "@/components/callbanner";
import { APP_URL } from "@/components/constdata";

export const metadata = {
  title: "Airline Travel Blog | Flight Guides, Policies & Travel Tips",
  
  description:
    "Read the latest airline travel guides, baggage policies, flight change rules, visa information, and airline customer support tips worldwide.",

  keywords: [
    "airline blog",
    "flight travel tips",
    "airline baggage policy",
    "how to change flight ticket",
    "airline customer support guide",
    "travel guides"
  ],

  alternates: {
    canonical: `${APP_URL}/blog`,
  },

  openGraph: {
    title: "Airline Travel Blog | Flight Guides & Tips",
    description:
      "Explore airline travel guides, baggage rules, cancellation policies and support information.",
    url: `${APP_URL}/blog`,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Airline Travel Blog",
    description:
      "Flight guides, baggage policies, travel tips and airline support information.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Blog() {
  return (
    <>
      {/* Blog Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Global Airlines Travel Blog",
            description:
              "Airline travel guides, baggage policies, flight change rules and travel tips.",
            url: `${APP_URL}/blog`,
            publisher: {
              "@type": "Organization",
              name: "Global Airlines Directory",
              url: APP_URL,
            },
          }),
        }}
      />

      <BlogPage />

      <div className="pb-10">
        <CallBanner />
      </div>
    </>
  );
}
