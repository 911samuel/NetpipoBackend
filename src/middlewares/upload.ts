import multer, { StorageEngine } from "multer";
import { Request, Express } from "express";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "uploads");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname);
    cb(null, randomString + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req: Request, file: Express.Multer.File, callback) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 }, 
}).single("imgUrl");

const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<string | Error> => {
  try {
    const result = await cloudinary.uploader.upload(file.path);
    return result.secure_url;
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};

export { upload, uploadToCloudinary };
