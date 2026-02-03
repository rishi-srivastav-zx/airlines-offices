import express from "express";
import { upload } from "../middleware/multer.js";
import {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
} from "../controllers/user.controllers.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// SUPERADMIN creates user
router.post("/", protect, upload.single("avatar"), createUser);

// Get users
router.get("/", protect, upload.single("avatar"), getUsers);

// Update user
router.put("/:id", protect, upload.single("avatar"), updateUser);

// Delete user
router.delete("/:id", protect, deleteUser);

export default router;
