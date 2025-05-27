import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import AIWritingAssistant from "../components/ai/AIWritingAssistant";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const blogData = {
        title,
        content,
        coverImage: coverImage || undefined,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/create`,
        blogData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/blog/${response.data.blog._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create blog post");
      console.error("Error creating blog:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        <button
          onClick={() => setShowAIAssistant(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center space-x-2 transition-all"
        >
          <span>✨</span>
          <span>AI Assistant</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            placeholder="Enter your blog title"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="coverImage"
            className="block text-gray-700 font-medium mb-2"
          >
            Cover Image URL (optional)
          </label>
          <input
            type="url"
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            placeholder="https://example.com/image.jpg"
          />
          {coverImage && (
            <div className="mt-2">
              <img
                src={coverImage}
                alt="Cover preview"
                className="max-h-40 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=Invalid+Image+URL";
                }}
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="content"
              className="block text-gray-700 font-medium"
            >
              Content
            </label>
            <button
              type="button"
              onClick={() => setShowAIAssistant(true)}
              className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 flex items-center space-x-1"
            >
              <span>✨</span>
              <span>Get AI Help</span>
            </button>
          </div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-64 bg-white text-gray-900"
            placeholder="Write your blog post content here..."
            required
          ></textarea>
          <div className="text-sm text-gray-500 mt-1">
            Word count:{" "}
            {content.split(" ").filter((word) => word.length > 0).length} |
            Reading time: ~
            {Math.ceil(
              content.split(" ").filter((word) => word.length > 0).length / 200
            )}{" "}
            min
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>

      <AIWritingAssistant
        content={content}
        onContentUpdate={setContent}
        isVisible={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />
    </div>
  );
};

export default CreateBlog;
