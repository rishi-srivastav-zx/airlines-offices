import mongoose from "mongoose";

const airlineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Airline name is required"],
            unique: true,
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        logo: {
            type: String,
            required: [true, "Logo URL is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ["Premium", "Major", "Regional", "Low Cost"],
            default: "Major",
        },
        fleet: [
            {
                type: String,
                trim: true,
            },
        ],
        about: {
            location: {
                type: String,
                trim: true,
            },
            overview: {
                type: String,
                trim: true,
            },
            network: {
                type: String,
                trim: true,
            },
            fleet: {
                type: String,
                trim: true,
            },
            alliance: {
                type: String,
                trim: true,
            },
            support: {
                type: String,
                trim: true,
            },
        },
        services: [
            {
                type: String,
                trim: true,
            },
        ],
        contactInfo: {
            phone: String,
            email: String,
            website: String,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create slug from name before saving
airlineSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }
    next();
});

// Virtual for offices
airlineSchema.virtual("offices", {
    ref: "Office",
    localField: "_id",
    foreignField: "airlineId",
});

// Index for better search performance
airlineSchema.index({ name: "text", category: 1 });

const Airline = mongoose.model("Airline", airlineSchema);

export default Airline;
