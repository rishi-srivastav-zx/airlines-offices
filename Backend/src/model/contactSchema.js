import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email",
            ],
        },
        phone: {
            type: String,
            trim: true,
        },
        subject: {
            type: String,
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            minlength: [10, "Message must be at least 10 characters"],
            maxlength: [2000, "Message cannot exceed 2000 characters"],
        },
        airlineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Airline",
            index: true,
        },
        officeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Office",
        },
        inquiryType: {
            type: String,
            enum: [
                "general",
                "booking",
                "cancellation",
                "refund",
                "complaint",
                "feedback",
                "support",
            ],
            default: "general",
            index: true,
        },
        status: {
            type: String,
            enum: ["new", "in_progress", "resolved", "closed"],
            default: "new",
            index: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        response: {
            type: String,
            trim: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        resolvedAt: {
            type: Date,
        },
        ipAddress: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for filtering and search
contactSchema.index({ status: 1, inquiryType: 1, createdAt: -1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
