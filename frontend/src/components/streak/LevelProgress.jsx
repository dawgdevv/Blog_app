const LevelProgress = ({ streakData }) => {
  if (!streakData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    streakData.currentLevelProgress || 0,
    100
  );
  const nextLevelXP = streakData.nextLevelXP || 100;
  const currentXP = streakData.experience || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Level Progress 🎯
      </h3>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-purple-600 mb-1">
          Level {streakData.level || 1}
        </div>
        <div className="text-sm text-gray-600">
          {currentXP} / {nextLevelXP} XP
        </div>
      </div>

      <div className="space-y-4">
        <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 20 && (
              <span className="text-xs text-white font-medium">
                {Math.round(progressPercentage)}%
              </span>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 text-center">
          {nextLevelXP - currentXP} XP to next level
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="font-semibold text-blue-600">Blog Posts</div>
          <div className="text-gray-600">+10-50 XP each</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="font-semibold text-green-600">Daily Streak</div>
          <div className="text-gray-600">+5 XP bonus</div>
        </div>
      </div>

      {/* Level milestone indicator */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500">
          {streakData.level < 5 && "Reach level 5 to unlock Rising Star badge!"}
          {streakData.level >= 5 &&
            streakData.level < 10 &&
            "Reach level 10 to unlock Blog Veteran badge!"}
          {streakData.level >= 10 && "You're a blogging veteran! Keep growing!"}
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;
