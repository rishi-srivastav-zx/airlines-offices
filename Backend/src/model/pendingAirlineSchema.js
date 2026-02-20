import mongoose from "mongoose";

const PendingAirlineSchema = new mongoose.Schema(
	{
		airlineName: {
			type: String,
			required: true,
			trim: true,
		},

		slug: {
			type: String,
			required: true,
			trim: true,
		},

		firstName: {
			type: String,
			required: true,
			trim: true,
		},

		logo: {
			type: String,
		},
		continents: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Continent",
			},
		],
		countries: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Country",
			},
		],
		cities: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "City",
			},
		],
		about: {
			description: {
				type: String, 
			},

			history: {
				type: String, 
			},

			services: {
				type: String, 
			},

			additionalInfo: {
				type: String, 
			},
		},
		seo: {
			metaTitle: {
				type: String,
				required: true,
				trim: true,
				maxlength: 60,
			},

			metaDescription: {
				type: String,
				required: true,
				trim: true,
				maxlength: 160,
			},

			keywords: {
				type: [String],
				lowercase: true,
				trim: true,
				default: [],
			},

			canonicalUrl: {
				type: String,
			},

			ogTitle: {
				type: String,
			},

			ogDescription: {
				type: String,
			},

			ogImage: {
				type: String,
			},
		},
		metadata: {
			verified: {
				type: Boolean,
				default: false,
			},

			rating: {
				value: {
					type: Number,
					min: 0,
					max: 5,
					default: 0,
				},
				reviewCount: {
					type: Number,
					default: 0,
				},
			},
		},
		// Approval specific fields
		status: {
			type: String,
			enum: ["PENDING", "APPROVED", "REJECTED"],
			default: "PENDING",
		},
		submittedBy: {
			type: String,
			required: true,
		},
		submittedAt: {
			type: Date,
			default: Date.now,
		},
		reviewedBy: {
			type: String,
		},
		reviewedAt: {
			type: Date,
		},
		rejectionReason: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.models.PendingAirline ||
	mongoose.model("PendingAirline", PendingAirlineSchema);