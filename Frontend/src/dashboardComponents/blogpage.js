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
  Eye,
  Pencil,
  Trash2,
  FileText,
  Clock,
  TrendingUp,
  MoreHorizontal,
  ArrowUpRight,
  AlertCircle,
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

/* Enhanced Status Badge with better visuals */
const StatusBadge = ({ status }) => {
  const config = {
    APPROVED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      icon: TrendingUp,
    },
    PUBLISHED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      icon: TrendingUp,
    },
    "PENDING APPROVAL": {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
      icon: Clock,
    },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
      icon: Clock,
    },
    DRAFT: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      dot: "bg-slate-400",
      icon: FileText,
    },
    REJECTED: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
      icon: MoreHorizontal,
    },
  };

  const style = config[status] || config.PENDING;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${style.bg} ${style.text} border ${style.border} transition-all duration-200 shadow-sm`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
      <Icon size={12} className="opacity-70" />
      {status}
    </span>
  );
};

/* Delete Confirmation Modal */
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, blogTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Delete Blog Post</h3>
        </div>
        
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete <span className="font-semibold text-slate-900">"{blogTitle}"</span>? This action cannot be undone and the blog will be permanently removed.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
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

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const fetchBlogs = async (search = "") => {
    try {
      setLoading(true);
      const res = await api.get("/blogs/posts", {
        params: {
          status: "published",
          search,
        },
      });

      const mappedBlogs = res.data.data.map((blog) => ({
        id: blog._id,
        title: blog.title,
        featuredImage: blog.featuredImage,
        status: "PUBLISHED",
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

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleView = async (blog) => {
    try {
      const res = await api.get(`/blogs/posts/admin/${blog.slug}`);
      setSelectedBlog(res.data.data);
      setModalMode("view");
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blog post details");
    }
  };

  const handleEdit = async (blog) => {
    try {
      const res = await api.get(`/blogs/posts/admin/${encodeURIComponent(blog.slug)}`);
      const blogData = res.data.data;
      
      setSelectedBlog(blogData);
      setModalMode("edit");
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blog post details");
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    try {
      await api.delete(`/blogs/posts/${encodeURIComponent(blogToDelete.slug)}`);
      toast.success("Blog deleted successfully!");
      setDeleteModalOpen(false);
      setBlogToDelete(null);
      fetchBlogs(); // Refresh the list
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog post");
    }
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
        fetchBlogs();
        setTimeout(() => {
          window.location.href = "/dashboard/Approvals?tab=blogs";
        }, 1500);
      } else if (modalMode === "edit") {
        await api.put(`/blogs/posts/${encodeURIComponent(selectedBlog.slug)}`, formData);
        toast.success("Blog updated successfully!");
        setIsModalOpen(false);
        if (selectedBlog.status === "pending") {
          setTimeout(() => {
            window.location.href = "/dashboard/Approvals?tab=blogs";
          }, 1000);
        } else {
          fetchBlogs();
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
      <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
        {/* Header Section - Stats Removed */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Blog Posts
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <FileText size={16} className="text-[#00ADEF]" />
              Create and manage content for the public website
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-[#00ADEF] hover:bg-[#0095cc] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-[#00ADEF]/25 hover:shadow-xl hover:shadow-[#00ADEF]/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={20} strokeWidth={2.5} />
            Create New Blog
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-6 border-b border-slate-100 bg-white">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles by title, author, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ADEF]/20 focus:border-[#00ADEF] transition-all duration-200 hover:bg-white hover:border-slate-300"
                />
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
                  <Filter size={16} className="text-slate-500" />
                  Filters
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
                  <Calendar size={16} className="text-slate-500" />
                  Date Range
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-16 text-center">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-100 border-t-[#00ADEF]"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-[#00ADEF]/30 animate-pulse"></div>
              </div>
              <p className="mt-6 text-lg font-medium text-slate-600">Loading your blogs...</p>
              <p className="text-sm text-slate-400 mt-1">Please wait a moment</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-8 m-6 text-red-700 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <MoreHorizontal size={20} className="text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900">Error Loading Blogs</h4>
                <p className="text-sm mt-1 text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Table Content */}
          {!loading && !error && (
            <>
              {blogs.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-3xl mb-6">
                    <FileText size={48} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    No blog posts found
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-6">
                    Get started by creating your first blog post. It will appear here once published.
                  </p>
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-2 text-[#00ADEF] font-semibold hover:underline"
                  >
                    Create your first blog
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Article Details
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Published Date
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {blogs.map((blog, index) => (
                        <tr
                          key={blog.id}
                          className="group hover:bg-slate-50/80 transition-all duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-5">
                            <div className="flex gap-4 items-center">
                              <div className="relative group/img">
                                <img
                                  src={blog.featuredImage}
                                  className="w-20 h-20 rounded-xl object-cover shadow-md border border-slate-200 group-hover/img:shadow-lg group-hover/img:scale-105 transition-all duration-300"
                                  alt=""
                                />
                                <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover/img:ring-[#00ADEF]/20 transition-all duration-300"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 text-base mb-1 line-clamp-1 group-hover:text-[#00ADEF] transition-colors">
                                  {blog.title}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                  <span className="flex items-center gap-1.5">
                                    <ImageIcon size={12} className="text-slate-400" />
                                    Featured Image
                                  </span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  <span className="font-mono text-slate-400">/{blog.slug}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-5 text-center">
                            <StatusBadge status={blog.status?.toUpperCase()} />
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ADEF] to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                {blog.author.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                {blog.author}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <div className="p-1.5 bg-slate-100 rounded-lg">
                                <Calendar size={14} className="text-slate-500" />
                              </div>
                              <span className="font-medium">
                                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleView(blog)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-[#00ADEF] hover:text-white hover:border-[#00ADEF] transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                <Eye size={14} />
                                View
                              </button>
                              <button
                                onClick={() => handleEdit(blog)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(blog)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                <Trash2 size={14} />
                                Delete
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

          {/* Enhanced Pagination */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{blogs.length}</span>
              <span className="text-slate-500">articles found</span>
              {searchQuery && (
                <span className="text-xs bg-slate-200 px-2 py-1 rounded-full text-slate-600">
                  filtered by "{searchQuery}"
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Page 1 of 1</span>
              <div className="flex gap-2">
                <button 
                  disabled
                  className="p-2.5 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronLeft size={18} className="text-slate-600" />
                </button>
                <button 
                  disabled
                  className="p-2.5 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronRight size={18} className="text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Form Modal */}
        {isModalOpen && (
          <BlogFormModal
            mode={modalMode}
            blog={selectedBlog}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setBlogToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          blogTitle={blogToDelete?.title || ""}
        />
      </div>
    </>
  );
}