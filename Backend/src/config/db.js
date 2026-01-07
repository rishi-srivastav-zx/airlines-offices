import mongoose from "mongoose";

export default async function database() {
    try {
        const conn = await mongoose.connect(
            "mongodb://127.0.0.1:27017/mydatabase"
        );

        console.log("MongoDB connected successfully");
        return conn.connection;
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
}
