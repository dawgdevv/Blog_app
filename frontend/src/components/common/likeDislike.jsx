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
  }, [blogId, isAuthenticated]);

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
      alert("Please log in to dislike this post");
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
      alert("Failed to dislike post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-t border-b border-gray-200">
      {/* Like button */}
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
          userLiked
            ? "bg-blue-100 text-blue-600 border border-blue-300"
            : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-blue-50 hover:text-blue-600"
        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <svg
          className={`w-5 h-5 ${userLiked ? "fill-blue-600" : "fill-gray-600"}`}
          viewBox="0 0 24 24"
        >
          <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
        </svg>
        <span className="font-medium">{likes}</span>
        <span className="text-sm">Like{likes !== 1 ? "s" : ""}</span>
      </button>

      {/* Dislike button */}
      <button
        onClick={handleDislike}
        disabled={loading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
          userDisliked
            ? "bg-red-100 text-red-600 border border-red-300"
            : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-red-50 hover:text-red-600"
        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <svg
          className={`w-5 h-5 ${
            userDisliked ? "fill-red-600" : "fill-gray-600"
          } transform rotate-180`}
          viewBox="0 0 24 24"
        >
          <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
        </svg>
        <span className="font-medium">{dislikes}</span>
        <span className="text-sm">Dislike{dislikes !== 1 ? "s" : ""}</span>
      </button>

      {/* Engagement ratio (optional) */}
      <div className="text-sm text-gray-500 ml-4">
        {likes + dislikes > 0 && (
          <span>
            {((likes / (likes + dislikes)) * 100).toFixed(0)}% positive
          </span>
        )}
      </div>
    </div>
  );
};

export default LikeDislike;
