"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAll =
  exports.delete1 =
  exports.update =
  exports.all =
  exports.single =
  exports.signIn =
  exports.signUp =
    void 0;
const employees_1 = require("../utils/employees");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const employees_2 = __importDefault(require("../models/employees"));
require("dotenv").config({ path: ".env" });
const signUp = async (req, res, next) => {
  try {
    const { firstname, lastname, employeename, email, password } = req.body;
    const existingemployeename = await employees_2.default.findOne({
      employeename,
    });
    if (existingemployeename) {
      return res.status(400).json({ message: "employeename is already taken" });
    }
    const existingEmail = await employees_2.default.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    const validatedemployee = await (0, employees_1.validateemployee)(req.body);
    if ("validationErrors" in validatedemployee) {
      return res.status(400).json(validatedemployee.validationErrors);
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newemployee = new employees_2.default({
      firstname,
      lastname,
      employeename,
      email,
      password: hashedPassword,
      role: email === "abayizeraeaz@gmail.com" ? "admin" : "employee",
    });
    const savedemployee = await newemployee.save();
    const token = jsonwebtoken_1.default.sign(
      { _id: savedemployee._id },
      process.env.LOGIN_SECRET || "I0H1A9G2sam",
      { expiresIn: "1d" }
    );
    if (!token) {
      throw new Error("Failed to generate token");
    }
    const employeeWithoutPassword = Object.assign(
      Object.assign({}, savedemployee.toObject()),
      { password: undefined }
    );
    return res.status(200).json({
      message: "Registration successful",
      token,
      employeeWithoutPassword,
    });
  } catch (error) {
    console.error("Error in Register:", error);
    next(error);
  }
};
exports.signUp = signUp;
const all = async (req, res, next) => {
  try {
    const employees = await employees_2.default.find();
    const employeeWithoutPassword = Object.assign(
      Object.assign({}, employees),
      { password: undefined }
    );
    return res.json({ employeeWithoutPassword });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      error: "An error occurred while fetching employees",
      details: error,
    });
  }
};
exports.all = all;
const single = async (req, res, next) => {
  const employeeId = req.params.id;
  try {
    const employee = await employees_2.default.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "employee not found" });
    }
    const employeeWithoutPassword = Object.assign(Object.assign({}, employee), {
      password: undefined,
    });
    return res.json({ employeeWithoutPassword });
  } catch (error) {
    console.error("Error fetching employee:", error);
    next(error);
  }
};
exports.single = single;
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const employee = await employees_2.default.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValidPassword = await bcryptjs_1.default.compare(
      password,
      employee.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jsonwebtoken_1.default.sign(
      { _id: employee._id },
      process.env.LOGIN_SECRET || "I0H1A9G2sam",
      { expiresIn: "1d" }
    );
    if (!token) {
      throw new Error("Failed to generate token");
    }
    const employeeWithoutPassword = Object.assign(
      Object.assign({}, employee.toObject()),
      { password: undefined }
    );
    return res.status(200).json({
      message: "Login successful",
      token,
      employeeWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};
exports.signIn = signIn;
const update = async (req, res, next) => {
  const employeeId = req.params.id;
  try {
    const validatedUpdatedemployee = await (0,
    employees_1.validateupdatedemployee)(req.body);
    if ("validationErrors" in validatedUpdatedemployee) {
      return res.status(400).json(validatedUpdatedemployee);
    }
    const { firstname, lastname, employeename, email, password } = req.body;
    const updateFields = {};
    if (firstname) updateFields.firstname = firstname;
    if (lastname) updateFields.lastname = lastname;
    if (employeename) updateFields.employeename = employeename;
    if (email) updateFields.email = email;
    if (password) {
      const hashedPassword = await bcryptjs_1.default.hash(password, 10);
      updateFields.password = hashedPassword;
    }
    const updatedemployee = await employees_2.default.findByIdAndUpdate(
      employeeId,
      updateFields,
      {
        new: true,
      }
    );
    if (!updatedemployee) {
      return res.status(404).json({ message: "employee not found" });
    }
    const employeeWithoutPassword = Object.assign(
      Object.assign({}, updatedemployee.toObject()),
      { password: undefined }
    );
    return res
      .status(200)
      .json({
        message: "employee updated successfully",
        employee: employeeWithoutPassword,
      });
  } catch (error) {
    console.error("Error updating employee:", error);
    next(error);
  }
};
exports.update = update;
const delete1 = async (req, res, next) => {
  const employeeId = req.params.id;
  try {
    const deletedemployee = await employees_2.default.findByIdAndDelete(
      employeeId
    );
    if (!deletedemployee) {
      return res.status(404).json({ message: "employee not found" });
    }
    return res.status(200).json({ message: "employee deleted successfully" });
  } catch (error) {
    next(error);
  }
};
exports.delete1 = delete1;
const deleteAll = async (req, res, next) => {
  try {
    await employees_2.default.deleteMany({});
    return res
      .status(200)
      .json({ message: "All employees deleted successfully" });
  } catch (error) {
    next(error);
  }
};
exports.deleteAll = deleteAll;
