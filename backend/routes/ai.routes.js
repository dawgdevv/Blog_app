import express from "express";
import { analyzeContent } from "../controllers/ai.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/analyze", authMiddleware, analyzeContent);

export default router;
