"use client";

import { useState } from "react";
import {
    UserPlus,
    Search,
    Shield,
    Mail,
    MoreVertical,
    Trash2,
    Edit2,
} from "lucide-react";

const UserRole = {
    SUPERADMIN: "SUPERADMIN",
    MANAGER: "MANAGER",
    EDITOR: "EDITOR",
};

const MOCK_USERS = [
    {
        id: "1",
        name: "Admin One",
        email: "admin@skyway.com",
        role: UserRole.SUPERADMIN,
    },
    {
        id: "2",
        name: "Jane Manager",
        email: "jane@skyway.com",
        role: UserRole.MANAGER,
    },
    {
        id: "3",
        name: "Sarah Editor",
        email: "sarah@skyway.com",
        role: UserRole.EDITOR,
    },
    {
        id: "4",
        name: "Mike Editor",
        email: "mike@skyway.com",
        role: UserRole.EDITOR,
    },
];

export default function Usermanagement() {
    const [users, setUsers] = useState(MOCK_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: UserRole.EDITOR,
    });

    const handleAddUser = (e) => {
        e.preventDefault();
        const newUser = { id: Math.random().toString(), ...formData };
        setUsers([...users, newUser]);
        setIsModalOpen(false);
        setFormData({ name: "", email: "", role: UserRole.EDITOR });
    };

    const deleteUser = (id) => {
        if (window.confirm("Are you sure you want to remove this user?")) {
            setUsers(users.filter((u) => u.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        User Management
                    </h1>
                    <p className="text-slate-500">
                        Add and manage access permissions for your team.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/10"
                >
                    <UserPlus size={20} />
                    Invite User
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative"
                    >
                        <div className="absolute top-4 right-4">
                            <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 border-2 border-white shadow-inner">
                                {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                                    {user.name}
                                </h3>
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest mt-1 inline-block border ${
                                        user.role === UserRole.SUPERADMIN
                                            ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                            : user.role === UserRole.MANAGER
                                            ? "bg-amber-50 text-amber-700 border-amber-100"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    }`}
                                >
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail size={16} className="text-slate-400" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Shield size={16} className="text-slate-400" />
                                <span>Full Access</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                                <Edit2 size={14} /> Edit
                            </button>
                            <button
                                onClick={() => deleteUser(user.id)}
                                className="w-10 flex items-center justify-center py-2 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <form onSubmit={handleAddUser}>
                            <div className="p-6 border-b flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Invite New User
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        required
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20"
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
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                        User Role
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.values(UserRole).map((role) => (
                                            <label
                                                key={role}
                                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                    formData.role === role
                                                        ? "border-blue-600 bg-blue-50"
                                                        : "border-slate-100 hover:bg-slate-50"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role}
                                                    checked={
                                                        formData.role === role
                                                    }
                                                    onChange={() =>
                                                        setFormData({
                                                            ...formData,
                                                            role,
                                                        })
                                                    }
                                                    className="text-blue-600"
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {role.charAt(0) +
                                                            role
                                                                .slice(1)
                                                                .toLowerCase()}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 leading-tight">
                                                        {role ===
                                                        UserRole.SUPERADMIN
                                                            ? "Full administrative control"
                                                            : role ===
                                                              UserRole.MANAGER
                                                            ? "Content approval and moderation"
                                                            : "Create and edit submissions"}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-900/10"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
