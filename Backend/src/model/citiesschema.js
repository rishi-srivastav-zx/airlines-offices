import mongoose from "mongoose";

const CitySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		country: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Country",
			required: true,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index to ensure unique city per country
CitySchema.index({ name: 1, country: 1 }, { unique: true });

export default mongoose.models.City || mongoose.model("City", CitySchema);
