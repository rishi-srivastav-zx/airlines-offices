"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
	X,
	Save,
	Upload,
	MapPin,
	FileText,
	Search,
	CheckCircle,
	AlertCircle,
	ChevronDown,
	Building2,
	Link as LinkIcon,
	ChevronRight,
	ChevronLeft,
	Info,
} from "lucide-react";
import axios from "axios";
import slugify from "@/utils/slugifyhelper";
import { toast } from "react-hot-toast";

const API_BASE_URL = "http://localhost:3001/api";
const api = axios.create({
	baseURL: API_BASE_URL,
});

// Dynamically import TinyMCE to avoid SSR issues
const Editor = dynamic(
	() => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
	{
		ssr: false,
		loading: () => (
			<div className="h-64 bg-slate-100 animate-pulse rounded-lg" />
		),
	}
);

const TINYMCE_CONFIG = {
	height: 300,
	menubar: true,
	plugins: [
		"advlist",
		"autolink",
		"lists",
		"link",
		"image",
		"charmap",
		"preview",
		"anchor",
		"searchreplace",
		"visualblocks",
		"code",
		"fullscreen",
		"insertdatetime",
		"media",
		"table",
		"code",
		"help",
		"wordcount",
	],
	toolbar:
		"undo redo | blocks | " +
		"bold italic forecolor | alignleft aligncenter " +
		"alignright alignjustify | bullist numlist outdent indent | " +
		"removeformat | help",
	content_style:
		"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
	skin: "oxide",
	content_css: "default",
};

// Helper to extract IDs from various data formats
const extractIds = (data) => {
	if (!data) return [];
	if (Array.isArray(data) && data.length === 0) return [];
	
	// If data is already an array of strings (ObjectIds), return as is
	if (Array.isArray(data) && typeof data[0] === 'string') {
		return data;
	}
	
	// If data is array of objects with $oid (MongoDB format)
	if (Array.isArray(data) && data[0]?.$oid) {
		return data.map(item => item.$oid);
	}
	
	// If data is populated objects, extract _id
	if (Array.isArray(data) && typeof data[0] === 'object') {
		return data.map(item => item._id?.toString?.() || item._id || item).filter(Boolean);
	}
	
	return [];
};

export default function AirlineAdminForm({
	onClose,
	onSave,
	initialData = null,
	mode = "create",
}) {
	const [formData, setFormData] = useState({
		airlineName: "",
		slug: "",
		firstName: "",
		logo: null,
		logoPreview: null,

		continents: [],
		countries: [],
		cities: [],

		about: {
			description: "",
			history: "",
			services: "",
			additionalInfo: "",
		},

		seo: {
			metaTitle: "",
			metaDescription: "",
			keywords: [],
			canonicalUrl: "",
			ogTitle: "",
			ogDescription: "",
			ogImage: null,
			ogImagePreview: null,
		},

		metadata: {
			verified: false,
			rating: {
				value: 0,
				reviewCount: 0,
			},
		},
	});

	const [errors, setErrors] = useState({});
	const [activeTab, setActiveTab] = useState("basic");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [keywordInput, setKeywordInput] = useState("");

	// Dynamic geodata state
	const [continents, setContinents] = useState([]);
	const [countries, setCountries] = useState([]);
	const [cities, setCities] = useState([]);
	const [loadingGeo, setLoadingGeo] = useState(false);
	const [initialDataLoaded, setInitialDataLoaded] = useState(false);

	// Manual input state
	const [manualEntries, setManualEntries] = useState({
		isContinentManual: false,
		isCountryManual: false,
		isCityManual: false,
		continentName: "",
		countryName: "",
		cityName: "",
	});

	// Load initial data
	useEffect(() => {
		if (initialData && !initialDataLoaded) {
			console.log("Loading initial data:", initialData);
			
			const continentIds = extractIds(initialData.continents);
			const countryIds = extractIds(initialData.countries);
			const cityIds = extractIds(initialData.cities);

			console.log("Extracted IDs:", { continentIds, countryIds, cityIds });

			setFormData((prev) => ({
				...prev,
				airlineName: initialData.airlineName || "",
				slug: initialData.slug || "",
				firstName: initialData.firstName || "",
				logo: initialData.logo || null,
				logoPreview: initialData.logo
					? `http://localhost:3001${initialData.logo}`
					: null,
				continents: continentIds,
				countries: countryIds,
				cities: cityIds,
				about: {
					description: initialData.about?.description || "",
					history: initialData.about?.history || "",
					services: initialData.about?.services || "",
					additionalInfo: initialData.about?.additionalInfo || "",
				},
				seo: {
					metaTitle: initialData.seo?.metaTitle || "",
					metaDescription: initialData.seo?.metaDescription || "",
					keywords: initialData.seo?.keywords || [],
					canonicalUrl: initialData.seo?.canonicalUrl || "",
					ogTitle: initialData.seo?.ogTitle || "",
					ogDescription: initialData.seo?.ogDescription || "",
					ogImage: initialData.seo?.ogImage || null,
					ogImagePreview: initialData.seo?.ogImage
						? `http://localhost:3001${initialData.seo.ogImage}`
						: null,
				},
				metadata: {
					verified: initialData.metadata?.verified || false,
					rating: {
						value: initialData.metadata?.rating?.value || 0,
						reviewCount: initialData.metadata?.rating?.reviewCount || 0,
					},
				},
			}));
			
			setInitialDataLoaded(true);
		}
	}, [initialData, initialDataLoaded]);

	useEffect(() => {
		// Auto-generate slug from airline name for new items
		if (!initialData && formData.airlineName) {
			setFormData((prev) => ({
				...prev,
				slug: slugify(formData.airlineName),
			}));
		}
		// For existing items, only generate slug if it's empty
		if (initialData && formData.airlineName && !formData.slug) {
			setFormData((prev) => ({
				...prev,
				slug: slugify(formData.airlineName),
			}));
		}
	}, [formData.airlineName, initialData]);

	// Fetch initial geodata
	useEffect(() => {
		const fetchContinents = async () => {
			try {
				console.log("Fetching continents from:", API_BASE_URL + "/geo/continents");
				const response = await api.get("/geo/continents");
				console.log("Continents response:", response.data);
				if (response.data.success) {
					setContinents(response.data.data);
				}
			} catch (error) {
				console.error("Error fetching continents:", error);
				toast.error("Failed to load continents");
			}
		};
		fetchContinents();
	}, []);

	// Fetch countries when continents selection changes - with initial data support
	useEffect(() => {
		const fetchCountries = async () => {
			if (formData.continents.length === 0) {
				setCountries([]);
				return;
			}
			
			setLoadingGeo(true);
			try {
				console.log("Fetching countries for continents:", formData.continents);
				const countryPromises = formData.continents.map((id) =>
					api.get(`/geo/countries/${id}`)
				);
				const results = await Promise.all(countryPromises);
				const allCountries = results.flatMap((res) => res.data.data);
				
				// Remove duplicates
				const uniqueCountries = Array.from(
					new Map(allCountries.map((c) => [c._id, c])).values()
				);
				
				const sorted = uniqueCountries.sort((a, b) => a.name.localeCompare(b.name));
				console.log("Fetched countries:", sorted.length);
				setCountries(sorted);
			} catch (error) {
				console.error("Error fetching countries:", error);
				toast.error("Failed to load countries");
			} finally {
				setLoadingGeo(false);
			}
		};
		
		// Only fetch if we have continents selected
		if (formData.continents.length > 0) {
			fetchCountries();
		}
	}, [formData.continents]);

	// Fetch cities when countries selection changes - with initial data support
	useEffect(() => {
		const fetchCities = async () => {
			if (formData.countries.length === 0) {
				setCities([]);
				return;
			}
			
			setLoadingGeo(true);
			try {
				console.log("Fetching cities for countries:", formData.countries);
				const cityPromises = formData.countries.map((id) =>
					api.get(`/geo/cities/${id}`)
				);
				const results = await Promise.all(cityPromises);
				const allCities = results.flatMap((res) => res.data.data);
				
				// Remove duplicates
				const uniqueCities = Array.from(
					new Map(allCities.map((c) => [c._id, c])).values()
				);
				
				const sorted = uniqueCities.sort((a, b) => a.name.localeCompare(b.name));
				console.log("Fetched cities:", sorted.length);
				setCities(sorted);
			} catch (error) {
				console.error("Error fetching cities:", error);
				toast.error("Failed to load cities");
			} finally {
				setLoadingGeo(false);
			}
		};
		
		// Only fetch if we have countries selected
		if (formData.countries.length > 0) {
			fetchCities();
		}
	}, [formData.countries]);

	const handleManualToggle = (field) => {
		setManualEntries((prev) => ({
			...prev,
			[`is${field}Manual`]: !prev[`is${field}Manual`],
		}));
	};

	const handleManualInputChange = (e) => {
		const { name, value } = e.target;
		setManualEntries((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSaveManualCountry = async () => {
		if (!manualEntries.countryName || !manualEntries.continentName) {
			toast.error("Please enter country name and select continent");
			return;
		}

		try {
			const res = await api.post("/geo/countries/bulk", {
				countries: [
					{
						name: manualEntries.countryName,
						continent: manualEntries.continentName,
					},
				],
			});

			if (res.data.success) {
				const newCountry = res.data.data[0];
				setCountries((prev) =>
					[...prev, newCountry].sort((a, b) =>
						a.name.localeCompare(b.name)
					)
				);
				handleMultiSelect("countries", newCountry._id);
				setManualEntries((prev) => ({
					...prev,
					isCountryManual: false,
					countryName: "",
					continentName: "",
				}));
				toast.success(`Country "${newCountry.name}" saved and selected`);
			}
		} catch (error) {
			console.error("Error saving manual country:", error);
			toast.error(error.response?.data?.message || "Failed to save country");
		}
	};

	const handleSaveManualCity = async () => {
		if (!manualEntries.cityName || !manualEntries.countryName) {
			toast.error("Please enter city name and select country");
			return;
		}

		try {
			const countryObj = countries.find(
				(c) =>
					c._id === manualEntries.countryName ||
					c.name === manualEntries.countryName
			);

			const res = await api.post("/geo/cities/bulk", {
				cities: [
					{
						name: manualEntries.cityName,
						country: manualEntries.countryName,
						continent: countryObj?.continent || formData.continents[0],
					},
				],
			});

			if (res.data.success) {
				const newCity = res.data.data[0];
				setCities((prev) =>
					[...prev, newCity].sort((a, b) => a.name.localeCompare(b.name))
				);
				handleMultiSelect("cities", newCity._id);
				setManualEntries((prev) => ({
					...prev,
					isCityManual: false,
					cityName: "",
					countryName: "",
				}));
				toast.success(`City "${newCity.name}" saved and selected`);
			}
		} catch (error) {
			console.error("Error saving manual city:", error);
			toast.error(error.response?.data?.message || "Failed to save city");
		}
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		const actualValue = type === "checkbox" ? checked : value;

		if (name.includes(".")) {
			const keys = name.split(".");
			setFormData((prev) => {
				const newState = { ...prev };
				let current = newState;
				for (let i = 0; i < keys.length - 1; i++) {
					current[keys[i]] = { ...current[keys[i]] };
					current = current[keys[i]];
				}
				current[keys[keys.length - 1]] = actualValue;
				return newState;
			});
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: actualValue,
			}));
		}

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: null }));
		}
		if (name.startsWith('seo.') && errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: null }));
		}
		if (name.startsWith('metadata.') && errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: null }));
		}
	};

	const handleMultiSelect = (field, value) => {
		setFormData((prev) => {
			const currentValues = prev[field];
			const newValues = currentValues.includes(value)
				? currentValues.filter((v) => v !== value)
				: [...currentValues, value];

			return {
				...prev,
				[field]: newValues,
			};
		});
	};

	const handleRichTextChange = (field, content) => {
		if (field.includes(".")) {
			const keys = field.split(".");
			setFormData((prev) => {
				const newState = { ...prev };
				let current = newState;
				for (let i = 0; i < keys.length - 1; i++) {
					current[keys[i]] = { ...current[keys[i]] };
					current = current[keys[i]];
				}
				current[keys[keys.length - 1]] = content;
				return newState;
			});
		} else {
			setFormData((prev) => ({
				...prev,
				[field]: content,
			}));
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
				setFormData((prev) => ({
					...prev,
					[field]: file,
					[previewField]: reader.result,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const regenerateSlug = () => {
		if (formData.airlineName) {
			const newSlug = slugify(formData.airlineName);
			setFormData((prev) => ({
				...prev,
				slug: newSlug,
			}));
			toast.success("Slug regenerated from airline name");
		} else {
			toast.error("Please enter airline name first");
		}
	};

	const handleAddKeyword = (e) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			const keyword = keywordInput.trim().toLowerCase();
			if (keyword && !formData.seo.keywords.includes(keyword)) {
				setFormData((prev) => ({
					...prev,
					seo: {
						...prev.seo,
						keywords: [...prev.seo.keywords, keyword],
					},
				}));
				setKeywordInput("");
			}
		}
	};

	const handleRemoveKeyword = (keywordToRemove) => {
		setFormData((prev) => ({
			...prev,
			seo: {
				...prev.seo,
				keywords: prev.seo.keywords.filter((k) => k !== keywordToRemove),
			},
		}));
	};

	// Validation functions for each tab
	const validateBasicTab = () => {
		const newErrors = {};
		if (!formData.airlineName?.trim())
			newErrors.airlineName = "Airline name is required";
		if (!formData.slug?.trim()) {
			newErrors.slug = "Slug is required";
		} else if (!formData.slug.match(/^[a-z0-9-]+$/)) {
			newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
		} else if (formData.slug.length < 3) {
			newErrors.slug = "Slug must be at least 3 characters long";
		} else if (formData.slug.startsWith('-') || formData.slug.endsWith('-')) {
			newErrors.slug = "Slug cannot start or end with a hyphen";
		}
		if (!formData.firstName?.trim())
			newErrors.firstName = "Brand name is required";

		setErrors((prev) => ({ ...prev, ...newErrors }));
		return Object.keys(newErrors).length === 0;
	};

	const validateGeographicTab = () => {
		const newErrors = {};
		if (!formData.continents || formData.continents.length === 0)
			newErrors.continents = "Select at least one continent";
		if (!formData.countries || formData.countries.length === 0)
			newErrors.countries = "Select at least one country";

		setErrors((prev) => ({ ...prev, ...newErrors }));
		return Object.keys(newErrors).length === 0;
	};

	const validateSEOTab = () => {
		const newErrors = {};
		if (!formData.seo?.metaTitle?.trim())
			newErrors["seo.metaTitle"] = "Meta title is required";
		if (!formData.seo?.metaDescription?.trim())
			newErrors["seo.metaDescription"] = "Meta description is required";

		setErrors((prev) => ({ ...prev, ...newErrors }));
		return Object.keys(newErrors).length === 0;
	};

	const validateCurrentTab = () => {
		switch (activeTab) {
			case "basic":
				return validateBasicTab();
			case "geographic":
				return validateGeographicTab();
			case "seo":
				return validateSEOTab();
			default:
				return true;
		}
	};

	const handleNext = () => {
		if (!validateCurrentTab()) {
			toast.error("Please fill in all required fields before proceeding");
			return;
		}

		const currentIndex = tabs.findIndex((t) => t.id === activeTab);
		if (currentIndex < tabs.length - 1) {
			setActiveTab(tabs[currentIndex + 1].id);
		}
	};

	const handlePrevious = () => {
		const currentIndex = tabs.findIndex((t) => t.id === activeTab);
		if (currentIndex > 0) {
			setActiveTab(tabs[currentIndex - 1].id);
		}
	};

	const validateForm = async () => {
		const basicValid = validateBasicTab();
		const geoValid = validateGeographicTab();
		const seoValid = validateSEOTab();

		if (initialData && formData.slug && initialData.slug !== formData.slug) {
			try {
				if (!formData.slug.match(/^[a-z0-9-]+$/)) {
					setErrors((prev) => ({ 
						...prev, 
						slug: "Slug can only contain lowercase letters, numbers, and hyphens" 
					}));
					return false;
				}
			} catch (error) {
				console.error("Slug validation error:", error);
			}
		}

		return basicValid && geoValid && seoValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setErrors({});

		const isValid = await validateForm();
		if (!isValid) {
			toast.error("Please fix the errors in the form");
			if (!validateBasicTab()) setActiveTab("basic");
			else if (!validateGeographicTab()) setActiveTab("geographic");
			else if (!validateSEOTab()) setActiveTab("seo");
			return;
		}

		setIsSubmitting(true);

		try {
			const submitData = new FormData();
			submitData.append("airlineName", formData.airlineName);
			submitData.append("slug", formData.slug);
			submitData.append("firstName", formData.firstName);

			if (formData.logo) {
				submitData.append("logo", formData.logo);
			}

			formData.continents.forEach((c) =>
				submitData.append("continents[]", c)
			);
			formData.countries.forEach((c) =>
				submitData.append("countries[]", c)
			);
			formData.cities.forEach((c) => submitData.append("cities[]", c));

			submitData.append("about[description]", formData.about.description);
			submitData.append("about[history]", formData.about.history);
			submitData.append("about[services]", formData.about.services);
			submitData.append(
				"about[additionalInfo]",
				formData.about.additionalInfo
			);

			submitData.append("seo[metaTitle]", formData.seo.metaTitle);
			submitData.append(
				"seo[metaDescription]",
				formData.seo.metaDescription
			);
			formData.seo.keywords.forEach((k) =>
				submitData.append("seo[keywords][]", k)
			);
			submitData.append("seo[canonicalUrl]", formData.seo.canonicalUrl);
			submitData.append("seo[ogTitle]", formData.seo.ogTitle);
			submitData.append("seo[ogDescription]", formData.seo.ogDescription);

			if (formData.seo.ogImage) {
				submitData.append("seo[ogImage]", formData.seo.ogImage);
			}

			submitData.append("metadata[verified]", formData.metadata.verified);
			submitData.append(
				"metadata[rating][value]",
				formData.metadata.rating?.value || 0
			);
			submitData.append(
				"metadata[rating][reviewCount]",
				formData.metadata.rating?.reviewCount || 0
			);

			await onSave(submitData);
		} catch (error) {
			console.error("Form submission error:", error);
			toast.error(error.response?.data?.message || "Failed to save airline");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Helper to get selected names
	const getSelectedNames = (ids, dataArray) => {
		if (!ids || !dataArray) return [];
		return ids
			.map((id) => dataArray.find((item) => item._id === id)?.name)
			.filter(Boolean);
	};

	// Word counter helper
	const countWords = (text) => {
		if (!text || typeof text !== 'string') return 0;
		return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
	};

	const tabs = [
		{ id: "basic", label: "Basic Info", icon: Building2 },
		{ id: "geographic", label: "Coverage", icon: MapPin },
		{ id: "about", label: "About", icon: FileText },
		{ id: "seo", label: "SEO", icon: Search },
		{ id: "status", label: "Status", icon: CheckCircle },
	];

	const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);

	return (
		<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
				<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-bold text-white">
							{initialData ? "Edit Airline" : "Add New Airline"}
						</h2>
						<p className="text-blue-100 mt-1">
							{initialData
								? "Update airline information"
								: "Create a new airline profile"}
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
					>
						<X size={24} />
					</button>
				</div>

				<div className="border-b border-slate-200 bg-slate-50 px-8">
					<div className="flex gap-2 overflow-x-auto">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
										activeTab === tab.id
											? "border-blue-600 text-blue-600 bg-white"
											: "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
									}`}
								>
									<Icon size={18} />
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>

				<form
					onSubmit={handleSubmit}
					className="flex-1 overflow-y-auto p-8"
				>
					{activeTab === "basic" && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
										Airline Name{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="airlineName"
										value={formData.airlineName}
										onChange={handleInputChange}
										placeholder="e.g., Emirates Airlines"
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${
											errors.airlineName
												? "border-red-300"
												: "border-slate-200"
										} focus:border-blue-500 outline-none transition-all`}
									/>
									{errors.airlineName && (
										<p className="text-red-500 text-sm flex items-center gap-1">
											<AlertCircle size={14} />{" "}
											{errors.airlineName}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
										Slug <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<input
											type="text"
											name="slug"
											value={formData.slug}
											onChange={handleInputChange}
											className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${
												errors.slug
													? "border-red-300"
													: "border-slate-200"
											} focus:border-blue-500 outline-none pl-10 pr-24`}
										/>
										<LinkIcon
											className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
											size={18}
										/>
										<button
											type="button"
											onClick={regenerateSlug}
											className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
										>
											Regenerate
										</button>
									</div>
									{errors.slug && (
										<p className="text-red-500 text-sm">
											{errors.slug}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Brand Name{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleInputChange}
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${
											errors.firstName
												? "border-red-300"
												: "border-slate-200"
										} focus:border-blue-500 outline-none`}
									/>
									{errors.firstName && (
										<p className="text-red-500 text-sm">
											{errors.firstName}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">
										Logo
									</label>
									<div className="flex items-center gap-4">
										<div className="relative w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden group">
											{formData.logoPreview ? (
												<>
													<img
														src={formData.logoPreview}
														alt="Preview"
														className="w-full h-full object-cover"
													/>
													<button
														type="button"
														onClick={() =>
															setFormData((prev) => ({
																...prev,
																logo: null,
																logoPreview: null,
															}))
														}
														className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
													>
														<X size={20} />
													</button>
												</>
											) : (
												<Upload
													className="text-slate-400"
													size={24}
												/>
											)}
										</div>
										<input
											type="file"
											accept="image/*"
											onChange={(e) =>
												handleImageUpload(
													e,
													"logo",
													"logoPreview"
												)
											}
											className="hidden"
											id="logo-upload"
										/>
										<label
											htmlFor="logo-upload"
											className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors font-medium text-sm flex items-center gap-2"
										>
											<Upload size={16} /> Upload Logo
										</label>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === "geographic" && (
						<div className="space-y-6 animate-in fade-in duration-300">
							{/* Continents Section */}
							<div className="space-y-3">
								<label className="text-sm font-semibold text-slate-700">
									Continents <span className="text-red-500">*</span>
								</label>
								<div className="flex flex-wrap gap-2">
									{continents.map((continent) => (
										<button
											key={continent._id}
											type="button"
											onClick={() =>
												handleMultiSelect(
													"continents",
													continent._id
												)
											}
											className={`px-4 py-2 rounded-lg border-2 transition-all ${
												formData.continents.includes(
													continent._id
												)
													? "bg-blue-600 border-blue-600 text-white"
													: "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
											}`}
										>
											{continent.name}
										</button>
									))}
								</div>
								{formData.continents.length > 0 && (
									<p className="text-sm text-green-600 flex items-center gap-1">
										<CheckCircle size={14} /> Selected:{" "}
										{getSelectedNames(
											formData.continents,
											continents
										).join(", ")}
									</p>
								)}
								{errors.continents && (
									<p className="text-red-500 text-sm flex items-center gap-1">
										<AlertCircle size={14} /> {errors.continents}
									</p>
								)}
							</div>

							{/* Countries Section */}
							<div className="space-y-3">
								<div className="flex justify-between items-center mb-2">
									<label className="text-sm font-semibold text-slate-700">
										Countries <span className="text-red-500">*</span>
									</label>
									<button
										type="button"
										onClick={() => handleManualToggle("Country")}
										className="text-xs text-blue-600 font-bold hover:underline"
									>
										{manualEntries.isCountryManual
											? "Cancel Manual"
											: "Add Manually"}
									</button>
								</div>

								{manualEntries.isCountryManual ? (
									<div className="p-4 border-2 border-blue-100 rounded-xl bg-blue-50/30 space-y-4">
										<input
											type="text"
											name="countryName"
											value={manualEntries.countryName}
											onChange={handleManualInputChange}
											placeholder="Country Name"
											className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-gray-900"
										/>
										<select
											value={manualEntries.continentName}
											name="continentName"
											onChange={handleManualInputChange}
											className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-gray-900"
										>
											<option value="">Select Continent</option>
											{continents.map((c) => (
												<option key={c._id} value={c._id}>
													{c.name}
												</option>
											))}
										</select>
										<button
											type="button"
											onClick={handleSaveManualCountry}
											className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2"
										>
											<Save size={16} /> Save Country
										</button>
									</div>
								) : (
									<>
										<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2 text-sm text-blue-800">
											<Info size={16} className="mt-0.5 flex-shrink-0" />
											<div>
												<p className="font-medium">Multi-select tip:</p>
												<p>
													Hold <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs font-mono">Ctrl</kbd> (Windows) or <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs font-mono">Cmd</kbd> (Mac) and click to select multiple countries
												</p>
											</div>
										</div>
										<select
											multiple
											size={6}
											value={formData.countries}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													countries: Array.from(
														e.target.selectedOptions,
														(o) => o.value
													),
												}))
											}
											disabled={countries.length === 0 || loadingGeo}
											className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-blue-500 h-40 disabled:bg-slate-100"
										>
											{countries.length === 0 && !loadingGeo && (
												<option disabled>Select continents first</option>
											)}
											{loadingGeo && (
												<option disabled>Loading countries...</option>
											)}
											{countries.map((c) => (
												<option key={c._id} value={c._id}>
													{c.name}
												</option>
											))}
										</select>
										{formData.countries.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{getSelectedNames(formData.countries, countries).map(
													(name) => (
														<span
															key={name}
															className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
														>
															{name}
															<button
																type="button"
																onClick={() => {
																	const country = countries.find(
																		(c) => c.name === name
																	);
																	if (country)
																		handleMultiSelect(
																			"countries",
																			country._id
																		);
																}}
															>
																<X size={12} />
															</button>
														</span>
													)
												)}
											</div>
										)}
									</>
								)}
								{errors.countries && (
									<p className="text-red-500 text-sm flex items-center gap-1">
										<AlertCircle size={14} /> {errors.countries}
									</p>
								)}
							</div>

							{/* Cities Section */}
							<div className="space-y-3">
								<div className="flex justify-between items-center mb-2">
									<label className="text-sm font-semibold text-slate-700">
										Cities
									</label>
									<button
										type="button"
										onClick={() => handleManualToggle("City")}
										className="text-xs text-blue-600 font-bold hover:underline"
									>
										{manualEntries.isCityManual
											? "Cancel Manual"
											: "Add Manually"}
									</button>
								</div>

								{manualEntries.isCityManual ? (
									<div className="p-4 border-2 border-green-100 rounded-xl bg-green-50/30 space-y-4">
										<input
											type="text"
											name="cityName"
											value={manualEntries.cityName}
											onChange={handleManualInputChange}
											placeholder="City Name"
											className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-gray-900"
										/>
										<select
											value={manualEntries.countryName}
											name="countryName"
											onChange={handleManualInputChange}
											className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-gray-900"
										>
											<option value="">Select Country</option>
											{countries.map((c) => (
												<option key={c._id} value={c._id}>
													{c.name}
												</option>
											))}
										</select>
										<button
											type="button"
											onClick={handleSaveManualCity}
											className="w-full py-2 bg-green-600 text-white font-bold rounded-lg flex items-center justify-center gap-2"
										>
											<Save size={16} /> Save City
										</button>
									</div>
								) : (
									<>
										<div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2 text-sm text-green-800">
											<Info size={16} className="mt-0.5 flex-shrink-0" />
											<div>
												<p className="font-medium">Multi-select tip:</p>
												<p>
													Hold <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs font-mono">Ctrl</kbd> (Windows) or <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs font-mono">Cmd</kbd> (Mac) and click to select multiple cities
												</p>
											</div>
										</div>
										<select
											multiple
											size={6}
											value={formData.cities}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													cities: Array.from(
														e.target.selectedOptions,
														(o) => o.value
													),
												}))
											}
											disabled={cities.length === 0 || loadingGeo}
											className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-blue-500 h-40 disabled:bg-slate-100"
										>
											{cities.length === 0 && !loadingGeo && (
												<option disabled>Select countries first</option>
											)}
											{loadingGeo && (
												<option disabled>Loading cities...</option>
											)}
											{cities.map((c) => (
												<option key={c._id} value={c._id}>
													{c.name}
												</option>
											))}
										</select>
										{formData.cities.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{getSelectedNames(formData.cities, cities).map(
													(name) => (
														<span
															key={name}
															className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1"
														>
															{name}
															<button
																type="button"
																onClick={() => {
																	const city = cities.find(
																		(c) => c.name === name
																	);
																	if (city)
																		handleMultiSelect("cities", city._id);
																}}
															>
																<X size={12} />
															</button>
														</span>
													)
												)}
											</div>
										)}
									</>
								)}
							</div>
						</div>
					)}

					{activeTab === "about" && (
						<div className="space-y-6 animate-in fade-in duration-300">
							{["description", "history", "services", "additionalInfo"].map(
								(field) => (
									<div key={field} className="space-y-2">
										<div className="flex justify-between items-center">
											<label className="text-sm font-semibold text-slate-700 capitalize">
												{field}
											</label>
											<span className="text-xs text-slate-500">
												{countWords(formData.about[field])} words
											</span>
										</div>
										<div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
											<Editor
												apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
												value={formData.about[field]}
												onEditorChange={(content) =>
													handleRichTextChange(`about.${field}`, content)
												}
												init={TINYMCE_CONFIG}
											/>
										</div>
									</div>
								)
							)}
						</div>
					)}

					{activeTab === "seo" && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<label className="text-sm font-semibold text-slate-700">
										Meta Title <span className="text-red-500">*</span>
									</label>
									<span
										className={`text-xs ${
											(formData.seo.metaTitle?.length || 0) > 60
												? "text-red-500"
												: "text-slate-500"
										}`}
									>
										{formData.seo.metaTitle?.length || 0} / 60 chars
									</span>
								</div>
								<input
									type="text"
									name="seo.metaTitle"
									value={formData.seo.metaTitle}
									onChange={handleInputChange}
									maxLength={60}
									className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${
										errors["seo.metaTitle"]
											? "border-red-300"
											: "border-slate-200"
									} focus:border-blue-500`}
								/>
								{errors["seo.metaTitle"] && (
									<p className="text-red-500 text-sm">
										{errors["seo.metaTitle"]}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<label className="text-sm font-semibold text-slate-700">
										Meta Description{" "}
										<span className="text-red-500">*</span>
									</label>
									<span
										className={`text-xs ${
											(formData.seo.metaDescription?.length || 0) > 160
												? "text-red-500"
												: "text-slate-500"
										}`}
									>
										{formData.seo.metaDescription?.length || 0} / 160 chars
									</span>
								</div>
								<textarea
									name="seo.metaDescription"
									value={formData.seo.metaDescription}
									onChange={handleInputChange}
									rows={3}
									maxLength={160}
									className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${
										errors["seo.metaDescription"]
											? "border-red-300"
											: "border-slate-200"
									} focus:border-blue-500 resize-none`}
								/>
								{errors["seo.metaDescription"] && (
									<p className="text-red-500 text-sm">
										{errors["seo.metaDescription"]}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<label className="text-sm font-semibold text-slate-700">
									Keywords
								</label>
								<div className="flex flex-wrap gap-2 p-3 border-2 border-slate-200 rounded-xl bg-white">
									{formData.seo.keywords.map((k) => (
										<span
											key={k}
											className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm flex items-center gap-1"
										>
											{k}{" "}
											<button
												type="button"
												onClick={() => handleRemoveKeyword(k)}
											>
												<X size={14} />
											</button>
										</span>
									))}
									<input
										type="text"
										value={keywordInput}
										onChange={(e) => setKeywordInput(e.target.value)}
										onKeyDown={handleAddKeyword}
										placeholder="Type and press Enter"
										className="flex-1 outline-none text-gray-900 text-sm"
									/>
								</div>
								<p className="text-xs text-slate-500">
									{formData.seo.keywords.length} keywords added
								</p>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<label className="text-sm font-semibold text-slate-700">
										OG Title
									</label>
									<span className="text-xs text-slate-500">
										{countWords(formData.seo.ogTitle)} words
									</span>
								</div>
								<input
									type="text"
									name="seo.ogTitle"
									value={formData.seo.ogTitle}
									onChange={handleInputChange}
									className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-blue-500"
								/>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<label className="text-sm font-semibold text-slate-700">
										OG Description
									</label>
									<span className="text-xs text-slate-500">
										{countWords(formData.seo.ogDescription)} words
									</span>
								</div>
								<textarea
									name="seo.ogDescription"
									value={formData.seo.ogDescription}
									onChange={handleInputChange}
									rows={3}
									className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-blue-500 resize-none"
								/>
							</div>
						</div>
					)}

					{activeTab === "status" && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 flex justify-between items-center">
									<div>
										<h3 className="font-semibold text-slate-900">
											Verified
										</h3>
										<p className="text-sm text-slate-500">
											Mark as verified profile
										</p>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											name="metadata.verified"
											checked={formData.metadata.verified}
											onChange={handleInputChange}
											className="sr-only peer"
										/>
										<div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
									</label>
								</div>
								<div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 space-y-4">
									<div className="flex justify-between items-center text-slate-900">
										<h3 className="font-semibold">Initial Rating</h3>
										<span className="font-bold">
											{formData.metadata.rating.value}/5
										</span>
									</div>
									<input
										type="range"
										name="metadata.rating.value"
										min="0"
										max="5"
										step="0.1"
										value={formData.metadata.rating.value}
										onChange={handleInputChange}
										className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
									/>
								</div>
							</div>
						</div>
					)}
				</form>

				<div className="border-t border-slate-200 p-6 bg-slate-50 flex justify-between items-center">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-3 text-slate-700 font-medium hover:bg-slate-200 rounded-xl transition-colors"
					>
						Cancel
					</button>
					<div className="flex gap-3">
						{currentTabIndex > 0 && (
							<button
								type="button"
								onClick={handlePrevious}
								className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all"
							>
								<ChevronLeft size={20} /> Previous
							</button>
						)}
						{currentTabIndex < tabs.length - 1 ? (
							<button
								type="button"
								onClick={handleNext}
								className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg"
							>
								Next <ChevronRight size={20} />
							</button>
						) : (
							<button
								type="button"
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg flex-center"
							>
								{isSubmitting ? (
									<>
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
										Saving...
									</>
								) : (
									<>
										<Save size={20} />{" "}
										{initialData ? "Update Airline" : "Save Airline"}
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