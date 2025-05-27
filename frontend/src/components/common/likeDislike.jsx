import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const LikeDislike = ({ blogId }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchLikeStatus();
    }
  });

  const fetchLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/like-status/${blogId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLikes(response.data.likesCount);
      setDislikes(response.data.dislikesCount);
      setUserLiked(response.data.userLiked);
      setUserDisliked(response.data.userDisliked);
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("Please log in to like this post");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/like/${blogId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLikes(response.data.likesCount);
      setDislikes(response.data.dislikesCount);
      setUserLiked(response.data.userLiked);
      setUserDisliked(response.data.userDisliked);
    } catch (error) {
      console.error("Error liking blog:", error);
      alert("Failed to like post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      alert("Please log in to react to this post");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/blogs/dislike/${blogId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLikes(response.data.likesCount);
      setDislikes(response.data.dislikesCount);
      setUserLiked(response.data.userLiked);
      setUserDisliked(response.data.userDisliked);
    } catch (error) {
      console.error("Error disliking blog:", error);
      alert("Failed to react to post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-6 border-t border-gray-200">
      <div className="flex items-center space-x-6">
        {/* Like button */}
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
            userLiked
              ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
              : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
          } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <svg
            className={`w-5 h-5 ${
              userLiked ? "fill-blue-600" : "fill-none stroke-current"
            }`}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
          </svg>
          <span className="font-medium text-sm">{likes}</span>
        </button>

        {/* Dislike button */}
        <button
          onClick={handleDislike}
          disabled={loading}
          className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
            userDisliked
              ? "bg-red-50 text-red-600 border border-red-200 shadow-sm"
              : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <svg
            className={`w-5 h-5 transform rotate-180 ${
              userDisliked ? "fill-red-600" : "fill-none stroke-current"
            }`}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
          </svg>
          <span className="font-medium text-sm">{dislikes}</span>
        </button>
      </div>

      {/* Engagement Stats */}
      <div className="text-sm text-gray-500">
        {likes + dislikes > 0 && (
          <div className="flex items-center space-x-4">
            <span className="font-medium">
              {likes + dislikes}{" "}
              {likes + dislikes === 1 ? "reaction" : "reactions"}
            </span>
            <span className="text-xs">
              {((likes / (likes + dislikes)) * 100).toFixed(0)}% positive
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikeDislike;
