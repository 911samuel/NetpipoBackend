import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import employee from "../models/employees";

require("dotenv").config();

interface AuthenticatedRequest extends Request {
  employee?: any;
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Missing Authorization Header" });
    }
    const secret = process.env.LOGIN_SECRET || "I0H1A9G2sam";

    if (!secret) {
      return res
        .status(500)
        .json({ error: "Server misconfiguration: Missing login token secret" });
    }
    const decodedToken = jwt.verify(token, secret);

    if (typeof decodedToken === "string") {
      return res.status(401).json({ error: "Invalid token format" });
    }
    const employee = await employee.findById(decodedToken._id);

    if (!employee) {
      return res.status(401).json({ error: "employee not found" });
    }
    (req as AuthenticatedRequest).employee = employee;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

export default authenticate;
