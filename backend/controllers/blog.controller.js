import Blog from "../models/blog.model.js";

export const createBlog = async (req, res) => {
  const { title, content, coverImage } = req.body;
  try {
    const newBlog = new Blog({
      title,
      content,
      author: req.user._id,
      coverImage,
    });

    await newBlog.save();

    const populatedBlog = await Blog.findById(newBlog._id).populate(
      "author",
      "name"
    );

    res.status(201).json({
      message: "Blog created successfully",
      blog: populatedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await Blog.countDocuments();

    // Use populate to include author details with pagination
    const blogs = await Blog.find()
      .populate("author", "name") // Only get the author's name
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      blogs: blogs,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fixed function name from getBlog to getBlogById
export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    // Use populate to include author details
    const blog = await Blog.findById(id).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, coverImage } = req.body;
  try {
    // First find the blog to check ownership
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, coverImage },
      { new: true }
    ).populate("author", "name");

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    // First find the blog to check ownership
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    res.status(200).json({
      message: "Blog deleted successfully",
      blog: deletedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fixed function name from getUserBlogs to getBlogsByUser
export const getBlogsByUser = async (req, res) => {
  // Handle both current user and specific user cases
  const userId = req.params.userId || req.user._id;

  try {
    const blogs = await Blog.find({ author: userId })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const likeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user already liked the blog
    const alreadyLiked = blog.likes.some(
      (like) => like.user.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // Remove like
      blog.likes = blog.likes.filter(
        (like) => like.user.toString() !== userId.toString()
      );
    } else {
      // Remove dislike if exists
      blog.dislikes = blog.dislikes.filter(
        (dislike) => dislike.user.toString() !== userId.toString()
      );
      // Add like
      blog.likes.push({ user: userId });
    }

    await blog.save();

    res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Blog liked",
      likesCount: blog.likes.length,
      dislikesCount: blog.dislikes.length,
      userLiked: !alreadyLiked,
      userDisliked: false,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const dislikeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user already disliked the blog
    const alreadyDisliked = blog.dislikes.some(
      (dislike) => dislike.user.toString() === userId.toString()
    );

    if (alreadyDisliked) {
      // Remove dislike
      blog.dislikes = blog.dislikes.filter(
        (dislike) => dislike.user.toString() !== userId.toString()
      );
    } else {
      // Remove like if exists
      blog.likes = blog.likes.filter(
        (like) => like.user.toString() !== userId.toString()
      );
      // Add dislike
      blog.dislikes.push({ user: userId });
    }

    await blog.save();

    res.status(200).json({
      message: alreadyDisliked ? "Dislike removed" : "Blog disliked",
      likesCount: blog.likes.length,
      dislikesCount: blog.dislikes.length,
      userLiked: false,
      userDisliked: !alreadyDisliked,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getBlogLikeStatus = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userLiked = blog.likes.some(
      (like) => like.user.toString() === userId.toString()
    );
    const userDisliked = blog.dislikes.some(
      (dislike) => dislike.user.toString() === userId.toString()
    );

    res.status(200).json({
      likesCount: blog.likes.length,
      dislikesCount: blog.dislikes.length,
      userLiked,
      userDisliked,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
