import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/comments/blog/${blogId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/comments/create`,
        {
          content: newComment,
          blogId: blogId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewComment("");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/comments/create`,
        {
          content: replyContent,
          blogId: blogId,
          parentCommentId: parentCommentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReplyContent("");
      setReplyingTo(null);
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error creating reply:", error);
      alert("Failed to add reply. Please try again.");
    }
  };

  const handleEditComment = async (e, commentId) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/comments/update/${commentId}`,
        { content: editContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditingComment(null);
      setEditContent("");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/comments/delete/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h3>

      {/* Add new comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
          <p className="text-gray-600">Please log in to leave a comment.</p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="space-y-4">
              {/* Main comment */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm">
                  {comment.author?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">
                        {comment.author?.name || "Anonymous"}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {editingComment === comment._id ? (
                      <form onSubmit={(e) => handleEditComment(e, comment._id)}>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                          required
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingComment(null);
                              setEditContent("");
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    )}
                  </div>

                  {/* Comment actions */}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    {isAuthenticated && (
                      <button
                        onClick={() => setReplyingTo(comment._id)}
                        className="hover:text-blue-600"
                      >
                        Reply
                      </button>
                    )}
                    {isAuthenticated && user?._id === comment.author?._id && (
                      <>
                        <button
                          onClick={() => {
                            setEditingComment(comment._id);
                            setEditContent(comment.content);
                          }}
                          className="hover:text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="hover:text-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                  {/* Reply form */}
                  {replyingTo === comment._id && (
                    <form
                      onSubmit={(e) => handleSubmitReply(e, comment._id)}
                      className="mt-3"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="2"
                            required
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 mt-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">
                            {reply.author?.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-100 p-2 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-xs">
                                  {reply.author?.name || "Anonymous"}
                                </h5>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    reply.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 text-xs">
                                {reply.content}
                              </p>
                            </div>
                            {isAuthenticated &&
                              user?._id === reply.author?._id && (
                                <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(reply._id)
                                    }
                                    className="hover:text-red-600"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
