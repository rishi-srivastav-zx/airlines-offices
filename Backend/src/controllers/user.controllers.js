import User from "../model/user.js";

// SUPERADMIN only
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields required" });
        }

        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
