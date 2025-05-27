const BadgeCollection = ({ badges }) => {
  // Updated badge definitions to match backend badge names
  const allBadges = [
    {
      id: "First Post",
      name: "First Post",
      emoji: "🎉",
      description: "Published your first blog post",
    },
    {
      id: "Week Warrior",
      name: "Week Warrior",
      emoji: "🔥",
      description: "Blog for 7 consecutive days",
    },
    {
      id: "Month Master",
      name: "Month Master",
      emoji: "👑",
      description: "Blog for 30 consecutive days",
    },
    {
      id: "Century Champion",
      name: "Century Champion",
      emoji: "💎",
      description: "Blog for 100 consecutive days",
    },
    {
      id: "Rising Star",
      name: "Rising Star",
      emoji: "⭐",
      description: "Reach level 5",
    },
    {
      id: "Blog Veteran",
      name: "Blog Veteran",
      emoji: "🎖️",
      description: "Reach level 10",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Badge Collection 🏆
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allBadges.map((badge) => {
          // Check if user has this badge by matching badge names
          const earned = badges.some(
            (userBadge) => userBadge.name === badge.name
          );

          return (
            <div
              key={badge.id}
              className={`text-center p-3 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer ${
                earned
                  ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 shadow-sm"
                  : "bg-gray-50 border border-gray-200 opacity-50"
              }`}
              title={badge.description}
            >
              <div className={`text-2xl mb-1 ${earned ? "" : "grayscale"}`}>
                {badge.emoji}
              </div>
              <div
                className={`text-xs font-medium ${
                  earned ? "text-yellow-800" : "text-gray-500"
                }`}
              >
                {badge.name}
              </div>
              {earned && (
                <div className="text-xs text-yellow-600 mt-1">✓ Earned</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <div className="text-sm text-gray-600 mb-2">
          {badges.length} of {allBadges.length} badges earned
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(badges.length / allBadges.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {Math.round((badges.length / allBadges.length) * 100)}% complete
        </div>
      </div>
    </div>
  );
};

export default BadgeCollection;
