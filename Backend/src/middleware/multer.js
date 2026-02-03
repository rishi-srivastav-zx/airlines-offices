import multer from "multer";
import path from "path";
import fs from "fs";

// ===============================
// FIELDNAME => FOLDER MAPPING
// ===============================
const FIELD_MAP = {
    logo: "logos",
    image: "images",
    avatar: "users",
};

// ===============================
// AUTO YEAR/MONTH PATH CREATOR
// ===============================
function getUploadPath(category) {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const uploadDir = path.join("uploads", year, month, category);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    return uploadDir;
}

// ===============================
// MULTER STORAGE
// ===============================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const category = FIELD_MAP[file.fieldname];

        if (!category) {
            return cb(new Error("Invalid field name: " + file.fieldname));
        }

        const uploadPath = getUploadPath(category);
        console.log("Upload path from storage:", uploadPath);
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});

// ===============================
// FILE FILTER
// ===============================
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image and pdf files allowed"), false);
    }
};

// ===============================
// MULTER CONFIG
// ===============================
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default upload;
