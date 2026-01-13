// backend/config/permissions.js

export const PERMISSIONS = {
    superadmin: {
        users: true,
        approvals: true,
        blogs: true,
        offices: true,
    },
    manager: {
        users: false,
        approvals: true,
        blogs: true,
        offices: true,
    },
    editor: {
        users: false,
        approvals: false,
        blogs: true,
        offices: true,
    },
};

export const checkPermission = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied",
            });
        }
        next();
    };
};
