import express from "express";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware.js"
// import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

// app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

export default app;
