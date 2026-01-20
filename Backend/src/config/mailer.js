import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // TLS for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    
});

transporter.verify((error) => {
    if (error) {
        console.error("SMTP ERROR:", error);
    } else {
        console.log("SMTP ready 🚀");
    }
});

export default transporter;