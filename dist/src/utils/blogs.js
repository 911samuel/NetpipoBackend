"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatedBlog = exports.validateBlog = void 0;
const zod_1 = require("zod");
const blogsZodSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: 'Title is required' }),
    author: zod_1.z.string().min(1, { message: 'Author is required' }),
    category: zod_1.z.string().min(1, { message: 'Category is required' }),
    description: zod_1.z.string().min(5, { message: 'Description should be at least 5 characters long' })
});
const updateBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: 'Title is required' }).optional(),
    text: zod_1.z.string().min(1, { message: 'Text is required' }).optional(),
});
const validateBlog = async (articleData, res) => {
    try {
        const validatedData = blogsZodSchema.parse(articleData);
        return validatedData;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const validationError = error.errors[0];
            const errorMessage = validationError.message;
            const errorMessages = {
                errorMessage,
            };
            return { validationErrors: errorMessages };
        }
        else {
            return { validationErrors: { unexpected: "Unexpected error occurred" } };
        }
    }
};
exports.validateBlog = validateBlog;
const validateUpdatedBlog = async (articleData, res) => {
    try {
        const validatedData = updateBlogSchema.parse(articleData);
        return validatedData;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const validationError = error.errors[0];
            const errorMessage = validationError.message;
            const errorMessages = {
                errorMessage,
            };
            return { validationErrors: errorMessages };
        }
        else {
            return { validationErrors: { unexpected: "Unexpected error occurred" } };
        }
    }
};
exports.validateUpdatedBlog = validateUpdatedBlog;
