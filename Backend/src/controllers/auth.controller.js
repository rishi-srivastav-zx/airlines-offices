import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Find user
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2️⃣ Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3️⃣ CREATE TOKEN ✅ (THIS WAS MISSING)
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 4️⃣ SET COOKIE + RESPONSE
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/",
        })
            .status(200)
            .json({
                token, // Include token in JSON response for frontend API route
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
