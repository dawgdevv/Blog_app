import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import streakRoutes from "./routes/streak.routes.js";
import aiRoutes from "./routes/ai.routes.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("running the backend sevices!");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
