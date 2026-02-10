import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		continent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Continent",
			required: true,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);


CountrySchema.index({ name: 1, continent: 1 }, { unique: true });

export default mongoose.models.Country ||
	mongoose.model("Country", CountrySchema);
