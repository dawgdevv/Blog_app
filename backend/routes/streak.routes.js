import express from "express";
import {
  getStreakData,
  getStreakMap,
  useStreakFreeze,
} from "../controllers/streak.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/data", authMiddleware, getStreakData);
router.get("/map", authMiddleware, getStreakMap);
router.post("/freeze", authMiddleware, useStreakFreeze);

export default router;
