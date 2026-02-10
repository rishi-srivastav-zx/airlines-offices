import express from "express";
import { upload } from "../middleware/multer.js";
import Office from "../model/officeSchema.js"; 
import { updateOffice } from "../controllers/uploads.controllers.js";
import path from "path";



const router = express.Router();

// Simple image upload route for blog images
router.post(
  "/image",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("=== IMAGE UPLOAD REQUEST RECEIVED ===");
      console.log("File:", req.file);

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image file provided." });
      }

      // Create public URL for the uploaded image
      const imageUrl = ("http://localhost:3001/" + req.file.path).replace(/\\/g, "/");
      
      console.log("✅ Image uploaded successfully:", imageUrl);

      res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        url: imageUrl,
      });
    } catch (error) {
      console.error("❌ IMAGE UPLOAD ERROR:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      });
    }
  },
);

router.post(
  "/",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("=== UPLOAD REQUEST RECEIVED ===");
      console.log("Files:", req.files);
      console.log("Body:", req.body);

      if (!req.body.officeData) {
        return res
          .status(400)
          .json({ success: false, message: "officeData field is missing." });
      }

      const officeData = JSON.parse(req.body.officeData);

      const logoFile = req.files?.logo?.[0];
      const imageFile = req.files?.image?.[0];

      // Add file paths if files were uploaded
      if (logoFile) {
        officeData.logo = ("/" + logoFile.path).replace(/\\/g, "/");
      }

      if (imageFile) {
        officeData.photo = ("/" + imageFile.path).replace(/\\/g, "/");
      }

      console.log("Final office data:", officeData);

      // Create new office
      const newOffice = new Office(officeData);
      await newOffice.save();

      console.log("✅ Office saved successfully");

      res.status(201).json({
        success: true,
        message: "Office created successfully",
        data: newOffice,
      });
    } catch (error) {
      console.error("❌ ERROR:", error.message);
      console.error("Stack:", error.stack);

      let errorMessage = "Failed to create office";
      if (error instanceof SyntaxError) {
        errorMessage = "Invalid JSON in officeData field.";
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
        error: error.message,
      });
    }
  },
);

router.put(
    "/offices/:slug",
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "photo", maxCount: 1 },
    ]),
    updateOffice,
);


export default router;
