import { z, ZodError } from "zod";
import { hash } from "bcryptjs";
import { Iemployee } from "../models/employees";

const employeeZodSchema = z.object({
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  employeename: z.string().min(1, { message: "employeename is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password cannot exceed 20 characters" }),
  role: z.string().min(3).default("employee"),
});

const updateemployeeSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "First name is required" })
    .optional(),
  lastname: z.string().min(1, { message: "Last name is required" }).optional(),
  employeename: z
    .string()
    .min(1, { message: "employeename is required" })
    .optional(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .optional(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password cannot exceed 20 characters" })
    .optional(),
  role: z.string().min(3).optional(),
});

interface Validatedemployee extends Omit<Iemployee, "password"> {}

const validateemployee = async (
  employeeData: any
): Promise<
  Validatedemployee | { validationErrors: Record<string, string> }
> => {
  try {
    const validatedData: any = employeeZodSchema.parse(employeeData);

    if (validatedData.password) {
      const hashedPassword = await hash(validatedData.password, 10);
      validatedData.password = hashedPassword;
    }

    return validatedData;
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = error.errors[0];
      const errorMessage = validationError.message;

      const errorMessages: Record<string, string> = {
        errorMessage,
      };
      return { validationErrors: errorMessages };
    } else {
      return { validationErrors: { unexpected: "Unexpected error occurred" } };
    }
  }
};

const validateupdatedemployee = async (
  employeeData: any
): Promise<
  Validatedemployee | { validationErrors: Record<string, string> }
> => {
  try {
    const validatedData: any = updateemployeeSchema.parse(employeeData);

    if (validatedData.password) {
      const hashedPassword = await hash(validatedData.password, 10);
      validatedData.password = hashedPassword;
    }

    return validatedData;
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = error.errors[0];
      const fieldName = validationError.path[0];
      const errorMessage = validationError.message;

      const errorMessages: Record<string, string> = {
        [fieldName]: errorMessage,
      };
      return { validationErrors: errorMessages };
    } else {
      return { validationErrors: { unexpected: "Unexpected error occurred" } };
    }
  }
};

export { validateemployee, validateupdatedemployee };
