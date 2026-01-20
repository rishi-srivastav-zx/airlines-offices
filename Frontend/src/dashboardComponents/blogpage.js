"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    Image as ImageIcon,
    User as UserIcon,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Filter,
    FileText,
    Calendar,
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
        title: `${content} - Travel Blog & Tips`,
        description: `Read our latest article about ${content}. Expert insights and travel tips.`,
        slug: slug,
    };
};

const MOCK_BLOGS = [
    {
        id: "1",
        title: "Top 10 Business Class Lounges in 2024",
        content: "Exploring the most luxurious lounges around the globe...",
        featuredImage:
            "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=400",
        status: ContentStatus.APPROVED,
        authorId: "user_1",
        createdAt: "2024-03-12",
        seo: {
            title: "Best Business Lounges 2024",
            description: "Find the best airport lounges.",
            slug: "best-business-lounges-2024",
        },
    },
    {
        id: "2",
        title: "Navigating New Baggage Policies",
        content: "What you need to know before your next long-haul flight...",
        featuredImage:
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400",
        status: ContentStatus.PENDING,
        authorId: "user_2",
        createdAt: "2024-03-18",
        seo: {
            title: "Baggage Policies Guide",
            description: "Avoid extra fees with our guide.",
            slug: "baggage-policies-guide",
        },
    },
];

export default function BlogsPage() {
    const [blogs, setBlogs] = useState(MOCK_BLOGS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        featuredImage: "",
        seoTitle: "",
        seoDescription: "",
        seoSlug: "",
    });

    const handleGenerateSEO = async () => {
        if (!formData.title) {
            alert("Please enter a blog title first.");
            return;
        }
        setIsGeneratingSEO(true);
        const result = await generateSEOData(
            "blog",
            `${formData.title}: ${formData.content.substring(0, 100)}`
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

        if (isEditMode && selectedBlog) {
            // Update existing blog
            setBlogs(
                blogs.map((blog) =>
                    blog.id === selectedBlog.id
                        ? {
                              ...blog,
                              title: formData.title,
                              content: formData.content,
                              featuredImage:
                                  formData.featuredImage || blog.featuredImage,
                              seo: {
                                  title: formData.seoTitle,
                                  description: formData.seoDescription,
                                  slug: formData.seoSlug,
                              },
                          }
                        : blog
                )
            );
        } else {
            // Add new blog
            const newBlog = {
                id: Math.random().toString(36).substr(2, 9),
                title: formData.title,
                content: formData.content,
                featuredImage:
                    formData.featuredImage ||
                    "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=400",
                status: ContentStatus.APPROVED,
                authorId: "current_user",
                createdAt: new Date().toISOString().split("T")[0],
                seo: {
                    title: formData.seoTitle,
                    description: formData.seoDescription,
                    slug: formData.seoSlug,
                },
            };
            setBlogs([newBlog, ...blogs]);
        }

        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedBlog(null);
        resetForm();
    };

    const handleEdit = (blog) => {
        setSelectedBlog(blog);
        setIsEditMode(true);
        setFormData({
            title: blog.title,
            content: blog.content,
            featuredImage: blog.featuredImage,
            seoTitle: blog.seo.title,
            seoDescription: blog.seo.description,
            seoSlug: blog.seo.slug,
        });
        setIsModalOpen(true);
    };

    const handleView = (blog) => {
        setSelectedBlog(blog);
        setIsEditMode(false);
        setFormData({
            title: blog.title,
            content: blog.content,
            featuredImage: blog.featuredImage,
            seoTitle: blog.seo.title,
            seoDescription: blog.seo.description,
            seoSlug: blog.seo.slug,
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setIsEditMode(true);
        setSelectedBlog(null);
        resetForm();
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            content: "",
            featuredImage: "",
            seoTitle: "",
            seoDescription: "",
            seoSlug: "",
        });
    };

    const filteredBlogs = blogs.filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Blog Posts
                    </h1>
                    <p className="text-slate-500">
                        Create and manage content for the public website.
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-900/10"
                >
                    <Plus size={20} />
                    Create Post
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
                            placeholder="Search articles..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Article</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBlogs.map((blog) => (
                                <tr
                                    key={blog.id}
                                    className="hover:bg-slate-50/80 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                                <img
                                                    src={blog.featuredImage}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 leading-tight mb-1">
                                                    {blog.title}
                                                </div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <ImageIcon size={12} />{" "}
                                                    Featured Image Set
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={blog.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                                SJ
                                            </div>
                                            Editor User
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-500 flex items-center gap-1">
                                            <Calendar
                                                size={14}
                                                className="text-slate-400"
                                            />
                                            {blog.createdAt}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleView(blog)}
                                                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEdit(blog)}
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
                    <div>Showing {filteredBlogs.length} articles</div>
                    <div className="flex gap-2">
                        <button className="p-2 border rounded hover:bg-slate-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="p-2 border rounded hover:bg-slate-50">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <FileText size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {!isEditMode
                                            ? "View Blog Post"
                                            : selectedBlog
                                            ? "Edit Blog Post"
                                            : "Write New Blog Post"}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsEditMode(false);
                                        setSelectedBlog(null);
                                        resetForm();
                                    }}
                                    className="text-slate-400 hover:text-slate-600 text-2xl font-light"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                            Article Title
                                        </label>
                                        <input
                                            required
                                            disabled={!isEditMode}
                                            placeholder="Enter a catchy headline..."
                                            className="w-full px-4 py-3 text-lg text-gray-900 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-600"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                            Content
                                        </label>
                                        <div className="border-2 border-slate-100 rounded-xl overflow-hidden focus-within:border-indigo-500 transition-all">
                                            {isEditMode && (
                                                <div className="bg-slate-50 px-4 py-2 border-b flex gap-2">
                                                    {[
                                                        "B",
                                                        "I",
                                                        "U",
                                                        "H1",
                                                        "H2",
                                                        "Link",
                                                    ].map((btn) => (
                                                        <button
                                                            key={btn}
                                                            type="button"
                                                            className="px-2 py-1 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                                                        >
                                                            {btn}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            <textarea
                                                required
                                                disabled={!isEditMode}
                                                rows={12}
                                                placeholder="Start writing your story..."
                                                className="w-full px-4 py-3 outline-none resize-none disabled:bg-gray-50 text-gray-900 disabled:text-gray-600"
                                                value={formData.content}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        content: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                                            Publishing Settings
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">
                                                    Featured Image URL
                                                </label>
                                                <div className="relative">
                                                    <ImageIcon
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                        size={16}
                                                    />
                                                    <input
                                                        disabled={!isEditMode}
                                                        className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-indigo-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                        placeholder="https://..."
                                                        value={
                                                            formData.featuredImage
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                featuredImage:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                                                <Sparkles size={14} /> SEO
                                                Assistant
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={handleGenerateSEO}
                                                disabled={
                                                    isGeneratingSEO ||
                                                    !isEditMode
                                                }
                                                className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                                {isGeneratingSEO
                                                    ? "AI..."
                                                    : "Magic"}
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
                                                    Slug
                                                </label>
                                                <input
                                                    disabled={!isEditMode}
                                                    className="w-full px-3 py-1.5 text-gray-900 text-xs rounded border focus:ring-2 focus:ring-indigo-500/20 disabled:bg-gray-50 disabled:text-gray-600"
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
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
                                                    Meta Description
                                                </label>
                                                <textarea
                                                    disabled={!isEditMode}
                                                    rows={3}
                                                    className="w-full px-3 py-1.5 text-gray-900 text-xs rounded border focus:ring-2 focus:ring-indigo-500/20 disabled:bg-gray-50 disabled:text-gray-600"
                                                    value={
                                                        formData.seoDescription
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            seoDescription:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t bg-slate-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsEditMode(false);
                                        setSelectedBlog(null);
                                        resetForm();
                                    }}
                                    className="px-6 py-2.5 font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                                >
                                    {isEditMode ? "Cancel" : "Close"}
                                </button>
                                {isEditMode && (
                                    <button
                                        type="submit"
                                        className="px-8 py-2.5 font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-900/10 transition-all"
                                    >
                                        {selectedBlog
                                            ? "Update Post"
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
