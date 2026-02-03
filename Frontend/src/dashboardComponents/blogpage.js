"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Image as ImageIcon,
    Calendar,
    Filter,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import BlogFormModal from "./blogform";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const api = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

/* Backend status mapping */
const ContentStatus = {
    published: "PUBLISHED",
    pending: "PENDING APPROVAL",
    draft: "DRAFT",
    archived: "REJECTED",
};

/* Status Badge */
const StatusBadge = ({ status }) => {
    const styles = {
        APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        "PENDING APPROVAL":
            "bg-amber-50 text-amber-700 border border-amber-200",
        DRAFT: "bg-slate-50 text-slate-700 border border-slate-200",
        REJECTED: "bg-red-50 text-red-700 border border-red-200",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${styles[status]} transition-all duration-200`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full ${
                    status === "APPROVED"
                        ? "bg-emerald-500"
                        : status === "PENDING APPROVAL"
                          ? "bg-amber-500"
                          : status === "DRAFT"
                            ? "bg-slate-400"
                            : "bg-red-500"
                } animate-pulse`}
            />
            {status}
        </span>
    );
};

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [selectedBlog, setSelectedBlog] = useState(null);

    const fetchBlogs = async (search = "") => {
        try {
            setLoading(true);
            const res = await api.get("/blogs/posts", {
                params: {
                    status: "published", // Only show published blogs in main page
                    search,
                },
            });

            const mappedBlogs = res.data.data.map((blog) => ({
                id: blog._id,
                title: blog.title,
                featuredImage: blog.featuredImage,
                status: ContentStatus[blog.status] || "PENDING",
                author: blog.author?.name || "Admin",
                createdAt: blog.createdAt
                    ? new Date(blog.createdAt).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
                slug: blog.slug,
            }));

            setBlogs(mappedBlogs);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to fetch blog posts");
            toast.error("Failed to fetch blog posts");
        } finally {
            setLoading(false);
        }
    };

    /* Initial load */
    useEffect(() => {
        fetchBlogs();
    }, []);

    /* Search (debounced) */
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBlogs(searchQuery);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleView = (blog) => {
        setSelectedBlog(blog);
        setModalMode("view");
        setIsModalOpen(true);
    };

    const handleEdit = (blog) => {
        setSelectedBlog(blog);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedBlog(null);
        setModalMode("create");
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            if (modalMode === "create") {
                await api.post("/blogs/posts", formData);
                toast.success("Blog created and sent for approval!");
                setIsModalOpen(false);
                fetchBlogs(); // Refresh the list
                // Redirect to approval page with blogs tab active
                setTimeout(() => {
                    window.location.href = "/dashboard/Approvals?tab=blogs";
                }, 1500);
            } else if (modalMode === "edit") {
                await api.put(`/blogs/posts/${selectedBlog.slug}`, formData);
                toast.success("Blog updated successfully!");
                setIsModalOpen(false);
                // If editing a pending blog, refresh approval page instead
                if (selectedBlog.status === 'pending') {
                    setTimeout(() => {
                        window.location.href = "/dashboard/Approvals?tab=blogs";
                    }, 1000);
                } else {
                    fetchBlogs(); // Refresh published blogs list
                }
            }
        } catch (err) {
            console.error(err);
            setError("Failed to save blog post");
            toast.error("Failed to save blog post");
        }
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">
                            Blog Posts
                        </h1>
                        <p className="text-slate-600">
                            Create and manage content for the public website.
                        </p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 hover:scale-105"
                    >
                        <Plus size={20} />
                        Create Post
                    </button>
                </div>

                {/* Table Wrapper */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                    {/* Search */}
                    <div className="p-6 border-b border-slate-200 flex justify-between gap-4 bg-gradient-to-br from-slate-50 to-white">
                        <div className="relative w-full max-w-md">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <button className="flex items-center text-slate-700 gap-2 px-5 py-3 border border-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors duration-200">
                            <Filter size={16} />
                            Filters
                        </button>
                    </div>

                    {/* Loading / Error */}
                    {loading && (
                        <div className="p-12 text-center text-slate-500">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
                            <p className="text-lg font-medium">
                                Loading blogs...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="p-6 mx-6 my-4 text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium">
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    {!loading && !error && (
                        <>
                            {blogs.length === 0 ? (
                                <div className="p-16 text-center text-slate-500">
                                    <div className="text-7xl mb-6">📝</div>
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                        No blog posts found
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        There are no blog posts available at the
                                        moment.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 text-xs uppercase text-slate-600 font-semibold tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">
                                                    Article
                                                </th>
                                                <th className="px-6 py-4 text-center">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4">
                                                    Author
                                                </th>
                                                <th className="px-6 py-4">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {blogs.map((blog) => (
                                                <tr
                                                    key={blog.id}
                                                    className="hover:bg-slate-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex gap-4 items-center">
                                                            <div className="relative group">
                                                                <img
                                                                    src={
                                                                        blog.featuredImage
                                                                    }
                                                                    className="w-16 h-16 rounded-xl object-cover shadow-md border border-slate-200 group-hover:shadow-lg transition-shadow duration-200"
                                                                    alt=""
                                                                />
                                                                <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/5 transition-colors duration-200"></div>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900 text-base mb-1">
                                                                    {blog.title}
                                                                </p>
                                                                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                                                    <ImageIcon
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="text-slate-400"
                                                                    />
                                                                    Featured
                                                                    Image
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-center align-middle">
                                                        <div className="flex justify-center text-slate-900">
                                                            <StatusBadge
                                                                status={blog.status?.toUpperCase()}
                                                            />
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5 text-sm text-slate-700 font-medium">
                                                        {blog.author}
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar
                                                                size={16}
                                                                className="text-slate-400"
                                                            />
                                                            {blog.createdAt}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleView(
                                                                        blog,
                                                                    )
                                                                }
                                                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 hover:shadow-md transition-all duration-200 border border-blue-200"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        blog,
                                                                    )
                                                                }
                                                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 hover:shadow-md transition-all duration-200 border border-slate-300"
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
                            )}
                        </>
                    )}

                    {/* Pagination UI (future-ready) */}
                    <div className="p-5 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600 bg-gradient-to-br from-slate-50 to-white">
                        <span className="font-medium">
                            Showing {blogs.length} articles
                        </span>
                        <div className="flex gap-2">
                            <button className="p-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronLeft
                                    size={18}
                                    className="text-slate-600"
                                />
                            </button>
                            <button className="p-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight
                                    size={18}
                                    className="text-slate-600"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <BlogFormModal
                        mode={modalMode}
                        blog={selectedBlog}
                        onSave={handleSave}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </>
    );
}
