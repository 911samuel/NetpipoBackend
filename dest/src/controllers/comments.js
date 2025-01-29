"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAll = exports.delete1 = exports.update = exports.add = void 0;
const express_validator_1 = require("express-validator");
const comments_1 = __importDefault(require("../models/comments"));
const add = async (req, res, next) => {
    const blogId = req.params.id;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { content } = req.body;
        const { employeename } = req.employee;
        if (!employeename) {
            return res.status(404).json({ message: "employeename not found" });
        }
        const newComment = new comments_1.default({
            content,
            employeename,
            blog_id: blogId,
        });
        await newComment.save();
        return res
            .status(201)
            .json({ message: "Comment added successfully", comment: newComment });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.add = add;
const update = async (req, res, next) => {
    const commentId = req.params.id;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { content } = req.body;
        const updatedComment = await comments_1.default.findByIdAndUpdate(commentId, { content }, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res
            .status(200)
            .json({
            message: "Comment updated successfully",
            comment: updatedComment,
        });
    }
    catch (error) {
        console.error("Error updating comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.update = update;
const delete1 = async (req, res, next) => {
    const commentId = req.params.id;
    try {
        const deletedComment = await comments_1.default.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.delete1 = delete1;
const deleteAll = async (req, res, next) => {
    try {
        await comments_1.default.deleteMany({});
        res.status(200).json({ message: "All comments were deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting all comments:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteAll = deleteAll;
