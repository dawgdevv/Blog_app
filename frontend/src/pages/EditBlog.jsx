import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        // FIX: Use the correct endpoint to fetch a blog by ID
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/blogs/getblogs/${id}`
        );
        const blog = response.data;

        // Check if current user is the author
        if (!isAuthenticated || !user || user._id !== blog.author._id) {
          navigate(`/blog/${id}`);
          return;
        }

        setTitle(blog.title);
        setContent(blog.content);
        setCoverImage(blog.coverImage || "");
      } catch (err) {
        setError(
          "Failed to load blog. It may have been removed or is unavailable."
        );
        console.error("Error fetching blog to edit:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, isAuthenticated, navigate, user]);

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

      // FIX: Use the correct endpoint to update a blog
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/update/${id}`,
        blogData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blog post");
      console.error("Error updating blog:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>

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
          <label
            htmlFor="content"
            className="block text-gray-700 font-medium mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-64 bg-white text-gray-900"
            placeholder="Write your blog post content here..."
            required
          ></textarea>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/blog/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
