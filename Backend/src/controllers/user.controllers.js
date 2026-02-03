import User from "../model/user.js";
import bcrypt from "bcrypt";
import { generatePassword } from "../../uitls/generatePassword.js";
import  transporter  from "../config/mailer.js"


export const createUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: "All fields required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: "User already exists" });
        }

        // 1️⃣ Generate password
        const plainPassword = generatePassword();

        // 2️⃣ Hash password
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // 3️⃣ Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            isActive: true,
            avatar: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : null,
        });
        // Professional email template
        const emailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Invitation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 40px 0; text-align: center;">
                        <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-collapse: collapse;">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Our Platform</h1>
                                </td>
                            </tr>
                            
                            <!-- Body -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px; font-weight: 600;">Hello ${name},</h2>
                                    
                                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                        You have been invited to join our system. We're excited to have you on board! Your account has been created with the role of <strong style="color: #667eea;">${role}</strong>.
                                    </p>
                                    
                                    <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                        Please use the following credentials to log in to your account:
                                    </p>
                                    
                                    <!-- Credentials Box -->
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                                        <tr>
                                            <td style="padding: 25px;">
                                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                    <tr>
                                                        <td style="padding: 8px 0;">
                                                            <span style="color: #888888; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 0 0 20px 0;">
                                                            <span style="color: #333333; font-size: 16px; font-weight: 500;">${email}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0;">
                                                            <span style="color: #888888; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Temporary Password</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 0;">
                                                            <span style="color: #333333; font-size: 16px; font-weight: 500; background-color: #ffffff; padding: 8px 12px; border-radius: 4px; display: inline-block; border: 1px solid #e0e0e0;">${plainPassword}</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- CTA Button -->
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                                        <tr>
                                            <td style="text-align: center;">
                                                <a href="${
                                                    process.env.FRONTEND_URL ||
                                                    "http://localhost:3000"
                                                }/login" 
                                                   style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                                                    Login to Your Account
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Security Notice -->
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff8e1; border-left: 4px solid #ffc107; border-radius: 4px; margin-bottom: 20px;">
                                        <tr>
                                            <td style="padding: 15px 20px;">
                                                <p style="margin: 0; color: #f57c00; font-size: 14px; line-height: 1.5;">
                                                    <strong>🔒 Security Notice:</strong> For your security, please change this temporary password immediately after your first login.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                        If you have any questions or need assistance, please don't hesitate to contact our support team.
                                    </p>
                                    
                                    <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                        Best regards,<br>
                                        <strong style="color: #333333;">The Admin Team</strong>
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                                    <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                        This is an automated message. Please do not reply to this email.
                                    </p>
                                    <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                        © ${new Date().getFullYear()} Your Company Name. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        try {
            await transporter.sendMail({
                from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
                to: email,
                subject: "🎉 Welcome! Your Account Has Been Created",
                html: emailTemplate,
            });
        } catch (mailError) {
            // 🔥 rollback user if email fails
            await User.findByIdAndDelete(user._id);
            console.error("Email send failed:", mailError);
            return res.status(500).json({
                message: "User creation failed. Email could not be sent.",
            });
        }

        return res.status(201).json({
            message: "User created and invitation email sent",
        });
    } catch (err) {
        console.error("Create user error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        console.log("Users from database:", users.map(u => ({name: u.name, avatar: u.avatar})));
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        console.log("Update request body:", req.body);
        console.log("Update request file:", req.file);
        
        const { name, password, role } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (role) updateData.role = role;
        if (req.file) {
            updateData.avatar = `/${req.file.path.replace(/\\/g, "/")}`;
            console.log("Avatar updated to:", updateData.avatar);
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        console.log("Final updateData:", updateData);

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true },
        ).select("-password");

        res.status(200).json({
            success: true,
            user: updatedUser,
        });
    } catch (err) {
        console.error("Update user error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isActive = false; // soft delete
        await user.save();
        res.json({ message: "User deactivated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
