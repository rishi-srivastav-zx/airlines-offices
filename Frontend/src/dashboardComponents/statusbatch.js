import React from "react";

export const StatusBadge = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-800 border-green-200";
            case "PENDING":
                return "bg-amber-100 text-amber-800 border-amber-200";
            case "REJECTED":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}
        >
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
};

export default StatusBadge;