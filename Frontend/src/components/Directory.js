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
} from "lucide-react";
import OfficeCard from "@/components/officeCard";
import SafeImage from "@/components/safeImage";
import { getOffices } from "@/api/offices";
import toast from "react-hot-toast";

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

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const data = await getOffices();
        setOffices(data);
        const uniqueAirlines = [
          ...new Map(
            data.map((item) => [
              item.about.airlineId,
              {
                id: item.about.airlineId,
                name: item.officeOverview.airlineName,
              },
            ]),
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
        office.officeOverview.airlineName

          .toLowerCase()

          .includes(search.toLowerCase()) ||
        office.officeOverview.address
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesAirline =
        !selectedAirline || office.about.airlineId === selectedAirline;

      const matchesCountry =
        !selectedCountry || office.officeOverview.country === selectedCountry;

      return matchesSearch && matchesAirline && matchesCountry;
    });
  }, [search, selectedAirline, selectedCountry, offices]);

  const countries = useMemo(() => {
    const set = new Set(offices.map((o) => o.officeOverview.country));

    return Array.from(set).sort();
  }, [offices]);

  const activeFiltersCount = [selectedAirline, selectedCountry, search].filter(
    Boolean,
  ).length;

  const handleReset = () => {
    setSearch("");
    setSelectedAirline("");
    setSelectedCountry("");
    router.push("/directory");
  };

  const handleOfficeClick = (slug) => {
    router.push(`/directoryAirlines/airlinespages/${slug}`);
  };

  const StatBox = ({ value, label }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <p className="text-3xl font-bold text-white mb-1">{value}</p>

      <p className="text-blue-100 text-sm">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header */}

      <div className="relative py-16 px-4 shadow-xl mb-8 overflow-hidden">
        {/* Flight Background Image */}

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1569629743817-70d8db6c323b?auto=format&fit=crop&w=2000&q=80')",
          }}
        />

        {/* Light Effects */}

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>

          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-white text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Airline Office Directory
            </h1>

            <p className="text-blue-50 text-lg md:text-xl max-w-2xl">
              Browse our comprehensive verified list of airline contact details
              worldwide.
            </p>
          </div>

          {/* Quick Stats */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatBox value={`${offices.length}+`} label="Office Locations" />

            <StatBox value={`${airlines.length}+`} label="Airlines" />

            <StatBox value={`${countries.length}+`} label="Countries" />

            <StatBox value="24/7" label="Support Available" />
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10">
        {/* Mobile Filter Toggle */}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between font-semibold text-gray-700"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#00ADEF]" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-[#00ADEF] text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </span>

          <span className="text-sm text-gray-500">
            {showFilters ? "Hide" : "Show"}
          </span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}

          <aside
            className={`lg:w-1/4 space-y-6 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-2xl p-4 mx-4 shadow-sm border border-gray-200 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-[#00ADEF]" />

                  <h3 className="font-bold text-lg text-gray-900">
                    Filter Results
                  </h3>
                </div>

                {activeFiltersCount > 0 && (
                  <span className="bg-[#00ADEF] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>

              {/* Search Input */}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="City, airline, country..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-[#00ADEF] focus:border-transparent outline-none transition-all text-sm"
                  />

                  {search ? (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <Search className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Airline Filter */}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Airline
                </label>

                <select
                  value={selectedAirline}
                  onChange={(e) => setSelectedAirline(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#00ADEF] focus:border-transparent outline-none text-sm"
                >
                  <option value="">All Airlines</option>

                  {airlines.map((airline) => (
                    <option key={airline.id} value={airline.id}>
                      {airline.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>

                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#00ADEF] focus:border-transparent outline-none text-sm"
                >
                  <option value="">All Countries</option>

                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}

              {activeFiltersCount > 0 && (
                <button
                  onClick={handleReset}
                  className="w-full py-3 text-sm font-semibold text-[#00ADEF] border-2 border-[#00ADEF] rounded-xl hover:bg-blue-50 transition-all"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            {/* Help Card */}

            <div className="bg-gradient-to-br from-[#00ADEF]/10 to-[#00ADEF]/5 rounded-2xl p-6 border border-[#00ADEF]/20">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-[#00ADEF]" />
              </div>

              <h4 className="font-bold mb-2 text-gray-900">
                Need Help Finding an Office?
              </h4>

              <p className="text-sm text-gray-600 mb-4">
                Our global support team is available 24/7 to assist you.
              </p>

              <button className="w-full bg-[#333333] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#222222] transition-all shadow-lg">
                Contact Support
              </button>
            </div>
          </aside>

          {/* Results Area */}

          <main className="lg:w-3/4">
            {/* Results Header */}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div>
                <p className="text-gray-600 font-medium">
                  Showing{" "}
                  <span className="text-[#00ADEF] font-bold text-lg">
                    {filteredOffices.length}
                  </span>{" "}
                  office
                  {filteredOffices.length !== 1 ? "s" : ""}
                </p>

                {activeFiltersCount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {activeFiltersCount} filter
                    {activeFiltersCount !== 1 ? "s" : ""} applied
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 mr-2 hidden sm:inline">
                  View:
                </span>

                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-[#00ADEF] text-white shadow-lg"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                  title="Grid View"
                >
                  <Grid className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-[#00ADEF] text-white shadow-lg"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                  title="List View"
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Results Grid/List */}

            {loading ? (
              <p>Loading...</p>
            ) : filteredOffices.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredOffices.map((office) =>
                  viewMode === "grid" ? (
                    <OfficeCard key={office.slug} office={office} />
                  ) : (
                    <div
                      key={office.slug}
                      onClick={() => handleOfficeClick(office.slug)}
                      className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:border-[#00ADEF] hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <SafeImage
                            src={office.photo}
                            alt={`${office.officeOverview.airlineName} ${office.officeOverview.city}`}
                            className="w-full h-full object-cover"
                            fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=200"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 group-hover:text-[#00ADEF] transition-colors mb-1 truncate">
                            {office.officeOverview.airlineName} -{" "}
                            {office.officeOverview.city}
                          </h4>

                          <p className="text-sm text-gray-600 mb-1">
                            {office.officeOverview.country}
                          </p>

                          <p className="text-xs text-gray-500 truncate hidden sm:block">
                            {office.officeOverview.phone}
                          </p>
                        </div>
                      </div>

                      <button className="bg-gray-100 p-3 rounded-xl group-hover:bg-[#00ADEF] group-hover:text-white transition-all flex-shrink-0 ml-4">
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  ),
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
                  We couldn't find any offices matching your search criteria.
                  Try adjusting your filters or search terms.
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
    </div>
  );
};

export default Directory;
