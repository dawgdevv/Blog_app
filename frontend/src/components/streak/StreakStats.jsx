const StreakStats = ({ streakData }) => {
  if (!streakData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getStreakStatus = (streak) => {
    if (streak === 0)
      return {
        text: "Start your journey!",
        emoji: "🌱",
        color: "text-gray-600",
      };
    if (streak < 7)
      return {
        text: "Building momentum",
        emoji: "🔥",
        color: "text-orange-600",
      };
    if (streak < 30)
      return { text: "On fire!", emoji: "🚀", color: "text-red-600" };
    if (streak < 100)
      return { text: "Streak master", emoji: "⭐", color: "text-yellow-600" };
    return { text: "Legend!", emoji: "👑", color: "text-purple-600" };
  };

  const status = getStreakStatus(streakData.currentStreak);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Current Streak {status.emoji}
      </h3>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-blue-600 mb-2">
          {streakData.currentStreak || 0}
        </div>
        <div className={`text-sm font-medium ${status.color}`}>
          {status.text}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Longest streak</span>
          <span className="font-semibold">
            {streakData.longestStreak || 0} days
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">This week</span>
          <span className="font-semibold">
            {streakData.weeklyProgress || 0}/7 days
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                ((streakData.weeklyProgress || 0) / 7) * 100,
                100
              )}%`,
            }}
          ></div>
        </div>

        <div className="text-center text-xs text-gray-500">
          {Math.round(((streakData.weeklyProgress || 0) / 7) * 100)}% of week
          complete
        </div>
      </div>

      {streakData.currentStreak > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
          <div className="text-sm text-green-800">
            <strong>Keep it up!</strong> You've been consistent for{" "}
            <strong>{streakData.currentStreak}</strong> days.
            {streakData.currentStreak < 7 &&
              ` ${
                7 - streakData.currentStreak
              } more days to complete your first week!`}
          </div>
        </div>
      )}

      {streakData.currentStreak === 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
          <div className="text-sm text-blue-800">
            <strong>Ready to start?</strong> Write your first blog post today to
            begin your streak journey!
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakStats;
