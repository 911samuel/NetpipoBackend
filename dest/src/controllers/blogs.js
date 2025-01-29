"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAll = exports.delete1 = exports.update = exports.create = exports.single = exports.all = void 0;
const blogs_1 = __importDefault(require("../models/blogs"));
const blogs_2 = require("../utils/blogs");
const upload_1 = require("../middlewares/upload");
const all = async (req, res, next) => {
    try {
        const blogs = await blogs_1.default.find();
        res.json({ blogs });
    }
    catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ error: "An error occurred while fetching blogs" });
    }
};
exports.all = all;
const single = async (req, res, next) => {
    const id = req.params.id;
    try {
        const blog = await blogs_1.default.findById(id);
        if (!blog) {
            return res.status(500).json({ message: "Blog not found" });
        }
        res.json({ blog });
    }
    catch (error) {
        console.error("Error fetching blog:", error);
        res
            .status(500)
            .json({ error: "An error occurred while fetching the blog" });
    }
};
exports.single = single;
const create = async (req, res, next) => {
    try {
        const validatedBlog = await (0, blogs_2.validateBlog)(req.body, res);
        if ("validationErrors" in validatedBlog) {
            return res.status(400).json(validatedBlog.validationErrors);
        }
        const { title, author, category, description } = req.body;
        let imgUrl = "";
        if (req.file && req.file.path) {
            const cloudinaryUrl = await (0, upload_1.uploadToCloudinary)(req.file);
            if (cloudinaryUrl instanceof Error) {
                throw new Error("Failed to upload image to Cloudinary");
            }
            imgUrl = cloudinaryUrl;
        }
        const blog = new blogs_1.default({
            title,
            author,
            category,
            description,
            imgUrl,
        });
        const savedBlog = await blog.save();
        res
            .status(201)
            .json({ message: "The blog was added successfully", blog: savedBlog });
    }
    catch (error) {
        console.error("Error saving blog:", error);
        res.status(500).json({ error: "An error occurred while saving the blog" });
    }
};
exports.create = create;
const update = async (req, res, next) => {
    const blogId = req.params.id;
    try {
        const validatedUpdatedBlog = await (0, blogs_2.validateUpdatedBlog)(req.body, res);
        if ("validationErrors" in validatedUpdatedBlog) {
            return res.status(400).json(validatedUpdatedBlog.validationErrors);
        }
        const updatedFields = {
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            description: req.body.description,
        };
        if (req.file) {
            const cloudinaryUrl = await (0, upload_1.uploadToCloudinary)(req.file);
            if (cloudinaryUrl instanceof Error) {
                throw new Error("Failed to upload image to Cloudinary");
            }
            updatedFields.imgUrl = cloudinaryUrl;
        }
        const updatedBlog = await blogs_1.default.findByIdAndUpdate(blogId, { $set: updatedFields }, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found." });
        }
        res
            .status(200)
            .json({ message: "Blog updated successfully.", data: updatedBlog });
    }
    catch (error) {
        console.error("Error updating blog:", error);
        res
            .status(500)
            .json({ error: "An error occurred while updating the blog" });
    }
};
exports.update = update;
const delete1 = async (req, res, next) => {
    const blogId = req.params.id;
    try {
        const deletedBlog = await blogs_1.default.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found." });
        }
        res.status(200).json({ message: "The blog was deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting blog:", error);
        res
            .status(500)
            .json({ error: "An error occurred while deleting the blog" });
    }
};
exports.delete1 = delete1;
const deleteAll = async (req, res, next) => {
    try {
        await blogs_1.default.deleteMany({});
        res.status(200).json({ message: "All blogs were deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting all blogs:", error);
        res
            .status(500)
            .json({ error: "An error occurred while deleting all blogs" });
    }
};
exports.deleteAll = deleteAll;
