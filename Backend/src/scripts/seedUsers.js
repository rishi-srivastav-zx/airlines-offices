import mongoose from "mongoose";
import User from "../model/user.js";
import dotenv from "dotenv";

// 🔹 LOAD ENV VARIABLES
dotenv.config();

const seedUsers = async () => {
    try {
         await mongoose.connect(process.env.MONGODB_URI);

        // DEV ONLY – clear old users
        await User.deleteMany();

        await User.create([
            {
                name: "Super Admin",
                email: "superadmin@airlines.com",
                password: "Super@123",
                role: "superadmin",
            },
            {
                name: "Manager User",
                email: "manager@airlines.com",
                password: "Manager@123",
                role: "manager",
            },
            {
                name: "Editor User",
                email: "editor@airlines.com",
                password: "Editor@123",
                role: "editor",
            },
        ]);

        console.log("✅ Users created successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding users:", error.message);
        process.exit(1);
    }
};

seedUsers();
