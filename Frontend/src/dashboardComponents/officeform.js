"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { 
  X, 
  Save, 
  Upload, 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  Building2,
  Plane,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";
const api = axios.create({
	baseURL: API_BASE_URL,
});

// Dynamically import TinyMCE
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false, loading: () => <div className="h-64 bg-slate-100 animate-pulse rounded-lg" /> }
);

const TINYMCE_CONFIG = {
  height: 250,
  menubar: true,
  plugins: [
    "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
    "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
    "insertdatetime", "media", "table", "code", "help", "wordcount"
  ],
  toolbar: "undo redo | blocks | " +
    "bold italic forecolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | help",
  content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
};

export default function AirlineOfficeForm({ 
  onClose, 
  onSave, 
  initialData = null,
  airlines = [], // List of airlines from parent component
  mode = "edit"
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Cascading Geodata state
  const [selectedAirlineData, setSelectedAirlineData] = useState(null);
  const [availableContinents, setAvailableContinents] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [loadingAirline, setLoadingAirline] = useState(false);
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);

  const [formData, setFormData] = useState({
    // Relation to Airline
    airline: "",
    continent: "",
    country: "",
    city: "",
    
    // Basic Info
    slug: "",
    photo: null,
    photoPreview: null,
    website: "",
    
    // Office Overview
    officeOverview: {
      continent: "",
      country: "",
      city: "",
      address: "",
      phone: "",
      hours: {
        start: "",
        end: ""
      }
    },
    
    // About Office
    aboutOffice: {
      description: "",
      services: "",
      additionalInfo: ""
    },
    
    // Airport Details
    airportLocation: {
      airportName: "",
      terminalInfo: "",
      iataCode: "",
      counterContact: "",
      airportAddress: ""
    },
    
    airportMapLocation: {
      latitude: "",
      longitude: "",
      mapQuery: "",
      googleMapsUrl: "",
      embedUrl: ""
    },
    
    // SEO
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: null,
      ogImagePreview: null
    },
    
    // Metadata
    metadata: {
      verified: false,
      rating: {
        value: 0,
        reviewCount: 0
      }
    }
  });

  // Initialize with existing data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        airline: initialData.airline?._id || initialData.airline || "",
        continent: initialData.continent?._id || initialData.continent || "",
        country: initialData.country?._id || initialData.country || "",
        city: initialData.city?._id || initialData.city || "",
        photoPreview: initialData.photo ? `http://localhost:3001${initialData.photo}` : null,
        seo: {
          ...prev.seo,
          ...initialData.seo,
          ogImagePreview: initialData.seo?.ogImage ? `http://localhost:3001${initialData.seo.ogImage}` : null
        }
      }));
    }
  }, [initialData]);

  // Auto-generate slug based on airline and airport name
  useEffect(() => {
    if (!initialData && !hasManuallyEditedSlug && formData.airline && formData.airportLocation.airportName) {
      const selectedAirline = airlines.find(a => a._id === formData.airline);
      if (selectedAirline) {
        const airportSlug = formData.airportLocation.airportName
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '') // remove special chars
          .replace(/[\s_]+/g, '-')   // replace spaces and underscores with hyphens
          .replace(/^-+|-+$/g, '');   // trim hyphens

        if (airportSlug) {
          const baseSlug = `${selectedAirline.slug}-${airportSlug}-office`;
          setFormData(prev => ({ ...prev, slug: baseSlug }));
        }
      }
    }
  }, [formData.airline, formData.airportLocation.airportName, airlines, initialData, hasManuallyEditedSlug]);

  // Fetch full airline data when airline is selected
  useEffect(() => {
    const fetchAirlineDetails = async () => {
      if (!formData.airline) {
        setSelectedAirlineData(null);
        setAvailableContinents([]);
        setAvailableCountries([]);
        setAvailableCities([]);
        return;
      }

      const selectedAirline = airlines.find(a => a._id === formData.airline);
      if (!selectedAirline) return;

      setLoadingAirline(true);
      try {
        const response = await api.get(`/airlines/${selectedAirline.slug}`);
        if (response.data.success) {
          const airlineFullData = response.data.data;
          setSelectedAirlineData(airlineFullData);
          setAvailableContinents(airlineFullData.continents || []);
          
          // If we have initialData, we might need to populate countries and cities right away
          const continentId = formData.continent || (initialData && (initialData.continent?._id || initialData.continent));
          if (continentId) {
            const filteredCountries = (airlineFullData.countries || []).filter(
              c => (c.continent?._id || c.continent) === continentId
            );
            setAvailableCountries(filteredCountries);

            const countryId = formData.country || (initialData && (initialData.country?._id || initialData.country));
            if (countryId) {
                const filteredCities = (airlineFullData.cities || []).filter(
                    city => (city.country?._id || city.country) === countryId
                );
                setAvailableCities(filteredCities);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching airline details:", error);
        toast.error("Failed to load airline coverage data");
      } finally {
        setLoadingAirline(false);
      }
    };

    fetchAirlineDetails();
  }, [formData.airline, airlines, initialData]);

  // Update available countries when continent selection changes
  useEffect(() => {
    if (!selectedAirlineData) return;

    const continentId = formData.continent;
    if (!continentId) {
      setAvailableCountries([]);
      return;
    }

    const filteredCountries = (selectedAirlineData.countries || []).filter(
      c => (c.continent?._id || c.continent) === continentId
    );
    setAvailableCountries(filteredCountries);
  }, [formData.continent, selectedAirlineData]);

  // Update available cities when country selection changes
  useEffect(() => {
    if (!selectedAirlineData) return;

    const countryId = formData.country;
    if (!countryId) {
      setAvailableCities([]);
      return;
    }

    const filteredCities = (selectedAirlineData.cities || []).filter(
      c => (c.country?._id || c.country) === countryId
    );
    setAvailableCities(filteredCities);
  }, [formData.country, selectedAirlineData]);

  const handleInputChange = (e, section = null, subsection = null) => {
    const { name, value, type, checked } = e.target;
    const actualValue = type === "checkbox" ? checked : value;

    if (subsection) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [name]: actualValue
          }
        }
      }));
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: actualValue
        }
      }));
    } else {
      setFormData(prev => {
        const newState = {
          ...prev,
          [name]: actualValue
        };

        // Track manual slug edits
        if (name === "slug") {
          setHasManuallyEditedSlug(true);
        }

        // Reset geodata if airline changed
        if (name === "airline") {
          newState.officeOverview = {
            ...prev.officeOverview,
            continent: "",
            country: "",
            city: ""
          };
        }
        return newState;
      });
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleGeoChange = (e, field) => {
    const { value } = e.target;
    
    setFormData(prev => {
      const newState = { ...prev };
      const updatedOverview = { ...prev.officeOverview };
      
      // Find the name for the selected ID
      let selectedName = "";
      if (field === "continent") {
        const found = availableContinents.find(c => (c._id || c) === value);
        selectedName = found ? (found.name || found) : "";
        
        newState.continent = value;
        updatedOverview.continent = selectedName;
        
        // Clear downstream
        newState.country = "";
        updatedOverview.country = "";
        newState.city = "";
        updatedOverview.city = "";
      } else if (field === "country") {
        const found = availableCountries.find(c => c._id === value);
        selectedName = found ? found.name : "";
        
        newState.country = value;
        updatedOverview.country = selectedName;
        
        // Clear downstream
        newState.city = "";
        updatedOverview.city = "";
      } else if (field === "city") {
        const found = availableCities.find(c => c._id === value);
        selectedName = found ? found.name : "";
        
        newState.city = value;
        updatedOverview.city = selectedName;
      }
      
      newState.officeOverview = updatedOverview;
      return newState;
    });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (e, field, previewField) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (previewField.includes("seo.")) {
          setFormData(prev => ({
            ...prev,
            seo: {
              ...prev.seo,
              ogImage: file,
              ogImagePreview: reader.result
            }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [field]: file,
            [previewField]: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRichTextChange = (field, content) => {
    setFormData(prev => ({
      ...prev,
      aboutOffice: {
        ...prev.aboutOffice,
        [field]: content
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.airline) newErrors.airline = "Select an airline";
        if (!formData.officeOverview.continent) newErrors.continent = "Select a continent";
        if (!formData.officeOverview.country) newErrors.country = "Select a country";
        if (!formData.officeOverview.city) newErrors.city = "City is required";
        if (!formData.officeOverview.address) newErrors.address = "Address is required";
        break;
      case 2:
        if (!formData.airportLocation.airportName) newErrors.airportName = "Airport name is required";
        if (!formData.airportLocation.iataCode) newErrors.iataCode = "IATA code is required";
        if (!formData.slug) newErrors.slug = "Slug is required";
        break;
      case 3:
        // Optional: Add content validation here if needed
        break;
      case 4:
        if (!formData.seo.metaTitle) newErrors.metaTitle = "Meta title is required";
        if (formData.seo.metaTitle.length > 60) newErrors.metaTitle = "Max 60 characters";
        if (!formData.seo.metaDescription) newErrors.metaDescription = "Meta description is required";
        if (formData.seo.metaDescription.length > 160) newErrors.metaDescription = "Max 160 characters";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      toast.error("Please fix the errors");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      
      // Separate files from other data
      // If photo/ogImage are strings (existing URLs), keep them in finalOfficeData
      // If they are File objects, remove them from JSON and append separately
      
      const officeDataTostringify = { ...formData };
      delete officeDataTostringify.photoPreview;
      delete officeDataTostringify.seo.ogImagePreview;
      
      if (formData.photo instanceof File) {
        delete officeDataTostringify.photo;
        submitData.append("photo", formData.photo);
      }
      
      if (formData.seo.ogImage instanceof File) {
        delete officeDataTostringify.seo.ogImage;
        submitData.append("ogImage", formData.seo.ogImage);
      }

      // Consolidate non-file data (and existing image URLs) into officeData
      submitData.append("officeData", JSON.stringify(officeDataTostringify));
      
      await onSave(submitData);
    } catch (error) {
      console.error("Error saving office:", error);
      toast.error("Failed to save office");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Basic Info", icon: Building2 },
    { id: 2, title: "Airport", icon: Plane },
    { id: 3, title: "Content", icon: MapPin },
    { id: 4, title: "SEO & Status", icon: CheckCircle }
  ];

  return (
		<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
				{/* Header */}
				<div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-bold text-white">
							{initialData ? "Edit Office" : "Add New Office"}
						</h2>
						<p className="text-indigo-100 mt-1">
							{initialData
								? "Update office location details"
								: "Register a new airline office location"}
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				{/* Stepper */}
				<div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
					<div className="flex items-center justify-between">
						{steps.map((step, index) => {
							const Icon = step.icon;
							const isActive = currentStep === step.id;
							const isCompleted = currentStep > step.id;

							return (
								<React.Fragment key={step.id}>
									<div
										className={`flex items-center gap-3 ${isActive ? "text-indigo-600" : isCompleted ? "text-green-600" : "text-slate-400"}`}
									>
										<div
											className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
												isActive
													? "bg-indigo-600 text-white"
													: isCompleted
														? "bg-green-600 text-white"
														: "bg-slate-200"
											}`}
										>
											{isCompleted ? (
												<CheckCircle size={20} />
											) : (
												<Icon size={20} />
											)}
										</div>
										<span className="font-medium hidden sm:block">
											{step.title}
										</span>
									</div>
									{index < steps.length - 1 && (
										<div
											className={`flex-1 h-1 mx-4 ${isCompleted ? "bg-green-600" : "bg-slate-200"}`}
										/>
									)}
								</React.Fragment>
							);
						})}
					</div>
				</div>

				{/* Form Content */}
				<form
					onSubmit={handleSubmit}
					className="flex-1 overflow-y-auto p-8"
				>
					{/* Step 1: Basic Information */}
					{currentStep === 1 && (
						<div className="space-y-6 animate-in fade-in">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Airline Selection */}
								<div className="space-y-2 md:col-span-2">
									<label className="text-sm font-semibold text-slate-700">
										Parent Airline{" "}
										<span className="text-red-500">*</span>
									</label>
									<select
										name="airline"
										value={formData.airline}
										onChange={(e) => handleInputChange(e)}
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.airline ? "border-red-300" : "border-slate-200"} focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none`}
									>
										<option value="">
											Select an airline...
										</option>
										{airlines.map((airline) => (
											<option
												key={airline._id}
												value={airline._id}
											>
												{airline.airlineName}
											</option>
										))}
									</select>
									{errors.airline && (
										<p className="text-red-500 text-sm">
											{errors.airline}
										</p>
									)}
								</div>

								{/* Location Fields */}
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Continent{" "}
										<span className="text-red-500">*</span>
									</label>
									<select
										name="continent"
										value={
											formData.continent
										}
										onChange={(e) => handleGeoChange(e, "continent")}
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.continent ? "border-red-300" : "border-slate-200"} focus:border-indigo-500 outline-none`}
                    disabled={loadingAirline || !formData.airline}
									>
										<option value="">
											Select continent...
										</option>
										{availableContinents.map((c) => (
											<option key={c._id || c} value={c._id || c}>
												{c.name || c}
											</option>
										))}
									</select>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Country{" "}
										<span className="text-red-500">*</span>
									</label>
									<select
										name="country"
										value={formData.country}
										onChange={(e) => handleGeoChange(e, "country")}
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.country ? "border-red-300" : "border-slate-200"} focus:border-indigo-500 outline-none`}
                    disabled={!formData.continent}
									>
                    <option value="">Select country...</option>
                    {availableCountries.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										City{" "}
										<span className="text-red-500">*</span>
									</label>
									<select
										name="city"
										value={formData.city}
										onChange={(e) => handleGeoChange(e, "city")}
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.city ? "border-red-300" : "border-slate-200"} focus:border-indigo-500 outline-none`}
                    disabled={!formData.country}
									>
                    <option value="">Select city...</option>
                    {availableCities.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Phone
									</label>
									<input
										type="tel"
										name="phone"
										value={formData.officeOverview.phone}
										onChange={(e) =>
											handleInputChange(
												e,
												"officeOverview",
											)
										}
										placeholder="+1 234 567 8900"
										className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none"
									/>
								</div>

								<div className="space-y-2 md:col-span-2">
									<label className="text-sm font-semibold text-slate-700">
										Address{" "}
										<span className="text-red-500">*</span>
									</label>
									<textarea
										name="address"
										value={formData.officeOverview.address}
										onChange={(e) =>
											handleInputChange(
												e,
												"officeOverview",
											)
										}
										rows={3}
										placeholder="Full office address"
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.address ? "border-red-300" : "border-slate-200"} focus:border-indigo-500 outline-none resize-none`}
									/>
								</div>

								{/* Office Hours */}
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
										<Clock size={16} />
										Opening Time
									</label>
									<input
										type="time"
										name="start"
										value={
											formData.officeOverview.hours.start
										}
										onChange={(e) =>
											handleInputChange(
												e,
												"officeOverview",
												"hours",
											)
										}
										className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
										<Clock size={16} />
										Closing Time
									</label>
									<input
										type="time"
										name="end"
										value={
											formData.officeOverview.hours.end
										}
										onChange={(e) =>
											handleInputChange(
												e,
												"officeOverview",
												"hours",
											)
										}
										className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none"
									/>
								</div>

								{/* Photo Upload */}
								<div className="space-y-2 md:col-span-2">
									<label className="text-sm font-semibold text-slate-700">
										Office Photo
									</label>
									<div className="flex items-center gap-4">
										<div className="relative w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-slate-50">
											{formData.photoPreview ? (
												<img
													src={formData.photoPreview}
													alt="Preview"
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-slate-400">
													<Upload size={24} />
												</div>
											)}
										</div>
										<input
											type="file"
											accept="image/*"
											onChange={(e) =>
												handleImageUpload(
													e,
													"photo",
													"photoPreview",
												)
											}
											className="hidden"
											id="office-photo"
										/>
										<label
											htmlFor="office-photo"
											className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer text-sm font-medium text-slate-700"
										>
											Upload Photo
										</label>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Step 2: Airport Details */}
					{currentStep === 2 && (
						<div className="space-y-6 animate-in fade-in">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Airport Name{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="airportName"
										value={
											formData.airportLocation.airportName
										}
										onChange={(e) =>
											handleInputChange(
												e,
												"airportLocation",
											)
										}
										placeholder="e.g., John F. Kennedy International Airport"
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.airportName ? "border-red-300" : "border-slate-200"} focus:border-indigo-500 outline-none`}
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										IATA Code{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="iataCode"
										value={
											formData.airportLocation.iataCode
										}
										onChange={(e) =>
											handleInputChange(
												e,
												"airportLocation",
											)
										}
										placeholder="e.g., JFK"
										maxLength={3}
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.iataCode ? "border-red-300" : "border-slate-200"} focus:border-indigo-500 outline-none uppercase`}
									/>
								</div>

                {/* Office Slug (Moved from Step 1) */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Office Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="airline-airport-office"
                    className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.slug ? "border-red-300" : "border-slate-200"} focus:border-indigo-500 outline-none`}
                  />
                  <p className="text-xs text-slate-500">
                    Unique URL identifier (generated automatically from airline and airport name)
                  </p>
                  {errors.slug && (
                    <p className="text-red-500 text-sm">
                      {errors.slug}
                    </p>
                  )}
                </div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Terminal Info
									</label>
									<input
										type="text"
										name="terminalInfo"
										value={
											formData.airportLocation
												.terminalInfo
										}
										onChange={(e) =>
											handleInputChange(
												e,
												"airportLocation",
											)
										}
										placeholder="e.g., Terminal 4, Counter 20-25"
										className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Counter Contact
									</label>
									<input
										type="text"
										name="counterContact"
										value={
											formData.airportLocation
												.counterContact
										}
										onChange={(e) =>
											handleInputChange(
												e,
												"airportLocation",
											)
										}
										placeholder="Contact number at counter"
										className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none"
									/>
								</div>

								<div className="space-y-2 md:col-span-2">
									<label className="text-sm font-semibold text-slate-700">
										Airport Address
									</label>
									<textarea
										name="airportAddress"
										value={
											formData.airportLocation
												.airportAddress
										}
										onChange={(e) =>
											handleInputChange(
												e,
												"airportLocation",
											)
										}
										rows={2}
										placeholder="Full airport address"
										className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none resize-none"
									/>
								</div>

								{/* Map Location */}
								<div className="md:col-span-2 bg-slate-50 p-6 rounded-xl border-2 border-slate-200 space-y-4">
									<h3 className="font-semibold text-slate-900 flex items-center gap-2">
										<Globe size={20} />
										Map Location
									</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<label className="text-xs font-medium text-slate-600">
												Latitude
											</label>
											<input
												type="number"
												step="any"
												name="latitude"
												value={
													formData.airportMapLocation
														.latitude
												}
												onChange={(e) =>
													handleInputChange(
														e,
														"airportMapLocation",
													)
												}
												placeholder="40.6413"
												className="w-full px-4 py-2 rounded-lg text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-xs font-medium text-slate-600">
												Longitude
											</label>

											<input
												type="number"
												step="any"
												name="longitude"
												value={
													formData.airportMapLocation
														.longitude
												}
												onChange={(e) =>
													handleInputChange(
														e,
														"airportMapLocation",
													)
												}
												placeholder="-73.7781"
												className="w-full px-4 py-2 rounded-lg text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<label className="text-xs font-medium text-slate-600">
											Google Maps URL
										</label>
										<input
											type="url"
											name="googleMapsUrl"
											value={
												formData.airportMapLocation
													.googleMapsUrl
											}
											onChange={(e) =>
												handleInputChange(
													e,
													"airportMapLocation",
												)
											}
											placeholder="https://maps.google.com/..."
											className="w-full px-4 py-2 rounded-lg text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none"
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Step 3: Content */}
					{currentStep === 3 && (
						<div className="space-y-6 animate-in fade-in">
							<div className="space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Office Description
									</label>
									<div className="border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
										<Editor
											apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
											value={
												formData.aboutOffice.description
											}
											onEditorChange={(content) =>
												handleRichTextChange(
													"description",
													content,
												)
											}
											init={TINYMCE_CONFIG}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Services Offered
									</label>
									<div className="border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
										<Editor
											apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
											value={
												formData.aboutOffice.services
											}
											onEditorChange={(content) =>
												handleRichTextChange(
													"services",
													content,
												)
											}
											init={TINYMCE_CONFIG}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Additional Information
									</label>
									<div className="border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
										<Editor
											apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
											value={
												formData.aboutOffice
													.additionalInfo
											}
											onEditorChange={(content) =>
												handleRichTextChange(
													"additionalInfo",
													content,
												)
											}
											init={TINYMCE_CONFIG}
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Step 4: SEO & Status */}
					{currentStep === 4 && (
						<div className="space-y-6 animate-in fade-in">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2 md:col-span-2">
									<label className="text-sm font-semibold text-slate-700 flex justify-between">
										<span>
											Meta Title{" "}
											<span className="text-red-500">
												*
											</span>
										</span>
										<span
											className={`text-xs ${formData.seo.metaTitle.length > 60 ? "text-red-500" : "text-slate-500"}`}
										>
											{formData.seo.metaTitle.length}/60
										</span>
									</label>
									<input
										type="text"
										name="metaTitle"
										value={formData.seo.metaTitle}
										onChange={(e) =>
											handleInputChange(e, "seo")
										}
										maxLength={60}
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.metaTitle ? "border-red-300" : "border-slate-200"} focus:border-indigo-500 outline-none`}
									/>
								</div>

								<div className="space-y-2 md:col-span-2">
									<label className="text-sm font-semibold text-slate-700 flex justify-between">
										<span>
											Meta Description{" "}
											<span className="text-red-500">
												*
											</span>
										</span>
										<span
											className={`text-xs ${formData.seo.metaDescription.length > 160 ? "text-red-500" : "text-slate-500"}`}
										>
											{
												formData.seo.metaDescription
													.length
											}
											/160
										</span>
									</label>
									<textarea
										name="metaDescription"
										value={formData.seo.metaDescription}
										onChange={(e) =>
											handleInputChange(e, "seo")
										}
										rows={3}
										maxLength={160}
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.metaDescription ? "border-red-300" : "border-slate-200"} focus:border-indigo-500 outline-none resize-none`}
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Canonical URL
									</label>
									<input
										type="url"
										name="canonicalUrl"
										value={formData.seo.canonicalUrl}
										onChange={(e) =>
											handleInputChange(e, "seo")
										}
										className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										OG Image
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={(e) =>
											handleImageUpload(
												e,
												"ogImage",
												"ogImagePreview",
											)
										}
										className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-indigo-500 outline-none"
									/>
								</div>

								{/* Verified Toggle */}
								<div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
									<div className="flex items-center justify-between">
										<span className="font-semibold text-slate-700">
											Verified Office
										</span>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												name="verified"
												checked={
													formData.metadata.verified
												}
												onChange={(e) =>
													handleInputChange(
														e,
														"metadata",
													)
												}
												className="sr-only peer"
											/>
											<div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
										</label>
									</div>
								</div>
							</div>
						</div>
					)}
				</form>

				{/* Footer */}
				<div className="border-t border-slate-200 p-6 bg-slate-50 flex justify-between items-center">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-3 text-slate-700 font-medium hover:bg-slate-200 rounded-xl transition-colors"
					>
						Cancel
					</button>

					<div className="flex gap-3">
						{currentStep > 1 && (
							<button
								type="button"
								onClick={() =>
									setCurrentStep((prev) => prev - 1)
								}
								className="flex items-center gap-2 px-6 py-3 text-slate-700 font-medium hover:bg-slate-200 rounded-xl transition-colors"
							>
								<ChevronLeft size={20} />
								Previous
							</button>
						)}

						{currentStep < 4 ? (
							<button
								type="button"
								onClick={handleNext}
								className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
							>
								Next
								<ChevronRight size={20} />
							</button>
						) : (
							<button
								type="submit"
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
							>
								{isSubmitting ? (
									<>
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save size={20} />
										{initialData
											? "Update Office"
											: "Save Office"}
									</>
								)}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
  );
}