import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByUser,
} from "../controllers/blog.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/create", authMiddleware, createBlog);
router.get("/getblogs", getBlogs);

// User blogs routes must come BEFORE the route with the :id parameter
router.get("/getblogs/user", authMiddleware, getBlogsByUser);
router.get("/getblogs/user/:userId", authMiddleware, getBlogsByUser);

// Blog by ID route should come after other specific routes
router.get("/getblogs/:id", getBlogById);

router.put("/update/:id", authMiddleware, updateBlog);
router.delete("/delete/:id", authMiddleware, deleteBlog);

export default router;
