import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchUserBlogs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/blogs/getblogs/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(response.data)) {
          setBlogs(response.data);
        } else {
          setBlogs([]);
          console.error("Unexpected API response format:", response.data);
        }
      } catch (err) {
        setError("Failed to load your blogs. Please try again later.");
        console.error("Error fetching user blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserBlogs();
    }
  }, [isAuthenticated, navigate]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/blogs/delete/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Remove the deleted blog from state
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (err) {
        alert("Failed to delete blog post. Please try again.");
        console.error("Error deleting blog:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Blogs</h1>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-xl font-medium mb-2">
            You haven't created any blogs yet
          </h3>
          <p className="text-gray-600 mb-6">
            Your published blogs will appear here.
          </p>
          <Link
            to="/blog/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex flex-col"
            >
              {/* Blog preview with image */}
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              )}

              <div className="p-5 flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  <span>
                    Published:{" "}
                    {new Date(
                      blog.timestamp || blog.createdAt
                    ).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {blog.content.substring(0, 150)}
                  {blog.content.length > 150 ? "..." : ""}
                </p>
              </div>

              {/* Action buttons */}
              <div className="border-t border-gray-200 p-4 flex justify-between">
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <div className="flex gap-4">
                  <Link
                    to={`/blog/edit/${blog._id}`}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id, blog.title)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
