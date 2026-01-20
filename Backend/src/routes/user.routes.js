import express from "express";
import {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
} from "../controllers/user.controllers.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// SUPERADMIN creates user
router.post("/", protect, createUser);

// Get users
router.get("/", protect, getUsers);

// Update user
router.put("/:id", protect, updateUser);

// Delete user
router.delete("/:id", protect, deleteUser);

export default router;
