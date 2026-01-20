"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  Mail,
  AlertCircle,
} from "lucide-react";

const OfficeCard = ({ office }) => {
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800";

  // Construct the initial image URL
  // Make sure your backend is serving images from the 'uploads' folder
  // and is running on localhost:3001
  const imageUrl = office.photo
    ? `http://localhost:3001${office.photo}`
    : fallbackImage;

  const handleImageError = (e) => {
    // Prevent infinite loop if fallback also fails
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
      setImageError(true);
    }
  };

  return (
    <Link href={`/directoryAirlines/airlinespages/${office.slug}`}>
      <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col cursor-pointer">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={imageError ? fallbackImage : imageUrl}
            alt={`${office.officeOverview.city} ${office.officeOverview.airlineName} office`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={handleImageError}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Image Error Badge */}
          {imageError && (
            <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="h-4 w-4" />
              <span>Stock Image</span>
            </div>
          )}

          {/* Country Badge - Bottom Left */}
          <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
            <span className="text-sm font-semibold text-[#00ADEF]">
              {office.officeOverview.country}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-grow flex flex-col bg-white">
          {/* Image Notice */}
          {imageError && (
            <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                This is not the actual office image. Showing a placeholder.
              </p>
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#00ADEF] transition-colors duration-300">
            {office.officeOverview.city} Office
          </h3>

          {/* Info List */}
          <div className="space-y-2 flex-grow">
            <div className="flex items-start gap-2">
              <div className="bg-blue-50 p-2.5 rounded-lg flex-shrink-0 mt-0.5">
                <MapPin className="h-5 w-5 text-[#00ADEF]" strokeWidth={2.5} />
              </div>
              <span className="text-sm mt-2 text-gray-700 leading-relaxed">
                {office.officeOverview.address}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-lg flex-shrink-0">
                <Phone className="h-5 w-5 text-[#00ADEF]" strokeWidth={2.5} />
              </div>
              <span className="text-sm text-gray-900 font-semibold">
                {office.officeOverview.phone}
              </span>
            </div>

            {office.email && (
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2.5 rounded-lg flex-shrink-0">
                  <Mail className="h-5 w-5 text-[#00ADEF]" strokeWidth={2.5} />
                </div>
                <span className="text-sm text-gray-700 truncate">
                  {office.email}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="bg-amber-50 p-2.5 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5 text-[#F5A623]" strokeWidth={2.5} />
              </div>
              <span className="text-sm text-gray-700">
                {office.officeOverview.hours.start} -{" "}
                {office.officeOverview.hours.end}
              </span>
            </div>
          </div>

          {/* CTA Link */}
          <div className="inline-flex items-center text-sm font-semibold text-[#00ADEF] mt-2">
            View Details
            <ArrowRight
              className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-300"
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OfficeCard;
