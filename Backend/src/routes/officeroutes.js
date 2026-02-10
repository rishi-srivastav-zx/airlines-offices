import express from "express";
import { upload } from "../middleware/multer.js";
import {
  getAllOffices,
  getOfficeBySlug,
  createOffice,
  updateOffice,
  patchOffice,
  deleteOffice,
  getOfficeStats,
  getNearbyOffices,
} from "../controllers/office.controller.js";

const router = express.Router();

router.get("/", getAllOffices);


router.get("/stats/summary", getOfficeStats);


router.get("/search/nearby", getNearbyOffices);


router.get("/:slug", getOfficeBySlug);


router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "ogImage", maxCount: 1 },
  ]),
  createOffice
);


router.put(
  "/:slug",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "ogImage", maxCount: 1 },
  ]),
  updateOffice
);


router.patch("/:slug", patchOffice);


router.delete("/:slug", deleteOffice);

export default router;
