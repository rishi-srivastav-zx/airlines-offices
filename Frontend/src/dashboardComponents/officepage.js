"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Check,
  Building2,
  Settings,
  FileText,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import slugify from "@/utils/slugifyhelper";

// Helper functions for time
const parseTimeToMinutes = (time) => {
  if (!time || !time.includes(":")) return null;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const formatTime = (time) => {
  if (!time || !time.includes(":")) return "";
  let [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "";
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
};

const formatOfficeHours = (hours) => {
  if (!hours || !hours.start || !hours.end) return "N/A";

  const start = hours.start;
  const end = hours.end;

  const startMin = parseTimeToMinutes(start);
  const endMin = parseTimeToMinutes(end);

  if (startMin === null || endMin === null) return "Invalid Time";

  if (startMin === endMin) {
    return "24 Hours";
  }

  const isOvernight = endMin < startMin;

  return `${formatTime(start)} - ${formatTime(end)}${
    isOvernight ? " (Next day)" : ""
  }`;
};

// API Configuration
const API_BASE_URL = "http://localhost:3001/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== FORM COMPONENT ====================
const InputWrapper = ({ children, error, label, required = false }) => {
  return (
    <div className="space-y-2 group">
      <label className="block text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const AirlineOfficeForm = ({ onClose, onSave, initialData = null }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [formData, setFormData] = useState(
    initialData || {
      slug: "",
      firstName: "",
      logo: "",
      photo: "",
      officeOverview: {
        airlineName: "",
        city: "",
        country: "",
        address: "",
        phone: "",
        hours: {
          start: "",
          end: "",
        },
        website: "",
        tollFreeNumber: "",
      },
      about: {
        airlineId: "",
        description: "",
        history: "",
        services: [],
        additionalInfo: "",
      },
      airportLocation: {
        airportName: "",
        terminalInfo: "",
        iataCode: "",
        counterContact: "",
        airportAddress: "",
      },
      airportMapLocation: {
        latitude: null,
        longitude: null,
        mapQuery: "",
        googleMapsUrl: "",
        embedUrl: "",
      },
      availableServices: [],
      fleetOperations: {
        aircraftTypes: [],
        totalFleet: null,
        additionalDetails: "",
      },
      metadata: {
        rating: null,
        reviewCount: null,
        verified: false,
        lastUpdated: new Date(),
      },
    },
  );

  const steps = useMemo(
    () => [
      { title: "Basic Info", icon: Building2 },
      { title: "Office Details", icon: MapPin },
      { title: "Airport Info", icon: FileText },
      { title: "Location & Map", icon: MapPin },
      { title: "Services & Fleet", icon: Settings },
    ],
    [],
  );

  const validateField = useCallback((name, value) => {
    let error = "";

    // Basic validations
    if (name === "slug" && !value.trim()) error = "Slug is required";
    if (name === "firstName" && !value.trim()) error = "First name is required";

    return error;
  }, []);

  const handleImageChange = (e) => {
    const { name, files } = e.target;

    if (!files || !files[0]) return;

    const file = files[0];

    // Optional: validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Only image files are allowed",
      }));
      return;
    }

    // Optional: validate file size (2MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Image must be under 5MB",
      }));
      return;
    }
    if (name === "logo") {
      setLogoFile(file);
    } else if (name === "photo") {
      setImageFile(file);
    }

    // Show preview
    setFormData((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(file), // Use object URL for preview
    }));
  };

  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => {
        let updated = { ...prev };

        // Handle nested fields (parent.child)
        if (name.includes(".")) {
          const keys = name.split(".");
          let temp = updated;

          keys.forEach((key, index) => {
            if (index === keys.length - 1) {
              temp[key] = newValue;
            } else {
              temp[key] = { ...temp[key] };
              temp = temp[key];
            }
          });
        } else {
          updated[name] = newValue;
        }

        // 🔥 Auto-generate slug from firstName
        if (name === "firstName" && !isSlugManual) {
          updated.slug = slugify(newValue);
        }

        return updated;
      });

      // Validation
      if (touched[name]) {
        const err = validateField(name, newValue);
        setErrors((prev) => ({ ...prev, [name]: err }));
      }
    },
    [touched, validateField, isSlugManual],
  );

  const handleArrayInputChange = useCallback((parent, value) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      [parent]: array,
    }));
  }, []);

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    },
    [validateField],
  );

  const nextStep = () => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionFormData = new FormData();

    // Append files if they exist
    if (logoFile) {
      submissionFormData.append("logo", logoFile);
    }
    if (imageFile) {
      submissionFormData.append("image", imageFile);
    }

    // Append the rest of the form data as a JSON string
    submissionFormData.append("officeData", JSON.stringify(formData));

    try {
      await onSave(submissionFormData);
      // The onSave function (handleSave in parent) will handle closing the modal and refreshing data
    } catch (err) {
      // Error is already handled and toasted in handleSave
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const officeHours = useMemo(() => {
    return formatOfficeHours(formData?.officeOverview?.hours);
  }, [formData?.officeOverview?.hours]);

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper
                label="Slug (URL-friendly ID)"
                required
                error={errors.slug}
              >
                <input
                  type="text"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={(e) => {
                    setIsSlugManual(true);
                    handleInputChange(e);
                  }}
                  onBlur={handleBlur}
                  className="input-ui text-gray-900"
                  placeholder="e.g., emirates-dubai-office"
                />
              </InputWrapper>
              <InputWrapper
                label="First Name"
                required
                error={errors.firstName}
              >
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="input-ui text-gray-900"
                />
              </InputWrapper>{" "}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <InputWrapper label="Logo" required error={errors.logo}>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input-ui text-gray-900"
                />

                {formData.logo && (
                  <img
                    src={
                      formData.logo.startsWith("blob:")
                        ? formData.logo
                        : `http://localhost:3001${formData.logo}`
                    }
                    alt="Logo Preview"
                    className="mt-3 h-20 object-contain rounded"
                  />
                )}
              </InputWrapper>

              {/* Photo Upload */}
              <InputWrapper label="Photo" required error={errors.photo}>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input-ui text-gray-900"
                />

                {formData.photo && (
                  <img
                    src={
                      formData.photo.startsWith("blob:")
                        ? formData.photo
                        : `http://localhost:3001${formData.photo}`
                    }
                    alt="Photo Preview"
                    className="mt-3 h-32 object-cover rounded"
                  />
                )}
              </InputWrapper>
            </div>

            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="metadata.verified"
                checked={formData.metadata.verified}
                onChange={handleInputChange}
                className="w-4 h-4 text-gray-900"
              />
              <span className="flex items-center gap-2 text-gray-900 font-semibold">
                <Sparkles className="text-yellow-500" size={18} />
                Verified Office
              </span>
            </label>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Airline Name" required>
                <input
                  name="officeOverview.airlineName"
                  value={formData.officeOverview.airlineName || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                />
              </InputWrapper>

              <InputWrapper label="City" required>
                <input
                  name="officeOverview.city"
                  value={formData.officeOverview.city || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                />
              </InputWrapper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Country" required>
                <input
                  name="officeOverview.country"
                  value={formData.officeOverview.country || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                />
              </InputWrapper>

              <InputWrapper label="Phone" required>
                <input
                  name="officeOverview.phone"
                  value={formData.officeOverview.phone || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                />
              </InputWrapper>
            </div>

            <InputWrapper label="Address" required>
              <textarea
                name="officeOverview.address"
                value={formData.officeOverview.address || ""}
                onChange={handleInputChange}
                className="input-ui text-gray-900"
                rows={3}
              />
            </InputWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Office Hours" required>
                <div className="relative group">
                  <div className="flex items-center gap-6 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 px-6 py-5 transition-all duration-200 hover:border-blue-300 hover:shadow-md focus-within:border-blue-500 focus-within:shadow-lg focus-within:ring-4 focus-within:ring-blue-100">
                    <div className="flex flex-col flex-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="officeOverview.hours.start"
                        value={formData.officeOverview.hours.start || ""}
                        onChange={handleInputChange}
                        className="w-full bg-transparent text-lg font-semibold text-gray-900 outline-none cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-center pt-6">
                      <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                    </div>

                    <div className="flex flex-col flex-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="officeOverview.hours.end"
                        value={formData.officeOverview.hours.end || ""}
                        onChange={handleInputChange}
                        className="w-full bg-transparent text-lg font-semibold text-gray-900 outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </InputWrapper>

              {officeHours && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-0.5">
                    <div className="bg-white rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Current Schedule
                          </p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {officeHours}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Your office will be available during these hours
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <InputWrapper label="Website" required>
                <input
                  name="officeOverview.website"
                  value={formData.officeOverview.website || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                  placeholder="https://example.com"
                />
              </InputWrapper>
            </div>

            <InputWrapper label="Toll Free Number">
              <input
                name="officeOverview.tollFreeNumber"
                value={formData.officeOverview.tollFreeNumber || ""}
                onChange={handleInputChange}
                className="input-ui text-gray-900"
              />
            </InputWrapper>

            <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900">About Section</h3>

              <InputWrapper label="Airline ID" required>
                <input
                  name="about.airlineId"
                  value={formData.about.airlineId || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                />
              </InputWrapper>

              <InputWrapper label="Description" required>
                <textarea
                  name="about.description"
                  value={formData.about.description || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                  rows={4}
                />
              </InputWrapper>

              <InputWrapper label="History">
                <textarea
                  name="about.history"
                  value={formData.about.history || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                  rows={3}
                />
              </InputWrapper>

              <InputWrapper label="Services (comma-separated)">
                <input
                  name="about.services"
                  value={formData.about.services.join(", ")}
                  onChange={(e) =>
                    handleArrayInputChange("about.services", e.target.value)
                  }
                  className="input-ui text-gray-900"
                  placeholder="Ticketing, Baggage, Check-in"
                />
              </InputWrapper>

              <InputWrapper label="Additional Info">
                <textarea
                  name="about.additionalInfo"
                  value={formData.about.additionalInfo || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                  rows={2}
                />
              </InputWrapper>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Airport Name" required>
                <input
                  name="airportLocation.airportName"
                  value={formData.airportLocation.airportName || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                />
              </InputWrapper>

              <InputWrapper label="IATA Code" required>
                <input
                  name="airportLocation.iataCode"
                  value={formData.airportLocation.iataCode || ""}
                  onChange={handleInputChange}
                  className="input-ui text-gray-900"
                  maxLength={3}
                  placeholder="e.g., DXB"
                />
              </InputWrapper>
            </div>

            <InputWrapper label="Terminal Info" required>
              <input
                name="airportLocation.terminalInfo"
                value={formData.airportLocation.terminalInfo || ""}
                onChange={handleInputChange}
                className="input-ui text-gray-900"
                placeholder="e.g., Terminal 3"
              />
            </InputWrapper>

            <InputWrapper label="Counter Contact" required>
              <input
                name="airportLocation.counterContact"
                value={formData.airportLocation.counterContact || ""}
                onChange={handleInputChange}
                className="input-ui text-gray-900"
              />
            </InputWrapper>

            <InputWrapper label="Airport Address">
              <textarea
                name="airportLocation.airportAddress"
                value={formData.airportLocation.airportAddress || ""}
                onChange={handleInputChange}
                className="input-ui text-gray-900"
                rows={3}
              />
            </InputWrapper>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Latitude">
                <input
                  type="number"
                  step="any"
                  name="airportMapLocation.latitude"
                  value={formData.airportMapLocation.latitude || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      airportMapLocation: {
                        ...prev.airportMapLocation,
                        latitude: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      },
                    }))
                  }
                  className="input-ui text-gray-900"
                  placeholder="25.2532"
                />
              </InputWrapper>

              <InputWrapper label="Longitude">
                <input
                  type="number"
                  step="any"
                  name="airportMapLocation.longitude"
                  value={formData.airportMapLocation.longitude || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      airportMapLocation: {
                        ...prev.airportMapLocation,
                        longitude: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      },
                    }))
                  }
                  className="input-ui text-gray-900"
                  placeholder="55.3657"
                />
              </InputWrapper>
            </div>

            <InputWrapper label="Map Query" required>
              <input
                name="airportMapLocation.mapQuery"
                value={formData.airportMapLocation.mapQuery || ""}
                onChange={handleInputChange}
                className="input-ui text-gray-900"
                placeholder="Dubai International Airport"
              />
            </InputWrapper>

            <InputWrapper label="Google Maps URL">
              <input
                name="airportMapLocation.googleMapsUrl"
                value={formData.airportMapLocation.googleMapsUrl || ""}
                onChange={handleInputChange}
                className="input-ui text-gray-900"
              />
            </InputWrapper>

            <InputWrapper label="Embed URL">
              <input
                name="airportMapLocation.embedUrl"
                value={formData.airportMapLocation.embedUrl || ""}
                onChange={handleInputChange}
                className="input-ui text-gray-900"
              />
            </InputWrapper>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <InputWrapper label="Available Services (comma-separated)" required>
              <input
                value={formData.availableServices.join(", ")}
                onChange={(e) =>
                  handleArrayInputChange("availableServices", e.target.value)
                }
                className="input-ui text-gray-900"
                placeholder="Check-in, Baggage, Lounge, Assistance"
              />
            </InputWrapper>

            <div className="space-y-4 p-4 bg-purple-50 rounded-xl">
              <h3 className="font-semibold text-purple-900">
                Fleet Operations
              </h3>

              <InputWrapper label="Aircraft Types (comma-separated)" required>
                <input
                  value={formData.fleetOperations.aircraftTypes.join(", ")}
                  onChange={(e) => {
                    const array = e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean);
                    setFormData((prev) => ({
                      ...prev,
                      fleetOperations: {
                        ...prev.fleetOperations,
                        aircraftTypes: array,
                      },
                    }));
                  }}
                  className="input-ui text-gray-900"
                  placeholder="Boeing 777, Airbus A380"
                />
              </InputWrapper>

              <InputWrapper label="Total Fleet">
                <input
                  type="number"
                  value={formData.fleetOperations.totalFleet || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fleetOperations: {
                        ...prev.fleetOperations,
                        totalFleet: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      },
                    }))
                  }
                  className="input-ui text-gray-900"
                />
              </InputWrapper>

              <InputWrapper label="Additional Details">
                <textarea
                  value={formData.fleetOperations.additionalDetails || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fleetOperations: {
                        ...prev.fleetOperations,
                        additionalDetails: e.target.value,
                      },
                    }))
                  }
                  className="input-ui text-gray-900"
                  rows={3}
                />
              </InputWrapper>
            </div>

            <div className="space-y-4 p-4 bg-green-50 rounded-xl">
              <h3 className="font-semibold text-green-900">Metadata</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label="Rating (0-5)">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.metadata.rating || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        metadata: {
                          ...prev.metadata,
                          rating: e.target.value
                            ? parseFloat(e.target.value)
                            : null,
                        },
                      }))
                    }
                    className="input-ui text-gray-900"
                  />
                </InputWrapper>

                <InputWrapper label="Review Count">
                  <input
                    type="number"
                    value={formData.metadata.reviewCount || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        metadata: {
                          ...prev.metadata,
                          reviewCount: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        },
                      }))
                    }
                    className="input-ui text-gray-900"
                  />
                </InputWrapper>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [
    currentStep,
    formData,
    errors,
    handleInputChange,
    handleBlur,
    handleArrayInputChange,
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <style>{`
                .input-ui {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 12px;
                    border: 2px solid #e5e7eb;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-ui:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out;
                }
            `}</style>

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold text-slate-900">
          {initialData ? "Edit Office" : "Add New Office"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-200 bg-gray-400 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="px-6 py-4 border-b bg-slate-50">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white scale-110"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  <span
                    className={`text-xs mt-2 font-semibold ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">{stepContent}</div>

      {/* Footer */}
      <div className="px-6 py-4 border-t bg-slate-50 flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2.5 font-semibold text-slate-600 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>

        <div className="text-sm text-slate-500 font-medium">
          Step {currentStep + 1} of {steps.length}
        </div>

        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            className="px-8 py-2.5 font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>Submit ✓</>
            )}
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="px-6 py-2.5 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

import { Toaster, toast } from "react-hot-toast";

// ==================== MAIN PAGE COMPONENT ====================

export default function OfficesPage() {
  const [offices, setOffices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  // Fetch offices from API
  const fetchOffices = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
      };

      if (search) {
        params.search = search;
      }

      const response = await api.get("/offices", { params });

      if (response.data.success) {
        setOffices(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch offices");
      console.error("Error fetching offices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOffices(1, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSave = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      let response;
      if (selectedOffice) {
        // Update existing office
        response = await api.put(
          `/offices/${selectedOffice.slug}`,
          formData,
          config,
        );
      } else {
        // Create new office
        response = await api.post("/upload", formData, config);
      }

      if (response.data.success) {
        toast.success(
          `Office ${selectedOffice ? "updated" : "created"} successfully!`,
        );
        await fetchOffices(
          selectedOffice ? pagination.currentPage : 1,
          searchQuery,
        );
        setIsModalOpen(false);
        setSelectedOffice(null);
      } else {
        toast.error(response.data.message || "Failed to save office");
      }
    } catch (err) {
      console.error("Error saving office:", err);
      const errorMessage =
        err.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw err; // Re-throw to be caught by the form's submission handler
    }
  };

  const handleEdit = (office) => {
    setSelectedOffice(office);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedOffice(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this office?")) return;

    try {
      const response = await api.delete(`/offices/${slug}`);
      if (response.data.success) {
        toast.success("Office deleted successfully!");
        await fetchOffices(pagination.currentPage, searchQuery);
      } else {
        toast.error(response.data.message || "Failed to delete office");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };
  const handlePageChange = (newPage) => {
    fetchOffices(newPage, searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Airlines Offices
            </h1>{" "}
            <p className="text-slate-500 mt-1">
              Manage global airline office locations and details.
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus size={20} />
            Add Office
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by airline or city..."
                className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 font-medium text-slate-600 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50">
              <Filter size={16} />
              Filters
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-red-500">
              <AlertCircle size={24} className="mr-2" />
              {error}
            </div>
          ) : offices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Building2 size={48} className="mb-4" />
              <p className="text-lg font-medium">No offices found</p>
              <p className="text-sm mt-2">
                Try adjusting your search or add a new office
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 text-sm uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Airline / Location</th>
                      <th className="px-6 py-4">Contact Info</th>
                      <th className="px-6 py-4">Airport</th>
                      <th className="px-6 py-4">Verified</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {offices.map((office) => (
                      <tr
                        key={office._id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {office.logo && (
                              <img
                                src={`http://localhost:3001${office.logo}`}
                                alt={`${office.officeOverview.airlineName} logo`}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <div className="font-semibold text-slate-900 flex items-center gap-2">
                                {office.officeOverview.airlineName}
                                {office.metadata.verified && (
                                  <Sparkles
                                    className="text-yellow-500"
                                    size={16}
                                  />
                                )}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                <MapPin size={12} />
                                {office.officeOverview.city},{" "}
                                {office.officeOverview.country}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600 flex items-center gap-2">
                            <Phone size={14} className="text-slate-400" />
                            {office.officeOverview.phone}
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            {formatOfficeHours(office.officeOverview.hours)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-700">
                            {office.airportLocation.airportName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {office.airportLocation.iataCode} -{" "}
                            {office.airportLocation.terminalInfo}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {office.metadata.verified ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(office.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(office)}
                              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(office.slug)}
                              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50">
                <div>
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} -{" "}
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems,
                  )}{" "}
                  of {pagination.totalItems} offices
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="p-2 border-2 border-slate-200 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="px-4 py-2 font-medium">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="p-2 border-2 border-slate-200 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <AirlineOfficeForm
              onClose={() => {
                setIsModalOpen(false);
                setSelectedOffice(null);
              }}
              onSave={handleSave}
              initialData={selectedOffice}
            />
          </div>
        )}
      </div>
    </div>
  );
}
