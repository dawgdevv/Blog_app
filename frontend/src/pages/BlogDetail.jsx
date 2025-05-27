import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/blogs/getblogs/${id}`
        );
        setBlog(response.data);
      } catch (err) {
        setError(
          "Failed to load blog. It may have been removed or is unavailable."
        );
        console.error("Error fetching blog details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/blogs/delete/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        navigate("/");
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
          <p className="mt-4 text-gray-600">Loading blog details...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center py-10">
          <div className="text-red-500 mb-4 text-5xl">404</div>
          <h3 className="text-2xl font-semibold mb-2">Blog Not Found</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor =
    isAuthenticated && user && blog.author && user._id === blog.author._id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="text-blue-600 hover:underline mb-6 inline-flex items-center"
      >
        ← Back to blogs
      </Link>

      {/* Blog header */}
      <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-4">{blog.title}</h1>

      <div className="flex items-center mb-6 text-gray-600">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
            {blog.author?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {blog.author?.name || "Unknown"}
            </p>
            <p className="text-xs">
              Published: {new Date(blog.timestamp).toLocaleDateString()}
              {blog.createdAt !== blog.updatedAt && (
                <span className="italic ml-2">
                  (Updated: {new Date(blog.updatedAt).toLocaleDateString()})
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-auto rounded-lg mb-6 object-cover"
        />
      )}

      {/* Edit/Delete buttons for author */}
      {isAuthor && (
        <div className="flex gap-3 mb-6">
          <Link
            to={`/blog/edit/${blog._id}`}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}

      {/* Blog content */}
      <div className="prose max-w-none">
        {/* Render the content as paragraphs */}
        {blog.content.split("\n").map((paragraph, index) =>
          paragraph ? (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ) : (
            <br key={index} />
          )
        )}
      </div>
    </div>
  );
};
export default BlogDetail;
