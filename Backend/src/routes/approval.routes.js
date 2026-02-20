import express from "express";
import PendingOffice from "../model/pendingOfficeSchema.js";
import PendingAirline from "../model/pendingAirlineSchema.js";
import Office from "../model/officeSchema.js";
import Airline from "../model/airlineschema.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// @route   GET /api/approval/pending
// @desc    Get all pending submissions (offices and/or airlines)
// @access  Private (Manager/SuperAdmin)
router.get("/pending", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "PENDING",
      sortBy = "submittedAt",
      order = "desc",
      type = "all", // "all", "offices", "airlines"
    } = req.query;

    const query = { status };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    let data = [];
    let total = 0;

    if (type === "offices") {
      const pendingOffices = await PendingOffice.find(query).populate("airline")
        .sort({ [sortBy]: sortOrder })
        .limit(parseInt(limit))
        .skip(skip);
      
      data = pendingOffices.map(item => ({ ...item.toObject(), itemType: 'office' }));
      total = await PendingOffice.countDocuments(query);
    } else if (type === "airlines") {
      const pendingAirlines = await PendingAirline.find(query)
        .sort({ [sortBy]: sortOrder })
        .limit(parseInt(limit))
        .skip(skip);
      
      data = pendingAirlines.map(item => ({ ...item.toObject(), itemType: 'airline' }));
      total = await PendingAirline.countDocuments(query);
    } else {
      // Get both offices and airlines, then combine and sort
      const [pendingOffices, pendingAirlines] = await Promise.all([
        PendingOffice.find(query).sort({ [sortBy]: sortOrder }),
        PendingAirline.find(query).sort({ [sortBy]: sortOrder })
      ]);

      const combined = [
        ...pendingOffices.map(item => ({ ...item.toObject(), itemType: 'office' })),
        ...pendingAirlines.map(item => ({ ...item.toObject(), itemType: 'airline' }))
      ].sort((a, b) => {
        const dateA = new Date(a[sortBy]);
        const dateB = new Date(b[sortBy]);
        return sortOrder === 1 ? dateA - dateB : dateB - dateA;
      });

      total = combined.length;
      data = combined.slice(skip, skip + parseInt(limit));
    }

    res.json({
      success: true,
      data,
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
    { name: "photo", maxCount: 1 },
    { name: "ogImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let officeData;
      if (req.body.officeData) {
        officeData = JSON.parse(req.body.officeData);
      } else {
        officeData = { ...req.body };
      }

      const photoFile = req.files?.photo?.[0];
      const ogImageFile = req.files?.ogImage?.[0];

      if (photoFile) {
        officeData.photo = ("/" + photoFile.path).replace(/\\/g, "/");
      }

      if (ogImageFile) {
        if (!officeData.seo) officeData.seo = {};
        officeData.seo.ogImage = ("/" + ogImageFile.path).replace(/\\/g, "/");
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

// @route   POST /api/approval/submit-airline
// @desc    Submit new airline for approval
// @access  Private
router.post(
  "/submit-airline",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "ogImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let airlineData;
      if (req.body.airlineData) {
        airlineData = JSON.parse(req.body.airlineData);
      } else {
        airlineData = { ...req.body };
      }

      const logoFile = req.files?.logo?.[0];
      const ogImageFile = req.files?.ogImage?.[0];

      if (logoFile) {
        airlineData.logo = ("/" + logoFile.path).replace(/\\/g, "/");
      }

      if (ogImageFile) {
        if (!airlineData.seo) airlineData.seo = {};
        airlineData.seo.ogImage = ("/" + ogImageFile.path).replace(/\\/g, "/");
      }

      // Add submission metadata
      airlineData.submittedBy = "Test User"; // Temporary for testing
      airlineData.submittedAt = new Date();

      const pendingAirline = new PendingAirline(airlineData);
      const savedPendingAirline = await pendingAirline.save();

      res.status(201).json({
        success: true,
        data: savedPendingAirline,
        message: "Airline submitted for approval successfully",
      });
    } catch (err) {
      let errorMessage = "Failed to submit airline for approval";
      if (err instanceof SyntaxError) {
        errorMessage = "Invalid JSON in airlineData field.";
      }
      res
        .status(400)
        .json({ success: false, message: errorMessage, error: err.message });
    }
  }
);

// @route   PUT /api/approval/:id/approve
// @desc    Approve a pending submission (office or airline)
// @access  Private (Manager/SuperAdmin)
router.put("/:id/approve", async (req, res) => {
  try {
    // Try to find in pending offices first
    let pendingItem = await PendingOffice.findById(req.params.id);
    let itemType = "office";
    let MainModel = Office;
    
    // If not found in offices, try airlines
    if (!pendingItem) {
      pendingItem = await PendingAirline.findById(req.params.id);
      itemType = "airline";
      MainModel = itemType === "airline" ? Airline : Office;
    }

    if (!pendingItem) {
      return res.status(404).json({
        success: false,
        message: "Pending submission not found",
      });
    }

    if (pendingItem.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} has already been processed`,
      });
    }

    // Check if slug already exists in main collection
    const existingItem = await MainModel.findOne({ slug: pendingItem.slug });
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} with this slug already exists in main collection`,
      });
    }

    // Create new item in main collection
    const itemData = pendingItem.toObject();
    
    // Clean up approval fields
    const fieldsToRemove = [
      "_id", "status", "submittedBy", "submittedAt", 
      "reviewedBy", "reviewedAt", "rejectionReason", 
      "__v", "createdAt", "updatedAt"
    ];
    fieldsToRemove.forEach(field => delete itemData[field]);

    const newItem = new MainModel(itemData);
    const savedItem = await newItem.save();

    // Update pending item status
    pendingItem.status = "APPROVED";
    pendingItem.reviewedBy = "Admin";
    pendingItem.reviewedAt = new Date();
    await pendingItem.save();

    res.json({
      success: true,
      data: savedItem,
      message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} approved and published successfully`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/approval/:id/reject
// @desc    Reject a pending submission (office or airline)
// @access  Private (Manager/SuperAdmin)
router.put("/:id/reject", async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        
        // Try to find in pending offices first
        let pendingItem = await PendingOffice.findById(req.params.id);
        let itemType = "office";
        
        // If not found in offices, try airlines
        if (!pendingItem) {
            pendingItem = await PendingAirline.findById(req.params.id);
            itemType = "airline";
        }

        if (!pendingItem) {
            return res.status(404).json({
                success: false,
                message: "Pending submission not found",
            });
        }

        if (pendingItem.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} has already been processed`,
            });
        }

        // Update pending item status to REJECTED
        pendingItem.status = "REJECTED";
        pendingItem.reviewedBy = "Admin";
        pendingItem.reviewedAt = new Date();
        pendingItem.rejectionReason = rejectionReason || "No reason provided";
        await pendingItem.save();

        res.json({
            success: true,
            message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} rejected successfully`,
            data: pendingItem,
        });
    } catch (err) {
        console.error("REJECT ERROR 👉", err);
        res.status(500).json({
            success: false,
            message: "Failed to reject submission",
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
                if (file.fieldname === 'photo') {
                    updateData.photo = filePath;
                } else if (file.fieldname === 'ogImage') {
                    if (!updateData.seo) updateData.seo = {};
                    updateData.seo.ogImage = filePath;
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
    const [officePending, officeApproved, officeRejected] = await Promise.all([
      PendingOffice.countDocuments({ status: "PENDING" }),
      PendingOffice.countDocuments({ status: "APPROVED" }),
      PendingOffice.countDocuments({ status: "REJECTED" }),
    ]);

    const [airlinePending, airlineApproved, airlineRejected] = await Promise.all([
      PendingAirline.countDocuments({ status: "PENDING" }),
      PendingAirline.countDocuments({ status: "APPROVED" }),
      PendingAirline.countDocuments({ status: "REJECTED" }),
    ]);

    res.json({
      success: true,
      data: {
        offices: {
          pending: officePending,
          approved: officeApproved,
          rejected: officeRejected,
          total: officePending + officeApproved + officeRejected,
        },
        airlines: {
          pending: airlinePending,
          approved: airlineApproved,
          rejected: airlineRejected,
          total: airlinePending + airlineApproved + airlineRejected,
        },
        combined: {
          pending: officePending + airlinePending,
          approved: officeApproved + airlineApproved,
          rejected: officeRejected + airlineRejected,
          total: (officePending + officeApproved + officeRejected) + (airlinePending + airlineApproved + airlineRejected),
        }
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