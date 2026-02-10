import express from "express";
import { upload } from "../middleware/multer.js";
import {
  getAllAirlines,
  getAirlineBySlug,
  createAirline,
  updateAirline,
  deleteAirline,
} from "../controllers/airline.controller.js";

const router = express.Router();

// @route   GET /api/airlines
// @desc    Get all airlines with pagination and search
// @access  Public
router.get("/", getAllAirlines);

// @route   GET /api/airlines/:slug
// @desc    Get single airline by slug
// @access  Public
router.get("/:slug", getAirlineBySlug);

// @route   POST /api/airlines
// @desc    Create a new airline
// @access  Private
router.post(
  "/",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "ogImage", maxCount: 1 },
  ]),
  createAirline
);

// @route   PUT /api/airlines/:slug
// @desc    Update an airline by slug
// @access  Private
router.put(
  "/:slug",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "ogImage", maxCount: 1 },
  ]),
  updateAirline
);

// @route   DELETE /api/airlines/:slug
// @desc    Delete an airline by slug
// @access  Private
router.delete("/:slug", deleteAirline);

export default router;
