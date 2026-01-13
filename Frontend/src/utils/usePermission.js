export const ROLE_PERMISSIONS = {
    SUPERADMIN: {
        offices: true,
        blogs: true,
        approvals: true,
        users: true,
    },
    MANAGER: {
        offices: true,
        blogs: true,
        approvals: true,
        users: false,
    },
    EDITOR: {
        offices: true,
        blogs: true,
        approvals: false,
        users: false,
    },
};

export const getUserPermissions = () => {
    if (typeof window === "undefined") return {};

    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return {};
        
        const user = JSON.parse(userStr);
        if (!user?.role) return {};

        // Normalize role to uppercase to match ROLE_PERMISSIONS keys
        const role = user.role.toUpperCase();
        return ROLE_PERMISSIONS[role] || {};
    } catch (error) {
        console.error("Error getting user permissions:", error);
        return {};
    }
};

export const hasPermission = (permission) => {
    const permissions = getUserPermissions();
    return !!permissions[permission];
};
