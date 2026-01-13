"use client";

import { useState } from "react";
import {
    CheckCircle,
    XCircle,
    Eye,
    MessageSquare,
    Search,
    Building2,
    FileText,
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

const MOCK_PENDING_CONTENT = [
    {
        id: "1",
        type: "office",
        title: "Delta Airlines Tokyo Office",
        author: "Sarah Jenkins",
        date: "2024-03-20",
        status: ContentStatus.PENDING,
    },
    {
        id: "2",
        type: "blog",
        title: "Ultimate Guide to Business Class",
        author: "Mike Ross",
        date: "2024-03-21",
        status: ContentStatus.PENDING,
    },
    {
        id: "3",
        type: "office",
        title: "Lufthansa Berlin HQ",
        author: "Sarah Jenkins",
        date: "2024-03-21",
        status: ContentStatus.PENDING,
    },
];

export default function ApprovalsPage() {
    const [items, setItems] = useState(MOCK_PENDING_CONTENT);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedItemId, setSelectedItemId] = useState(null);

    const handleApprove = (id) => {
        setItems(items.filter((i) => i.id !== id));
        // In real app, call API to update status
        alert("Content approved and published!");
    };

    const openRejectModal = (id) => {
        setSelectedItemId(id);
        setIsRejectModalOpen(true);
    };

    const handleReject = () => {
        if (!rejectionReason) return;
        setItems(items.filter((i) => i.id !== selectedItemId));
        setIsRejectModalOpen(false);
        setRejectionReason("");
        alert("Content rejected with feedback sent to editor.");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Content Approvals
                    </h1>
                    <p className="text-slate-500">
                        Review and moderate pending submissions from editors.
                    </p>
                </div>
                <div className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-bold border border-amber-200">
                    {items.length} Pending Actions
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <div className="relative max-w-sm">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Filter by title or author..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors"
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <div
                                    className={`p-3 rounded-xl ${
                                        item.type === "office"
                                            ? "bg-blue-50 text-blue-600"
                                            : "bg-indigo-50 text-indigo-600"
                                    }`}
                                >
                                    {item.type === "office" ? (
                                        <Building2 size={24} />
                                    ) : (
                                        <FileText size={24} />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            {item.type}
                                        </span>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            Submitted by{" "}
                                            <span className="font-semibold text-slate-700">
                                                {item.author}
                                            </span>
                                        </span>
                                        <span>•</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                                    <Eye size={18} />
                                    Preview
                                </button>
                                <button
                                    onClick={() => openRejectModal(item.id)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                >
                                    <XCircle size={18} />
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleApprove(item.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all shadow-lg shadow-green-900/10"
                                >
                                    <CheckCircle size={18} />
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))}
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
                                No pending content requires your approval.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {isRejectModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                Reject Submission
                            </h2>
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 mb-4">
                                Please provide a reason for rejection. This will
                                be shared with the editor to help them improve
                                the content.
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
                                onClick={() => setIsRejectModalOpen(false)}
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
    );
}
