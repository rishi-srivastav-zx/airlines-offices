"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OFFICES } from "@/components/constdata";

/* ---------------- OFFICE CARD ---------------- */

const OfficeCard = ({ office }) => {
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

  const slug = slugify(`${office.airlineName} ${office.city}`);

  return (
    <Link href={`/directoryAirlines/airlinespages/${slug}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col cursor-pointer">
        {/* Image */}

        <div className="relative h-50 overflow-hidden bg-gray-100">
          <img
            src={office.image}
            alt={`${office.city} ${office.airlineName} office`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Country Badge */}

          <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-lg shadow">
            <span className="text-sm font-semibold text-[#00ADEF]">
              {office.country}
            </span>
          </div>
        </div>

        {/* Content */}

        <div className="sm:p-6 px-3 py-5  flex-grow bg-white">
          <h3 className="tsm:ext-2xl text-xl font-bold mb-3 text-gray-900 group-hover:text-[#00ADEF] transition-colors">
            {office.city} Office
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-[#00ADEF]" />

              <span className="text-sm text-gray-700">{office.address}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#00ADEF]" />

              <span className="text-sm font-semibold text-gray-900">
                {office.phone}
              </span>
            </div>

            {office.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#00ADEF]" />

                <span className="text-sm text-gray-700 truncate">
                  {office.email}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />

              <span className="text-sm text-gray-700">{office.hours}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ---------------- MAIN SECTION ---------------- */

export default function AirlineOfficesSection() {
  const pathname = usePathname();

  // get current city from URL → /offices/dubai
  const currentCity = pathname?.split("/").pop();

  // remove current office (ex: Dubai)
  const filteredOffices = OFFICES.filter(
    (office) => office.city.toLowerCase() !== currentCity?.toLowerCase(),
  );

  // show only 2
  const visibleOffices = filteredOffices.slice(0, 2);

  return (
    <section className="bg-gradient-to-br  from-blue-50 via-white to-indigo-50 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="sm:text-2xl text-lg font-bold text-yellow-400">
            Qatar Airways Office List
          </h2>

          {filteredOffices.length > 2 && (
            <Link
              href="/directoryAirlines"
              className="text-blue-600 font-semibold hover:underline"
            >
              View All
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-12 gap-6 ">
          {visibleOffices.map((office) => (
            <OfficeCard key={office.id} office={office} />
          ))}
        </div>
      </div>
    </section>
  );
}
