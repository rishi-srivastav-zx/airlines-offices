import mongoose from "mongoose";

export default async function database() {
    try {
        if (!mongoose) throw new Error("mongoose is not set");
        const conn = await mongoose.connect(
            "mongodb://127.0.0.1:3001/airlines-offices"
        );

        console.log(
            "Connection to Moongose Server Established!",
            conn.connection
        );

        return mongoose.connection;
    } catch (error) {
        console.log("Error in establishing database connection!");
    }
}
