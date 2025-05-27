import express from "express";
import {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createComment);
router.get("/blog/:blogId", getCommentsByBlog);
router.put("/update/:id", authMiddleware, updateComment);
router.delete("/delete/:id", authMiddleware, deleteComment);

export default router;
