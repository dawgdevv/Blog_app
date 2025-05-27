import Comment from "../models/comment.model.js";
import Blog from "../models/blog.model.js";

export const createComment = async (req, res) => {
  const { content, blogId, parentCommentId } = req.body;

  try {
    // Verify blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = new Comment({
      content,
      author: req.user._id,
      blog: blogId,
      parentComment: parentCommentId || null,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "name"
    );

    res.status(201).json({
      message: "Comment created successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCommentsByBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    const comments = await Comment.find({
      blog: blogId,
      parentComment: null, // Only get top-level comments
    })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate("author", "name")
          .sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies: replies,
        };
      })
    );

    res.status(200).json(commentsWithReplies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    ).populate("author", "name");

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Delete the comment and its replies
    await Comment.deleteMany({
      $or: [{ _id: id }, { parentComment: id }],
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
