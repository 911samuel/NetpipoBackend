"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAll = exports.delete1 = exports.update = exports.all = exports.single = exports.signIn = exports.signUp = void 0;
const users_1 = require("../utils/users");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_2 = __importDefault(require("../models/users"));
require("dotenv").config({ path: ".env" });
const signUp = async (req, res, next) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;
        const existingUsername = await users_2.default.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username is already taken" });
        }
        const existingEmail = await users_2.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        const validatedUser = await (0, users_1.validateUser)(req.body);
        if ("validationErrors" in validatedUser) {
            return res.status(400).json(validatedUser.validationErrors);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new users_2.default({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            role: email === "abayizeraeaz@gmail.com" ? "admin" : "user",
        });
        const savedUser = await newUser.save();
        const token = jsonwebtoken_1.default.sign({ _id: savedUser._id }, process.env.LOGIN_SECRET || "I0H1A9G2sam", { expiresIn: "1d" });
        if (!token) {
            throw new Error("Failed to generate token");
        }
        const userWithoutPassword = Object.assign(Object.assign({}, savedUser.toObject()), { password: undefined });
        return res.status(200).json({
            message: "Registration successful",
            token,
            userWithoutPassword,
        });
    }
    catch (error) {
        console.error("Error in Register:", error);
        next(error);
    }
};
exports.signUp = signUp;
const all = async (req, res, next) => {
    try {
        const users = await users_2.default.find();
        const userWithoutPassword = Object.assign(Object.assign({}, users), { password: undefined });
        return res.json({ userWithoutPassword });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            error: "An error occurred while fetching users",
            details: error,
        });
    }
};
exports.all = all;
const single = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await users_2.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userWithoutPassword = Object.assign(Object.assign({}, user), { password: undefined });
        return res.json({ userWithoutPassword });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        next(error);
    }
};
exports.single = single;
const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await users_2.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.LOGIN_SECRET || "I0H1A9G2sam", { expiresIn: "1d" });
        if (!token) {
            throw new Error("Failed to generate token");
        }
        const userWithoutPassword = Object.assign(Object.assign({}, user.toObject()), { password: undefined });
        return res.status(200).json({
            message: "Login successful",
            token, userWithoutPassword
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signIn = signIn;
const update = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const validatedUpdatedUser = await (0, users_1.validateupdatedUser)(req.body);
        if ("validationErrors" in validatedUpdatedUser) {
            return res.status(400).json(validatedUpdatedUser);
        }
        const { firstname, lastname, username, email, password } = req.body;
        const updateFields = {};
        if (firstname)
            updateFields.firstname = firstname;
        if (lastname)
            updateFields.lastname = lastname;
        if (username)
            updateFields.username = username;
        if (email)
            updateFields.email = email;
        if (password) {
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            updateFields.password = hashedPassword;
        }
        const updatedUser = await users_2.default.findByIdAndUpdate(userId, updateFields, {
            new: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const userWithoutPassword = Object.assign(Object.assign({}, updatedUser.toObject()), { password: undefined });
        return res
            .status(200)
            .json({ message: "User updated successfully", user: userWithoutPassword });
    }
    catch (error) {
        console.error("Error updating user:", error);
        next(error);
    }
};
exports.update = update;
const delete1 = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const deletedUser = await users_2.default.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.delete1 = delete1;
const deleteAll = async (req, res, next) => {
    try {
        await users_2.default.deleteMany({});
        return res
            .status(200)
            .json({ message: "All users deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAll = deleteAll;
