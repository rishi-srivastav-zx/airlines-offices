import express from "express";
import { login } from "../controllers/auth.controller.js";
import { createUser } from "../controllers/user.controllers.js";
import { approveData } from "../controllers/approval.js";
import { protect } from "../middleware/auth.js";
import { checkPermission } from "../config/permission.js";

const router = express.Router();

// Auth

router.post("/login", login);

// SUPERADMIN only

router.post("/users", protect, checkPermission(["SUPERADMIN"]), createUser);

// SUPERADMIN + MANAGER

router.post(
    "/approvals",
    protect,
    checkPermission(["SUPERADMIN", "MANAGER"]),
    approveData
);

export default router;
