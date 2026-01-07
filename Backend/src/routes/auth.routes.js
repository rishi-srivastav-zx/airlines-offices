import express from "express";
import Airline from "../model/airlinesSchema.js";

const router = express.Router();

// ==================== AIRLINE ROUTES ====================

// Create new airline
router.post("/airlines", async (req, res) => {
    try {
        const { name, logo, category, fleet, about, services } = req.body;

        // Validation
        if (!name || !logo || !category) {
            return res.status(400).json({
                success: false,
                message: "Name, logo, and category are required",
            });
        }

        // Check if airline already exists
        const existingAirline = await Airline.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
        });

        if (existingAirline) {
            return res.status(409).json({
                success: false,
                message: "Airline with this name already exists",
            });
        }

        // Create new airline
        const airline = new Airline({
            name,
            logo,
            category,
            fleet: fleet || [],
            about: about || {},
            services: services || [],
        });

        await airline.save();

        res.status(201).json({
            success: true,
            message: "Airline created successfully",
            data: airline,
        });
    } catch (error) {
        console.error("Error creating airline:", error);
        res.status(500).json({
            success: false,
            message: "Error creating airline",
            error: error.message,
        });
    }
});

// Get all airlines
router.get("/airlines", async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;

        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const airlines = await Airline.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ name: 1 });

        const total = await Airline.countDocuments(query);

        res.status(200).json({
            success: true,
            data: airlines,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error("Error fetching airlines:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching airlines",
            error: error.message,
        });
    }
});

// Get single airline by ID
router.get("/airlines/:id", async (req, res) => {
    try {
        const airline = await Airline.findById(req.params.id).populate(
            "offices"
        );

        if (!airline) {
            return res.status(404).json({
                success: false,
                message: "Airline not found",
            });
        }

        res.status(200).json({
            success: true,
            data: airline,
        });
    } catch (error) {
        console.error("Error fetching airline:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching airline",
            error: error.message,
        });
    }
});

// Update airline
router.put("/airlines/:id", async (req, res) => {
    try {
        const { name, logo, category, fleet, about, services } = req.body;

        const airline = await Airline.findById(req.params.id);

        if (!airline) {
            return res.status(404).json({
                success: false,
                message: "Airline not found",
            });
        }

        // Check if new name already exists (excluding current airline)
        if (name && name !== airline.name) {
            const existingAirline = await Airline.findOne({
                name: { $regex: new RegExp(`^${name}$`, "i") },
                _id: { $ne: req.params.id },
            });

            if (existingAirline) {
                return res.status(409).json({
                    success: false,
                    message: "Airline with this name already exists",
                });
            }
        }

        // Update fields
        if (name) airline.name = name;
        if (logo) airline.logo = logo;
        if (category) airline.category = category;
        if (fleet) airline.fleet = fleet;
        if (about) airline.about = about;
        if (services) airline.services = services;

        await airline.save();

        res.status(200).json({
            success: true,
            message: "Airline updated successfully",
            data: airline,
        });
    } catch (error) {
        console.error("Error updating airline:", error);
        res.status(500).json({
            success: false,
            message: "Error updating airline",
            error: error.message,
        });
    }
});

// Delete airline
router.delete("/airlines/:id", async (req, res) => {
    try {
        const airline = await Airline.findByIdAndDelete(req.params.id);

        if (!airline) {
            return res.status(404).json({
                success: false,
                message: "Airline not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Airline deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting airline:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting airline",
            error: error.message,
        });
    }
});

// ==================== OFFICE ROUTES ====================

// Create new office
router.post("/offices", async (req, res) => {
    try {
        const {
            airlineId,
            airlineName,
            city,
            country,
            address,
            phone,
            email,
            hours,
            image,
            featured,
            description,
        } = req.body;

        // Validation
        if (!airlineId || !city || !country || !address || !phone || !email) {
            return res.status(400).json({
                success: false,
                message:
                    "Airline, city, country, address, phone, and email are required",
            });
        }

        // Verify airline exists
        const airline = await Airline.findById(airlineId);
        if (!airline) {
            return res.status(404).json({
                success: false,
                message: "Airline not found",
            });
        }

        // Check if office already exists at this location
        const existingOffice = await Office.findOne({
            airlineId,
            city: { $regex: new RegExp(`^${city}$`, "i") },
            country: { $regex: new RegExp(`^${country}$`, "i") },
        });

        if (existingOffice) {
            return res.status(409).json({
                success: false,
                message:
                    "Office already exists at this location for this airline",
            });
        }

        // Create new office
        const office = new Office({
            airlineId,
            airlineName: airlineName || airline.name,
            city,
            country,
            address,
            phone,
            email,
            hours,
            image,
            featured: featured || false,
            description,
        });

        await office.save();

        res.status(201).json({
            success: true,
            message: "Office created successfully",
            data: office,
        });
    } catch (error) {
        console.error("Error creating office:", error);
        res.status(500).json({
            success: false,
            message: "Error creating office",
            error: error.message,
        });
    }
});

// Get all offices
router.get("/offices", async (req, res) => {
    try {
        const {
            airlineId,
            city,
            country,
            featured,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        let query = {};

        // Filter by airline
        if (airlineId) {
            query.airlineId = airlineId;
        }

        // Filter by city
        if (city) {
            query.city = { $regex: city, $options: "i" };
        }

        // Filter by country
        if (country) {
            query.country = { $regex: country, $options: "i" };
        }

        // Filter by featured
        if (featured !== undefined) {
            query.featured = featured === "true";
        }

        // Search
        if (search) {
            query.$or = [
                { city: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
                { airlineName: { $regex: search, $options: "i" } },
            ];
        }

        const offices = await Office.find(query)
            .populate("airlineId", "name logo category")
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ city: 1 });

        const total = await Office.countDocuments(query);

        res.status(200).json({
            success: true,
            data: offices,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error("Error fetching offices:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching offices",
            error: error.message,
        });
    }
});

// Get single office by ID
router.get("/offices/:id", async (req, res) => {
    try {
        const office = await Office.findById(req.params.id).populate(
            "airlineId",
            "name logo category fleet"
        );

        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Office not found",
            });
        }

        res.status(200).json({
            success: true,
            data: office,
        });
    } catch (error) {
        console.error("Error fetching office:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching office",
            error: error.message,
        });
    }
});

// Update office
router.put("/offices/:id", async (req, res) => {
    try {
        const updateData = req.body;

        const office = await Office.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Office not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Office updated successfully",
            data: office,
        });
    } catch (error) {
        console.error("Error updating office:", error);
        res.status(500).json({
            success: false,
            message: "Error updating office",
            error: error.message,
        });
    }
});

// Delete office
router.delete("/offices/:id", async (req, res) => {
    try {
        const office = await Office.findByIdAndDelete(req.params.id);

        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Office not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Office deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting office:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting office",
            error: error.message,
        });
    }
});

// ==================== BLOG POST ROUTES ====================

// Create new blog post
router.post("/blog", async (req, res) => {
    try {
        const {
            title,
            excerpt,
            author,
            image,
            category,
            readTime,
            content,
            tags,
        } = req.body;

        // Validation
        if (!title || !excerpt || !author || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, excerpt, author, and category are required",
            });
        }

        // Check if blog post with same title exists
        const existingPost = await BlogPost.findOne({
            title: { $regex: new RegExp(`^${title}$`, "i") },
        });

        if (existingPost) {
            return res.status(409).json({
                success: false,
                message: "Blog post with this title already exists",
            });
        }

        // Create new blog post
        const blogPost = new BlogPost({
            title,
            excerpt,
            author,
            image,
            category,
            readTime,
            content,
            tags: tags || [],
            publishedAt: new Date(),
        });

        await blogPost.save();

        res.status(201).json({
            success: true,
            message: "Blog post created successfully",
            data: blogPost,
        });
    } catch (error) {
        console.error("Error creating blog post:", error);
        res.status(500).json({
            success: false,
            message: "Error creating blog post",
            error: error.message,
        });
    }
});

// Get all blog posts
router.get("/blog", async (req, res) => {
    try {
        const {
            category,
            author,
            search,
            tags,
            page = 1,
            limit = 10,
            sortBy = "publishedAt",
            order = "desc",
        } = req.query;

        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by author
        if (author) {
            query.author = { $regex: author, $options: "i" };
        }

        // Filter by tags
        if (tags) {
            query.tags = { $in: tags.split(",") };
        }

        // Search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { excerpt: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ];
        }

        const sortOrder = order === "asc" ? 1 : -1;

        const posts = await BlogPost.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ [sortBy]: sortOrder });

        const total = await BlogPost.countDocuments(query);

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching blog posts",
            error: error.message,
        });
    }
});

// Get single blog post by ID
router.get("/blog/:id", async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found",
            });
        }

        // Increment view count
        post.views = (post.views || 0) + 1;
        await post.save();

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        console.error("Error fetching blog post:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching blog post",
            error: error.message,
        });
    }
});

// Update blog post
router.put("/blog/:id", async (req, res) => {
    try {
        const updateData = { ...req.body, updatedAt: new Date() };

        const post = await BlogPost.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog post updated successfully",
            data: post,
        });
    } catch (error) {
        console.error("Error updating blog post:", error);
        res.status(500).json({
            success: false,
            message: "Error updating blog post",
            error: error.message,
        });
    }
});

// Delete blog post
router.delete("/blog/:id", async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog post deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting blog post",
            error: error.message,
        });
    }
});

// ==================== BOOKING ROUTES ====================

// Create new booking
router.post("/bookings", async (req, res) => {
    try {
        const {
            userId,
            airlineId,
            flightNumber,
            origin,
            destination,
            departureDate,
            returnDate,
            passengers,
            cabinClass,
            totalAmount,
            contactInfo,
        } = req.body;

        // Validation
        if (
            !userId ||
            !airlineId ||
            !origin ||
            !destination ||
            !departureDate ||
            !passengers ||
            !cabinClass ||
            !contactInfo
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required booking information",
            });
        }

        // Verify airline exists
        const airline = await Airline.findById(airlineId);
        if (!airline) {
            return res.status(404).json({
                success: false,
                message: "Airline not found",
            });
        }

        // Create booking
        const booking = new Booking({
            userId,
            airlineId,
            flightNumber,
            origin,
            destination,
            departureDate: new Date(departureDate),
            returnDate: returnDate ? new Date(returnDate) : null,
            passengers,
            cabinClass,
            totalAmount,
            contactInfo,
            bookingReference: generateBookingReference(),
            status: "pending",
            createdAt: new Date(),
        });

        await booking.save();

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({
            success: false,
            message: "Error creating booking",
            error: error.message,
        });
    }
});

// Get all bookings (with filters)
router.get("/bookings", async (req, res) => {
    try {
        const { userId, airlineId, status, page = 1, limit = 10 } = req.query;

        let query = {};

        if (userId) query.userId = userId;
        if (airlineId) query.airlineId = airlineId;
        if (status) query.status = status;

        const bookings = await Booking.find(query)
            .populate("userId", "name email")
            .populate("airlineId", "name logo")
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            error: error.message,
        });
    }
});

// Get single booking
router.get("/bookings/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("userId", "name email phone")
            .populate("airlineId", "name logo category");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching booking",
            error: error.message,
        });
    }
});

// Update booking status
router.put("/bookings/:id", async (req, res) => {
    try {
        const { status, paymentStatus, notes } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;
        if (notes) booking.notes = notes;
        booking.updatedAt = new Date();

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({
            success: false,
            message: "Error updating booking",
            error: error.message,
        });
    }
});

// Cancel booking
router.delete("/bookings/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        booking.status = "cancelled";
        booking.cancelledAt = new Date();
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({
            success: false,
            message: "Error cancelling booking",
            error: error.message,
        });
    }
});

// ==================== CONTACT/INQUIRY ROUTES ====================

// Create contact inquiry
router.post("/contact", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            subject,
            message,
            airlineId,
            officeId,
            inquiryType,
        } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and message are required",
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Create contact inquiry
        const contact = new Contact({
            name,
            email,
            phone,
            subject,
            message,
            airlineId,
            officeId,
            inquiryType: inquiryType || "general",
            status: "new",
            createdAt: new Date(),
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: "Your inquiry has been submitted successfully",
            data: contact,
        });
    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({
            success: false,
            message: "Error submitting inquiry",
            error: error.message,
        });
    }
});

// Get all contact inquiries
router.get("/contact", async (req, res) => {
    try {
        const {
            status,
            inquiryType,
            airlineId,
            page = 1,
            limit = 20,
        } = req.query;

        let query = {};

        if (status) query.status = status;
        if (inquiryType) query.inquiryType = inquiryType;
        if (airlineId) query.airlineId = airlineId;

        const contacts = await Contact.find(query)
            .populate("airlineId", "name logo")
            .populate("officeId", "city country")
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching inquiries",
            error: error.message,
        });
    }
});

// Update contact inquiry status
router.put("/contact/:id", async (req, res) => {
    try {
        const { status, response, assignedTo } = req.body;

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found",
            });
        }

        if (status) contact.status = status;
        if (response) contact.response = response;
        if (assignedTo) contact.assignedTo = assignedTo;
        contact.updatedAt = new Date();

        await contact.save();

        res.status(200).json({
            success: true,
            message: "Inquiry updated successfully",
            data: contact,
        });
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({
            success: false,
            message: "Error updating inquiry",
            error: error.message,
        });
    }
});

// ==================== UTILITY FUNCTIONS ====================

function generateBookingReference() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let reference = "";
    for (let i = 0; i < 6; i++) {
        reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
}

// ==================== STATISTICS ROUTES ====================

// Get dashboard statistics
router.get("/stats/dashboard", async (req, res) => {
    try {
        const [
            totalAirlines,
            totalOffices,
            totalBookings,
            pendingBookings,
            totalBlogPosts,
            newInquiries,
        ] = await Promise.all([
            Airline.countDocuments(),
            Office.countDocuments(),
            Booking.countDocuments(),
            Booking.countDocuments({ status: "pending" }),
            BlogPost.countDocuments(),
            Contact.countDocuments({ status: "new" }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalAirlines,
                totalOffices,
                totalBookings,
                pendingBookings,
                totalBlogPosts,
                newInquiries,
            },
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching statistics",
            error: error.message,
        });
    }
});

export default router;
