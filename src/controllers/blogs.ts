import { Request, Response, NextFunction } from "express";
import Blog, { IBlog } from "../models/blogs";
import { validateBlog, validateUpdatedBlog } from "../utils/blogs";
import { upload, uploadToCloudinary } from "../middlewares/upload"; 

const all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await Blog.find();
    res.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "An error occurred while fetching blogs" });
  }
};

const single = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(500).json({ message: "Blog not found" });
    }
    res.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the blog" });
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedBlog = await validateBlog(req.body, res);

    if ("validationErrors" in validatedBlog) {
      return res.status(400).json(validatedBlog.validationErrors);
    }

    const { title, author, category, description } = req.body;

    let imgUrl = "";

    if (req.file && req.file.path) {
      const cloudinaryUrl = await uploadToCloudinary(req.file);
      if (cloudinaryUrl instanceof Error) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      imgUrl = cloudinaryUrl;
    }
    
    const blog: IBlog = new Blog({
      title,
      author,
      category,
      description,
      imgUrl,
    });

    const savedBlog = await blog.save();
    res
      .status(201)
      .json({ message: "The blog was added successfully", blog: savedBlog });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: "An error occurred while saving the blog" });
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const blogId = req.params.id;
  try {
    const validatedUpdatedBlog = await validateUpdatedBlog(req.body, res);

    if ("validationErrors" in validatedUpdatedBlog) {
      return res.status(400).json(validatedUpdatedBlog.validationErrors);
    }

    const updatedFields: Partial<IBlog> = {
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      description: req.body.description,
    };

    if (req.file) {
      const cloudinaryUrl = await uploadToCloudinary(req.file);
      if (cloudinaryUrl instanceof Error) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      updatedFields.imgUrl = cloudinaryUrl;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    res
      .status(200)
      .json({ message: "Blog updated successfully.", data: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the blog" });
  }
};

const delete1 = async (req: Request, res: Response, next: NextFunction) => {
  const blogId = req.params.id;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    res.status(200).json({ message: "The blog was deleted successfully." });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the blog" });
  }
};

const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Blog.deleteMany({});
    res.status(200).json({ message: "All blogs were deleted successfully." });
  } catch (error) {
    console.error("Error deleting all blogs:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting all blogs" });
  }
};

export { all, single, create, update, delete1, deleteAll };
