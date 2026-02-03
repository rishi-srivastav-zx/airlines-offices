"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import AirlineOfficeForm from "./AirlineOfficeForm";
import BlogFormModal from "./blogform";

// API Configuration
const api = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

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

export default function ApprovalsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isApproving, setIsApproving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Blog approval states
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    const [blogModalMode, setBlogModalMode] = useState("view");
    const [activeTab, setActiveTab] = useState("offices"); // Tab management
    const [notificationCount, setNotificationCount] = useState(0);
    
    // Handle URL parameter for initial tab
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab === 'blogs') {
            setActiveTab('blogs');
        }
    }, []);

    // Fetch pending offices
    const fetchPendingOffices = async () => {
        try {
            const response = await api.get("/approval/pending");
            if (response.data.success) {
                setItems(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching pending offices:", err);
        }
    };

    // Fetch pending blogs for approval
    const fetchPendingBlogs = async () => {
        try {
            setLoading(true);
            const res = await api.get("/blogs/pending-posts");

            const mappedBlogs = res.data.data.map((blog) => ({
                id: blog._id,
                title: blog.title,
                featuredImage: blog.featuredImage,
                status: "PENDING APPROVAL",
                author: blog.author?.name || "Admin",
                createdAt: blog.createdAt ? new Date(blog.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                slug: blog.slug,
            }));

            setBlogs(mappedBlogs);
            setNotificationCount(mappedBlogs.length); // Update notification count
        } catch (err) {
            console.error("Error fetching pending blogs:", err);
        }
    };

    const fetchAllPending = async () => {
        setLoading(true);
        setError(null);
        
        await Promise.all([
            fetchPendingOffices(),
            fetchPendingBlogs()
        ]);
        
        setLoading(false);
    };

    useEffect(() => {
        fetchAllPending();
    }, []);

    const handlePreview = (office) => {
        setSelectedOffice(office); // 🔥 pura office object
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        if (!selectedOffice) return;

        await api.put(`/approval/${selectedOffice._id}/update`, formData);

        toast.success("Pending office updated");
        setIsModalOpen(false);
        fetchPendingOffices(); // Refresh the list
    };

    // Blog approval functions
    const handleViewBlog = (blog) => {
        setSelectedBlog(blog);
        setBlogModalMode("view");
        setIsBlogModalOpen(true);
    };

    const handleApproveBlog = async (blog) => {
        try {
            await api.patch(`/blogs/posts/${blog.slug}/status`, {
                status: "published",
            });
            toast.success("Blog approved and published successfully!");
            fetchPendingBlogs(); // Refresh the list
        } catch (err) {
            toast.error("Failed to approve blog post");
            console.error(err);
        }
    };

    const handleRejectBlog = async (blog) => {
        try {
            await api.patch(`/blogs/posts/${blog.slug}/status`, {
                status: "archived",
            });
            toast.success("Blog rejected successfully!");
            fetchPendingBlogs(); // Refresh the list
        } catch (err) {
            toast.error("Failed to reject blog post");
            console.error(err);
        }
    };



    const handleApprove = async (id) => {
        setIsApproving(true);
        try {
            const response = await api.put(`/approval/${id}/approve`);
            if (response.data.success) {
                toast.success("Office approved and published successfully!");
                setItems(items.filter((i) => i._id !== id));
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to approve office",
            );
            console.error("Error approving office:", err);
        } finally {
            setIsApproving(false);
        }
    };

    const openRejectModal = (id) => {
        setSelectedItemId(id);
        setIsRejectModalOpen(true);
    };

    const handleReject = async () => {
        if (!rejectionReason) return;

        try {
            const response = await api.put(
                `/approval/${selectedItemId}/reject`,
                {
                    rejectionReason,
                },
            );
            if (response.data.success) {
                toast.success("Office rejected successfully!");
                setItems(items.filter((i) => i._id !== selectedItemId));
                setIsRejectModalOpen(false);
                setRejectionReason("");
                setSelectedItemId(null);
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to reject office",
            );
            console.error("Error rejecting office:", err);
        }
    };

    // Filter items based on search query
    const filteredItems = items.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            item.officeOverview?.airlineName
                ?.toLowerCase()
                .includes(searchLower) ||
            item.officeOverview?.city?.toLowerCase().includes(searchLower) ||
            item.officeOverview?.country?.toLowerCase().includes(searchLower)
        );
    });

    // Filter blogs based on search query
    const filteredBlogs = blogs.filter((blog) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            blog.title?.toLowerCase().includes(searchLower) ||
            blog.author?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 p-6">
                <div className="max-w-8xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <FileText
                                        className="text-blue-600"
                                        size={28}
                                    />
                                </div>
                                Content Approvals
                            </h1>
                            <p className="text-slate-500 mt-2">
                                Review and approve pending submissions
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border shadow-sm">
                            <span className="text-sm font-medium text-slate-600">
                                Total Pending:
                            </span>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                                {items.length + blogs.length}
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl border shadow-sm p-1">
                        <div className="flex gap-1">
                            <button
                                onClick={() => setActiveTab("offices")}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === "offices"
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <Building2 size={18} />
                                Offices ({items.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("blogs")}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === "blogs"
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <FileText size={18} />
                                Blogs ({blogs.length})
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-2xl border shadow-lg p-4">
                        <div className="relative">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search by airline name, city, or country..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-2xl border shadow-xl p-20 flex flex-col items-center justify-center">
                            <Loader2
                                size={48}
                                className="animate-spin text-blue-600 mb-4"
                            />
                            <p className="text-slate-600 font-medium">
                                Loading pending {activeTab}...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-2xl border shadow-xl p-20 flex flex-col items-center justify-center">
                            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                                <XCircle size={40} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Error Loading Data
                            </h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border shadow-xl overflow-hidden">
                            {/* Offices Tab */}
                            {activeTab === "offices" && (
                                <div className="divide-y divide-slate-100">
                                    {filteredItems.map((item) => (
                                        <div
                                            key={item._id}
                                            className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors"
                                        >
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                                    <Building2 size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                            Office
                                                        </span>
                                                        <StatusBadge
                                                            status={item.status}
                                                        />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        {item.officeOverview
                                                            ?.airlineName ||
                                                            "Unknown Airline"}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 mb-2">
                                                        {item.officeOverview?.city},{" "}
                                                        {
                                                            item.officeOverview
                                                                ?.country
                                                        }
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            Submitted by{" "}
                                                            <span className="font-semibold text-slate-700">
                                                                {item.submittedBy ||
                                                                    "Anonymous"}
                                                            </span>
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {new Date(
                                                                item.submittedAt,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        handlePreview(item)
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                                                >
                                                    <Eye size={18} />
                                                    Preview
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        openRejectModal(item._id)
                                                    }
                                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                >
                                                    <XCircle size={18} />
                                                    Reject
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleApprove(item._id)
                                                    }
                                                    disabled={isApproving}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all shadow-lg shadow-green-900/10 disabled:opacity-50"
                                                >
                                                    {isApproving ? (
                                                        <>
                                                            <Loader2
                                                                size={18}
                                                                className="animate-spin"
                                                            />
                                                            Approving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle
                                                                size={18}
                                                            />
                                                            Approve
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredItems.length === 0 &&
                                        items.length > 0 && (
                                            <div className="p-20 text-center">
                                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Search
                                                        size={40}
                                                        className="text-slate-300"
                                                    />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    No results found
                                                </h3>
                                                <p className="text-slate-500 mt-1">
                                                    Try adjusting your search terms
                                                </p>
                                            </div>
                                        )}
                                    {items.length === 0 && (
                                        <div className="p-20 text-center">
                                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle
                                                    size={40}
                                                    className="text-slate-300"
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">
                                                All caught up!
                                            </h3>
                                            <p className="text-slate-500 mt-1">
                                                No pending offices require your
                                                approval.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Blogs Tab */}
                            {activeTab === "blogs" && (
                                <div className="divide-y divide-slate-100">
                                    {filteredBlogs.map((blog) => (
                                        <div
                                            key={blog.id}
                                            className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors"
                                        >
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                            Blog
                                                        </span>
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                            {blog.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 mb-2">
                                                        by {blog.author}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <span className="font-semibold text-slate-700">
                                                                Submitted {blog.createdAt}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleViewBlog(blog)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                                                >
                                                    <Eye size={18} />
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => handleRejectBlog(blog)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                >
                                                    <XCircle size={18} />
                                                    Reject
                                                </button>

                                                <button
                                                    onClick={() => handleApproveBlog(blog)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all shadow-lg shadow-green-900/10"
                                                >
                                                    <CheckCircle size={18} />
                                                    Approve
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredBlogs.length === 0 &&
                                        blogs.length > 0 && (
                                            <div className="p-20 text-center">
                                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Search
                                                        size={40}
                                                        className="text-slate-300"
                                                    />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    No results found
                                                </h3>
                                                <p className="text-slate-500 mt-1">
                                                    Try adjusting your search terms
                                                </p>
                                            </div>
                                        )}
                                    {blogs.length === 0 && (
                                        <div className="p-20 text-center">
                                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle
                                                    size={40}
                                                    className="text-slate-300"
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">
                                                All caught up!
                                            </h3>
                                            <p className="text-slate-500 mt-1">
                                                No pending blogs require your
                                                approval.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {isRejectModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="p-6 border-b flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Reject Submission
                                    </h2>
                                    <button
                                        onClick={() =>
                                            setIsRejectModalOpen(false)
                                        }
                                        className="text-slate-400 hover:text-slate-600 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-slate-600 mb-4">
                                        Please provide a reason for rejection.
                                        This will be shared with the editor to
                                        help them improve the content.
                                    </p>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                        Rejection Reason
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                                        rows={4}
                                        placeholder="e.g. Incomplete address information, outdated phone numbers..."
                                        value={rejectionReason}
                                        onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="p-6 bg-slate-50 flex justify-end gap-3">
                                    <button
                                        onClick={() =>
                                            setIsRejectModalOpen(false)
                                        }
                                        className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={!rejectionReason}
                                        className="px-6 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-red-900/10"
                                    >
                                        Confirm Rejection
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                        <AirlineOfficeForm
                            initialData={selectedOffice} // 🔥 THIS IS THE KEY
                            onSave={handleSave}
                            onClose={() => {
                                setIsModalOpen(false);
                                setSelectedOffice(null);
                            }}
                        />
                    </div>
                )}

                {/* Blog Modal */}
                {isBlogModalOpen && (
                    <BlogFormModal
                        mode={blogModalMode}
                        blog={selectedBlog}
                        onClose={() => {
                            setIsBlogModalOpen(false);
                            setSelectedBlog(null);
                        }}
                    />
                )}
            </div>
        </>
    );
}
