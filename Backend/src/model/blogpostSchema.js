import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            unique: true,
            trim: true,
            minlength: [10, "Title must be at least 10 characters"],
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        excerpt: {
            type: String,
            required: [true, "Excerpt is required"],
            trim: true,
            maxlength: [500, "Excerpt cannot exceed 500 characters"],
        },
        content: {
            type: String,
            trim: true,
        },
        author: {
            type: String,
            required: [true, "Author is required"],
            trim: true,
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        image: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            enum: [
                "Travel Tips",
                "Luxury Travel",
                "Guidelines",
                "News",
                "Reviews",
                "Destinations",
                "General",
            ],
            index: true,
        },
        tags: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],
        readTime: {
            type: String,
            trim: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "published",
        },
        featured: {
            type: Boolean,
            default: false,
        },
        metaDescription: {
            type: String,
            trim: true,
            maxlength: [160, "Meta description cannot exceed 160 characters"],
        },
        metaKeywords: [String],
    },
    {
        timestamps: true,
    }
);

// Create slug from title before saving
blogPostSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }
    next();
});

// Index for search
blogPostSchema.index({
    title: "text",
    excerpt: "text",
    content: "text",
    tags: "text",
});

// Index for filtering
blogPostSchema.index({ category: 1, status: 1, publishedAt: -1 });

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;
