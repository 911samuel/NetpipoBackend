"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const employees_1 = __importDefault(require("../models/employees"));
require("dotenv").config();
const authenticate = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Missing Authorization Header" });
        }
        const secret = process.env.LOGIN_SECRET || "I0H1A9G2sam";
        if (!secret) {
            return res
                .status(500)
                .json({ error: "Server misconfiguration: Missing login token secret" });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, secret);
        if (typeof decodedToken === "string") {
            return res.status(401).json({ error: "Invalid token format" });
        }
        const foundEmployee = await employees_1.default.findById(decodedToken._id);
        if (!foundEmployee) {
            return res.status(401).json({ error: "employee not found" });
        }
        req.employee = foundEmployee;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid Token" });
    }
};
exports.default = authenticate;
