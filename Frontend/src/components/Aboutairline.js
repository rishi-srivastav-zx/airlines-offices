
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

export default function AboutAirline({ officeId, officeSlug, airlineName, city }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/api/offices/${officeSlug || officeId}`,
        );
        setData(response.data.data.about);
        setError(null);
      } catch (err) {
        console.error("Error fetching office data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (officeSlug || officeId) {
      fetchAboutData();
    }
  }, [officeSlug]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg sm:p-8 p-4 shadow-xl border border-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg sm:p-8 p-4 shadow-xl border border-gray-100">
        <p className="text-red-600">
          Error loading office information: {error}
        </p>
      </div>
    );
  }

  // No data state - show a message instead of returning null
  if (!data) {
    return (
      <div className="bg-white rounded-lg sm:p-8 p-4 shadow-xl border border-gray-100">
        <h2 className="sm:text-3xl text-xl font-bold text-[#333333] mb-4">
          About {airlineName} {city} Office
        </h2>
        <p className="text-gray-600 sm:text-lg text-sm">
          No additional information is available for this office at the moment.
        </p>
      </div>
    );
  }

  // Check if there's any content to display
  const hasContent =
    data?.overview ||
    data?.network ||
    data?.fleet ||
    data?.cabins ||
    data?.alliance ||
    data?.services ||
    data?.baggage ||
    data?.loyalty ||
    data?.airportServices ||
    data?.targetCustomers ||
    data?.support ||
    data?.description ||
    data?.history ||
    data?.location ||
    data?.additionalInfo;

  if (!hasContent) {
    return (
      <div className="bg-white rounded-lg sm:p-8 p-4 shadow-xl border border-gray-100">
        <h2 className="sm:text-3xl text-xl font-bold text-[#333333] mb-4">
          About {airlineName} {city} Office
        </h2>
        <p className="text-gray-600 sm:text-lg text-sm">
          No detailed information is available for this office at the moment.
        </p>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-lg sm:p-8 p-4 shadow-xl border border-gray-100">
      <h2 className="sm:text-3xl text-xl font-bold text-[#333333] mb-4">
        About {airlineName} {city} Office
      </h2>

      {/* Always visible */}
      {data?.location && (
        <p className="text-gray-600 sm:text-lg text-sm mb-4">
          The {airlineName} {city} office is located at {data.location}.
        </p>
      )}

      {/* Collapsible Preview */}
      <div
        className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[1200px] opacity-100" : "max-h-48 opacity-90"
        }`}
      >
        <div className="space-y-3 sm:text-lg text-sm text-gray-600 text-justify">
          {data?.description && <p>{data.description}</p>}
          {data?.overview && <p>{data.overview}</p>}
          {data?.history && <p>{data.history}</p>}
          {data?.network && <p>{data.network}</p>}
          {data?.fleet && <p>{data.fleet}</p>}
          {data?.cabins && <p>{data.cabins}</p>}
          {data?.alliance && <p>{data.alliance}</p>}
          {data?.services && <p>{data.services}</p>}
          {data?.baggage && <p>{data.baggage}</p>}
          {data?.loyalty && <p>{data.loyalty}</p>}
          {data?.airportServices && <p>{data.airportServices}</p>}
          {data?.targetCustomers && <p>{data.targetCustomers}</p>}
          {data?.support && <p>{data.support}</p>}
          {data?.additionalInfo && <p>{data.additionalInfo}</p>}
        </div>

        {/* Fade overlay when collapsed */}
        {!open && (
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="mt-4 flex items-center gap-2 text-[#00ADEF] font-semibold text-lg hover:underline"
      >
        {open ? "Read less" : "Read more"}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
    </div>
  );
}
