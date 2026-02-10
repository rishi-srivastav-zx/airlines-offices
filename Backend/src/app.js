import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import approvalRoutes from "./routes/approval.routes.js";
import officeRoutes from "./routes/officeroutes.js";
import uploadRoutes from "./routes/uploads.routes.js";
import blogRoutes from "./routes/blogs.routes.js";
import { getRelatedBlogs } from "./controllers/getrelatedblog.js";

import airlineRoutes from "./routes/airlineroutes.js";
import geoRoutes from "./routes/georoutes.js";

const app = express();

/* ✅ CORS (ONLY ONCE) */
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use("/uploads", express.static("uploads"));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

/* ✅ Cookie parser */
app.use(cookieParser());

/* ✅ Test route */
app.get("/api", (req, res) => {
    res.send("API is running 🚀");
});

/* ✅ Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/approval", approvalRoutes);
app.use("/api/offices", officeRoutes);
app.use("/api/airlines", airlineRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/getrelatedblog", getRelatedBlogs);
app.use("/api/geo", geoRoutes);

export default app;
