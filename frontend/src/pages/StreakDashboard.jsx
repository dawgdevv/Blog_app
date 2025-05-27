import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import StreakMap from "../components/streak/StreakMap";
import StreakStats from "../components/streak/StreakStats";
import LevelProgress from "../components/streak/LevelProgress";
import BadgeCollection from "../components/streak/BadgeCollection";

const StreakDashboard = () => {
  const [streakData, setStreakData] = useState(null);
  const [streakMap, setStreakMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchStreakData();
      fetchStreakMap();
    }
  }, [isAuthenticated]);

  const fetchStreakData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/streak/data`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStreakData(response.data);
    } catch (error) {
      console.error("Error fetching streak data:", error);
      setError("Failed to load streak data");
    }
  };

  const fetchStreakMap = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/streak/map`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStreakMap(response.data);
    } catch (error) {
      console.error("Error fetching streak map:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your streak dashboard
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">
              Loading your streak data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-red-500 mb-6 text-6xl">⚠️</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Error Loading Data
            </h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-full mx-auto">
        {/* Compact Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Writing Journey 🚀
                </h1>
                <p className="text-gray-600 mt-1">
                  {streakData?.currentStreak || 0} day streak • Level{" "}
                  {streakData?.level || 1}
                </p>
              </div>
              <Link
                to="/blog/create"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Write Today</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Full-Width Streak Map Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <StreakMap streakMap={streakMap} streakData={streakData} />
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Current Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {streakData?.currentStreak || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Current Streak
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {streakData?.currentStreak === 0
                  ? "Start today!"
                  : "🔥 On fire!"}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {streakData?.level || 1}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Current Level
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {streakData?.experience || 0} / {streakData?.nextLevelXP || 100}{" "}
                XP
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {streakData?.longestStreak || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Best Streak
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {streakData?.longestStreak === 0
                  ? "No record yet"
                  : "Personal best"}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {streakData?.badges?.length || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Badges Earned
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Unlock more by writing!
              </div>
            </div>
          </div>

          {/* Detailed Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Streak Details */}
            <div className="lg:col-span-1">
              <StreakStats streakData={streakData} />
            </div>

            {/* Level Progress */}
            <div className="lg:col-span-1">
              <LevelProgress streakData={streakData} />
            </div>

            {/* Badge Collection */}
            <div className="lg:col-span-1">
              <BadgeCollection badges={streakData?.badges || []} />
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/blog/create"
              className="group bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                ✍️
              </div>
              <h3 className="text-xl font-bold mb-2">Write New Post</h3>
              <p className="text-sm opacity-90 mb-4">
                Continue your streak today
              </p>
              <div className="text-xs bg-white/20 px-3 py-1 rounded-full inline-block">
                +10-50 XP
              </div>
            </Link>

            <Link
              to="/my-blogs"
              className="group bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                📚
              </div>
              <h3 className="text-xl font-bold mb-2">My Collection</h3>
              <p className="text-sm opacity-90 mb-4">View all your posts</p>
              <div className="text-xs bg-white/20 px-3 py-1 rounded-full inline-block">
                {streakData?.totalPosts || 0} posts
              </div>
            </Link>

            <Link
              to="/"
              className="group bg-gradient-to-br from-purple-500 to-pink-600 text-white p-8 rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                🌟
              </div>
              <h3 className="text-xl font-bold mb-2">Explore</h3>
              <p className="text-sm opacity-90 mb-4">
                Discover amazing content
              </p>
              <div className="text-xs bg-white/20 px-3 py-1 rounded-full inline-block">
                Get inspired
              </div>
            </Link>
          </div>

          {/* Weekly Challenge */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  This Week's Challenge 🎯
                </h3>
                <p className="text-gray-600 mb-4">
                  Write for {Math.max(7 - (streakData?.weeklyProgress || 0), 0)}{" "}
                  more days this week to maintain your streak!
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 max-w-md">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          ((streakData?.weeklyProgress || 0) / 7) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {streakData?.weeklyProgress || 0}/7 days
                  </span>
                </div>
              </div>
              <div className="text-6xl opacity-50">🏆</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakDashboard;
