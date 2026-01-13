import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

/* ✅ CORS (ONLY ONCE) */
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

/* ✅ Body parser */
app.use(express.json());

/* ✅ Cookie parser */
app.use(cookieParser());

/* ✅ Test route */
app.get("/api", (req, res) => {
    res.send("API is running 🚀");
});

/* ✅ Routes */
app.use("/api/auth", authRoutes);

/* ✅ Error middleware (LAST) */
app.use(errorMiddleware);

export default app;
