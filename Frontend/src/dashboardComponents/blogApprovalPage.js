"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Image as ImageIcon,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Eye,
  Bell,
} from "lucide-react";
import BlogFormModal from "./blogform";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* Status Badge */
const StatusBadge = ({ status }) => {
  const styles = {
    "PENDING APPROVAL": "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    DRAFT: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default function BlogApprovalPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchPendingBlogs = async (search = "") => {
    try {
      setLoading(true);
      const res = await api.get("/blogs/pending-posts", {
        params: {
          search,
        },
      });

      const blogData = res.data.data || [];
      const mappedBlogs = blogData.map((blog) => ({
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
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending blog posts");
    } finally {
      setLoading(false);
    }
  };

  /* Initial load */
  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  /* Search (debounced) */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPendingBlogs(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleView = (blog) => {
    setSelectedBlog(blog);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleApprove = async (blog) => {
    try {
      await api.patch(`/blogs/posts/${blog.slug}/status`, {
        status: "published",
      });
      fetchPendingBlogs(); // Refresh the list
    } catch (err) {
      console.error(err);
      setError("Failed to approve blog post");
    }
  };

  const handleReject = async (blog) => {
    try {
      await api.patch(`/blogs/posts/${blog.slug}/status`, {
        status: "archived",
      });
      fetchPendingBlogs(); // Refresh the list
    } catch (err) {
      console.error(err);
      setError("Failed to reject blog post");
    }
  };

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPendingBlogs();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Blog Approval
            {notificationCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Bell size={12} />
                {notificationCount}
              </span>
            )}
          </h1>
          <p className="text-slate-500">
            Review and approve pending blog posts for publication.
            {notificationCount > 0 && (
              <span className="block text-amber-600 text-sm font-medium mt-1">
                {notificationCount} pending approval{notificationCount > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b flex justify-between gap-4 bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search pending articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="p-6 text-center text-slate-500">Loading pending blogs...</div>
        )}

        {error && <div className="p-4 text-red-600 bg-red-50">{error}</div>}

        {/* Table */}
        {!loading && !error && (
          <>
            {blogs.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">No pending approvals</h3>
                <p className="text-sm text-slate-500">There are no blog posts waiting for approval at the moment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Article</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex gap-4">
                            <img
                              src={blog.featuredImage}
                              className="w-12 h-12 rounded-lg object-cover"
                              alt=""
                            />
                            <div>
                              <p className="font-semibold">{blog.title}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <ImageIcon size={12} />
                                Featured Image
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={blog.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {blog.author}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          <Calendar size={14} className="inline mr-1" />
                          {blog.createdAt}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleView(blog)}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm flex items-center gap-1"
                            >
                              <Eye size={14} />
                              View
                            </button>
                            <button
                              onClick={() => handleApprove(blog)}
                              className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-1 hover:bg-green-100"
                            >
                              <Check size={14} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(blog)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-1 hover:bg-red-100"
                            >
                              <X size={14} />
                              Reject
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
        <div className="p-4 border-t flex justify-between text-sm text-slate-500">
          <span>Showing {blogs.length} pending articles</span>
          <div className="flex gap-2">
            <button className="p-2 border rounded">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border rounded">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <BlogFormModal
          mode={modalMode}
          blog={selectedBlog}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}