"use client";

import React, { useState, useEffect } from "react";
import AboutAirline from "@/components/Aboutairline";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Plane,
  MapPin,
  Clock,
  Info,
  ExternalLink,
  Layers,
  Star,
  Navigation,
  PhoneOutgoing,
} from "lucide-react";
import {
  OFFICES,
  aircraftByAirline,
  servicesList,
  getAirlineById,
} from "@/components/constdata";
import { officeInquiries } from "@/components/constdata";
import SafeImage from "@/components/safeImage";
import OfficeInquiryList from "@/components/InquiryTable";
import AirlineOfficesSection from "@/components/List";

// InfoTable Component
const InfoTable = ({ icon: Icon, title, rows }) => {
  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 border rounded-lg sm:rounded-xl">
      <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 mb-3 sm:mb-4 md:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
        <div className="w-1 sm:w-1.5 md:w-2 h-5 sm:h-6 md:h-8 bg-blue-600 rounded-full flex-shrink-0"></div>
        {Icon && (
          <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
        )}
        <span className="break-words leading-tight">{title}</span>
      </h2>
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-start py-2 sm:py-3 border-b border-slate-100 last:border-0 gap-1 sm:gap-2 md:gap-4"
          >
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-500 uppercase tracking-tight sm:tracking-tighter sm:min-w-[120px] md:min-w-[140px] flex-shrink-0">
              {row.label}
            </span>
            <div className="sm:text-right sm:ml-auto text-sm sm:text-base md:text-lg font-semibold text-slate-800 break-words w-full sm:w-auto">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// MapSection Component
const MapSection = ({ airlineName, city, address, country }) => {
  const mapQuery = encodeURIComponent(`${address}, ${city}, ${country}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  // Using place search which works without API key for basic embeds
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  // Default rating (you can add this to office data later)
  const rating = 4.0;
  const reviewCount = 606;

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 sm:mb-4 gap-2">
        <h2 className="text-base xs:text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
          <span className="break-words">Office Location Map</span>
        </h2>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center gap-1 w-fit"
        >
          Open in Maps
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        </a>
      </div>

      {/* Map Container */}
      <div className="relative h-[250px] xs:h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {/* Google Maps Embed */}
        <iframe
          src={googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        ></iframe>

        {/* Information Card Overlay */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 bg-white rounded-lg shadow-xl max-w-[calc(100%-1rem)] xs:max-w-[280px] sm:max-w-sm w-full border border-gray-200">
          {/* Office Name */}
          <div className="p-2 xs:p-3 sm:p-4 border-b border-gray-100">
            <h3 className="font-semibold text-slate-800 text-xs xs:text-sm sm:text-base leading-tight break-words">
              {airlineName} - {city}
            </h3>
          </div>

          {/* Address */}
          <div className="p-2 xs:p-3 sm:p-4 border-b border-gray-100">
            <p className="text-[10px] xs:text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
              {address}, {city}, {country}
            </p>
          </div>

          {/* Rating */}
          <div className="p-2 xs:p-3 sm:p-4 border-b border-gray-100 flex flex-wrap items-center gap-1 xs:gap-2">
            <div className="flex items-center gap-0.5 xs:gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    i < Math.floor(rating)
                      ? "fill-orange-400 text-orange-400"
                      : i < rating
                        ? "fill-orange-200 text-orange-200"
                        : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-slate-700">
              {rating}
            </span>
            <span className="text-[10px] xs:text-xs sm:text-sm text-slate-500">
              ({reviewCount} reviews)
            </span>
          </div>

          {/* Actions */}
          <div className="p-2 xs:p-3 sm:p-4 flex flex-col gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium transition-colors"
            >
              <Navigation className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              Directions
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-[10px] xs:text-xs sm:text-sm font-medium text-center"
            >
              View larger map
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const OfficeTemplate = () => {
  const router = useRouter();
  const params = useParams();
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  useEffect(() => {
    if (!params) return;

    const slug = params.slug;
    if (slug) {
      const found = OFFICES.find(
        (o) => slugify(`${o.airlineName} ${o.city}`) === slug,
      );
      if (found) {
        setSelectedOffice(found);
        return;
      }
    }

    if (OFFICES.length > 0) {
      setSelectedOffice(OFFICES[0]);
    }
  }, [params]);

  const handleOfficeSelect = (office) => {
    setSelectedOffice(office);
    const slug = slugify(`${office.airlineName} ${office.city}`);
    router.push(`/directoryAirlines/airlinespages/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  if (!selectedOffice) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Loading office information...
          </p>
        </div>
      </div>
    );
  }

  const airline = getAirlineById(selectedOffice.airlineId);
  const aircraft = aircraftByAirline[selectedOffice.airlineId] || [];

  // Default values for missing fields
  const website =
    airline?.website ||
    `https://www.${selectedOffice.airlineName
      .toLowerCase()
      .replace(/\s+/g, "")}.com`;
  const airportName =
    selectedOffice.airportName ||
    `${selectedOffice.city} International Airport`;
  const airportAddress =
    selectedOffice.airportAddress ||
    `${airportName}, Terminal Information Available`;
  const airportCode =
    selectedOffice.airportCode ||
    selectedOffice.city.substring(0, 3).toUpperCase();
  const airportContact = selectedOffice.airportContact || selectedOffice.phone;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow">
        {/* Hero / Header Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-6 xs:py-8 sm:py-10 md:py-14 lg:py-20 px-3 xs:px-4 sm:px-6">
          <div className="container w-full mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 xs:gap-4 sm:gap-6">
              <div className="flex-shrink-0 ml-8">
                <div className="bg-white rounded-lg p-1.5 xs:p-2 sm:p-1 shadow-2xl md:mt-2 lg:mt-10">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                    {selectedOffice.logo ? (
                      <img
                        src={selectedOffice.logo}
                        alt={`${selectedOffice.airlineName} logo`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-black text-lg xs:text-xl sm:text-2xl md:text-3xl">
                          {selectedOffice.airlineName
                            .substring(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 text-center md:text-left w-full">
                <div className="inline-flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-md px-2 xs:px-2.5 sm:px-3 py-1 rounded-full text-white/80 text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider xs:tracking-widest mb-3 xs:mb-4 sm:mb-6">
                  <span className="flex h-1.5 w-1.5 xs:h-2 xs:w-2 rounded-full bg-blue-300 animate-pulse flex-shrink-0"></span>
                  <span className="whitespace-nowrap">
                    Verified Airline Office Info
                  </span>
                </div>
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 xs:mb-3 sm:mb-4 leading-tight break-words px-2 xs:px-0">
                  {selectedOffice.airlineName} {selectedOffice.city} Office
                </h1>
                <p className="text-blue-50 text-xs xs:text-sm sm:text-base lg:text-lg max-w-2xl mx-auto md:mx-0 opacity-90 leading-relaxed font-medium px-2 xs:px-0">
                  Official contact details, airport coordinates, and headquarter
                  information for {selectedOffice.airlineName} in{" "}
                  {selectedOffice.country}.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Content Container */}
        <div className="container w-full mx-auto px-3 xs:px-4 sm:px-6 -mt-4 xs:-mt-6 sm:-mt-8 md:-mt-12 pb-8 xs:pb-12 sm:pb-16 md:pb-20">
          <div className="grid lg:grid-cols-12 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
            {/* Left Column (Primary Info) */}
            <div className="lg:col-span-8 space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
              {/* Detailed Info Tables */}
              <InfoTable
                icon={Info}
                title="Office Overview"
                rows={[
                  {
                    label: "Address",
                    value: (
                      <span className="text-blue-600 break-words">
                        {selectedOffice.address}
                      </span>
                    ),
                  },
                  {
                    label: "Phone Number",
                    value: selectedOffice.phone,
                  },
                  {
                    label: "Operation Hours",
                    value: (
                      <div className="flex items-center gap-2">
                        <Clock className="text-orange-500 w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" />{" "}
                        <span className="break-words">
                          {selectedOffice.hours}
                        </span>
                      </div>
                    ),
                  },
                  {
                    label: "Official Website",
                    value: (
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 break-all"
                      >
                        <span className="break-all">{website}</span>{" "}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    ),
                  },
                  {
                    label: "TOLL-FREE NUMBER",
                    value: (
                      <Link
                        href="tel:+18338426011"
                        className=" inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 text-lg lg:text-sm font-semibold rounded-lg lg:rounded-xl shadow-md border border-yellow-200 hover:bg-yellow-500 transition-colors whitespace-nowrap"
                      >
                        <PhoneOutgoing className="w-5 h-5 sm:w-[18px] sm:h-[18px] shrink-0" />
                        <span>+1-833-842-6011</span>
                        <span className="hidden sm:inline">(Toll-Free)</span>
                      </Link>
                    ),
                  },
                ]}
              />

              <AboutAirline
                airlineId={selectedOffice.airlineId}
                airlineName={selectedOffice.airlineName}
                city={selectedOffice.city}
              />

              <InfoTable
                icon={Plane}
                title="Airport Location"
                rows={[
                  {
                    label: "Airport Name",
                    value: airportName,
                  },
                  {
                    label: "Terminal Info",
                    value: airportAddress,
                  },
                  {
                    label: "IATA Code",
                    value: (
                      <span className="inline-block bg-slate-800 text-white px-2 py-0.5 rounded text-xs font-mono">
                        {airportCode}
                      </span>
                    ),
                  },
                  {
                    label: "Counter Contact",
                    value: airportContact,
                  },
                ]}
              />

              {/* Map Section */}
              <MapSection
                airlineName={selectedOffice.airlineName}
                city={selectedOffice.city}
                address={selectedOffice.address}
                country={selectedOffice.country}
              />

              <OfficeInquiryList data={officeInquiries} />

              {/* Main Content */}
              <AirlineOfficesSection data={OFFICES} />

              {/* Services Grid */}
              <div className="bg-white p-3 xs:p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-black text-slate-800 mb-3 sm:mb-4 md:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
                  <div className="w-1 sm:w-1.5 md:w-2 h-5 sm:h-6 md:h-8 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <span className="break-words">Available Services</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                  {servicesList.map((service, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 sm:gap-3 group"
                    >
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-blue-200 group-hover:bg-blue-600 transition-colors flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors break-words">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aircraft Types */}
              <div className="bg-slate-800 p-4 xs:p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl text-white shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2 xs:p-3 sm:p-4 opacity-10">
                  <Plane className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl" />
                </div>
                <h2 className="text-lg xs:text-xl sm:text-2xl font-black mb-3 xs:mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 relative z-10">
                  <Layers className="text-blue-400 w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="break-words">Fleet Operations</span>
                </h2>
                <div className="flex flex-wrap gap-1.5 xs:gap-2 relative z-10">
                  {aircraft.map((plane, i) => (
                    <span
                      key={i}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg xs:rounded-xl text-[10px] xs:text-xs sm:text-sm font-medium hover:bg-white/20 transition-all cursor-default break-words"
                    >
                      {plane}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-4 space-y-4 xs:space-y-5 sm:space-y-6">
              {/* Office Image / Featured Content */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <SafeImage
                  src={selectedOffice.image}
                  alt={selectedOffice.city}
                  className="w-full h-40 xs:h-48 sm:h-56 object-cover"
                  fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
                />
                <div className="p-3 xs:p-4 sm:p-6">
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic break-words">
                    "{selectedOffice.description}"
                  </p>
                </div>
              </div>

              {/* Related Offices */}
              <div className="bg-white p-3 xs:p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-sm xs:text-base sm:text-lg font-bold text-slate-800 mb-3 xs:mb-4 sm:mb-5 break-words">
                  Browse More Offices
                </h3>
                <div className="space-y-2 xs:space-y-3">
                  {OFFICES.filter((o) => o.id !== selectedOffice.id).map(
                    (o) => (
                      <button
                        key={o.id}
                        onClick={() => handleOfficeSelect(o)}
                        className="w-full flex items-center gap-2 xs:gap-3 p-2 rounded-lg xs:rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left"
                      >
                        <SafeImage
                          src={o.image}
                          alt={o.city}
                          className="w-12 h-9 xs:w-14 xs:h-10 sm:w-16 sm:h-12 rounded-md xs:rounded-lg object-cover flex-shrink-0"
                          fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
                        />
                        <div className="min-w-0">
                          <p className="text-[9px] xs:text-[10px] sm:text-xs font-bold text-blue-600 leading-tight break-words">
                            {o.airlineName}
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                            {o.city} Office
                          </p>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Newsletter / CTA */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 sticky top-24 p-4 xs:p-5 sm:p-6 md:p-8 rounded-2xl xs:rounded-3xl text-white shadow-2xl shadow-blue-200">
                <h3 className="text-base xs:text-lg sm:text-xl font-black mb-2 sm:mb-3 italic break-words">
                  Need Help?
                </h3>
                <p className="text-xs sm:text-sm text-blue-50 mb-3 xs:mb-4 sm:mb-6 opacity-80 break-words leading-relaxed">
                  Our support team is available 24/7 for urgent ticketing and
                  travel inquiries.
                </p>
                <button className="w-full bg-white flex items-center justify-center gap-2 text-blue-600 font-black py-2.5 xs:py-3 sm:py-4 rounded-xl xs:rounded-2xl hover:bg-blue-50 transition-colors shadow-lg text-xs xs:text-sm sm:text-base text-center">
                  <PhoneOutgoing size={18} className="shrink-0" />
                  <span className="whitespace-nowrap">+1-833-842-6011</span>
                  <span className="font-normal whitespace-nowrap">
                    (Toll-Free)
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficeTemplate;
