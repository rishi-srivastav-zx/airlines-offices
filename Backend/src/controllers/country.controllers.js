import Country from "../model/country.js";
import Continent from "../model/continents.js";


export const getCountries = async (req, res) => {
	try {
		const { continent, search } = req.query;
		let query = { "metadata.isActive": true };

		if (continent) {
			query.continent = continent;
		}

		if (search) {
			query.name = { $regex: search, $options: "i" };
		}

		const countries = await Country.find(query)
			.populate("continent", "name code")
			.sort({ name: 1 });

		res.status(200).json({
			success: true,
			count: countries.length,
			data: countries,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


export const getCountriesByContinent = async (req, res) => {
	try {
		const countries = await Country.find({
			continent: req.params.continentId,
			"metadata.isActive": true,
		})
			.populate("continent", "name code")
			.sort({ name: 1 });

		res.status(200).json({
			success: true,
			count: countries.length,
			data: countries,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


export const getCountry = async (req, res) => {
	try {
		const country = await Country.findById(req.params.id).populate(
			"continent",
			"name code",
		);
		if (!country) {
			return res.status(404).json({
				success: false,
				message: "Country not found",
			});
		}
		res.status(200).json({
			success: true,
			data: country,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


export const createCountry = async (req, res) => {
	try {
		
		const continent = await Continent.findById(req.body.continent);
		if (!continent) {
			return res.status(404).json({
				success: false,
				message: "Continent not found",
			});
		}

		const country = await Country.create(req.body);
		await country.populate("continent");

		res.status(201).json({
			success: true,
			data: country,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};


export const updateCountry = async (req, res) => {
	try {
		const country = await Country.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			},
		).populate("continent");

		if (!country) {
			return res.status(404).json({
				success: false,
				message: "Country not found",
			});
		}
		res.status(200).json({
			success: true,
			data: country,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};


export const deleteCountry = async (req, res) => {
	try {
		const country = await Country.findById(req.params.id);
		if (!country) {
			return res.status(404).json({
				success: false,
				message: "Country not found",
			});
		}

		// Check if cities exist for this country
		const City = (await import("../models/City.js")).default;
		const cityCount = await City.countDocuments({ country: req.params.id });

		if (cityCount > 0) {
			return res.status(400).json({
				success: false,
				message: `Cannot delete country. ${cityCount} cities are associated with it.`,
			});
		}

		await country.deleteOne();
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
