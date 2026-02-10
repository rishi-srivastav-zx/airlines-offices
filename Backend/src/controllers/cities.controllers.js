import City from "../model/citiesschema.js";
import Country from "../model/country.js";


export const getCities = async (req, res) => {
	try {
		const { country, continent, search, popular } = req.query;
		let query = { "metadata.isActive": true };

		if (country) query.country = country;
		if (continent) query.continent = continent;
		if (popular) query["metadata.isPopular"] = true;
		if (search) query.name = { $regex: search, $options: "i" };

		const cities = await City.find(query)
			.populate("country", "name code")
			.populate("continent", "name code")
			.sort({ "metadata.isPopular": -1, name: 1 });

		res.status(200).json({
			success: true,
			count: cities.length,
			data: cities,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


export const getCitiesByCountry = async (req, res) => {
	try {
		const cities = await City.find({
			country: req.params.countryId,
			"metadata.isActive": true,
		})
			.populate("country", "name code")
			.populate("continent", "name code")
			.sort({ name: 1 });

		res.status(200).json({
			success: true,
			count: cities.length,
			data: cities,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


export const getCity = async (req, res) => {
	try {
		const city = await City.findById(req.params.id)
			.populate("country", "name code")
			.populate("continent", "name code");

		if (!city) {
			return res.status(404).json({
				success: false,
				message: "City not found",
			});
		}
		res.status(200).json({
			success: true,
			data: city,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


export const createCity = async (req, res) => {
	try {
		
		const country = await Country.findById(req.body.country).populate(
			"continent",
		);
		if (!country) {
			return res.status(404).json({
				success: false,
				message: "Country not found",
			});
		}

		
		req.body.continent = country.continent._id;

		const city = await City.create(req.body);
		await city.populate("country continent");

		res.status(201).json({
			success: true,
			data: city,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};


export const updateCity = async (req, res) => {
	try {
		const city = await City.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		})
			.populate("country", "name code")
			.populate("continent", "name code");

		if (!city) {
			return res.status(404).json({
				success: false,
				message: "City not found",
			});
		}
		res.status(200).json({
			success: true,
			data: city,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};


export const deleteCity = async (req, res) => {
	try {
		const city = await City.findById(req.params.id);
		if (!city) {
			return res.status(404).json({
				success: false,
				message: "City not found",
			});
		}

		await city.deleteOne();
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
