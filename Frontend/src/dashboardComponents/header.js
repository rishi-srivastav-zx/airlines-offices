import { useState, useEffect } from "react";
import { Bell, X, Camera } from "lucide-react";

export default function HeaderBar() {
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("User");
    const [userRole, setUserRole] = useState("editor");

    useEffect(() => {
        setMounted(true);
        
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUserName(user?.name || "User");
                setUserRole(user?.role || "editor");
                setEmail(user?.email || "");
            }
        } catch (error) {
            console.error("Error reading user from localStorage:", error);
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSaveProfile = () => {
        setIsProfileOpen(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (date) =>
        date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const formatTime = (date) =>
        date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

    if (!mounted) return null;

    return (
        <header className="w-full bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {formatDate(currentTime)}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {formatTime(currentTime)}
                    </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    >
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                                {userName || "User"}
                            </p>
                            <p className="text-xs text-gray-500 uppercase">
                                {userRole || "role"}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold overflow-hidden">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                userName.charAt(0).toUpperCase()
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Profile Edit Popup */}
            {isProfileOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Edit Profile
                            </h3>
                            <button
                                onClick={() => setIsProfileOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4 space-y-4">
                            {/* Avatar with Upload */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-2xl overflow-hidden">
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            userName.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <label
                                        htmlFor="profile-upload"
                                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </label>
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) =>
                                        setUserName(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Role Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Role
                                </label>

                                <select
                                    value={userRole} // ← dynamic
                                    disabled // ← NOT changeable
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                                >
                                    <option value={userRole}>{userRole}</option>
                                </select>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                            <button
                                onClick={() => setIsProfileOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
