"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const path_1 = __importDefault(require("path"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const randomString = Math.random().toString(36).substring(2, 15);
        const ext = path_1.default.extname(file.originalname);
        cb(null, randomString + ext);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg") {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 2 },
}).single("imgUrl");
exports.upload = upload;
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(file.path);
        return result.secure_url;
    }
    catch (error) {
        throw new Error("Cloudinary upload failed");
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
