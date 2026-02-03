"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    MessageSquare,
    Search,
    Building2,
    FileText,
    Loader2,
    MapPin,
    Settings,
    X,
    Sparkles,
    AlertCircle,
    Check,
} from "lucide-react";
import { formatOfficeHours, generateAirlineId, slugify } from "@/utils/slugifyhelper";

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
    const [servicesText, setServicesText] = useState("");
    const [availableServicesText, setAvailableServicesText] = useState("");

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
            [name]: URL.createObjectURL(file),
        }));
    };

    useEffect(() => {
        if (formData.about && Array.isArray(formData.about.services)) {
            setServicesText(formData.about.services.join(", "));
        }
    }, [formData.about?.services]);

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

    useEffect(() => {
        if (Array.isArray(formData.availableServices)) {
            setAvailableServicesText(formData.availableServices.join(", "));
        }
    }, [formData.availableServices]);

    const handleArrayInputChange = (path, value) => {
        const keys = path.split("."); // ["about", "services"]

        setFormData((prev) => {
            const updated = { ...prev };
            let current = updated;

            // walk to parent
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            // set final value as array
            const finalValue = Array.isArray(value)
                ? value
                : value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean);

            current[keys[keys.length - 1]] = finalValue;

            return updated;
        });
    };

    useEffect(() => {
        if (formData?.about?.airlineName && !formData?.about?.airlineId) {
            setFormData((prev) => ({
                ...prev,
                about: {
                    ...prev.about,
                    airlineId: generateAirlineId(prev.about.airlineName),
                },
            }));
        }
    }, [formData?.about?.airlineName]);

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
                                checked={formData.metadata?.verified || false}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-gray-900"
                            />
                            <span className="flex items-center gap-2 text-gray-900 font-semibold">
                                <Sparkles className="text-yellow-500" size={18} />
                                Verified airline
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

                        <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
                            <h3 className="font-semibold text-blue-900">About Section</h3>

                            <InputWrapper label="Airline ID" required>
                                <input
                                    name="about.airlineId"
                                    value={formData.about.airlineId || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    placeholder="Auto generated"
                                />
                            </InputWrapper>

                            <InputWrapper label="Office Location" required>
                                <textarea
                                    name="about.location"
                                    value={formData.about.location || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={2}
                                    placeholder="Describe the office location..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Overview" required>
                                <textarea
                                    name="about.overview"
                                    value={formData.about.overview || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={4}
                                    placeholder="General overview of the airline..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Network">
                                <textarea
                                    name="about.network"
                                    value={formData.about.network || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={3}
                                    placeholder="Information about the airline's route network..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Fleet">
                                <textarea
                                    name="about.fleet"
                                    value={formData.about.fleet || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={3}
                                    placeholder="Details about the aircraft fleet..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Cabins">
                                <textarea
                                    name="about.cabins"
                                    value={formData.about.cabins || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={3}
                                    placeholder="Description of cabin classes and amenities..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Alliance">
                                <textarea
                                    name="about.alliance"
                                    value={formData.about.alliance || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={2}
                                    placeholder="Information about airline alliances..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Services">
                                <textarea
                                    name="about.services"
                                    value={formData.about.services || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={3}
                                    placeholder="Services offered by the airline..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Baggage">
                                <textarea
                                    name="about.baggage"
                                    value={formData.about.baggage || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={3}
                                    placeholder="Baggage policies and allowances..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Loyalty Program">
                                <textarea
                                    name="about.loyalty"
                                    value={formData.about.loyalty || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={3}
                                    placeholder="Details about the loyalty program..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Airport Services">
                                <textarea
                                    name="about.airportServices"
                                    value={formData.about.airportServices || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={3}
                                    placeholder="Services available at the airport..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Target Customers">
                                <textarea
                                    name="about.targetCustomers"
                                    value={formData.about.targetCustomers || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={3}
                                    placeholder="Information about target customer segments..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Support">
                                <textarea
                                    name="about.support"
                                    value={formData.about.support || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={3}
                                    placeholder="Customer support information..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Description">
                                <textarea
                                    name="about.description"
                                    value={formData.about.description || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={4}
                                    placeholder="Additional description..."
                                />
                            </InputWrapper>

                            <InputWrapper label="History">
                                <textarea
                                    name="about.history"
                                    value={formData.about.history || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={3}
                                    placeholder="Historical information about the airline..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Additional Info">
                                <textarea
                                    name="about.additionalInfo"
                                    value={formData.about.additionalInfo || ""}
                                    onChange={handleInputChange}
                                    className="input-ui text-gray-900"
                                    rows={2}
                                    placeholder="Any additional information..."
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
                                type="text"
                                value={availableServicesText}
                                onChange={(e) => setAvailableServicesText(e.target.value)}
                                onBlur={() => {
                                    const servicesArray = availableServicesText
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean);

                                    handleArrayInputChange("availableServices", servicesArray);
                                }}
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
                            <h3 className="font-semibold text-green-900">SEO Metadata</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ⭐ Rating Value */}
                                <InputWrapper label="Rating (0–5)">
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={formData.metadata?.rating?.value || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                metadata: {
                                                    ...prev.metadata,
                                                    rating: {
                                                        ...prev.metadata?.rating,
                                                        value: e.target.value
                                                            ? parseFloat(e.target.value)
                                                            : 0,
                                                    },
                                                },
                                            }))
                                        }
                                        className="input-ui text-gray-900"
                                    />
                                </InputWrapper>

                                {/* 🧾 Review Count */}
                                <InputWrapper label="Review Count">
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.metadata?.reviewCount || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                metadata: {
                                                    ...prev.metadata,
                                                    reviewCount: e.target.value
                                                        ? parseInt(e.target.value)
                                                        : 0,
                                                },
                                            }))
                                        }
                                        className="input-ui text-gray-900"
                                    />
                                </InputWrapper>

                                {/* 📝 Review Summary (Meta Description) */}
                                <InputWrapper label="Review Summary (SEO)">
                                    <textarea
                                        maxLength={160}
                                        value={formData.metadata?.reviewSummary || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                metadata: {
                                                    ...prev.metadata,
                                                    reviewSummary: e.target.value,
                                                },
                                            }))
                                        }
                                        className="input-ui text-gray-900 resize-none"
                                        placeholder="Short SEO-friendly description (max 160 chars)"
                                    />
                                </InputWrapper>

                                {/* 🏷️ SEO Keywords */}
                                <InputWrapper label="SEO Keywords (comma separated)">
                                    <input
                                        type="text"
                                        value={(formData.metadata?.keywords || []).join(", ")}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                metadata: {
                                                    ...prev.metadata,
                                                    keywords: e.target.value
                                                        .split(",")
                                                        .map((k) => k.trim())
                                                        .filter(Boolean),
                                                },
                                            }))
                                        }
                                        className="input-ui text-gray-900"
                                        placeholder="qatar airways dubai office, contact number"
                                    />
                                </InputWrapper>

                                {/* ✅ Verified */}
                                <InputWrapper label="Verified Listing">
                                    <select
                                        value={formData.metadata?.verified ? "yes" : "no"}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                metadata: {
                                                    ...prev.metadata,
                                                    verified: e.target.value === "yes",
                                                },
                                            }))
                                        }
                                        className="input-ui text-gray-900"
                                    >
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                    </select>
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
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${isActive
                                                ? "bg-blue-600 text-white scale-110"
                                                : isCompleted
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-200 text-gray-500"
                                            }`}
                                    >
                                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                                    </div>
                                    <span
                                        className={`text-xs mt-2 font-semibold ${isActive ? "text-blue-600" : "text-gray-500"
                                            }`}
                                    >
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`h-1 flex-1 mx-2 rounded transition-all ${isCompleted ? "bg-green-500" : "bg-gray-200"
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

export default AirlineOfficeForm;
