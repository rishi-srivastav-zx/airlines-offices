"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    FileText,
    CheckSquare,
    Users,
    LogOut,
    Plane,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUserPermissions } from "@/utils/usePermission";


export const Sidebar = ({ handleLogout }) => {
    const pathname = usePathname();
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user?.role) {
                    setRole(user.role);
                }
            }
            // Get permissions after user is loaded
            setPermissions(getUserPermissions());
        } catch (error) {
            console.error("Error reading user from localStorage:", error);
        }
    }, []);

  const menuItems = [
      {
          name: "Dashboard",
          path: "/dashboard",
          permission: null,
          icon: LayoutDashboard,
      },
      {
          name: "Airlines Offices",
          path: "/dashboard/officepage",
          permission: "offices",
          icon: Building2,
      },
      {
          name: "Blogs",
          path: "/dashboard/blogpage",
          permission: "blogs",
          icon: FileText,
      },
      {
          name: "Approvals",
          path: "/dashboard/Approvals",
          permission: "approvals",
          icon: CheckSquare,
      },
      {
          name: "User Management",
          path: "/dashboard/Usermanagement",
          permission: "users",
          icon: Users,
      },
  ];



  const filteredMenu = menuItems.filter((item) => {
      if (!item.permission) return true;
      return permissions?.[item.permission];
  });

//    const handleLogout = () => {
//        localStorage.removeItem("user");
//        document.cookie = "token=; Max-Age=0; path=/";
//        router.push("/signup");
//    };

    return (
        <div className="w-64 h-screen bg-slate-900 flex flex-col shrink-0">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Plane className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                    Airlines<span className="text-blue-400">Offices</span>
                </h1>
            </div>

            {/* Menu */}
            <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-4 px-2">
                    Main Menu
                </div>

                {filteredMenu.map((item) => {
                    const isActive =
                        item.path === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
};
