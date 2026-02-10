import mongoose from "mongoose";

const ContinentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			enum: [
				"Asia",
				"Europe",
				"Africa",
				"North America",
				"South America",
				"Australia",
				"Antarctica",
			],
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.models.Continent ||
	mongoose.model("Continent", ContinentSchema);
