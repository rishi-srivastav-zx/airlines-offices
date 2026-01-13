"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    MapPin,
    Phone,
    Mail,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Filter,
} from "lucide-react";

// Enums converted to objects
const ContentStatus = {
    APPROVED: "APPROVED",
    PENDING: "PENDING",
    REJECTED: "REJECTED",
};

// StatusBadge Component
const StatusBadge = ({ status }) => {
    const styles = {
        [ContentStatus.APPROVED]: "bg-green-100 text-green-700",
        [ContentStatus.PENDING]: "bg-yellow-100 text-yellow-700",
        [ContentStatus.REJECTED]: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
        >
            {status}
        </span>
    );
};

// Mock generateSEOData function
const generateSEOData = async (type, content) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const slug = content
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return {
        title: `${content} - Contact Information & Details`,
        description: `Find contact details, address, and working hours for ${content}. Get in touch with our office today.`,
        slug: slug,
    };
};

const MOCK_OFFICES = [
    {
        id: "1",
        airlineName: "Emirates",
        city: "Dubai",
        country: "United Arab Emirates",
        address: "Terminal 3, Dubai International Airport",
        phone: "+971 4 224 5555",
        email: "dxb.office@emirates.com",
        workingHours: "24/7",
        status: ContentStatus.APPROVED,
        createdBy: "user_1",
        createdAt: "2024-03-10",
        seo: {
            title: "Emirates Office Dubai",
            description: "Contact Emirates office at Dubai Airport.",
            slug: "emirates-office-dubai",
        },
    },
    {
        id: "2",
        airlineName: "Qatar Airways",
        city: "Doha",
        country: "Qatar",
        address: "Hamad International Airport, Level 1",
        phone: "+974 4022 6000",
        email: "doh.office@qatarairways.com",
        workingHours: "08:00 - 20:00",
        status: ContentStatus.PENDING,
        createdBy: "user_2",
        createdAt: "2024-03-15",
        seo: {
            title: "Qatar Airways Doha Office",
            description: "Visit Qatar Airways in Doha.",
            slug: "qatar-airways-doha",
        },
    },
];

export default function OfficesPage() {
    const [offices, setOffices] = useState(MOCK_OFFICES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [formData, setFormData] = useState({
        airlineName: "",
        city: "",
        country: "",
        address: "",
        phone: "",
        email: "",
        workingHours: "",
        seoTitle: "",
        seoDescription: "",
        seoSlug: "",
    });

    const handleGenerateSEO = async () => {
        if (!formData.airlineName || !formData.city) {
            alert("Please enter airline name and city first.");
            return;
        }
        setIsGeneratingSEO(true);
        const result = await generateSEOData(
            "office",
            `${formData.airlineName} in ${formData.city}, ${formData.country}`
        );
        if (result) {
            setFormData((prev) => ({
                ...prev,
                seoTitle: result.title,
                seoDescription: result.description,
                seoSlug: result.slug,
            }));
        }
        setIsGeneratingSEO(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode && selectedOffice) {
            // Update existing office
            setOffices(
                offices.map((office) =>
                    office.id === selectedOffice.id
                        ? {
                              ...office,
                              ...formData,
                              seo: {
                                  title: formData.seoTitle,
                                  description: formData.seoDescription,
                                  slug: formData.seoSlug,
                              },
                          }
                        : office
                )
            );
        } else {
            // Add new office
            const newOffice = {
                id: Math.random().toString(36).substr(2, 9),
                ...formData,
                status: ContentStatus.APPROVED,
                createdBy: "current_user",
                createdAt: new Date().toISOString().split("T")[0],
                seo: {
                    title: formData.seoTitle,
                    description: formData.seoDescription,
                    slug: formData.seoSlug,
                },
            };
            setOffices([newOffice, ...offices]);
        }

        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedOffice(null);
        resetForm();
    };

    const handleEdit = (office) => {
        setSelectedOffice(office);
        setIsEditMode(true);
        setFormData({
            airlineName: office.airlineName,
            city: office.city,
            country: office.country,
            address: office.address,
            phone: office.phone,
            email: office.email,
            workingHours: office.workingHours,
            seoTitle: office.seo.title,
            seoDescription: office.seo.description,
            seoSlug: office.seo.slug,
        });
        setIsModalOpen(true);
    };

    const handleView = (office) => {
        setSelectedOffice(office);
        setIsEditMode(false);
        setFormData({
            airlineName: office.airlineName,
            city: office.city,
            country: office.country,
            address: office.address,
            phone: office.phone,
            email: office.email,
            workingHours: office.workingHours,
            seoTitle: office.seo.title,
            seoDescription: office.seo.description,
            seoSlug: office.seo.slug,
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setIsEditMode(true);
        setSelectedOffice(null);
        resetForm();
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            airlineName: "",
            city: "",
            country: "",
            address: "",
            phone: "",
            email: "",
            workingHours: "",
            seoTitle: "",
            seoDescription: "",
            seoSlug: "",
        });
    };

    const filteredOffices = offices.filter(
        (o) =>
            o.airlineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Airlines Offices
                    </h1>
                    <p className="text-slate-500">
                        Manage global airline office locations and details.
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/10"
                >
                    <Plus size={20} />
                    Add Office
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search by airline or city..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                            <Filter size={16} />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">
                                    Airline / Location
                                </th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Created By</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOffices.map((office) => (
                                <tr
                                    key={office.id}
                                    className="hover:bg-slate-50/80 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">
                                            {office.airlineName}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                            <MapPin size={12} /> {office.city},{" "}
                                            {office.country}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600 flex items-center gap-2">
                                            <Phone
                                                size={14}
                                                className="text-slate-400"
                                            />{" "}
                                            {office.phone}
                                        </div>
                                        <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                                            <Mail
                                                size={14}
                                                className="text-slate-400"
                                            />{" "}
                                            {office.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={office.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        Editor User
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-500">
                                        {office.createdAt}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleView(office)
                                                }
                                                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleEdit(office)
                                                }
                                                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <div>
                        Showing 1 - {filteredOffices.length} of{" "}
                        {filteredOffices.length} offices
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {!isEditMode
                                        ? "View Office"
                                        : selectedOffice
                                        ? "Edit Office"
                                        : "Add New Office"}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsEditMode(false);
                                        setSelectedOffice(null);
                                        resetForm();
                                    }}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <section>
                                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Airline Name
                                            </label>
                                            <input
                                                required
                                                disabled={!isEditMode}
                                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                value={formData.airlineName}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        airlineName:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    City
                                                </label>
                                                <input
                                                    required
                                                    disabled={!isEditMode}
                                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                    value={formData.city}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            city: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Country
                                                </label>
                                                <input
                                                    required
                                                    disabled={!isEditMode}
                                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                    value={formData.country}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            country:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Address
                                            </label>
                                            <textarea
                                                required
                                                disabled={!isEditMode}
                                                rows={2}
                                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                value={formData.address}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">
                                        Contact & Hours
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                required
                                                disabled={!isEditMode}
                                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                required
                                                disabled={!isEditMode}
                                                type="email"
                                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Working Hours
                                            </label>
                                            <input
                                                required
                                                disabled={!isEditMode}
                                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                value={formData.workingHours}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        workingHours:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles size={16} /> SEO Settings
                                            (AI Assisted)
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={handleGenerateSEO}
                                            disabled={
                                                isGeneratingSEO || !isEditMode
                                            }
                                            className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
                                        >
                                            {isGeneratingSEO
                                                ? "Generating..."
                                                : "Magic Generate"}
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
                                                Meta Title
                                            </label>
                                            <input
                                                disabled={!isEditMode}
                                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                value={formData.seoTitle}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        seoTitle:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
                                                Meta Description
                                            </label>
                                            <textarea
                                                disabled={!isEditMode}
                                                rows={2}
                                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                value={formData.seoDescription}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        seoDescription:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
                                                URL Slug
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400 text-sm">
                                                    /offices/
                                                </span>
                                                <input
                                                    disabled={!isEditMode}
                                                    className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                    value={formData.seoSlug}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            seoSlug:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="p-6 border-t bg-slate-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsEditMode(false);
                                        setSelectedOffice(null);
                                        resetForm();
                                    }}
                                    className="px-6 py-2.5 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    {isEditMode ? "Cancel" : "Close"}
                                </button>
                                {isEditMode && (
                                    <button
                                        type="submit"
                                        className="px-8 py-2.5 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-900/10 transition-all"
                                    >
                                        {selectedOffice
                                            ? "Update Office"
                                            : "Save & Publish"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
