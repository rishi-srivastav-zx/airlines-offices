import express from "express";
import { approveData } from "../controllers/approval.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, approveData);

export default router;
