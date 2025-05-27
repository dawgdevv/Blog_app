import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    content: {
      type: String,
      required: true,
      minLength: 10,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Add the coverImage field
    coverImage: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
); // Also add timestamps for createdAt/updatedAt

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
