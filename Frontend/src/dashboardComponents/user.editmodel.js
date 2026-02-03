"use client";
import { X, Upload } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserRole = {
    SUPERADMIN: "SUPERADMIN",
    MANAGER: "MANAGER",
    EDITOR: "EDITOR",
};

export default function EditUserModal({ user, onClose, onUpdate }) {
    const [formData, setFormData] = useState(() => ({
        name: user.name || "",
        email: user.email || "",
        password: "",
        avatar: user.avatar || "",
        role: user.role?.toUpperCase() || UserRole.EDITOR,
        avatarFile: null,
    }));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        const preview = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, avatar: preview, avatarFile: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            toast.error("Name is required");
            return;
        }

        setIsSubmitting(true);

        try {
            const submissionData = new FormData();
            submissionData.append("name", formData.name);
            submissionData.append("role", formData.role.toLowerCase());
            
            if (formData.password) {
                submissionData.append("password", formData.password);
            }
            
            if (formData.avatarFile) {
                console.log("Appending avatar file:", formData.avatarFile.name);
                submissionData.append("avatar", formData.avatarFile);
            } else {
                console.log("No avatar file to upload");
            }

            console.log("Submitting FormData with fields:");
            for (let [key, value] of submissionData.entries()) {
                console.log(key, value);
            }

            const response = await axios.put(
                `http://localhost:3001/api/users/${user._id}`,
                submissionData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log("Update response:", response.data);

            if (response.data.success) {
                console.log("Calling onUpdate with:", response.data.user);
                console.log("User avatar from response:", response.data.user.avatar);
                onUpdate(response.data.user);
                toast.success("User updated successfully!");
                onClose();
            } else {
                toast.error(response.data.message || "Failed to update user");
            }
        } catch (error) {
            console.error("Failed to update user:", error);
            console.error("Error response:", error.response?.data);
            const message = error.response?.data?.message || "Failed to update user. Please try again.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <h2
                    id="modal-title"
                    className="text-xl font-bold mb-6 text-slate-900"
                >
                    Edit User
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3 mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 overflow-hidden flex items-center justify-center ring-4 ring-indigo-50">
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar.startsWith('blob:') || formData.avatar.startsWith('http') ? formData.avatar : `http://localhost:3001${formData.avatar}`}
                                    alt={`${formData.name}'s avatar`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.log("Edit modal image failed to load:", formData.avatar);
                                        const parent = e.target.parentElement;
                                        if (parent) {
                                            parent.innerHTML = `<span class="text-2xl font-bold text-indigo-600">${formData.name?.[0]?.toUpperCase() || "U"}</span>`;
                                        }
                                    }}
                                />
                            ) : (
                                <span className="text-2xl font-bold text-indigo-600">
                                    {formData.name?.[0]?.toUpperCase() || "U"}
                                </span>
                            )}
                        </div>

                        <label className="flex items-center gap-2 text-sm cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                            <Upload size={16} />
                            Upload Photo
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                                aria-label="Upload profile photo"
                            />
                        </label>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-900 mb-1.5"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="input-ui w-full px-4 py-2.5 border border-slate-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-900 mb-1.5"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled
                                className="input-ui w-full px-4 py-2.5 border border-slate-400 text-gray-900 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                                aria-label="Email address (disabled)"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-900 mb-1.5"
                            >
                                New Password{" "}
                                <span className="text-slate-400 font-normal">
                                    (optional)
                                </span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current"
                                className="input-ui w-full px-4 py-2.5 border text-gray-900 border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-900 mb-1.5"
                            >
                                User Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="input-ui w-full px-4 py-2.5 border text-gray-900 border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            >
                                <option value="SUPERADMIN">Super Admin</option>
                                <option value="MANAGER">Manager</option>
                                <option value="EDITOR">Editor</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 py-2.5 rounded-lg font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
