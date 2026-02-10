import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dropProblematicIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    const db = mongoose.connection.db;

    // 1. Drop index on countries collection
    try {
      await db.collection("countries").dropIndex("slug_1");
      console.log("Successfully dropped 'slug_1' index from 'countries' collection.");
    } catch (err) {
      if (err.codeName === "IndexNotFound") {
        console.log("Index 'slug_1' not found on 'countries' collection, skipping.");
      } else {
        console.error("Error dropping index on countries:", err.message);
      }
    }

    // 2. Drop index on cities collection
    try {
      await db.collection("cities").dropIndex("slug_1_country_1");
      console.log("Successfully dropped 'slug_1_country_1' index from 'cities' collection.");
    } catch (err) {
      if (err.codeName === "IndexNotFound") {
        console.log("Index 'slug_1_country_1' not found on 'cities' collection, skipping.");
      } else {
        console.error("Error dropping index on cities:", err.message);
      }
    }

    console.log("Index cleanup completed! ✨");
    process.exit(0);
  } catch (error) {
    console.error("Connection failed:", error.message);
    process.exit(1);
  }
};

dropProblematicIndexes();
