"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
	X,
	Save,
	Upload,
	Globe,
	MapPin,
	FileText,
	Search,
	Tag,
	Star,
	CheckCircle,
	AlertCircle,
	ChevronDown,
	Building2,
	Link as LinkIcon,
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
	},
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

	// Manual input state
	const [manualEntries, setManualEntries] = useState({
		isContinentManual: false,
		isCountryManual: false,
		isCityManual: false,
		continentName: "",
		countryName: "",
		cityName: "",
	});

	useEffect(() => {
		if (initialData) {
			setFormData((prev) => ({
				...prev,
				...initialData,
				logoPreview: initialData.logo
					? `http://localhost:3001${initialData.logo}`
					: null,
				about: {
					...prev.about,
					...initialData.about,
				},
				seo: {
					...prev.seo,
					...initialData.seo,
					ogImagePreview: initialData.seo?.ogImage
						? `http://localhost:3001${initialData.seo.ogImage}`
						: null,
				},
				metadata: {
					...prev.metadata,
					...initialData.metadata,
					rating: {
						...prev.metadata.rating,
						...initialData.metadata?.rating,
					},
				},
			}));
		}
	}, [initialData]);

	useEffect(() => {
		if (!initialData && formData.airlineName) {
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
				const response = await api.get("/geo/continents");
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

	// Fetch countries when continents selection changes
	useEffect(() => {
		const fetchCountries = async () => {
			if (formData.continents.length === 0) {
				setCountries([]);
				return;
			}
			setLoadingGeo(true);
			try {
				const countryPromises = formData.continents.map(id => api.get(`/geo/countries/${id}`));
				const results = await Promise.all(countryPromises);
				const allCountries = results.flatMap(res => res.data.data);
				const uniqueCountries = Array.from(new Map(allCountries.map(c => [c._id, c])).values());
				setCountries(uniqueCountries.sort((a, b) => a.name.localeCompare(b.name)));
			} catch (error) {
				console.error("Error fetching countries:", error);
			} finally {
				setLoadingGeo(false);
			}
		};
		fetchCountries();
	}, [formData.continents]);

	// Fetch cities when countries selection changes
	useEffect(() => {
		const fetchCities = async () => {
			if (formData.countries.length === 0) {
				setCities([]);
				return;
			}
			setLoadingGeo(true);
			try {
				const cityPromises = formData.countries.map(id => api.get(`/geo/cities/${id}`));
				const results = await Promise.all(cityPromises);
				const allCities = results.flatMap(res => res.data.data);
				const uniqueCities = Array.from(new Map(allCities.map(c => [c._id, c])).values());
				setCities(uniqueCities.sort((a, b) => a.name.localeCompare(b.name)));
			} catch (error) {
				console.error("Error fetching cities:", error);
			} finally {
				setLoadingGeo(false);
			}
		};
		fetchCities();
	}, [formData.countries]);

	// Clear dependent selections when parent changes
	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			countries: prev.countries.filter((id) =>
				countries.some(c => c._id === id)
			),
			cities: [],
		}));
	}, [countries]);

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			cities: prev.cities.filter((id) =>
				cities.some(c => c._id === id)
			),
		}));
	}, [cities]);

	const handleManualToggle = (field) => {
		setManualEntries(prev => ({
			...prev,
			[`is${field}Manual`]: !prev[`is${field}Manual`]
		}));
	};

	const handleManualInputChange = (e) => {
		const { name, value } = e.target;
		setManualEntries(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSaveManualCountry = async () => {
		if (!manualEntries.countryName || !manualEntries.continentName) {
			toast.error("Please enter country name and select continent");
			return;
		}

		try {
			const res = await api.post("/geo/countries/bulk", {
				countries: [{
					name: manualEntries.countryName,
					continent: manualEntries.continentName
				}]
			});

			if (res.data.success) {
				const newCountry = res.data.data[0];
				setCountries(prev => [...prev, newCountry].sort((a, b) => a.name.localeCompare(b.name)));
				handleMultiSelect("countries", newCountry._id);
				setManualEntries(prev => ({
					...prev,
					isCountryManual: false,
					countryName: "",
					continentName: ""
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
			const countryObj = countries.find(c => c._id === manualEntries.countryName || c.name === manualEntries.countryName);
			
			const res = await api.post("/geo/cities/bulk", {
				cities: [{
					name: manualEntries.cityName,
					country: manualEntries.countryName,
					continent: countryObj?.continent || formData.continents[0]
				}]
			});

			if (res.data.success) {
				const newCity = res.data.data[0];
				setCities(prev => [...prev, newCity].sort((a, b) => a.name.localeCompare(b.name)));
				handleMultiSelect("cities", newCity._id);
				setManualEntries(prev => ({
					...prev,
					isCityManual: false,
					cityName: "",
					countryName: ""
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
				keywords: prev.seo.keywords.filter(
					(k) => k !== keywordToRemove,
				),
			},
		}));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.airlineName.trim()) newErrors.airlineName = "Airline name is required";
		if (!formData.slug.trim()) newErrors.slug = "Slug is required";
		if (!formData.firstName.trim()) newErrors.firstName = "Brand name is required";
		if (formData.continents.length === 0) newErrors.continents = "Select at least one continent";
		if (formData.countries.length === 0) newErrors.countries = "Select at least one country";
		if (!formData.seo.metaTitle.trim()) newErrors["seo.metaTitle"] = "Meta title is required";
		if (!formData.seo.metaDescription.trim()) newErrors["seo.metaDescription"] = "Meta description is required";
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Please fix the errors in the form");
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

			formData.continents.forEach((c) => submitData.append("continents[]", c));
			formData.countries.forEach((c) => submitData.append("countries[]", c));
			formData.cities.forEach((c) => submitData.append("cities[]", c));

			submitData.append("about[description]", formData.about.description);
			submitData.append("about[history]", formData.about.history);
			submitData.append("about[services]", formData.about.services);
			submitData.append("about[additionalInfo]", formData.about.additionalInfo);

			submitData.append("seo[metaTitle]", formData.seo.metaTitle);
			submitData.append("seo[metaDescription]", formData.seo.metaDescription);
			formData.seo.keywords.forEach((k) => submitData.append("seo[keywords][]", k));
			submitData.append("seo[canonicalUrl]", formData.seo.canonicalUrl);
			submitData.append("seo[ogTitle]", formData.seo.ogTitle);
			submitData.append("seo[ogDescription]", formData.seo.ogDescription);

			if (formData.seo.ogImage) {
				submitData.append("seo[ogImage]", formData.seo.ogImage);
			}

			submitData.append("metadata[verified]", formData.metadata.verified);
			submitData.append("metadata[rating][value]", formData.metadata.rating.value);

			await onSave(submitData);
		} catch (error) {
			console.error("Form submission error:", error);
			toast.error(error.response?.data?.message || "Failed to save airline");
		} finally {
			setIsSubmitting(false);
		}
	};

	const tabs = [
		{ id: "basic", label: "Basic Info", icon: Building2 },
		{ id: "geographic", label: "Coverage", icon: MapPin },
		{ id: "about", label: "About", icon: FileText },
		{ id: "seo", label: "SEO", icon: Search },
		{ id: "status", label: "Status", icon: CheckCircle },
	];

	return (
		<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
				<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-bold text-white">
							{initialData ? "Edit Airline" : "Add New Airline"}
						</h2>
						<p className="text-blue-100 mt-1">
							{initialData ? "Update airline information" : "Create a new airline profile"}
						</p>
					</div>
					<button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
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

				<form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
					{activeTab === "basic" && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
										Airline Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="airlineName"
										value={formData.airlineName}
										onChange={handleInputChange}
										placeholder="e.g., Emirates Airlines"
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.airlineName ? "border-red-300" : "border-slate-200"} focus:border-blue-500 outline-none transition-all`}
									/>
									{errors.airlineName && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14} /> {errors.airlineName}</p>}
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
											className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.slug ? "border-red-300" : "border-slate-200"} focus:border-blue-500 outline-none pl-10`}
										/>
										<LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">Brand Name <span className="text-red-500">*</span></label>
									<input
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleInputChange}
										className={`w-full px-4 py-3 rounded-xl text-gray-900 border-2 ${errors.firstName ? "border-red-300" : "border-slate-200"} focus:border-blue-500 outline-none`}
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700">Logo</label>
									<div className="flex items-center gap-4">
										<div className="relative w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden group">
											{formData.logoPreview ? (
												<>
													<img src={formData.logoPreview} alt="Preview" className="w-full h-full object-cover" />
													<button type="button" onClick={() => setFormData(prev => ({ ...prev, logo: null, logoPreview: null }))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
														<X size={20} />
													</button>
												</>
											) : <Upload className="text-slate-400" size={24} />}
										</div>
										<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo", "logoPreview")} className="hidden" id="logo-upload" />
										<label htmlFor="logo-upload" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors font-medium text-sm flex items-center gap-2">
											<Upload size={16} /> Upload Logo
										</label>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === "geographic" && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="space-y-3">
								<label className="text-sm font-semibold text-slate-700">Continents <span className="text-red-500">*</span></label>
								<div className="flex flex-wrap gap-2">
									{continents.map((continent) => (
										<button
											key={continent._id}
											type="button"
											onClick={() => handleMultiSelect("continents", continent._id)}
											className={`px-4 py-2 rounded-lg border-2 transition-all ${formData.continents.includes(continent._id) ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"}`}
										>
											{continent.name}
										</button>
									))}
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex justify-between items-center mb-2">
									<label className="text-sm font-semibold text-slate-700">Countries <span className="text-red-500">*</span></label>
									<button type="button" onClick={() => handleManualToggle("Country")} className="text-xs text-blue-600 font-bold hover:underline">
										{manualEntries.isCountryManual ? "Cancel Manual" : "Add Manually"}
									</button>
								</div>
								
								{manualEntries.isCountryManual ? (
									<div className="p-4 border-2 border-blue-100 rounded-xl bg-blue-50/30 space-y-4">
										<input type="text" name="countryName" value={manualEntries.countryName} onChange={handleManualInputChange} placeholder="Country Name" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-gray-900" />
										<select value={manualEntries.continentName} name="continentName" onChange={handleManualInputChange} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-gray-900">
											<option value="">Select Continent</option>
											{continents.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
										</select>
										<button type="button" onClick={handleSaveManualCountry} className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2"><Save size={16}/> Save Country</button>
									</div>
								) : (
									<select multiple size={6} value={formData.countries} onChange={(e) => setFormData(prev => ({ ...prev, countries: Array.from(e.target.selectedOptions, o => o.value) }))} disabled={countries.length === 0} className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-blue-500 h-40">
										{countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
									</select>
								)}
							</div>

							<div className="space-y-3">
								<div className="flex justify-between items-center mb-2">
									<label className="text-sm font-semibold text-slate-700">Cities</label>
									<button type="button" onClick={() => handleManualToggle("City")} className="text-xs text-blue-600 font-bold hover:underline">
										{manualEntries.isCityManual ? "Cancel Manual" : "Add Manually"}
									</button>
								</div>
								
								{manualEntries.isCityManual ? (
									<div className="p-4 border-2 border-green-100 rounded-xl bg-green-50/30 space-y-4">
										<input type="text" name="cityName" value={manualEntries.cityName} onChange={handleManualInputChange} placeholder="City Name" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-gray-900" />
										<select value={manualEntries.countryName} name="countryName" onChange={handleManualInputChange} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-gray-900">
											<option value="">Select Country</option>
											{countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
										</select>
										<button type="button" onClick={handleSaveManualCity} className="w-full py-2 bg-green-600 text-white font-bold rounded-lg flex items-center justify-center gap-2"><Save size={16}/> Save City</button>
									</div>
								) : (
									<select multiple size={6} value={formData.cities} onChange={(e) => setFormData(prev => ({ ...prev, cities: Array.from(e.target.selectedOptions, o => o.value) }))} disabled={cities.length === 0} className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-blue-500 h-40">
										{cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
									</select>
								)}
							</div>
						</div>
					)}

					{activeTab === "about" && (
						<div className="space-y-6 animate-in fade-in duration-300">
							{["description", "history", "services", "additionalInfo"].map(field => (
								<div key={field} className="space-y-2">
									<label className="text-sm font-semibold text-slate-700 capitalize">{field}</label>
									<div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
										<Editor
											apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
											value={formData.about[field]}
											onEditorChange={(content) => handleRichTextChange(`about.${field}`, content)}
											init={TINYMCE_CONFIG}
										/>
									</div>
								</div>
							))}
						</div>
					)}

					{activeTab === "seo" && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="space-y-2">
								<label className="text-sm font-semibold text-slate-700">Meta Title <span className="text-red-500">*</span></label>
								<input type="text" name="seo.metaTitle" value={formData.seo.metaTitle} onChange={handleInputChange} maxLength={60} className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-blue-500" />
							</div>
							<div className="space-y-2">
								<label className="text-sm font-semibold text-slate-700">Meta Description <span className="text-red-500">*</span></label>
								<textarea name="seo.metaDescription" value={formData.seo.metaDescription} onChange={handleInputChange} rows={3} maxLength={160} className="w-full px-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:border-blue-500 resize-none" />
							</div>
							<div className="space-y-2">
								<label className="text-sm font-semibold text-slate-700">Keywords</label>
								<div className="flex flex-wrap gap-2 p-3 border-2 border-slate-200 rounded-xl bg-white">
									{formData.seo.keywords.map(k => (
										<span key={k} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm flex items-center gap-1">
											{k} <button type="button" onClick={() => handleRemoveKeyword(k)}><X size={14}/></button>
										</span>
									))}
									<input type="text" value={keywordInput} onChange={e => setKeywordInput(e.target.value)} onKeyDown={handleAddKeyword} placeholder="Type and press Enter" className="flex-1 outline-none text-gray-900 text-sm" />
								</div>
							</div>
						</div>
					)}

					{activeTab === "status" && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 flex justify-between items-center">
									<div>
										<h3 className="font-semibold text-slate-900">Verified</h3>
										<p className="text-sm text-slate-500">Mark as verified profile</p>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input type="checkbox" name="metadata.verified" checked={formData.metadata.verified} onChange={handleInputChange} className="sr-only peer" />
										<div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
									</label>
								</div>
								<div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 space-y-4">
									<div className="flex justify-between items-center text-slate-900">
										<h3 className="font-semibold">Initial Rating</h3>
										<span className="font-bold">{formData.metadata.rating.value}/5</span>
									</div>
									<input type="range" name="metadata.rating.value" min="0" max="5" step="0.1" value={formData.metadata.rating.value} onChange={handleInputChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
								</div>
							</div>
						</div>
					)}
				</form>

				<div className="border-t border-slate-200 p-6 bg-slate-50 flex justify-between items-center">
					<button type="button" onClick={onClose} className="px-6 py-3 text-slate-700 font-medium hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
					<div className="flex gap-3">
						<button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg flex-center">
							{isSubmitting ? (
								<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
							) : (
								<><Save size={20} /> {initialData ? "Update Airline" : "Save Airline"}</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
