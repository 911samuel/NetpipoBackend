"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateupdatedemployee = exports.validateemployee = void 0;
const zod_1 = require("zod");
const bcryptjs_1 = require("bcryptjs");
const employeeZodSchema = zod_1.z.object({
  firstname: zod_1.z.string().min(1, { message: "First name is required" }),
  lastname: zod_1.z.string().min(1, { message: "Last name is required" }),
  employeename: zod_1.z
    .string()
    .min(1, { message: "employeename is required" }),
  email: zod_1.z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: zod_1.z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password cannot exceed 20 characters" }),
  role: zod_1.z.string().min(3).default("employee"),
});
const updateemployeeSchema = zod_1.z.object({
  firstname: zod_1.z
    .string()
    .min(1, { message: "First name is required" })
    .optional(),
  lastname: zod_1.z
    .string()
    .min(1, { message: "Last name is required" })
    .optional(),
  employeename: zod_1.z
    .string()
    .min(1, { message: "employeename is required" })
    .optional(),
  email: zod_1.z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .optional(),
  password: zod_1.z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password cannot exceed 20 characters" })
    .optional(),
  role: zod_1.z.string().min(3).optional(),
});
const validateemployee = async (employeeData) => {
  try {
    const validatedData = employeeZodSchema.parse(employeeData);
    if (validatedData.password) {
      const hashedPassword = await (0, bcryptjs_1.hash)(
        validatedData.password,
        10
      );
      validatedData.password = hashedPassword;
    }
    return validatedData;
  } catch (error) {
    if (error instanceof zod_1.ZodError) {
      const validationError = error.errors[0];
      const errorMessage = validationError.message;
      const errorMessages = {
        errorMessage,
      };
      return { validationErrors: errorMessages };
    } else {
      return { validationErrors: { unexpected: "Unexpected error occurred" } };
    }
  }
};
exports.validateemployee = validateemployee;
const validateupdatedemployee = async (employeeData) => {
  try {
    const validatedData = updateemployeeSchema.parse(employeeData);
    if (validatedData.password) {
      const hashedPassword = await (0, bcryptjs_1.hash)(
        validatedData.password,
        10
      );
      validatedData.password = hashedPassword;
    }
    return validatedData;
  } catch (error) {
    if (error instanceof zod_1.ZodError) {
      const validationError = error.errors[0];
      const fieldName = validationError.path[0];
      const errorMessage = validationError.message;
      const errorMessages = {
        [fieldName]: errorMessage,
      };
      return { validationErrors: errorMessages };
    } else {
      return { validationErrors: { unexpected: "Unexpected error occurred" } };
    }
  }
};
exports.validateupdatedemployee = validateupdatedemployee;
