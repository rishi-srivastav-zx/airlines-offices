import mongoose from "mongoose";

const OfficeSchema = new mongoose.Schema(
	{

		airline: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Airline",
			required: true,
			index: true,
		},
		continent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Continent",
			required: true,
		},
		country: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Country",
			required: true,
		},
		city: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "City",
			required: true,
		},

		slug: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
		},

		photo: {
			type: String,
		},

		website: {
			type: String,
		},

		officeOverview: {
			continent: {
				type: String,
				required: true,
			},

			country: {
				type: String,
				required: true,
			},

			city: {
				type: String,
				required: true,
			},

			address: {
				type: String,
				required: true,
			},

			phone: {
				type: String,
			},

			hours: {
				start: { type: String },
				end: { type: String },
			},
		},

		aboutOffice: {
			description: {
				type: String, 
			},

			services: {
				type: String, 
			},

			additionalInfo: {
				type: String, 
			},
		},

		airportLocation: {
			airportName: {
				type: String,
				required: true,
			},
			terminalInfo: String,
			iataCode: String,
			counterContact: String,
			airportAddress: String,
		},

		airportMapLocation: {
			latitude: Number,
			longitude: Number,
			mapQuery: String,
			googleMapsUrl: String,
			embedUrl: String,
		},

		seo: {
			metaTitle: {
				type: String,
				required: true,
				maxlength: 60,
			},

			metaDescription: {
				type: String,
				required: true,
				maxlength: 160,
			},

			keywords: {
				type: [String],
				lowercase: true,
				default: [],
			},

			canonicalUrl: String,
			ogTitle: String,
			ogDescription: String,
			ogImage: String,
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
	},
	{ timestamps: true },
);

export default mongoose.models.Office || mongoose.model("Office", OfficeSchema);