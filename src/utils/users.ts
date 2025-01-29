import { z, ZodError } from "zod";
import { hash } from "bcryptjs";
import { IUser } from "../models/users";

const userZodSchema = z.object({
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(1,  { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20,  { message: "Password cannot exceed 20 characters" }),
  role: z.string().min(3).default("USER"),
});

const updateUserSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "First name is required" })
    .optional(),
  lastname: z.string().min(1, { message: "Last name is required" }).optional(),
  username: z.string().min(1, { message: "Username is required" }).optional(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .optional(),
  password: z
    .string()
    .min(1,  { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20,  { message: "Password cannot exceed 20 characters" })
    .optional(),
  role: z.string().min(3).optional(),
});

interface ValidatedUser extends Omit<IUser, "password"> {}

const validateUser = async (
  userData: any
): Promise<ValidatedUser | { validationErrors: Record<string, string> }> => {
  try {
    const validatedData: any = userZodSchema.parse(userData);

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

const validateupdatedUser = async (
  userData: any
): Promise<ValidatedUser | { validationErrors: Record<string, string> }> => {
  try {
    const validatedData: any = updateUserSchema.parse(userData);

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

export { validateUser, validateupdatedUser };
