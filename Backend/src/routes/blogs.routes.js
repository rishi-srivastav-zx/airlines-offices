import { Router } from "express";
import BlogPost from "../model/blogpostschema.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";


const upload = multer({ dest: "uploads/" });

const router = Router();

/* ======================
   PUBLIC ROUTES
====================== */

// GET ALL POSTS
router.get("/posts", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { category, tags, search, sort = "-publishDate" } = req.query;

        const query = { status: "published" };

        if (category) query.category = category;
        if (tags) query.tags = { $in: tags.split(",") };
        if (search) query.$text = { $search: search };

        const posts = await BlogPost.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .select("title slug featuredImage publishDate category tags views");

        const total = await BlogPost.countDocuments(query);

        res.json({
            success: true,
            data: posts,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET SINGLE POST
router.get("/posts/:slug", async (req, res) => {
    try {
        const post = await BlogPost.findOneAndUpdate(
            { slug: req.params.slug, status: "published" },
            { $inc: { views: 1 } },
            { new: true },
        );

        if (!post)
            return res
                .status(404)
                .json({ success: false, message: "Post not found" });

        const relatedPosts = await BlogPost.find({
            _id: { $ne: post._id },
            status: "published",
            $or: [{ category: post.category }, { tags: { $in: post.tags } }],
        })
            .limit(3)
            .select("title slug featuredImage publishDate");

        res.json({ success: true, data: { post, relatedPosts } });
    } catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// LIKE POST
router.post("/posts/:slug/like", async (req, res) => {
    try {
        const post = await BlogPost.findOneAndUpdate(
            { slug: req.params.slug },
            { $inc: { likes: 1 } },
            { new: true },
        );

        if (!post)
            return res
                .status(404)
                .json({ success: false, message: "Post not found" });

        res.json({ success: true, likes: post.likes });
    } catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/* ======================
   ADMIN ROUTES
====================== */

// GET ALL POSTS FOR TESTING
router.get("/all-posts", async (req, res) => {
    try {
        const posts = await BlogPost.find({})
            .sort("-createdAt")
            .select("title slug status author createdAt");

        res.json({
            success: true,
            data: posts,
            count: posts.length
        });
    } catch (err) {
        console.error("All posts error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET PENDING POSTS FOR APPROVAL
router.get("/pending-posts", async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const query = { status: "pending" };
        
        if (search) query.$text = { $search: search };

        const posts = await BlogPost.find(query)
            .sort("-createdAt")
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("author", "name");

        const total = await BlogPost.countDocuments(query);

        res.json({
            success: true,
            data: posts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Pending posts error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET ALL POSTS BY STATUS (ADMIN - NO AUTH FOR TESTING)
router.get("/posts/admin", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { category, tags, search, sort = "-createdAt", status } = req.query;

        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (tags) query.tags = { $in: tags.split(",") };
        if (search) query.$text = { $search: search };

        const posts = await BlogPost.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("author", "name");

        const total = await BlogPost.countDocuments(query);

        res.json({
            success: true,
            data: posts,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("Admin posts error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// CREATE POST (NO AUTH FOR TESTING)
router.post("/posts", async (req, res) => {
    try {
        const data = req.body;
        
        // Force new posts to pending status for approval
        data.status = "pending";

        if (!data.slug) {
            data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        const exists = await BlogPost.findOne({ slug: data.slug });
        if (exists)
            return res
                .status(400)
                .json({ success: false, message: "Slug already exists" });

        const post = await BlogPost.create(data);
        res.status(201).json({ success: true, data: post });
    } catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// UPDATE POST (NO AUTH FOR TESTING)
router.put("/posts/:slug",  async (req, res) => {
    try {
        const post = await BlogPost.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true, runValidators: true },
        );

        if (!post)
            return res
                .status(404)
                .json({ success: false, message: "Post not found" });

        res.json({ success: true, data: post });
    } catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// CHANGE STATUS (NO AUTH FOR TESTING)
router.patch(
    "/posts/:slug/status",
    async (req, res) => {
        const { status } = req.body;
        if (!["pending", "draft", "published", "archived"].includes(status))
            return res
                .status(400)
                .json({ success: false, message: "Invalid status" });

        const post = await BlogPost.findOneAndUpdate(
            { slug: req.params.slug },
            { status },
            { new: true },
        );

        res.json({ success: true, data: post });
    },
);

// SOFT DELETE
router.delete("/posts/:slug", protect, async (req, res) => {
    const post = await BlogPost.findOneAndUpdate(
        { slug: req.params.slug },
        { status: "archived" },
        { new: true },
    );

    res.json({ success: true, message: "Post archived" });
});

export default router;
