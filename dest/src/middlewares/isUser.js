"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const employees_1 = __importDefault(require("../models/employees"));
require("dotenv").config();
const isemployee = async (req, res, next) => {
  var _a;
  const token =
    (_a = req.headers.authorization) === null || _a === void 0
      ? void 0
      : _a.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jsonwebtoken_1.default.verify(
      token,
      process.env.LOGIN_SECRET || "I0H1A9G2sam"
    );
    const employee = await employees_1.default.findById(decoded._id);
    if (!employee) {
      return res.status(401).json({ message: "employee not found" });
    }
    if (employee.role !== "employee") {
      return res
        .status(403)
        .json({ message: "Unauthorized: employee is not a regular employee" });
    }
    req.employee = employee;
    next();
  } catch (error) {
    console.error("Error in isemployee middleware:", error);
    return res.status(401).json({ message: "Invalid token", error: error });
  }
};
exports.default = isemployee;
