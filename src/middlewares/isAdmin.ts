import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import employee from "../models/employees";

require("dotenv").config();

interface RequestWithemployee extends Request {
  employee?: any;
}

const isAdmin = async (
  req: RequestWithemployee,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.LOGIN_SECRET || "I0H1A9G2sam"
    );
    const foundEmployee = await employee.findById(decoded._id);
    if (!foundEmployee) {
      return res.status(401).json({ message: "employee not found" });
    }
    if (foundEmployee.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: employee is not an admin" });
    }
    req.employee = foundEmployee;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error: error });
  }
};

export default isAdmin;
