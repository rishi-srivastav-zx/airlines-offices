"use client";

import { useState, useEffect, useRef } from "react";
import {
    Image as ImageIcon,
    Sparkles,
    FileText,
    Plus,
    Trash2,
    X,
    Upload,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import TinyMCEEditor from "./tinymceditor";

// Mock generateSEOData function
const generateSEOData = async (type, content) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const slug = content
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return {
        metaTitle: `${content} - Travel Blog & Tips`,
        metaDescription: `Read our latest article about ${content}. Expert insights and travel tips.`,
        keywords: content.split(" ").slice(0, 5),
    };
};

const uploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("http://localhost:3001/api/upload/image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const result = await response.json();
            
            if (result.success && result.url) {
                return result.url;
            } else {
                // Fallback to mock URL if upload fails
                console.warn("Upload failed, using mock URL");
                return `https://picsum.photos/seed/${Date.now()}/400/300.jpg`;
            }
        } catch (error) {
            console.error("Upload error:", error);
            // Fallback to mock URL
            return `https://picsum.photos/seed/${Date.now()}/400/300.jpg`;
        }
    };

export default function BlogFormModal({ mode, blog, onSave, onClose }) {
    const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [tagInput, setTagInput] = useState("");
    const [keywordInput, setKeywordInput] = useState("");
    const fileInputRef = useRef(null);

const steps = ["basic", "content", "cabin", "pricing", "seo"];
    const stepTitles = {
        basic: "Basic Information",
        content: "Content Details",
        cabin: "Cabin Classes & Upgrades",
        pricing: "Pricing",
        seo: "SEO Optimization",
    };

const [formData, setFormData] = useState({
        title: "",
        slug: "",
        featuredImage: "",
        category: "",
        tags: [],
        introduction: "",
        content: "",
        author: { 
            name: "", 
            role: "", 
            avatar: "",
            bio: "",
            website: "",
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: ""
        },
        cabinClasses: {
            economy: {
                seatTypes: [],
            },
            club: {
                advantages: [],
            },
        },
        upgradeOptions: [],
        pricing: {
            range: { min: 0, max: 0, currency: "INR" },
        },
        benefits: [],
        faq: [],
        relatedAirlines: [],
        seo: {
            metaTitle: "",
            metaDescription: "",
            keywords: [],
        },
        status: "pending",
        publishDate: new Date(),
    });

    const isEditMode = mode === "edit" || mode === "create";
    const isViewMode = mode === "view";
    const activeTab = steps[currentStep];

useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || "",
                slug: blog.slug || "",
                featuredImage: blog.featuredImage || "",
                category: blog.category || "",
                tags: blog.tags || [],
                introduction: blog.introduction || "",
                content: blog.content || "",
                author: blog.author || { 
                    name: "", 
                    role: "", 
                    avatar: "",
                    bio: "",
                    website: "",
                    facebook: "",
                    twitter: "",
                    linkedin: "",
                    instagram: ""
                },
                cabinClasses: blog.cabinClasses || {
                    economy: {
                        seatTypes: [],
                    },
                    club: {
                        advantages: [],
                    },
                },
                upgradeOptions: blog.upgradeOptions || [],
                pricing: blog.pricing || {
                    range: { min: 0, max: 0, currency: "INR" },
                },
                benefits: blog.benefits || [],
                faq: blog.faq || [],
                relatedAirlines: blog.relatedAirlines || [],
                seo: blog.seo || {
                    metaTitle: "",
                    metaDescription: "",
                    keywords: [],
                },
                status: blog.status || "pending",
                publishDate: blog.publishDate || new Date(),
            });
        }
    }, [blog, mode]);

const handleAuthorAvatarUpload = async (file) => {
        try {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Please upload a valid image file (JPG, PNG, GIF, WebP)");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB");
                return;
            }

            // Use the same upload method as featured image
            const avatarUrl = await uploadImage(file);
            
            setFormData((prev) => ({
                ...prev,
                author: {
                    ...prev.author,
                    avatar: avatarUrl, 
                },
            }));
        } catch (error) {
            alert("Failed to upload avatar. Please try again.");
        }
    };


useEffect(() => {
        if (isEditMode && formData.title && !blog) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9\s]+/g, " ") // Replace special chars with space first
                .trim()
                .replace(/\s+/g, "-") // Replace spaces with hyphens
                .replace(/^-|-$/g, "")
                .replace(/[()]/g, ""); // Remove parentheses
            setFormData((prev) => ({ ...prev, slug }));
        }
    }, [formData.title, isEditMode, blog]);

const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("Image upload started:", file.name, file.type, file.size);

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file (JPG, PNG, GIF, WebP)");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size should be less than 5MB");
            return;
        }

        setIsUploadingImage(true);
        try {
            const imageUrl = await uploadImage(file);
            console.log("Upload completed, URL:", imageUrl);
            setFormData((prev) => ({
                ...prev,
                featuredImage: imageUrl,
            }));
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleGenerateSEO = async () => {
        if (!formData.title) {
            alert("Please enter a blog title first.");
            return;
        }
        setIsGeneratingSEO(true);
        const result = await generateSEOData(
            "blog",
            `${formData.title}: ${formData.introduction.substring(0, 100)}`,
        );
        if (result) {
            setFormData((prev) => ({
                ...prev,
                seo: {
                    metaTitle: result.metaTitle,
                    metaDescription: result.metaDescription,
                    keywords: result.keywords,
                },
            }));
        }
        setIsGeneratingSEO(false);
    };

    const validateStep = (step) => {
        switch (step) {
            case 0: // basic
                if (!formData.title.trim()) {
                    alert("Please enter a title");
                    return false;
                }
                if (!formData.slug.trim()) {
                    alert("Please enter a slug");
                    return false;
                }
                if (!formData.featuredImage.trim()) {
                    alert("Please add a featured image URL or upload an image");
                    return false;
                }
                if (!formData.introduction.trim()) {
                    alert("Please enter an introduction");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate required fields before submission
        if (!formData.title || formData.title.trim() === "") {
            alert("Please provide a title before submitting.");
            return;
        }
        if (!formData.featuredImage || formData.featuredImage.trim() === "") {
            alert("Please upload a featured image before submitting.");
            return;
        }
        if (!formData.introduction || formData.introduction.trim() === "") {
            alert("Please provide an introduction before submitting.");
            return;
        }
        
        // Prepare clean data that matches the backend schema
        const submitData = {
            title: formData.title.trim(),
            slug: formData.slug.trim(),
            featuredImage: formData.featuredImage.trim(),
            category: formData.category?.trim() || "",
            tags: formData.tags.filter(tag => tag?.trim()),
            introduction: formData.introduction.trim(),
            content: formData.content?.trim() || "",
            author: {
                name: formData.author.name?.trim() || "",
                role: formData.author.role?.trim() || "",
                avatar: formData.author.avatar?.trim() || "",
                bio: formData.author.bio?.trim() || "",
                website: formData.author.website?.trim() || "",
                facebook: formData.author.facebook?.trim() || "",
                twitter: formData.author.twitter?.trim() || "",
                linkedin: formData.author.linkedin?.trim() || "",
                instagram: formData.author.instagram?.trim() || ""
            },
            cabinClasses: {
                economy: {
                    seatTypes: formData.cabinClasses.economy.seatTypes.filter(seat => seat?.type?.trim())
                },
                club: {
                    advantages: formData.cabinClasses.club.advantages.filter(adv => adv?.feature?.trim())
                }
            },
            upgradeOptions: formData.upgradeOptions.filter(option => option?.method?.trim()).map(option => ({
                method: option.method.trim(),
                steps: option.steps?.filter(step => step?.instruction?.trim()) || [],
                notes: option.notes?.filter(note => note?.trim()) || []
            })),
            pricing: {
                range: {
                    min: formData.pricing.range.min || 0,
                    max: formData.pricing.range.max || 0,
                    currency: formData.pricing.range.currency || "INR"
                }
            },
            benefits: formData.benefits.filter(benefit => benefit?.trim()),
            faq: formData.faq.filter(item => item?.question?.trim() && item?.answer?.trim()),
            relatedAirlines: formData.relatedAirlines.filter(airline => airline?.name?.trim()),
            seo: {
                metaTitle: formData.seo.metaTitle?.trim() || "",
                metaDescription: formData.seo.metaDescription?.trim() || "",
                keywords: formData.seo.keywords.filter(keyword => keyword?.trim())
            },
            status: mode === "create" ? "pending" : formData.status,
            publishDate: formData.publishDate || new Date()
        };
        
        console.log("=== FRONTEND SUBMITTING DATA ===");
        console.log(JSON.stringify(submitData, null, 2));
        
        onSave(submitData);
    };

    const getModalTitle = () => {
        if (mode === "view") return "View Blog Post";
        if (mode === "edit") return "Edit Blog Post";
        return "Write New Blog Post";
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput("");
        }
    };

    const removeTag = (tag) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    const addKeyword = () => {
        if (
            keywordInput.trim() &&
            !formData.seo.keywords.includes(keywordInput.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                seo: {
                    ...prev.seo,
                    keywords: [...prev.seo.keywords, keywordInput.trim()],
                },
            }));
            setKeywordInput("");
        }
    };

    const removeKeyword = (keyword) => {
        setFormData((prev) => ({
            ...prev,
            seo: {
                ...prev.seo,
                keywords: prev.seo.keywords.filter((k) => k !== keyword),
            },
        }));
    };

    const addBenefit = () => {
        setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
    };

    const updateBenefit = (index, value) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData((prev) => ({ ...prev, benefits: newBenefits }));
    };

    const removeBenefit = (index) => {
        setFormData((prev) => ({
            ...prev,
            benefits: prev.benefits.filter((_, i) => i !== index),
        }));
    };

    const addFAQ = () => {
        setFormData((prev) => ({
            ...prev,
            faq: [...prev.faq, { question: "", answer: "" }],
        }));
    };

    const updateFAQ = (index, field, value) => {
        const newFAQ = [...formData.faq];
        newFAQ[index][field] = value;
        setFormData((prev) => ({ ...prev, faq: newFAQ }));
    };

    const removeFAQ = (index) => {
        setFormData((prev) => ({
            ...prev,
            faq: prev.faq.filter((_, i) => i !== index),
        }));
    };

    const addRelatedAirline = () => {
        setFormData((prev) => ({
            ...prev,
            relatedAirlines: [...prev.relatedAirlines, { name: "", link: "" }],
        }));
    };

    const updateRelatedAirline = (index, field, value) => {
        const newAirlines = [...formData.relatedAirlines];
        newAirlines[index][field] = value;
        setFormData((prev) => ({ ...prev, relatedAirlines: newAirlines }));
    };

    const removeRelatedAirline = (index) => {
        setFormData((prev) => ({
            ...prev,
            relatedAirlines: prev.relatedAirlines.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="p-6 border-b sticky top-0 bg-white z-10">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {getModalTitle()}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 text-2xl font-light"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Progress Steps */}
                        {isEditMode && (
                            <div className="flex items-center justify-between">
                                {steps.map((step, index) => (
                                    <div
                                        key={step}
                                        className="flex items-center flex-1"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                    index <= currentStep
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-slate-200 text-slate-500"
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <span
                                                className={`text-sm font-medium whitespace-nowrap ${
                                                    index <= currentStep
                                                        ? "text-indigo-600"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                {stepTitles[step]}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`flex-1 h-0.5 mx-2 ${
                                                    index < currentStep
                                                        ? "bg-indigo-600"
                                                        : "bg-slate-200"
                                                }`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* View Mode Tabs */}
                        {isViewMode && (
                            <div className="flex gap-2 mt-4 border-b overflow-x-auto">
                                {steps.map((tab, index) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setCurrentStep(index)}
                                        className={`px-4 py-2 font-medium text-sm capitalize whitespace-nowrap ${
                                            currentStep === index
                                                ? "border-b-2 border-indigo-600 text-indigo-600"
                                                : "text-slate-500 hover:text-slate-700"
                                        }`}
                                    >
                                        {stepTitles[tab]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        {/* Basic Tab */}
                        {activeTab === "basic" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Article Title *
                                    </label>
                                    <input
                                        required
                                        disabled={isViewMode}
                                        placeholder="Enter a catchy headline..."
                                        className="w-full px-4 py-3 text-lg rounded-xl border-2 border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-gray-900 transition-all outline-none disabled:bg-gray-50"
                                        value={formData.title || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        required
                                        disabled={isViewMode}
                                        placeholder="blog-post-slug"
                                        className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                        value={formData.slug || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                slug: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Category
                                    </label>
                                    <input
                                        disabled={isViewMode}
                                        placeholder="Travel Tips"
                                        className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                        value={formData.category || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Featured Image *
                                    </label>

{/* Image Upload Only */}
                                    <div className="space-y-3">
                                        <p className="text-xs text-slate-500 mb-2">
                                            Upload an image file for the featured image
                                        </p>
                                        {/* Upload Button */}
                                        {isEditMode && (
                                            <div>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    disabled={isUploadingImage}
                                                    className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 disabled:opacity-50"
                                                >
                                                    <Upload size={20} />
                                                    {isUploadingImage
                                                        ? "Uploading..."
                                                        : "Click to Upload Image"}
                                                </button>
                                            </div>
                                        )}

{/* Image Preview */}
                                        {formData.featuredImage && (
                                            <div className="relative">
                                                <img
                                                    src={formData.featuredImage}
                                                    alt="Preview"
                                                    className="w-full h-64 object-cover rounded-lg"
                                                    onLoad={() => console.log("Image loaded successfully")}
                                                    onError={(e) => {
                                                        console.error("Image failed to load:", formData.featuredImage);
                                                        e.target.style.display = "none";
                                                    }}
                                                />
                                                {isEditMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                featuredImage:
                                                                    "",
                                                            })
                                                        }
                                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Tags
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            disabled={isViewMode}
                                            placeholder="Add tag..."
                                            className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                            value={tagInput}
                                            onChange={(e) =>
                                                setTagInput(e.target.value)
                                            }
                                            onKeyPress={(e) =>
                                                e.key === "Enter" &&
                                                (e.preventDefault(), addTag())
                                            }
                                        />
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={addTag}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
                                            >
                                                {tag}
                                                {isEditMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTag(tag)
                                                        }
                                                        className="hover:text-indigo-900"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Introduction *
                                    </label>
                                    <textarea
                                        required
                                        disabled={isViewMode}
                                        rows={4}
                                        placeholder="Write a brief introduction..."
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none resize-none disabled:bg-gray-50"
                                        value={formData.introduction || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                introduction: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 text-indigo-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Author Information
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Name, Role, and Avatar */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Full Name{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={isViewMode}
                                                    placeholder="Enter author name"
                                                    className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all text-slate-900 placeholder:text-slate-400 ${
                                                        isViewMode
                                                            ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                                                            : "border-slate-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                                    }`}
                                                    value={
                                                        formData.author?.name ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            author: {
                                                                ...formData.author,
                                                                name: e.target
                                                                    .value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Role */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Role / Title
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={isViewMode}
                                                    placeholder="e.g., Senior Writer"
                                                    className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all text-slate-900 placeholder:text-slate-400 ${
                                                        isViewMode
                                                            ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                                                            : "border-slate-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                                    }`}
                                                    value={
                                                        formData.author?.role ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            author: {
                                                                ...formData.author,
                                                                role: e.target
                                                                    .value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Avatar Upload */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Profile Picture
                                                </label>

                                                <div className="flex items-start gap-4">
                                                    {/* Avatar Preview */}
                                                    <div className="relative">
                                                        {formData.author
                                                            ?.avatar ? (
                                                            <div className="relative group">
                                                                <img
                                                                    src={
                                                                        formData
                                                                            .author
                                                                            .avatar
                                                                    }
                                                                    alt="Author avatar preview"
                                                                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-300 shadow-sm"
                                                                />
                                                                {!isViewMode && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setFormData(
                                                                                {
                                                                                    ...formData,
                                                                                    author: {
                                                                                        ...formData.author,
                                                                                        avatar: null,
                                                                                    },
                                                                                },
                                                                            )
                                                                        }
                                                                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                                                        title="Remove image"
                                                                    >
                                                                        <svg
                                                                            className="w-3.5 h-3.5"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={
                                                                                    2
                                                                                }
                                                                                d="M6 18L18 6M6 6l12 12"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                                <svg
                                                                    className="w-8 h-8 text-slate-400"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Upload Input */}
                                                    <div className="flex-1">
                                                        <label
                                                            className={`block cursor-pointer ${isViewMode ? "cursor-not-allowed" : ""}`}
                                                        >
                                                            <div
                                                                className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                                                                    isViewMode
                                                                        ? "border-slate-200 bg-slate-50"
                                                                        : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50"
                                                                }`}
                                                            >
                                                                <svg
                                                                    className="mx-auto h-8 w-8 text-slate-400 mb-2"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                    />
                                                                </svg>
                                                                <p className="text-sm font-medium text-slate-700 mb-1">
                                                                    {formData
                                                                        .author
                                                                        ?.avatar
                                                                        ? "Change picture"
                                                                        : "Upload a picture"}
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    PNG, JPG up
                                                                    to 5MB
                                                                </p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                disabled={
                                                                    isViewMode
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const file =
                                                                        e.target
                                                                            .files?.[0];
                                                                    if (file) {
                                                                        handleAuthorAvatarUpload(
                                                                            file,
                                                                        );
                                                                    }
                                                                }}
                                                                className="hidden"
                                                            />
                                                        </label>

                                                        {formData.author
                                                            ?.avatar &&
                                                            !isViewMode && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setFormData(
                                                                            {
                                                                                ...formData,
                                                                                author: {
                                                                                    ...formData.author,
                                                                                    avatar: null,
                                                                                },
                                                                            },
                                                                        )
                                                                    }
                                                                    className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-1"
                                                                >
                                                                    <svg
                                                                        className="w-4 h-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                    Remove
                                                                    picture
                                                                </button>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Biography
                                            </label>
                                            <textarea
                                                rows={4}
                                                disabled={isViewMode}
                                                placeholder="Write a brief bio about the author..."
                                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all resize-none text-slate-900 placeholder:text-slate-400 ${
                                                    isViewMode
                                                        ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                                                        : "border-slate-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                                }`}
                                                value={
                                                    formData.author?.bio || ""
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        author: {
                                                            ...formData.author,
                                                            bio: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                            <p className="mt-1 text-xs text-slate-500">
                                                {formData.author?.bio?.length ||
                                                    0}{" "}
                                                / 500 characters
                                            </p>
                                        </div>

                                        {/* Social Links */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                                Social Media Links
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {[
                                                    {
                                                        field: "website",
                                                        label: "Website",
                                                        icon: "🌐",
                                                        placeholder:
                                                            "https://example.com",
                                                    },
                                                    {
                                                        field: "facebook",
                                                        label: "Facebook",
                                                        icon: "📘",
                                                        placeholder:
                                                            "https://facebook.com/username",
                                                    },
                                                    {
                                                        field: "twitter",
                                                        label: "Twitter/X",
                                                        icon: "🐦",
                                                        placeholder:
                                                            "https://twitter.com/username",
                                                    },
                                                    {
                                                        field: "linkedin",
                                                        label: "LinkedIn",
                                                        icon: "💼",
                                                        placeholder:
                                                            "https://linkedin.com/in/username",
                                                    },
                                                    {
                                                        field: "instagram",
                                                        label: "Instagram",
                                                        icon: "📷",
                                                        placeholder:
                                                            "https://instagram.com/username",
                                                    },

                                                ].map(
                                                    ({
                                                        field,
                                                        label,
                                                        icon,
                                                        placeholder,
                                                    }) => (
                                                        <div key={field}>
                                                            <label className="block text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1">
                                                                <span>
                                                                    {icon}
                                                                </span>
                                                                {label}
                                                            </label>
                                                            <input
                                                                type="url"
                                                                disabled={
                                                                    isViewMode
                                                                }
                                                                placeholder={
                                                                    placeholder
                                                                }
                                                                className={`w-full px-3 py-2 rounded-lg border-2 transition-all text-sm text-slate-900 placeholder:text-slate-400 ${
                                                                    isViewMode
                                                                        ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                                                                        : "border-slate-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                                                }`}
                                                                value={
                                                                    formData
                                                                        .author?.[
                                                                        field
                                                                    ] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            author: {
                                                                                ...formData.author,
                                                                                [field]:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        },
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>




                            </div>
                        )}

{/* Content Tab */}
                        {activeTab === "content" && (
                            <div className="space-y-6">
                                {/* Main Content Editor */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                                        Blog Content
                                    </h3>
                                    <TinyMCEEditor
                                        value={formData.content}
                                        onChange={(content) =>
                                            setFormData({
                                                ...formData,
                                                content: content,
                                            })
                                        }
                                        height={400}
                                        placeholder="Write your blog content here..."
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Benefits
                                        </h3>
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={addBenefit}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                                            >
                                                <Plus size={16} /> Add Benefit
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {formData.benefits.map(
                                            (benefit, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2"
                                                >
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Benefit description..."
                                                        className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                        value={benefit}
                                                        onChange={(e) =>
                                                            updateBenefit(
                                                                index,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    {isEditMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeBenefit(
                                                                    index,
                                                                )
                                                            }
                                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            FAQ
                                        </h3>
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={addFAQ}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                                            >
                                                <Plus size={16} /> Add FAQ
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {formData.faq.map((item, index) => (
                                            <div
                                                key={index}
                                                className="p-4 border-2 border-slate-200 rounded-lg space-y-2"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-slate-700">
                                                        Question {index + 1}
                                                    </span>
                                                    {isEditMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFAQ(index)
                                                            }
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <input
                                                    disabled={isViewMode}
                                                    placeholder="Question..."
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                    value={item.question}
                                                    onChange={(e) =>
                                                        updateFAQ(
                                                            index,
                                                            "question",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <textarea
                                                    disabled={isViewMode}
                                                    rows={3}
                                                    placeholder="Answer..."
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                    value={item.answer}
                                                    onChange={(e) =>
                                                        updateFAQ(
                                                            index,
                                                            "answer",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Related Airlines
                                        </h3>
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={addRelatedAirline}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                                            >
                                                <Plus size={16} /> Add Airline
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {formData.relatedAirlines.map(
                                            (airline, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2"
                                                >
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Airline name..."
                                                        className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                        value={airline.name}
                                                        onChange={(e) =>
                                                            updateRelatedAirline(
                                                                index,
                                                                "name",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Link..."
                                                        className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                        value={airline.link}
                                                        onChange={(e) =>
                                                            updateRelatedAirline(
                                                                index,
                                                                "link",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    {isEditMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeRelatedAirline(
                                                                    index,
                                                                )
                                                            }
                                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cabin Classes & Upgrades Tab */}
                        {activeTab === "cabin" && (
                            <div className="space-y-8">
                                {/* Economy Class */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                                        Economy Class Seat Types
                                    </h3>
                                    <div className="space-y-3">
                                        {formData.cabinClasses.economy.seatTypes.map((seatType, index) => (
                                            <div key={index} className="p-4 border-2 border-slate-200 rounded-lg space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-slate-700">
                                                        Seat Type {index + 1}
                                                    </span>
                                                    {isEditMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newSeatTypes = [...formData.cabinClasses.economy.seatTypes];
                                                                newSeatTypes.splice(index, 1);
                                                                setFormData({
                                                                    ...formData,
                                                                    cabinClasses: {
                                                                        ...formData.cabinClasses,
                                                                        economy: {
                                                                            ...formData.cabinClasses.economy,
                                                                            seatTypes: newSeatTypes
                                                                        }
                                                                    }
                                                                });
                                                            }}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Seat Type Name"
                                                        className="px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                        value={seatType.type || ""}
                                                        onChange={(e) => {
                                                            const newSeatTypes = [...formData.cabinClasses.economy.seatTypes];
                                                            newSeatTypes[index] = { ...seatType, type: e.target.value };
                                                            setFormData({
                                                                ...formData,
                                                                cabinClasses: {
                                                                    ...formData.cabinClasses,
                                                                    economy: {
                                                                        ...formData.cabinClasses.economy,
                                                                        seatTypes: newSeatTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    />
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Description"
                                                        className="px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                        value={seatType.description || ""}
                                                        onChange={(e) => {
                                                            const newSeatTypes = [...formData.cabinClasses.economy.seatTypes];
                                                            newSeatTypes[index] = { ...seatType, description: e.target.value };
                                                            setFormData({
                                                                ...formData,
                                                                cabinClasses: {
                                                                    ...formData.cabinClasses,
                                                                    economy: {
                                                                        ...formData.cabinClasses.economy,
                                                                        seatTypes: newSeatTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    />
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Legroom"
                                                        className="px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                        value={seatType.legroom || ""}
                                                        onChange={(e) => {
                                                            const newSeatTypes = [...formData.cabinClasses.economy.seatTypes];
                                                            newSeatTypes[index] = { ...seatType, legroom: e.target.value };
                                                            setFormData({
                                                                ...formData,
                                                                cabinClasses: {
                                                                    ...formData.cabinClasses,
                                                                    economy: {
                                                                        ...formData.cabinClasses.economy,
                                                                        seatTypes: newSeatTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        cabinClasses: {
                                                            ...formData.cabinClasses,
                                                            economy: {
                                                                ...formData.cabinClasses.economy,
                                                                seatTypes: [...formData.cabinClasses.economy.seatTypes, { type: "", description: "", legroom: "" }]
                                                            }
                                                        }
                                                    });
                                                }}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                                            >
                                                <Plus size={16} /> Add Seat Type
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Club Class */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                                        Club Class Advantages
                                    </h3>
                                    <div className="space-y-3">
                                        {formData.cabinClasses.club.advantages.map((advantage, index) => (
                                            <div key={index} className="p-4 border-2 border-slate-200 rounded-lg space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-slate-700">
                                                        Advantage {index + 1}
                                                    </span>
                                                    {isEditMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newAdvantages = [...formData.cabinClasses.club.advantages];
                                                                newAdvantages.splice(index, 1);
                                                                setFormData({
                                                                    ...formData,
                                                                    cabinClasses: {
                                                                        ...formData.cabinClasses,
                                                                        club: {
                                                                            ...formData.cabinClasses.club,
                                                                            advantages: newAdvantages
                                                                        }
                                                                    }
                                                                });
                                                            }}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Feature Name"
                                                        className="px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                        value={advantage.feature || ""}
                                                        onChange={(e) => {
                                                            const newAdvantages = [...formData.cabinClasses.club.advantages];
                                                            newAdvantages[index] = { ...advantage, feature: e.target.value };
                                                            setFormData({
                                                                ...formData,
                                                                cabinClasses: {
                                                                    ...formData.cabinClasses,
                                                                    club: {
                                                                        ...formData.cabinClasses.club,
                                                                        advantages: newAdvantages
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    />
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Description"
                                                        className="px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                        value={advantage.description || ""}
                                                        onChange={(e) => {
                                                            const newAdvantages = [...formData.cabinClasses.club.advantages];
                                                            newAdvantages[index] = { ...advantage, description: e.target.value };
                                                            setFormData({
                                                                ...formData,
                                                                cabinClasses: {
                                                                    ...formData.cabinClasses,
                                                                    club: {
                                                                        ...formData.cabinClasses.club,
                                                                        advantages: newAdvantages
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        cabinClasses: {
                                                            ...formData.cabinClasses,
                                                            club: {
                                                                ...formData.cabinClasses.club,
                                                                advantages: [...formData.cabinClasses.club.advantages, { feature: "", description: "" }]
                                                            }
                                                        }
                                                    });
                                                }}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                                            >
                                                <Plus size={16} /> Add Advantage
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Upgrade Options */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                                        Upgrade Options
                                    </h3>
                                    <div className="space-y-4">
                                        {formData.upgradeOptions.map((option, index) => (
                                            <div key={index} className="p-4 border-2 border-slate-200 rounded-lg space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-slate-700">
                                                        Upgrade Method {index + 1}
                                                    </span>
                                                    {isEditMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newOptions = [...formData.upgradeOptions];
                                                                newOptions.splice(index, 1);
                                                                setFormData({
                                                                    ...formData,
                                                                    upgradeOptions: newOptions
                                                                });
                                                            }}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <input
                                                    disabled={isViewMode}
                                                    placeholder="Upgrade Method"
                                                    className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                    value={option.method || ""}
                                                    onChange={(e) => {
                                                        const newOptions = [...formData.upgradeOptions];
                                                        newOptions[index] = { ...option, method: e.target.value };
                                                        setFormData({
                                                            ...formData,
                                                            upgradeOptions: newOptions
                                                        });
                                                    }}
                                                />
                                                
                                                {/* Steps */}
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Steps</h4>
                                                    <div className="space-y-2">
                                                        {option.steps?.map((step, stepIndex) => (
                                                            <div key={stepIndex} className="flex gap-2 items-center">
                                                                <input
                                                                    disabled={isViewMode}
                                                                    type="number"
                                                                    placeholder="#"
                                                                    className="w-16 px-2 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                                    value={step.stepNumber || ""}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...formData.upgradeOptions];
                                                                        if (!newOptions[index].steps) newOptions[index].steps = [];
                                                                        newOptions[index].steps[stepIndex] = { ...step, stepNumber: parseInt(e.target.value) || 0 };
                                                                        setFormData({
                                                                            ...formData,
                                                                            upgradeOptions: newOptions
                                                                        });
                                                                    }}
                                                                />
                                                                <input
                                                                    disabled={isViewMode}
                                                                    placeholder="Instruction"
                                                                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                                    value={step.instruction || ""}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...formData.upgradeOptions];
                                                                        if (!newOptions[index].steps) newOptions[index].steps = [];
                                                                        newOptions[index].steps[stepIndex] = { ...step, instruction: e.target.value };
                                                                        setFormData({
                                                                            ...formData,
                                                                            upgradeOptions: newOptions
                                                                        });
                                                                    }}
                                                                />
                                                                {isEditMode && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newOptions = [...formData.upgradeOptions];
                                                                            if (!newOptions[index].steps) newOptions[index].steps = [];
                                                                            newOptions[index].steps.splice(stepIndex, 1);
                                                                            setFormData({
                                                                                ...formData,
                                                                                upgradeOptions: newOptions
                                                                            });
                                                                        }}
                                                                        className="text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {isEditMode && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newOptions = [...formData.upgradeOptions];
                                                                    if (!newOptions[index].steps) newOptions[index].steps = [];
                                                                    newOptions[index].steps.push({ stepNumber: 0, instruction: "" });
                                                                    setFormData({
                                                                        ...formData,
                                                                        upgradeOptions: newOptions
                                                                    });
                                                                }}
                                                                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
                                                            >
                                                                Add Step
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Notes</h4>
                                                    <div className="space-y-2">
                                                        {option.notes?.map((note, noteIndex) => (
                                                            <div key={noteIndex} className="flex gap-2">
                                                                <input
                                                                    disabled={isViewMode}
                                                                    placeholder="Note"
                                                                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                                    value={note || ""}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...formData.upgradeOptions];
                                                                        if (!newOptions[index].notes) newOptions[index].notes = [];
                                                                        newOptions[index].notes[noteIndex] = e.target.value;
                                                                        setFormData({
                                                                            ...formData,
                                                                            upgradeOptions: newOptions
                                                                        });
                                                                    }}
                                                                />
                                                                {isEditMode && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newOptions = [...formData.upgradeOptions];
                                                                            if (!newOptions[index].notes) newOptions[index].notes = [];
                                                                            newOptions[index].notes.splice(noteIndex, 1);
                                                                            setFormData({
                                                                                ...formData,
                                                                                upgradeOptions: newOptions
                                                                            });
                                                                        }}
                                                                        className="text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {isEditMode && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newOptions = [...formData.upgradeOptions];
                                                                    if (!newOptions[index].notes) newOptions[index].notes = [];
                                                                    newOptions[index].notes.push("");
                                                                    setFormData({
                                                                        ...formData,
                                                                        upgradeOptions: newOptions
                                                                    });
                                                                }}
                                                                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
                                                            >
                                                                Add Note
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        upgradeOptions: [...formData.upgradeOptions, { method: "", steps: [], notes: [] }]
                                                    });
                                                }}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                                            >
                                                <Plus size={16} /> Add Upgrade Option
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pricing Tab */}
                        {activeTab === "pricing" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-900">
                                    Pricing Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Minimum Price
                                        </label>
                                        <input
                                            type="number"
                                            disabled={isViewMode}
                                            placeholder="0"
                                            className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                            value={
                                                formData.pricing.range.min || ""
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    pricing: {
                                                        range: {
                                                            ...formData.pricing
                                                                .range,
                                                            min:
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 0,
                                                        },
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Maximum Price
                                        </label>
                                        <input
                                            type="number"
                                            disabled={isViewMode}
                                            placeholder="0"
                                            className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                            value={
                                                formData.pricing.range.max || ""
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    pricing: {
                                                        range: {
                                                            ...formData.pricing
                                                                .range,
                                                            max:
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 0,
                                                        },
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Currency
                                        </label>
                                        <select
                                            disabled={isViewMode}
                                            className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                            value={
                                                formData.pricing.range.currency
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    pricing: {
                                                        range: {
                                                            ...formData.pricing
                                                                .range,
                                                            currency:
                                                                e.target.value,
                                                        },
                                                    },
                                                })
                                            }
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* SEO Tab */}
                        {activeTab === "seo" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Sparkles
                                            size={20}
                                            className="text-indigo-600"
                                        />
                                        SEO Optimization
                                    </h3>
                                    {isEditMode && (
                                        <button
                                            type="button"
                                            onClick={handleGenerateSEO}
                                            disabled={isGeneratingSEO}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
                                        >
                                            {isGeneratingSEO
                                                ? "Generating..."
                                                : "Generate with AI"}
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Meta Title
                                    </label>
                                    <input
                                        disabled={isViewMode}
                                        placeholder="SEO optimized title..."
                                        className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                        value={formData.seo.metaTitle || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                seo: {
                                                    ...formData.seo,
                                                    metaTitle: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        disabled={isViewMode}
                                        rows={3}
                                        placeholder="Brief description for search engines..."
                                        className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                        value={
                                            formData.seo.metaDescription || ""
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                seo: {
                                                    ...formData.seo,
                                                    metaDescription:
                                                        e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Keywords
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            disabled={isViewMode}
                                            placeholder="Add keyword..."
                                            className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                            value={keywordInput}
                                            onChange={(e) =>
                                                setKeywordInput(e.target.value)
                                            }
                                            onKeyPress={(e) =>
                                                e.key === "Enter" &&
                                                (e.preventDefault(),
                                                addKeyword())
                                            }
                                        />
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={addKeyword}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.seo.keywords.map(
                                            (keyword, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
                                                >
                                                    {keyword}
                                                    {isEditMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeKeyword(
                                                                    keyword,
                                                                )
                                                            }
                                                            className="hover:text-green-900"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t bg-slate-50 rounded-b-2xl flex justify-between gap-3 sticky bottom-0">
                        <div>
                            {isEditMode && currentStep > 0 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="px-6 py-2.5 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-2"
                                >
                                    <ChevronLeft size={18} />
                                    Previous
                                </button>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
                            >
                                {isEditMode ? "Cancel" : "Close"}
                            </button>

                            {isEditMode && currentStep < steps.length - 1 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8 py-2.5 font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-900/10 transition-all flex items-center gap-2"
                                >
                                    Next
                                    <ChevronRight size={18} />
                                </button>
                            )}

                            {isEditMode && currentStep === steps.length - 1 && (
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg shadow-green-900/10 transition-all"
                                >
                                    {mode === "edit"
                                        ? "Update & Publish"
                                        : "Save & Publish"}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
