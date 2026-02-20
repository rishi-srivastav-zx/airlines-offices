"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Clock,
  ArrowRight,
  Mail,
  AlertCircle,
  Phone,
  ExternalLink,
} from "lucide-react";

const OfficeCard = ({ office }) => {
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800";

  const imageUrl = office.photo
    ? `http://localhost:3001${office.photo}`
    : fallbackImage;

  const handleImageError = (e) => {
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
      setImageError(true);
    }
  };

  const website = office?.officeOverview?.website || office?.website || null;
  const phone = office?.officeOverview?.phone || office?.phone || null;
  const email = office?.officeOverview?.email || office?.email || null;

  // Format hours display
  const hours = office?.officeOverview?.hours;
  const hoursDisplay = hours?.start && hours?.end 
    ? `${hours.start} - ${hours.end}`
    : hours?.start || hours?.end || "Hours not available";

  return (
    <Link 
      href={`/directoryAirlines/airlinespages/${office.slug}`}
      className="block h-full"
    >
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-[#00ADEF]/30">
        {/* Image Section - Optimized aspect ratio for 4-col grid */}
        <div className="relative h-60 sm:h-44 lg:h-40 xl:h-44 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={imageError ? fallbackImage : imageUrl}
            alt={`${office?.officeOverview?.city ?? ""} ${office?.officeOverview?.airlineName ?? ""} office`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={handleImageError}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Stock Image Badge */}
          {imageError && (
            <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5 text-xs font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Stock</span>
            </div>
          )}

          {/* Country Badge */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
            <span className="text-xs font-bold text-[#00ADEF] uppercase tracking-wide">
              {office?.officeOverview?.country ?? "Unknown"}
            </span>
          </div>
        </div>

        {/* Content Section - Compact for 4-col layout */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Stock Image Notice */}
          {imageError && (
            <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 flex items-start gap-2">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-tight">
                Placeholder image shown
              </p>
            </div>
          )}

          {/* Title - Responsive text sizes */}
          <h3 className="text-lg sm:text-base lg:text-sm xl:text-base font-bold mb-2 text-gray-900 group-hover:text-[#00ADEF] transition-colors duration-300 line-clamp-1">
            {office?.officeOverview?.airlineName || "Airline"} - {office?.officeOverview?.city || "City"}
          </h3>

          {/* Address - Truncated for compactness */}
          <div className="flex items-start gap-2 mb-3">
            <div className="bg-blue-50 p-1.5 rounded-md flex-shrink-0 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-[#00ADEF]" strokeWidth={2} />
            </div>
            <p className="text-sm text-gray-900 text-bold leading-relaxed line-clamp-2 flex-1">
              {office?.officeOverview?.address || "Address not available"}
            </p>
          </div>

          {/* Info Grid - 2 columns for compact layout */}
          <div className="grid grid-cols-1 gap-2 mb-3 flex-grow">
            {/* Website */}
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-md flex-shrink-0">
                <Globe className="h-3.5 w-3.5 text-[#00ADEF]" strokeWidth={2} />
              </div>
              <span className="text-sm text-gray-900 text-bold truncate flex-1">
                {website ? (
                  <span className="text-[#00ADEF] hover:underline">{website.replace(/^https?:\/\//, '').substring(0, 25)}{website.length > 25 ? '...' : ''}</span>
                ) : (
                  <span className="text-gray-400 italic">No website</span>
                )}
              </span>
            </div>

            {/* Phone */}
            {phone && (
              <div className="flex items-center gap-2">
                <div className="bg-green-50 p-1.5 rounded-md flex-shrink-0">
                  <Phone className="h-3.5 w-3.5 text-green-600" strokeWidth={2} />
                </div>
                <span className="text-sm text-gray-900 text-bold truncate">
                  {phone}
                </span>
              </div>
            )}

            {/* Hours */}
            <div className="flex items-center gap-2">
              <div className="bg-amber-50 p-1.5 rounded-md flex-shrink-0">
                <Clock className="h-3.5 w-3.5 text-amber-600" strokeWidth={2} />
              </div>
              <span className="text-sm text-gray-900 text-bold truncate">
                {hoursDisplay}
              </span>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#00ADEF] group-hover:text-[#0096d6] transition-colors">
                View Details
              </span>
              <div className="bg-[#00ADEF]/10 group-hover:bg-[#00ADEF] p-2 rounded-lg transition-colors duration-300">
                <ArrowRight className="h-4 w-4 text-[#00ADEF] group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-0.5" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OfficeCard;