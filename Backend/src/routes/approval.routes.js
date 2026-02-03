import express from "express";
import PendingOffice from "../model/pendingOfficeSchema.js";
import Office from "../model/officeSchema.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// @route   GET /api/approval/pending
// @desc    Get all pending office submissions
// @access  Private (Manager/SuperAdmin)
router.get("/pending", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "PENDING",
      sortBy = "submittedAt",
      order = "desc",
    } = req.query;

    const query = { status };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const pendingOffices = await PendingOffice.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await PendingOffice.countDocuments(query);

    res.json({
      success: true,
      data: pendingOffices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/approval/submit
// @desc    Submit new office for approval
// @access  Private
router.post(
  "/submit",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.body.officeData) {
        return res
          .status(400)
          .json({ success: false, message: "officeData field is missing." });
      }

      const officeData = JSON.parse(req.body.officeData);
      const logoFile = req.files?.logo?.[0];
      const imageFile = req.files?.image?.[0];

      if (logoFile) {
        officeData.logo = ("/" + logoFile.path).replace(/\\/g, "/");
      }

      if (imageFile) {
        officeData.photo = ("/" + imageFile.path).replace(/\\/g, "/");
      }

      // Add submission metadata
      officeData.submittedBy = "Test User"; // Temporary for testing
      officeData.submittedAt = new Date();

      const pendingOffice = new PendingOffice(officeData);
      const savedPendingOffice = await pendingOffice.save();

      res.status(201).json({
        success: true,
        data: savedPendingOffice,
        message: "Office submitted for approval successfully",
      });
    } catch (err) {
      let errorMessage = "Failed to submit office for approval";
      if (err instanceof SyntaxError) {
        errorMessage = "Invalid JSON in officeData field.";
      }
      res
        .status(400)
        .json({ success: false, message: errorMessage, error: err.message });
    }
  }
);

// @route   PUT /api/approval/:id/approve
// @desc    Approve a pending office submission
// @access  Private (Manager/SuperAdmin)
router.put("/:id/approve", async (req, res) => {
  try {
    const pendingOffice = await PendingOffice.findById(req.params.id);

    if (!pendingOffice) {
      return res.status(404).json({
        success: false,
        message: "Pending office not found",
      });
    }

    if (pendingOffice.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Office has already been processed",
      });
    }

    // Check if slug already exists in main offices collection
    const existingOffice = await Office.findOne({ slug: pendingOffice.slug });
    if (existingOffice) {
      return res.status(400).json({
        success: false,
        message: "Office with this slug already exists in main collection",
      });
    }

    // Create new office in main collection
    const officeData = pendingOffice.toObject();
    delete officeData._id;
    delete officeData.status;
    delete officeData.submittedBy;
    delete officeData.submittedAt;
    delete officeData.reviewedBy;
    delete officeData.reviewedAt;
    delete officeData.rejectionReason;
    delete officeData.__v;
    delete officeData.createdAt;
    delete officeData.updatedAt;

    // Convert about.services from array to string for main office schema
    if (officeData.about && Array.isArray(officeData.about.services)) {
      officeData.about.services = officeData.about.services.join(', ');
    }

    const newOffice = new Office(officeData);
    const savedOffice = await newOffice.save();

    // Update pending office status
    pendingOffice.status = "APPROVED";
    pendingOffice.reviewedBy = "Admin";
    pendingOffice.reviewedAt = new Date();
    await pendingOffice.save();

    res.json({
      success: true,
      data: savedOffice,
      message: "Office approved and published successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/approval/:id/reject
// @desc    Reject a pending office submission
// @access  Private (Manager/SuperAdmin)
router.put("/:id/reject", async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const pendingOffice = await PendingOffice.findById(req.params.id);

        if (!pendingOffice) {
            return res.status(404).json({
                success: false,
                message: "Pending office not found",
            });
        }

        if (pendingOffice.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Office has already been processed",
            });
        }

        // Update pending office status to REJECTED
        pendingOffice.status = "REJECTED";
        pendingOffice.reviewedBy = "Admin";
        pendingOffice.reviewedAt = new Date();
        pendingOffice.rejectionReason = rejectionReason || "No reason provided";
        await pendingOffice.save();

        res.json({
            success: true,
            message: "Office rejected successfully",
            data: pendingOffice,
        });
    } catch (err) {
        console.error("REJECT ERROR 👉", err);
        res.status(500).json({
            success: false,
            message: "Failed to reject office",
            error: err.message,
        });
    }
});

// @route   PUT /api/approval/:id/update
// @desc    Update a pending office submission
// @access  Private (Manager/SuperAdmin)
router.put("/:id/update", upload.any(), async (req, res) => {
    try {
        const office = await PendingOffice.findById(req.params.id);

        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Pending office not found",
            });
        }

        // Handle both direct data and FormData format
        let updateData = req.body;
        
        // If officeData is sent as JSON string (from FormData), parse it
        if (req.body.officeData && typeof req.body.officeData === 'string') {
            try {
                updateData = JSON.parse(req.body.officeData);
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                return res.status(400).json({
                    success: false,
                    message: "Invalid officeData format",
                });
            }
        }

        // Handle file uploads if present
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const filePath = ("/" + file.path).replace(/\\/g, "/");
                if (file.fieldname === 'logo') {
                    updateData.logo = filePath;
                } else if (file.fieldname === 'image') {
                    updateData.photo = filePath;
                }
            });
        }

        // Merge update data with existing data to handle partial updates
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && updateData[key] !== null) {
                if (typeof updateData[key] === 'object' && !Array.isArray(updateData[key]) && office[key]) {
                    // For nested objects that exist in the original, merge properties deeply
                    office[key] = { ...office[key].toObject(), ...updateData[key] };
                } else {
                    // For direct properties or new nested objects, assign directly
                    office[key] = updateData[key];
                }
            }
        });

        await office.save();

        res.json({
            success: true,
            message: "Pending office updated successfully",
            data: office,
        });
    } catch (err) {
        console.error("UPDATE ERROR 👉", err);
        res.status(500).json({
            success: false,
            message: "Failed to update pending office",
            error: err.message,
        });
    }
});

// @route   GET /api/approval/stats
// @desc    Get approval statistics
// @access  Private (Manager/SuperAdmin)
router.get("/stats", async (req, res) => {
  try {
    const pending = await PendingOffice.countDocuments({ status: "PENDING" });
    const approved = await PendingOffice.countDocuments({ status: "APPROVED" });
    const rejected = await PendingOffice.countDocuments({ status: "REJECTED" });

    res.json({
      success: true,
      data: {
        pending,
        approved,
        rejected,
        total: pending + approved + rejected,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/approval/:id
// @desc    Get single pending office by ID
// @access  Private (Manager/SuperAdmin)
router.get("/:id", async (req, res) => {
  try {
    const pendingOffice = await PendingOffice.findById(req.params.id);

    if (!pendingOffice) {
      return res.status(404).json({
        success: false,
        message: "Pending office not found",
      });
    }

    res.json({ success: true, data: pendingOffice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;