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

    // Simplified image upload - return file URL directly
    // In production, upload to server and get URL back
    const uploadImage = async (file) => {
        // For now, simulate upload and return placeholder URL
        // Replace with actual upload logic that returns a URL, not base64
        await new Promise((resolve) => setTimeout(resolve, 500));
        return `https://picsum.photos/seed/${Date.now()}/400/300.jpg`;
    };

export default function BlogFormModal({ mode, blog, onSave, onClose }) {
    const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [tagInput, setTagInput] = useState("");
    const [keywordInput, setKeywordInput] = useState("");
    const fileInputRef = useRef(null);

    const steps = ["basic", "content", "pricing", "seo"];
    const stepTitles = {
        basic: "Basic Information",
        content: "Content Details",
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
        author: { name: "", role: "", avatar: "" },
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
        status: "draft",
        publishDate: new Date().toISOString().split("T")[0],
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
                author: blog.author || { name: "", role: "", avatar: "" },
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
                status: blog.status || "draft",
                publishDate:
                    blog.publishDate?.split("T")[0] ||
                    new Date().toISOString().split("T")[0],
            });
        }
    }, [blog, mode]);

    useEffect(() => {
        if (isEditMode && formData.title && !blog) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    }, [formData.title, isEditMode, blog]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
            setFormData((prev) => ({
                ...prev,
                featuredImage: imageUrl,
            }));
        } catch (error) {
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
            alert("Please provide a featured image URL or upload an image before submitting.");
            return;
        }
        if (!formData.introduction || formData.introduction.trim() === "") {
            alert("Please provide an introduction before submitting.");
            return;
        }
        
        // Send all form data but ensure no large image base64 data
        const submitData = { ...formData };
        
        // Remove any potential image base64 data that's too large
        if (submitData.featuredImage && submitData.featuredImage.startsWith('data:image/')) {
            // Replace base64 with URL to avoid payload size issues
            submitData.featuredImage = `https://picsum.photos/seed/${Date.now()}/400/300.jpg`;
        }
        
        // Remove any potential 'image' field that might cause backend error
        delete submitData.image;
        
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
                                         value={formData.title || ''}
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
                                         value={formData.slug || ''}
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
                                         value={formData.category || ''}
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

                                    {/* Image Upload Options */}
                                    <div className="space-y-3">
                                        <p className="text-xs text-slate-500 mb-2">
                                            Enter a valid image URL or upload an
                                            image file
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

                                        {/* OR Divider */}
                                        {isEditMode && (
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-slate-200"></div>
                                                </div>
                                                <div className="relative flex justify-center text-sm">
                                                    <span className="px-2 bg-white text-slate-500">
                                                        OR
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* URL Input */}
                                        <div className="relative">
                                            <ImageIcon
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                size={18}
                                            />
                                            <input
                                                required
                                                disabled={isViewMode}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                placeholder="Or paste image URL..."
                                                value={formData.featuredImage || ''}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        featuredImage:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* Image Preview */}
                                        {formData.featuredImage && (
                                            <div className="relative">
                                                <img
                                                    src={formData.featuredImage}
                                                    alt="Preview"
                                                    className="w-full h-64 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";
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
                                         value={formData.introduction || ''}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                introduction: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                                        Author Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Name
                                            </label>
                                            <input
                                                disabled={isViewMode}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                value={formData.author?.name || ''}
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
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Role
                                            </label>
                                            <input
                                                disabled={isViewMode}
                                                placeholder="Travel Expert"
                                                className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                value={formData.author?.role || ''}
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
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Avatar URL
                                            </label>
                                            <input
                                                disabled={isViewMode}
                                                placeholder="https://..."
                                                className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                                value={formData.author?.avatar || ''}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        author: {
                                                            ...formData.author,
                                                            avatar: e.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        disabled={isViewMode}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="pending">
                                            Pending Approval
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">
                                        Publish Date
                                    </label>
                                    <input
                                        type="date"
                                        disabled={isViewMode}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 text-gray-900 focus:border-indigo-500 outline-none disabled:bg-gray-50"
                                         value={formData.publishDate || ''}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                publishDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Content Tab */}
                        {activeTab === "content" && (
                            <div className="space-y-6">
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
                                             value={formData.pricing.range.min || ''}
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
                                             value={formData.pricing.range.max || ''}
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
                                         value={formData.seo.metaTitle || ''}
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
                                         value={formData.seo.metaDescription || ''}
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
