import {
  getContinents,
  getCountriesByContinent,
  getCitiesByCountry,
  getAllGeoData,
  bulkCreateContinents,
  bulkCreateCountries,
  bulkCreateCities,
} from "../controllers/geo.controller.js";
import express from "express";


const router = express.Router();

router.get("/continents", getContinents);
router.post("/continents/bulk", bulkCreateContinents);

router.get("/countries/:continentId", getCountriesByContinent);
router.post("/countries/bulk", bulkCreateCountries);

router.get("/cities/:countryId", getCitiesByCountry);
router.post("/cities/bulk", bulkCreateCities);

router.get("/all", getAllGeoData);


export default router;
