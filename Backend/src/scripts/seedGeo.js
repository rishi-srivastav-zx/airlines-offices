import mongoose from "mongoose";
import dotenv from "dotenv";
import Continent from "../model/continents.js";
import Country from "../model/country.js";
import City from "../model/citiesschema.js";
import {
  CONTINENTS,
  COUNTRIES_BY_CONTINENT,
  CITIES_BY_COUNTRY,
} from "../utils/geoData.js";

dotenv.config();

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

const seedGeoData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Continent.deleteMany({});
    await Country.deleteMany({});
    await City.deleteMany({});
    console.log("Cleared existing geographic data.");

    const continentMap = {};
    const countryMap = {};

    // 1. Seed Continents
    for (const continentName of CONTINENTS) {
      const continent = await Continent.create({ 
        name: continentName,
        slug: slugify(continentName)
      });
      continentMap[continentName] = continent._id;
    }
    console.log(`Seeded ${CONTINENTS.length} continents.`);

    // 2. Seed Countries
    for (const [continentName, countries] of Object.entries(COUNTRIES_BY_CONTINENT)) {
      const continentId = continentMap[continentName];
      if (!continentId) continue;

      for (const countryName of countries) {
        const country = await Country.create({
          name: countryName,
          continent: continentId,
          slug: slugify(countryName)
        });
        countryMap[countryName] = { 
          id: country._id, 
          continentId: continentId 
        };
      }
    }
    console.log("Seeded countries.");

    // 3. Seed Cities
    let cityCount = 0;
    for (const [countryName, cities] of Object.entries(CITIES_BY_COUNTRY)) {
      const countryData = countryMap[countryName];
      if (!countryData) continue;

      for (const cityName of cities) {
        await City.create({
          name: cityName,
          country: countryData.id,
          continent: countryData.continentId,
          slug: slugify(cityName)
        });
        cityCount++;
      }
    }
    console.log(`Seeded ${cityCount} cities.`);

    console.log("Geographic data seeding completed successfully! 🌱");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding geographic data:", error);
    process.exit(1);
  }
};

seedGeoData();
