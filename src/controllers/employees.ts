import { Request, Response, NextFunction } from "express";
import { validateemployee, validateupdatedemployee } from "../utils/employees";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import employee, { Iemployee } from "../models/employees";

require("dotenv").config({ path: ".env" });

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstname, lastname, employeename, email, password } = req.body;

    const existingemployeename = await employee.findOne({ employeename });
    if (existingemployeename) {
      return res.status(400).json({ message: "employeename is already taken" });
    }

    const existingEmail = await employee.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const validatedemployee = await validateemployee(req.body);
    if ("validationErrors" in validatedemployee) {
      return res.status(400).json(validatedemployee.validationErrors);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newemployee: Iemployee = new employee({
      firstname,
      lastname,
      employeename,
      email,
      password: hashedPassword,
      role: email === "abayizeraeaz@gmail.com" ? "admin" : "employee",
    });

    const savedemployee = await newemployee.save();

    const token = jwt.sign(
      { _id: savedemployee._id },
      process.env.LOGIN_SECRET || "I0H1A9G2sam",
      { expiresIn: "1d" }
    );

    if (!token) {
      throw new Error("Failed to generate token");
    }

    const employeeWithoutPassword = {
      ...savedemployee.toObject(),
      password: undefined,
    };

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

const all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = await employee.find();
    const employeeWithoutPassword = { ...employees, password: undefined };
    return res.json({ employeeWithoutPassword });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      error: "An error occurred while fetching employees",
      details: error,
    });
  }
};

const single = async (req: Request, res: Response, next: NextFunction) => {
  const employeeId = req.params.id;
  try {
    const employee = await employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "employee not found" });
    }

    const employeeWithoutPassword = { ...employee, password: undefined };

    return res.json({ employeeWithoutPassword });
  } catch (error) {
    console.error("Error fetching employee:", error);
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const employee = await employee.findOne({ email });

    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, employee.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { _id: employee._id },
      process.env.LOGIN_SECRET || "I0H1A9G2sam",
      { expiresIn: "1d" }
    );

    if (!token) {
      throw new Error("Failed to generate token");
    }

    const employeeWithoutPassword = {
      ...employee.toObject(),
      password: undefined,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      employeeWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const employeeId = req.params.id;

  try {
    const validatedUpdatedemployee = await validateupdatedemployee(req.body);

    if ("validationErrors" in validatedUpdatedemployee) {
      return res.status(400).json(validatedUpdatedemployee);
    }

    const { firstname, lastname, employeename, email, password } = req.body;

    const updateFields: Partial<Iemployee> = {};

    if (firstname) updateFields.firstname = firstname;
    if (lastname) updateFields.lastname = lastname;
    if (employeename) updateFields.employeename = employeename;
    if (email) updateFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedemployee = await employee.findByIdAndUpdate(
      employeeId,
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedemployee) {
      return res.status(404).json({ message: "employee not found" });
    }

    const employeeWithoutPassword = {
      ...updatedemployee.toObject(),
      password: undefined,
    };

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

const delete1 = async (req: Request, res: Response, next: NextFunction) => {
  const employeeId = req.params.id;
  try {
    const deletedemployee = await employee.findByIdAndDelete(employeeId);

    if (!deletedemployee) {
      return res.status(404).json({ message: "employee not found" });
    }

    return res.status(200).json({ message: "employee deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await employee.deleteMany({});
    return res
      .status(200)
      .json({ message: "All employees deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn, single, all, update, delete1, deleteAll };
