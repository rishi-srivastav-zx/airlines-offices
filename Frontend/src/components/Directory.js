"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Grid,
  List as ListIcon,
  ArrowRight,
  X,
  Globe,
  Building2,
  MapPinned,
} from "lucide-react";
import OfficeCard from "@/components/officeCard";
import SafeImage from "@/components/safeImage";
import { getOffices } from "@/api/offices";
import toast from "react-hot-toast";
import { slugify } from "@/utils/slugifyhelper";

const Directory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialAirline = searchParams.get("airline") || "";
  const initialSearch = searchParams.get("q") || "";
  const initialCity = searchParams.get("city") || "";

  const [search, setSearch] = useState(initialSearch || initialCity);
  const [selectedAirline, setSelectedAirline] = useState(initialAirline);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [offices, setOffices] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const data = await getOffices({});
        setOffices(data);
        const uniqueAirlines = [
          ...new Map(
            data
              .filter((item) => item.airline)
              .map((item) => [
                item.airline._id,
                {
                  id: item.airline._id,
                  name: item.airline.airlineName,
                  slug: slugify(item.airline.airlineName),
                },
              ])
          ).values(),
        ];
        setAirlines(uniqueAirlines);
      } catch (error) {
        toast.error("Failed to fetch offices");
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, []);

  const filteredOffices = useMemo(() => {
    return offices.filter((office) => {
      const matchesSearch =
        office.officeOverview.city
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        office.officeOverview.country
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (office.airline?.airlineName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        office.officeOverview.address
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesAirline =
        !selectedAirline ||
        slugify(office.airline?.airlineName || "") === selectedAirline;

      const matchesCountry =
        !selectedCountry || office.officeOverview.country === selectedCountry;

      return matchesSearch && matchesAirline && matchesCountry;
    });
  }, [search, selectedAirline, selectedCountry, offices]);

  const countries = useMemo(() => {
    const set = new Set(offices.map((o) => o.officeOverview.country));
    return Array.from(set).sort();
  }, [offices]);

  const officesByContinent = useMemo(() => {
    const grouped = {};

    filteredOffices.forEach((office) => {
      let continent = office?.officeOverview?.continent;

      if (!continent || typeof continent !== "string") {
        continent = "Unknown";
      }

      continent = continent.trim();

      if (!grouped[continent]) {
        grouped[continent] = [];
      }

      grouped[continent].push(office);
    });

    return grouped;
  }, [filteredOffices]);

  const activeFiltersCount = [
    selectedAirline,
    selectedCountry,
    search,
    websiteUrl,
  ].filter(Boolean).length;

  const handleReset = () => {
    setSearch("");
    setSelectedAirline("");
    setSelectedCountry("");
    setWebsiteUrl("");
    router.push("/directoryAirlines");
  };

  const handleOfficeClick = (slug) => {
    router.push(`/directoryAirlines/airlinespages/${slug}`);
  };

  const StatBox = ({ value, label, icon: Icon }) => (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 flex items-center gap-3">
      <div className="bg-white/30 p-2 rounded-lg">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-white/80 text-xs">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header - Only blur effect, no solid blue */}
      <div className="relative py-12 px-4 shadow-xl mb-6 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1569629743817-70d8db6c323b?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        
        {/* Blur overlay only - no solid color */}
        <div className="absolute inset-0 backdrop-blur-xs bg-black/20" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-white text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-lg">
              Airline Office Directory
            </h1>
            <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto drop-shadow-md">
              Browse our comprehensive verified list of airline contact details worldwide.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <StatBox
              value={`${offices.length}+`}
              label="Office Locations"
              icon={Building2}
            />
            <StatBox value={`${airlines.length}+`} label="Airlines" icon={MapPinned} />
            <StatBox value={`${countries.length}+`} label="Countries" icon={MapPin} />
            <StatBox value="24/7" label="Support Available" icon={Globe} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       {/* Top Filter Bar - Single Line Layout */}
<div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6 relative z-20">
  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
    
    {/* Left Side: Search + Filters */}
    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
      
      {/* Search Input */}
      <div className="relative w-full sm:w-64 lg:w-72">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search city, airline, country..."
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-2 pl-9 pr-8 focus:ring-2 focus:ring-[#00ADEF] focus:border-transparent outline-none transition-all text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Airline Filter */}
      <div className="relative w-full sm:w-40 lg:w-44">
        <select
          value={selectedAirline}
          onChange={(e) => setSelectedAirline(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-[#00ADEF] focus:border-transparent outline-none text-sm appearance-none cursor-pointer"
        >
          <option value="">All Airlines</option>
          {airlines.map((airline) => (
            <option key={airline.id} value={airline.slug}>
              {airline.name}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <Filter className="h-3 w-3" />
        </div>
      </div>

      {/* Country Filter */}
      <div className="relative w-full sm:w-40 lg:w-44">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-[#00ADEF] focus:border-transparent outline-none text-sm appearance-none cursor-pointer"
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <MapPin className="h-3 w-3" />
        </div>
      </div>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200 whitespace-nowrap"
        >
          <X className="h-3 w-3" />
          Clear
          <span className="bg-red-200 text-red-700 text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {activeFiltersCount}
          </span>
        </button>
      )}
    </div>

    {/* Right Side: Results Count + View Toggle */}
    <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
      <span className="text-sm text-gray-600">
        <span className="font-bold text-[#00ADEF]">{filteredOffices.length}</span> results
      </span>
      
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-1.5 rounded-md transition-all ${
            viewMode === "grid"
              ? "bg-white text-[#00ADEF] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
          title="Grid View"
        >
          <Grid className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-1.5 rounded-md transition-all ${
            viewMode === "list"
              ? "bg-white text-[#00ADEF] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
          title="List View"
        >
          <ListIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>

  {/* Active Filters Tags - Below if needed */}
  {activeFiltersCount > 0 && (
    <div className="flex flex-wrap gap-2 items-center mt-3 pt-3 border-t border-gray-100">
      <span className="text-xs text-gray-500 font-medium">Active:</span>
      {search && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
          "{search.length > 20 ? search.substring(0, 20) + '...' : search}"
          <button onClick={() => setSearch("")} className="hover:text-blue-900">
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      {selectedAirline && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
          {airlines.find(a => a.slug === selectedAirline)?.name}
          <button onClick={() => setSelectedAirline("")} className="hover:text-blue-900">
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      {selectedCountry && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
          {selectedCountry}
          <button onClick={() => setSelectedCountry("")} className="hover:text-blue-900">
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
    </div>
  )}
</div>

          {/* Results Area */}
<main className="relative z-10">
  {loading ? (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ADEF]"></div>
    </div>
  ) : filteredOffices.length > 0 ? (
    <div className="space-y-12">
      {Object.entries(officesByContinent)
        .filter(
          ([continent]) =>
            continent && continent !== "Unknown" && continent.trim() !== ""
        )
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([continent, continentOffices]) => (
          <div key={continent}>
            {/* Continent Header - Improved styling */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="h-px bg-gradient-to-r from-transparent via-[#00ADEF]/50 to-[#00ADEF] flex-1 max-w-[100px]"></div>
                <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-md border border-[#00ADEF]/20">
                  <MapPin className="h-5 w-5 text-[#00ADEF]" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    {continent}
                  </h2>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {continentOffices.length}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-l from-transparent via-[#00ADEF]/50 to-[#00ADEF] flex-1 max-w-[100px]"></div>
              </div>
            </div>

            {/* Offices Grid - Optimized for 4 columns with responsive breakpoints */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {continentOffices.map((office) =>
                viewMode === "grid" ? (
                  <OfficeCard key={office.slug} office={office} />
                ) : (
                  <div
                    key={office.slug}
                    onClick={() => handleOfficeClick(office.slug)}
                    className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:border-[#00ADEF] hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={`http://localhost:3001${office.photo}`}
                          alt={`${office.airline?.airlineName || "Office"} ${
                            office.officeOverview.city
                          }`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=200";
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 group-hover:text-[#00ADEF] transition-colors mb-1 truncate text-sm sm:text-base">
                          {office.airline?.airlineName || "Unknown Airline"} -{" "}
                          {office.officeOverview.city}
                        </h4>

                        <p className="text-xs sm:text-sm text-gray-600 mb-1">
                          {office.officeOverview.country}
                        </p>

                        <p className="text-xs text-gray-500 truncate hidden sm:block">
                          {office.officeOverview.phone}
                        </p>
                      </div>
                    </div>

                    <button className="bg-gray-100 p-2.5 sm:p-3 rounded-xl group-hover:bg-[#00ADEF] group-hover:text-white transition-all flex-shrink-0 ml-2 sm:ml-4">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        ))}

      {/* Unknown Continent Section */}
      {officesByContinent["Unknown"] &&
        officesByContinent["Unknown"].length > 0 && (
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-400/50 to-gray-400 flex-1 max-w-[100px]"></div>
                <div className="flex items-center gap-2 bg-gray-50 px-5 py-2.5 rounded-full shadow-md border border-gray-200">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-700">
                    Other Locations
                  </h2>
                  <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {officesByContinent["Unknown"].length}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-l from-transparent via-gray-400/50 to-gray-400 flex-1 max-w-[100px]"></div>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {officesByContinent["Unknown"].map((office) =>
                viewMode === "grid" ? (
                  <OfficeCard key={office.slug} office={office} />
                ) : (
                  <div
                    key={office.slug}
                    onClick={() => handleOfficeClick(office.slug)}
                    className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:border-[#00ADEF] hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <SafeImage
                          src={office.photo}
                          alt={`${office.airline?.airlineName || "Office"} ${
                            office.officeOverview.city
                          }`}
                          className="w-full h-full object-cover"
                          fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=200"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 group-hover:text-[#00ADEF] transition-colors mb-1 truncate text-sm sm:text-base">
                          {office.airline?.airlineName || "Unknown Airline"} -{" "}
                          {office.officeOverview.city}
                        </h4>

                        <p className="text-xs sm:text-sm text-gray-600 mb-1">
                          {office.officeOverview.country}
                        </p>

                        <p className="text-xs text-gray-500 truncate hidden sm:block">
                          {office.officeOverview.phone}
                        </p>
                      </div>
                    </div>

                    <button className="bg-gray-100 p-2.5 sm:p-3 rounded-xl group-hover:bg-[#00ADEF] group-hover:text-white transition-all flex-shrink-0 ml-2 sm:ml-4">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  ) : (
    <div className="bg-white rounded-3xl p-12 md:p-20 text-center shadow-sm border-2 border-dashed border-gray-300">
      <div className="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="h-12 w-12 text-gray-300" />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        No Offices Found
      </h3>

      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        We couldn't find any offices matching your search criteria. Try adjusting your
        filters or search terms.
      </p>

      <button
        onClick={handleReset}
        className="bg-[#00ADEF] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0096d6] transition-all shadow-lg"
      >
        Clear All Filters
      </button>
    </div>
  )}
</main>
      </div>
    </div>
  );
};

export default Directory;