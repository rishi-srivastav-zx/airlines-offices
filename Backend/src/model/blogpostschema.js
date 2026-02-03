import { Schema, model } from "mongoose";

const BlogPostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        author: {
            name: { type: String, trim: true },
            role: String,
            avatar: String,
        },

        featuredImage: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            index: true,
        },

        tags: {
            type: [String],
            index: true,
        },

        introduction: {
            type: String,
            required: true,
        },

        cabinClasses: {
            economy: {
                seatTypes: [
                    {
                        type: String,
                        description: String,
                        legroom: String,
                    },
                ],
            },
            club: {
                advantages: [
                    {
                        feature: String,
                        description: String,
                    },
                ],
            },
        },

        upgradeOptions: [
            {
                method: String,
                steps: [
                    {
                        stepNumber: Number,
                        instruction: String,
                    },
                ],
                notes: [String],
            },
        ],

        pricing: {
            range: {
                min: Number,
                max: Number,
                currency: { type: String, default: "INR" },
            },
        },

        benefits: [String],

        faq: [
            {
                question: String,
                answer: String,
            },
        ],

        relatedAirlines: [
            {
                name: String,
                link: String,
            },
        ],

        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
        },

        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },

        status: {
            type: String,
            enum: ["pending", "draft", "published", "archived"],
            default: "pending",
            index: true,
        },

        publishDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

// 🔍 Text search index
BlogPostSchema.index({
    title: "text",
    introduction: "text",
    tags: "text",
});

export default model("BlogPost", BlogPostSchema);
