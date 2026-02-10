import Continent from "../model/continents.js";


export const getContinents = async (req, res) => {
	try {
		const continents = await Continent.find({
			"metadata.isActive": true,
		}).sort({ "metadata.displayOrder": 1, name: 1 });

		res.status(200).json({
			success: true,
			count: continents.length,
			data: continents,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


export const getContinent = async (req, res) => {
	try {
		const continent = await Continent.findById(req.params.id);
		if (!continent) {
			return res.status(404).json({
				success: false,
				message: "Continent not found",
			});
		}
		res.status(200).json({
			success: true,
			data: continent,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


export const createContinent = async (req, res) => {
	try {
		const continent = await Continent.create(req.body);
		res.status(201).json({
			success: true,
			data: continent,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};


export const updateContinent = async (req, res) => {
	try {
		const continent = await Continent.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true },
		);
		if (!continent) {
			return res.status(404).json({
				success: false,
				message: "Continent not found",
			});
		}
		res.status(200).json({
			success: true,
			data: continent,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};


export const deleteContinent = async (req, res) => {
	try {
		const continent = await Continent.findById(req.params.id);
		if (!continent) {
			return res.status(404).json({
				success: false,
				message: "Continent not found",
			});
		}

		
		const Country = (await import("../models/Country.js")).default;
		const countryCount = await Country.countDocuments({
			continent: req.params.id,
		});

		if (countryCount > 0) {
			return res.status(400).json({
				success: false,
				message: `Cannot delete continent. ${countryCount} countries are associated with it.`,
			});
		}

		await continent.deleteOne();
		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

router.post("/bulk", async (req, res) => {
	try {
		const result = await Continent.insertMany(req.body);
		res.json({ success: true, count: result.length });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});
