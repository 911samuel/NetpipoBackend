import { z, ZodError } from 'zod';
import { Response } from 'express';
import { IBlog } from '../models/blogs';

const blogsZodSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }), 
  category:  z.string().min(1, { message: 'Category is required'}),
  description: z.string().min(5, { message: 'Description should be at least 5 characters long' })
});

const updateBlogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).optional(),
  text: z.string().min(1, { message: 'Text is required' }).optional(),
});

interface UpdatedBlog extends IBlog {}

const validateBlog = async (articleData: any, res: Response): Promise<UpdatedBlog | { validationErrors: Record<string, string> }>  => {
  try {
    const validatedData = blogsZodSchema.parse(articleData);
    return validatedData as UpdatedBlog;
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

const validateUpdatedBlog = async (articleData: any, res: Response): Promise<UpdatedBlog | { validationErrors: Record<string, string> }>  => {
  try {
    const validatedData = updateBlogSchema.parse(articleData);
    return validatedData as UpdatedBlog;
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

export { validateBlog, validateUpdatedBlog };
