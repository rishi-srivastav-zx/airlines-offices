import { Schema, model } from "mongoose";

/* ---------- SUB SCHEMAS ---------- */

const EconomySeatSchema = new Schema(
  {
    seatName: { type: String },
    description: { type: String, required: true },
    legroom: { type: String, required: true },
  },
  { _id: false }
);

const ClubAdvantageSchema = new Schema(
  {
    feature: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const UpgradeStepSchema = new Schema(
  {
    stepNumber: Number,
    instruction: String,
  },
  { _id: false }
);

/* ---------- MAIN BLOG SCHEMA ---------- */

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    author: {
      name: String,
      role: String,
      avatar: String,
      bio: String,
      website: String,
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
    },

    featuredImage: { type: String, required: true },

    category: { type: String, index: true },

    tags: { type: [String], index: true },

    introduction: { type: String, required: true },

    content: { type: String },

    cabinClasses: {
      economy: {
        seatTypes: [EconomySeatSchema],
      },
      club: {
        advantages: [ClubAdvantageSchema],
      },
    },

    upgradeOptions: [
      {
        method: String,
        steps: [UpgradeStepSchema],
        notes: [String],
      },
    ],

    pricing: {
      range: {
        min: Number,
        max: Number,
        currency: { type: String, default: "USD" },
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

    publishDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/* ---------- INDEXES ---------- */
BlogPostSchema.index({
  title: "text",
  introduction: "text",
  tags: "text",
});

export default model("BlogPost", BlogPostSchema);
