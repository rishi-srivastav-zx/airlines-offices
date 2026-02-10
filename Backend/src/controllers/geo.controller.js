import Continent from "../model/continents.js";
import Country from "../model/country.js";
import City from "../model/citiesschema.js";

/**
 * @desc    Bulk create continents
 * @route   POST /api/geo/continents/bulk
 */
export const bulkCreateContinents = async (req, res) => {
  try {
    const { continents } = req.body;
    if (!Array.isArray(continents)) {
      return res.status(400).json({ success: false, message: "Invalid input: expected an array of continents" });
    }

    const createdContinents = await Continent.insertMany(continents);
    res.status(201).json({ success: true, data: createdContinents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Bulk create countries
 * @route   POST /api/geo/countries/bulk
 */
export const bulkCreateCountries = async (req, res) => {
  try {
    const { countries } = req.body;
    if (!Array.isArray(countries)) {
      return res.status(400).json({ success: false, message: "Invalid input: expected an array of countries" });
    }

    const createdCountries = await Country.insertMany(countries);
    res.status(201).json({ success: true, data: createdCountries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Bulk create cities
 * @route   POST /api/geo/cities/bulk
 */
export const bulkCreateCities = async (req, res) => {
  try {
    const { cities } = req.body;
    if (!Array.isArray(cities)) {
      return res.status(400).json({ success: false, message: "Invalid input: expected an array of cities" });
    }

    const createdCities = await City.insertMany(cities);
    res.status(201).json({ success: true, data: createdCities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get all continents
 * @route   GET /api/geo/continents
 */
export const getContinents = async (req, res) => {
  try {
    const continents = await Continent.find()
      .select("_id name")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: continents,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * @desc    Get countries by continent
 * @route   GET /api/geo/countries/:continentId
 */
export const getCountriesByContinent = async (req, res) => {
  try {
    const { continentId } = req.params;

    const countries = await Country.find({ continent: continentId })
      .select("_id name continent")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: countries,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * @desc    Get cities by country
 * @route   GET /api/geo/cities/:countryId
 */
export const getCitiesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;

    const cities = await City.find({ country: countryId })
      .select("_id name country")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: cities,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * @desc    Get all geo data (admin / debug use)
 * @route   GET /api/geo/all
 */
export const getAllGeoData = async (req, res) => {
  try {
    const continents = await Continent.find().sort({ name: 1 });
    const countries = await Country.find().populate("continent", "name");
    const cities = await City.find().populate("country", "name");

    res.json({
      success: true,
      data: {
        continents,
        countries,
        cities,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
