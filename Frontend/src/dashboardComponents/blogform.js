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
    AlertCircle,
    CheckCircle,
    Info,
} from "lucide-react";
import TinyMCEEditor from "./tinymceditor";
import { toast } from "react-hot-toast";

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
            console.warn("Upload failed, using mock URL");
            return `https://picsum.photos/seed/${Date.now()}/400/300.jpg`;
        }
    } catch (error) {
        console.error("Upload error:", error);
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
    instagram: "",
  },

    cabinClasses: {
      economy: {
        seatTypes: [
          {
            seatName: "",
            description: "",
            legroom: "",
          },
        ],
      },
      club: {
      advantages: [
        {
          feature: "",
          description: "",
        },
      ],
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
  if (!blog) return;

  setFormData({
    title: blog.title ?? "",
    slug: blog.slug ?? "",
    featuredImage: blog.featuredImage ?? "",
    category: blog.category ?? "",
    tags: blog.tags ?? [],
    introduction: blog.introduction ?? "",
    content: blog.content ?? "",

    author: {
      name: blog.author?.name ?? "",
      role: blog.author?.role ?? "",
      avatar: blog.author?.avatar ?? "",
      bio: blog.author?.bio ?? "",
      website: blog.author?.website ?? "",
      facebook: blog.author?.facebook ?? "",
      twitter: blog.author?.twitter ?? "",
      linkedin: blog.author?.linkedin ?? "",
      instagram: blog.author?.instagram ?? "",
    },

    cabinClasses: {
      economy: {
        seatTypes: blog.cabinClasses?.economy?.seatTypes ?? [],
      },
      club: {
        advantages: blog.cabinClasses?.club?.advantages ?? [],
      },
    },

    upgradeOptions: blog.upgradeOptions ?? [],
    pricing: blog.pricing ?? { range: { min: 0, max: 0, currency: "INR" } },
    benefits: blog.benefits ?? [],
    faq: blog.faq ?? [],
    relatedAirlines: blog.relatedAirlines ?? [],
    seo: blog.seo ?? { metaTitle: "", metaDescription: "", keywords: [] },
    status: blog.status ?? "pending",
    publishDate: blog.publishDate ? new Date(blog.publishDate) : new Date(),
  });
}, [blog, mode]);


    const handleAuthorAvatarUpload = async (file) => {
        try {
            if (!file.type.startsWith("image/")) {
                toast.error("Please upload a valid image file (JPG, PNG, GIF, WebP)");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            const avatarUrl = await uploadImage(file);
            
            setFormData((prev) => ({
                ...prev,
                author: {
                    ...prev.author,
                    avatar: avatarUrl, 
                },
            }));
            toast.success("Avatar uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload avatar. Please try again.");
        }
    };

    useEffect(() => {
        if (isEditMode && formData.title && !blog) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9\s]+/g, " ")
                .trim()
                .replace(/\s+/g, "-")
                .replace(/^-|-$/g, "")
                .replace(/[()]/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    }, [formData.title, isEditMode, blog]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file (JPG, PNG, GIF, WebP)");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setIsUploadingImage(true);
        try {
            const imageUrl = await uploadImage(file);
            setFormData((prev) => ({
                ...prev,
                featuredImage: imageUrl,
            }));
            toast.success("Image uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleGenerateSEO = async () => {
        if (!formData.title) {
            toast.error("Please enter a blog title first.");
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
            toast.success("SEO data generated successfully!");
        }
        setIsGeneratingSEO(false);
    };

    const validateStep = (step) => {
        switch (step) {
            case 0:
                if (!formData.title.trim()) {
                    toast.error("Please enter a title");
                    return false;
                }
                if (!formData.slug.trim()) {
                    toast.error("Please enter a slug");
                    return false;
                }
                if (!formData.featuredImage.trim()) {
                    toast.error("Please add a featured image URL or upload an image");
                    return false;
                }
                if (!formData.introduction.trim()) {
                    toast.error("Please enter an introduction");
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
        
        if (!formData.title || formData.title.trim() === "") {
            toast.error("Please provide a title before submitting.");
            return;
        }
        if (!formData.featuredImage || formData.featuredImage.trim() === "") {
            toast.error("Please upload a featured image before submitting.");
            return;
        }
        if (!formData.introduction || formData.introduction.trim() === "") {
            toast.error("Please provide an introduction before submitting.");
            return;
        }
        
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
                    seatTypes: formData.cabinClasses.economy.seatTypes.filter(seat => seat?.seatName?.trim())
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
        
        onSave(submitData);
    };

    const getModalTitle = () => {
        if (mode === "view") return "View Blog Post";
        if (mode === "edit") return "Edit Blog Post";
        return "Write New Blog Post";
    };

    // Helper functions for dynamic fields
    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput("");
            toast.success("Tag added!");
        } else if (formData.tags.includes(tagInput.trim())) {
            toast.error("Tag already exists!");
        }
    };

    const removeTag = (tag) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
        toast.success("Tag removed!");
    };

    const addKeyword = () => {
        if (keywordInput.trim() && !formData.seo.keywords.includes(keywordInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                seo: {
                    ...prev.seo,
                    keywords: [...prev.seo.keywords, keywordInput.trim()],
                },
            }));
            setKeywordInput("");
            toast.success("Keyword added!");
        } else if (formData.seo.keywords.includes(keywordInput.trim())) {
            toast.error("Keyword already exists!");
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
        toast.success("Keyword removed!");
    };

    const addBenefit = () => {
        setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
        toast.success("Benefit field added!");
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
        toast.success("Benefit removed!");
    };

    const addFAQ = () => {
        setFormData((prev) => ({
            ...prev,
            faq: [...prev.faq, { question: "", answer: "" }],
        }));
        toast.success("FAQ added!");
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
        toast.success("FAQ removed!");
    };

    const addRelatedAirline = () => {
        setFormData((prev) => ({
            ...prev,
            relatedAirlines: [...prev.relatedAirlines, { name: "", link: "" }],
        }));
        toast.success("Related airline added!");
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
        toast.success("Related airline removed!");
    };

    // Cabin class helpers
    const addEconomySeatType = () => {
        setFormData((prev) => ({
            ...prev,
            cabinClasses: {
                ...prev.cabinClasses,
                economy: {
                    ...prev.cabinClasses.economy,
                    seatTypes: [...prev.cabinClasses.economy.seatTypes, { seatName: "", description: "", legroom: "" }]
                }
            }
        }));
        toast.success("Economy seat type added!");
    };

    const updateEconomySeatType = (index, field, value) => {
        const newSeatTypes = [...formData.cabinClasses.economy.seatTypes];
        newSeatTypes[index] = { ...newSeatTypes[index], [field]: value };
        setFormData((prev) => ({
            ...prev,
            cabinClasses: {
                ...prev.cabinClasses,
                economy: {
                    ...prev.cabinClasses.economy,
                    seatTypes: newSeatTypes
                }
            }
        }));
    };

    const removeEconomySeatType = (index) => {
        const newSeatTypes = [...formData.cabinClasses.economy.seatTypes];
        newSeatTypes.splice(index, 1);
        setFormData((prev) => ({
            ...prev,
            cabinClasses: {
                ...prev.cabinClasses,
                economy: {
                    ...prev.cabinClasses.economy,
                    seatTypes: newSeatTypes
                }
            }
        }));
        toast.success("Economy seat type removed!");
    };

    const addClubAdvantage = () => {
        setFormData((prev) => ({
            ...prev,
            cabinClasses: {
                ...prev.cabinClasses,
                club: {
                    ...prev.cabinClasses.club,
                    advantages: [...prev.cabinClasses.club.advantages, { feature: "", description: "" }]
                }
            }
        }));
        toast.success("Club advantage added!");
    };

    const updateClubAdvantage = (index, field, value) => {
        const newAdvantages = [...formData.cabinClasses.club.advantages];
        newAdvantages[index] = { ...newAdvantages[index], [field]: value };
        setFormData((prev) => ({
            ...prev,
            cabinClasses: {
                ...prev.cabinClasses,
                club: {
                    ...prev.cabinClasses.club,
                    advantages: newAdvantages
                }
            }
        }));
    };

    const removeClubAdvantage = (index) => {
        const newAdvantages = [...formData.cabinClasses.club.advantages];
        newAdvantages.splice(index, 1);
        setFormData((prev) => ({
            ...prev,
            cabinClasses: {
                ...prev.cabinClasses,
                club: {
                    ...prev.cabinClasses.club,
                    advantages: newAdvantages
                }
            }
        }));
        toast.success("Club advantage removed!");
    };

    const addUpgradeOption = () => {
        setFormData((prev) => ({
            ...prev,
            upgradeOptions: [...prev.upgradeOptions, { method: "", steps: [], notes: [] }]
        }));
        toast.success("Upgrade option added!");
    };

    const updateUpgradeOption = (index, field, value) => {
        const newOptions = [...formData.upgradeOptions];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setFormData((prev) => ({ ...prev, upgradeOptions: newOptions }));
    };

    const removeUpgradeOption = (index) => {
        const newOptions = [...formData.upgradeOptions];
        newOptions.splice(index, 1);
        setFormData((prev) => ({ ...prev, upgradeOptions: newOptions }));
        toast.success("Upgrade option removed!");
    };

    const addUpgradeStep = (optionIndex) => {
        const newOptions = [...formData.upgradeOptions];
        if (!newOptions[optionIndex].steps) newOptions[optionIndex].steps = [];
        newOptions[optionIndex].steps.push({ stepNumber: newOptions[optionIndex].steps.length + 1, instruction: "" });
        setFormData((prev) => ({ ...prev, upgradeOptions: newOptions }));
        toast.success("Step added!");
    };

    const updateUpgradeStep = (optionIndex, stepIndex, field, value) => {
        const newOptions = [...formData.upgradeOptions];
        if (!newOptions[optionIndex].steps) newOptions[optionIndex].steps = [];
        newOptions[optionIndex].steps[stepIndex] = { ...newOptions[optionIndex].steps[stepIndex], [field]: value };
        setFormData((prev) => ({ ...prev, upgradeOptions: newOptions }));
    };

    const removeUpgradeStep = (optionIndex, stepIndex) => {
        const newOptions = [...formData.upgradeOptions];
        if (!newOptions[optionIndex].steps) newOptions[optionIndex].steps = [];
        newOptions[optionIndex].steps.splice(stepIndex, 1);
        // Renumber steps
        newOptions[optionIndex].steps = newOptions[optionIndex].steps.map((step, idx) => ({
            ...step,
            stepNumber: idx + 1
        }));
        setFormData((prev) => ({ ...prev, upgradeOptions: newOptions }));
        toast.success("Step removed!");
    };

    const addUpgradeNote = (optionIndex) => {
        const newOptions = [...formData.upgradeOptions];
        if (!newOptions[optionIndex].notes) newOptions[optionIndex].notes = [];
        newOptions[optionIndex].notes.push("");
        setFormData((prev) => ({ ...prev, upgradeOptions: newOptions }));
        toast.success("Note added!");
    };

    const updateUpgradeNote = (optionIndex, noteIndex, value) => {
        const newOptions = [...formData.upgradeOptions];
        if (!newOptions[optionIndex].notes) newOptions[optionIndex].notes = [];
        newOptions[optionIndex].notes[noteIndex] = value;
        setFormData((prev) => ({ ...prev, upgradeOptions: newOptions }));
    };

    const removeUpgradeNote = (optionIndex, noteIndex) => {
        const newOptions = [...formData.upgradeOptions];
        if (!newOptions[optionIndex].notes) newOptions[optionIndex].notes = [];
        newOptions[optionIndex].notes.splice(noteIndex, 1);
        setFormData((prev) => ({ ...prev, upgradeOptions: newOptions }));
        toast.success("Note removed!");
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="p-6 border-b sticky top-0 bg-white z-10">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#00ADEF] text-white rounded-lg">
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
                                                        ? "bg-[#00ADEF] text-white"
                                                        : "bg-slate-200 text-slate-500"
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <span
                                                className={`text-sm font-medium whitespace-nowrap ${
                                                    index <= currentStep
                                                        ? "text-[#00ADEF]"
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
                                                        ? "bg-[#00ADEF]"
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
                                                ? "border-b-2 border-[#00ADEF] text-[#00ADEF]"
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
                                        className="w-full px-4 py-3 text-lg rounded-xl border-2 border-slate-300 focus:border-[#00ADEF] focus:ring-4 focus:ring-[#00ADEF]/10 text-gray-900 transition-all outline-none disabled:bg-gray-50"
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
                                        className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
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
                                        className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
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

                                    <div className="space-y-3">
                                        <p className="text-xs text-slate-500 mb-2">
                                            Upload an image file for the featured image
                                        </p>
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
                                                    className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-[#00ADEF] hover:bg-[#00ADEF]/5 transition-all flex items-center justify-center gap-2 text-slate-600 hover:text-[#00ADEF] disabled:opacity-50"
                                                >
                                                    <Upload size={20} />
                                                    {isUploadingImage
                                                        ? "Uploading..."
                                                        : "Click to Upload Image"}
                                                </button>
                                            </div>
                                        )}

                                        {formData.featuredImage && (
                                            <div className="relative">
                                                <img
                                                    src={formData.featuredImage}
                                                    alt="Preview"
                                                    className="w-full h-64 object-cover rounded-lg"
                                                />
                                                {isEditMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                featuredImage: "",
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
                                            className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
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
                                                className="px-4 py-2 bg-[#00ADEF] text-white rounded-lg hover:bg-[#0095cc] flex items-center gap-2"
                                            >
                                                <Plus size={18} />
                                                Add
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-[#00ADEF]/10 text-[#00ADEF] rounded-full text-sm flex items-center gap-2 border border-[#00ADEF]/20"
                                            >
                                                {tag}
                                                {isEditMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTag(tag)
                                                        }
                                                        className="hover:text-[#0095cc]"
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
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none resize-none disabled:bg-gray-50"
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
                                            className="w-5 h-5 text-[#00ADEF]"
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
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={isViewMode}
                                                    placeholder="Enter author name"
                                                    className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all text-slate-900 placeholder:text-slate-400 ${
                                                        isViewMode
                                                            ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                                                            : "border-slate-300 hover:border-[#00ADEF] focus:border-[#00ADEF] focus:ring-2 focus:ring-[#00ADEF]/20 outline-none"
                                                    }`}
                                                    value={formData.author?.name || ""}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            author: {
                                                                ...formData.author,
                                                                name: e.target.value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>

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
                                                            : "border-slate-300 hover:border-[#00ADEF] focus:border-[#00ADEF] focus:ring-2 focus:ring-[#00ADEF]/20 outline-none"
                                                    }`}
                                                    value={formData.author?.role || ""}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            author: {
                                                                ...formData.author,
                                                                role: e.target.value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Profile Picture
                                                </label>
                                                <div className="flex items-start gap-4">
                                                    <div className="relative">
                                                        {formData.author?.avatar ? (
                                                            <div className="relative group">
                                                                <img
                                                                    src={formData.author.avatar}
                                                                    alt="Author avatar preview"
                                                                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-300 shadow-sm"
                                                                />
                                                                {!isViewMode && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setFormData({
                                                                                ...formData,
                                                                                author: {
                                                                                    ...formData.author,
                                                                                    avatar: null,
                                                                                },
                                                                            })
                                                                        }
                                                                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        <X size={14} />
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
                                                                        strokeWidth={2}
                                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className={`block cursor-pointer ${isViewMode ? "cursor-not-allowed" : ""}`}>
                                                            <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                                                                isViewMode
                                                                    ? "border-slate-200 bg-slate-50"
                                                                    : "border-slate-300 hover:border-[#00ADEF] hover:bg-[#00ADEF]/5"
                                                            }`}>
                                                                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                                                <p className="text-sm font-medium text-slate-700 mb-1">
                                                                    {formData.author?.avatar ? "Change picture" : "Upload a picture"}
                                                                </p>
                                                                <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                disabled={isViewMode}
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) handleAuthorAvatarUpload(file);
                                                                }}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

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
                                                        : "border-slate-300 hover:border-[#00ADEF] focus:border-[#00ADEF] focus:ring-2 focus:ring-[#00ADEF]/20 outline-none"
                                                }`}
                                                value={formData.author?.bio || ""}
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
                                                {formData.author?.bio?.length || 0} / 500 characters
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                                Social Media Links
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {[
                                                    { field: "website", label: "Website", icon: "🌐", placeholder: "https://example.com" },
                                                    { field: "facebook", label: "Facebook", icon: "📘", placeholder: "https://facebook.com/username" },
                                                    { field: "twitter", label: "Twitter/X", icon: "🐦", placeholder: "https://twitter.com/username" },
                                                    { field: "linkedin", label: "LinkedIn", icon: "💼", placeholder: "https://linkedin.com/in/username" },
                                                    { field: "instagram", label: "Instagram", icon: "📷", placeholder: "https://instagram.com/username" },
                                                ].map(({ field, label, icon, placeholder }) => (
                                                    <div key={field}>
                                                        <label className="block text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1">
                                                            <span>{icon}</span>
                                                            {label}
                                                        </label>
                                                        <input
                                                            type="url"
                                                            disabled={isViewMode}
                                                            placeholder={placeholder}
                                                            className={`w-full px-3 py-2 rounded-lg border-2 transition-all text-sm text-slate-900 placeholder:text-slate-400 ${
                                                                isViewMode
                                                                    ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                                                                    : "border-slate-300 hover:border-[#00ADEF] focus:border-[#00ADEF] focus:ring-2 focus:ring-[#00ADEF]/20 outline-none"
                                                            }`}
                                                            value={formData.author?.[field] || ""}
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    author: {
                                                                        ...formData.author,
                                                                        [field]: e.target.value,
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content Tab */}
                        {activeTab === "content" && (
                            <div className="space-y-6">
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
                                                className="flex items-center gap-2 px-4 py-2 bg-[#00ADEF] text-white rounded-lg hover:bg-[#0095cc] transition-colors"
                                            >
                                                <Plus size={16} /> Add Benefit
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {formData.benefits.map((benefit, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    disabled={isViewMode}
                                                    placeholder="Benefit description..."
                                                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                    value={benefit}
                                                    onChange={(e) => updateBenefit(index, e.target.value)}
                                                />
                                                {isEditMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeBenefit(index)}
                                                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {formData.benefits.length === 0 && isEditMode && (
                                            <p className="text-sm text-slate-500 italic">No benefits added yet. Click "Add Benefit" to create one.</p>
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
                                                className="flex items-center gap-2 px-4 py-2 bg-[#00ADEF] text-white rounded-lg hover:bg-[#0095cc] transition-colors"
                                            >
                                                <Plus size={16} /> Add FAQ
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {formData.faq.map((item, index) => (
                                            <div key={index} className="p-4 border-2 border-slate-200 rounded-lg space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-slate-700">
                                                        Question {index + 1}
                                                    </span>
                                                    {isEditMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFAQ(index)}
                                                            className="text-red-600 hover:text-red-700 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <input
                                                    disabled={isViewMode}
                                                    placeholder="Question..."
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                    value={item.question}
                                                    onChange={(e) => updateFAQ(index, "question", e.target.value)}
                                                />
                                                <textarea
                                                    disabled={isViewMode}
                                                    rows={3}
                                                    placeholder="Answer..."
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                    value={item.answer}
                                                    onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                                                />
                                            </div>
                                        ))}
                                        {formData.faq.length === 0 && isEditMode && (
                                            <p className="text-sm text-slate-500 italic">No FAQs added yet. Click "Add FAQ" to create one.</p>
                                        )}
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
                                                className="flex items-center gap-2 px-4 py-2 bg-[#00ADEF] text-white rounded-lg hover:bg-[#0095cc] transition-colors"
                                            >
                                                <Plus size={16} /> Add Airline
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {formData.relatedAirlines.map((airline, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    disabled={isViewMode}
                                                    placeholder="Airline name..."
                                                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                    value={airline.name}
                                                    onChange={(e) => updateRelatedAirline(index, "name", e.target.value)}
                                                />
                                                <input
                                                    disabled={isViewMode}
                                                    placeholder="Link..."
                                                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                    value={airline.link}
                                                    onChange={(e) => updateRelatedAirline(index, "link", e.target.value)}
                                                />
                                                {isEditMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRelatedAirline(index)}
                                                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {formData.relatedAirlines.length === 0 && isEditMode && (
                                            <p className="text-sm text-slate-500 italic">No related airlines added yet. Click "Add Airline" to create one.</p>
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
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Economy Class Seat Types
                                        </h3>
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={addEconomySeatType}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#00ADEF] text-white rounded-lg hover:bg-[#0095cc] transition-colors"
                                            >
                                                <Plus size={16} /> Add Seat Type
                                            </button>
                                        )}
                                    </div>
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
                                                            onClick={() => removeEconomySeatType(index)}
                                                            className="text-red-600 hover:text-red-700 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Seat Type Name"
                                                        className="px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                        value={seatType.type || ""}
                                                        onChange={(e) => updateEconomySeatType(index, "type", e.target.value)}
                                                    />
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Description"
                                                        className="px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                        value={seatType.description || ""}
                                                        onChange={(e) => updateEconomySeatType(index, "description", e.target.value)}
                                                    />
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Legroom"
                                                        className="px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                        value={seatType.legroom || ""}
                                                        onChange={(e) => updateEconomySeatType(index, "legroom", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {formData.cabinClasses.economy.seatTypes.length === 0 && isEditMode && (
                                            <p className="text-sm text-slate-500 italic">No economy seat types added yet. Click "Add Seat Type" to create one.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Club Class */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Club Class Advantages
                                        </h3>
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={addClubAdvantage}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#00ADEF] text-white rounded-lg hover:bg-[#0095cc] transition-colors"
                                            >
                                                <Plus size={16} /> Add Advantage
                                            </button>
                                        )}
                                    </div>
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
                                                            onClick={() => removeClubAdvantage(index)}
                                                            className="text-red-600 hover:text-red-700 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Feature Name"
                                                        className="px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                        value={advantage.feature || ""}
                                                        onChange={(e) => updateClubAdvantage(index, "feature", e.target.value)}
                                                    />
                                                    <input
                                                        disabled={isViewMode}
                                                        placeholder="Description"
                                                        className="px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                        value={advantage.description || ""}
                                                        onChange={(e) => updateClubAdvantage(index, "description", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {formData.cabinClasses.club.advantages.length === 0 && isEditMode && (
                                            <p className="text-sm text-slate-500 italic">No club advantages added yet. Click "Add Advantage" to create one.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Upgrade Options */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Upgrade Options
                                        </h3>
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={addUpgradeOption}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#00ADEF] text-white rounded-lg hover:bg-[#0095cc] transition-colors"
                                            >
                                                <Plus size={16} /> Add Upgrade Option
                                            </button>
                                        )}
                                    </div>
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
                                                            onClick={() => removeUpgradeOption(index)}
                                                            className="text-red-600 hover:text-red-700 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <input
                                                    disabled={isViewMode}
                                                    placeholder="Upgrade Method"
                                                    className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                    value={option.method || ""}
                                                    onChange={(e) => updateUpgradeOption(index, "method", e.target.value)}
                                                />
                                                
                                                {/* Steps */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="text-sm font-semibold text-slate-700">Steps</h4>
                                                        {isEditMode && (
                                                            <button
                                                                type="button"
                                                                onClick={() => addUpgradeStep(index)}
                                                                className="px-3 py-1 bg-[#00ADEF]/10 text-[#00ADEF] rounded-lg hover:bg-[#00ADEF]/20 text-sm transition-colors"
                                                            >
                                                                <Plus size={14} className="inline mr-1" /> Add Step
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        {option.steps?.map((step, stepIndex) => (
                                                            <div key={stepIndex} className="flex gap-2 items-center">
                                                                <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-sm font-bold text-slate-600">
                                                                    {step.stepNumber}
                                                                </span>
                                                                <input
                                                                    disabled={isViewMode}
                                                                    placeholder="Instruction"
                                                                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                                    value={step.instruction || ""}
                                                                    onChange={(e) => updateUpgradeStep(index, stepIndex, "instruction", e.target.value)}
                                                                />
                                                                {isEditMode && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeUpgradeStep(index, stepIndex)}
                                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {(!option.steps || option.steps.length === 0) && isEditMode && (
                                                            <p className="text-sm text-slate-500 italic">No steps added yet.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="text-sm font-semibold text-slate-700">Notes</h4>
                                                        {isEditMode && (
                                                            <button
                                                                type="button"
                                                                onClick={() => addUpgradeNote(index)}
                                                                className="px-3 py-1 bg-[#00ADEF]/10 text-[#00ADEF] rounded-lg hover:bg-[#00ADEF]/20 text-sm transition-colors"
                                                            >
                                                                <Plus size={14} className="inline mr-1" /> Add Note
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        {option.notes?.map((note, noteIndex) => (
                                                            <div key={noteIndex} className="flex gap-2">
                                                                <input
                                                                    disabled={isViewMode}
                                                                    placeholder="Note"
                                                                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                                                    value={note || ""}
                                                                    onChange={(e) => updateUpgradeNote(index, noteIndex, e.target.value)}
                                                                />
                                                                {isEditMode && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeUpgradeNote(index, noteIndex)}
                                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {(!option.notes || option.notes.length === 0) && isEditMode && (
                                                            <p className="text-sm text-slate-500 italic">No notes added yet.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {formData.upgradeOptions.length === 0 && isEditMode && (
                                            <p className="text-sm text-slate-500 italic">No upgrade options added yet. Click "Add Upgrade Option" to create one.</p>
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
                                            className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                            value={formData.pricing.range.min || ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    pricing: {
                                                        range: {
                                                            ...formData.pricing.range,
                                                            min: parseInt(e.target.value) || 0,
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
                                            className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                            value={formData.pricing.range.max || ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    pricing: {
                                                        range: {
                                                            ...formData.pricing.range,
                                                            max: parseInt(e.target.value) || 0,
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
                                            className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                            value={formData.pricing.range.currency}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    pricing: {
                                                        range: {
                                                            ...formData.pricing.range,
                                                            currency: e.target.value,
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
                                        <Sparkles size={20} className="text-[#00ADEF]" />
                                        SEO Optimization
                                    </h3>
                                    {isEditMode && (
                                        <button
                                            type="button"
                                            onClick={handleGenerateSEO}
                                            disabled={isGeneratingSEO}
                                            className="px-4 py-2 bg-[#00ADEF] text-white rounded-lg hover:bg-[#0095cc] disabled:opacity-50 text-sm font-medium transition-colors"
                                        >
                                            {isGeneratingSEO ? "Generating..." : "Generate with AI"}
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
                                        className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
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
                                        className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                        value={formData.seo.metaDescription || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                seo: {
                                                    ...formData.seo,
                                                    metaDescription: e.target.value,
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
                                            className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-[#00ADEF] outline-none disabled:bg-gray-50"
                                            value={keywordInput}
                                            onChange={(e) =>
                                                setKeywordInput(e.target.value)
                                            }
                                            onKeyPress={(e) =>
                                                e.key === "Enter" &&
                                                (e.preventDefault(), addKeyword())
                                            }
                                        />
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={addKeyword}
                                                className="px-4 py-2 bg-[#00ADEF] text-white rounded-lg hover:bg-[#0095cc] flex items-center gap-2"
                                            >
                                                <Plus size={18} />
                                                Add
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.seo.keywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2 border border-green-200"
                                            >
                                                {keyword}
                                                {isEditMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeKeyword(keyword)}
                                                        className="hover:text-green-900"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </span>
                                        ))}
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
                                    className="px-8 py-2.5 font-bold bg-[#00ADEF] text-white rounded-lg hover:bg-[#0095cc] shadow-lg shadow-[#00ADEF]/25 transition-all flex items-center gap-2"
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
                                    {mode === "edit" ? "Update & Publish" : "Save & Publish"}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}