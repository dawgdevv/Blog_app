import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById, // Changed from getBlog to getBlogById
  updateBlog,
  deleteBlog,
  getBlogsByUser, // Changed from getUserBlogs to getBlogsByUser
  getBlogsByUser as getSpecificUserBlogs, // Using alias or create separate function
  likeBlog,
  dislikeBlog,
  getBlogLikeStatus,
} from "../controllers/blog.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createBlog);
router.get("/getblogs", getBlogs);

// User blogs routes must come BEFORE the route with the :id parameter
router.get("/getblogs/user", authMiddleware, getBlogsByUser);
router.get("/getblogs/user/:userId", authMiddleware, getBlogsByUser); // Using same function

// Blog by ID route should come after other specific routes
router.get("/getblogs/:id", getBlogById); // Corrected function name

router.put("/update/:id", authMiddleware, updateBlog);
router.delete("/delete/:id", authMiddleware, deleteBlog);

// Like/Dislike routes
router.post("/like/:id", authMiddleware, likeBlog);
router.post("/dislike/:id", authMiddleware, dislikeBlog);
router.get("/like-status/:id", authMiddleware, getBlogLikeStatus);

export default router;
