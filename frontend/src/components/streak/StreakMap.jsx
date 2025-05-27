import { useState, useMemo } from "react";

const StreakMap = ({ streakMap, streakData }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  // Debug: Log the streak map data
  console.log("StreakMap data:", streakMap);

  // Memoized calculations to avoid redundant processing
  const { weeks, monthLabels } = useMemo(() => {
    if (!streakMap?.streakMap?.length) {
      return { weeks: [], monthLabels: [] };
    }

    const days = streakMap.streakMap;
    const weeks = [];
    const monthLabels = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Debug: Log some sample days to see the data structure
    console.log("Sample days data:", days.slice(-10));

    // Create weeks array
    const firstDate = new Date(days[0].date);
    const firstDayOfWeek = firstDate.getDay();
    let currentWeek = new Array(firstDayOfWeek).fill(null);

    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // Create month labels
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find((day) => day !== null);
      if (firstDayOfWeek) {
        const date = new Date(firstDayOfWeek.date);
        const dayOfMonth = date.getDate();
        monthLabels.push({
          weekIndex,
          month: dayOfMonth <= 7 ? months[date.getMonth()] : "",
        });
      } else {
        monthLabels.push({ weekIndex, month: "" });
      }
    });

    return { weeks, monthLabels };
  }, [streakMap]);

  const getActivityColor = (level, blogsPosted) => {
    if (blogsPosted === 0) return "bg-gray-100 border-gray-200";
    const colors = [
      "bg-gray-100 border-gray-200",
      "bg-green-200 border-green-300",
      "bg-green-400 border-green-500",
      "bg-green-600 border-green-700",
      "bg-green-800 border-green-900",
    ];
    return colors[Math.min(level, 4)] || colors[4];
  };

  const getActivityEmoji = (blogsPosted) => {
    if (blogsPosted === 0) return "";
    if (blogsPosted === 1) return "📝";
    if (blogsPosted === 2) return "✍️";
    if (blogsPosted >= 3) return "🔥";
    return "📚";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!streakMap) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-53 gap-1">
            {Array.from({ length: 365 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const consistencyPercentage = Math.round(
    (streakMap.activeDays / streakMap.totalDays) * 100
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Your Year in Writing 🗓️
        </h3>
        <p className="text-gray-600">
          {streakMap.activeDays} days active out of {streakMap.totalDays} days
        </p>
      </div>

      {/* Activity Graph */}
      <div className="mb-6 overflow-x-auto">
        {/* Month labels */}
        <div className="flex mb-2 ml-8">
          {monthLabels.map((label, index) => (
            <div
              key={index}
              className="text-xs text-gray-500 w-3 mr-1 text-center"
            >
              {label.month}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Weekday labels */}
          <div className="flex flex-col mr-2">
            {weekdays.map((day, index) => (
              <div
                key={day}
                className="text-xs text-gray-500 h-3 flex items-center mb-1"
                style={{ opacity: index % 2 === 0 ? 1 : 0 }}
              >
                {index % 2 === 0 ? day : ""}
              </div>
            ))}
          </div>

          {/* Activity grid */}
          <div className="flex space-x-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col space-y-1">
                {week.map((day, dayIndex) => {
                  // Debug log for days with posts
                  if (day && day.blogsPosted > 0) {
                    console.log(
                      `Day ${day.date}: ${day.blogsPosted} posts, level: ${day.level}`
                    );
                  }

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm border transition-all duration-200 ${
                        day
                          ? `cursor-pointer hover:scale-110 ${getActivityColor(
                              day.level,
                              day.blogsPosted
                            )}`
                          : "bg-transparent border-transparent"
                      } ${
                        hoveredDate === day?.date ? "ring-2 ring-blue-400" : ""
                      }`}
                      onMouseEnter={() => day && setHoveredDate(day.date)}
                      onMouseLeave={() => setHoveredDate(null)}
                      onClick={() => day && setSelectedDate(day)}
                      title={
                        day
                          ? `${formatDate(day.date)}: ${day.blogsPosted} post${
                              day.blogsPosted !== 1 ? "s" : ""
                            }`
                          : ""
                      }
                    >
                      {day && day.blogsPosted > 0 && (
                        <div className="text-[8px] leading-none text-center overflow-hidden">
                          {getActivityEmoji(day.blogsPosted)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
        <div className="flex items-center space-x-2">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getActivityColor(
                  level,
                  level
                )}`}
              ></div>
            ))}
          </div>
          <span>More</span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <span>📝</span>
            <span>1 post</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>✍️</span>
            <span>2 posts</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🔥</span>
            <span>3+ posts</span>
          </div>
        </div>
      </div>

      {/* Selected date info */}
      {selectedDate && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">
            {formatDate(selectedDate.date)}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Posts published:</span>
              <div className="font-semibold text-lg text-blue-600">
                {selectedDate.blogsPosted}{" "}
                {getActivityEmoji(selectedDate.blogsPosted)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Streak day:</span>
              <div className="font-semibold text-lg text-purple-600">
                {selectedDate.streakDay > 0
                  ? `Day ${selectedDate.streakDay}`
                  : "No streak"}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedDate(null)}
            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Close details
          </button>
        </div>
      )}

      {/* Streak Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
          <div className="text-2xl font-bold text-green-600">
            {streakData?.currentStreak || 0}
          </div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">
            {streakData?.longestStreak || 0}
          </div>
          <div className="text-sm text-gray-600">Longest Streak</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">
            {streakMap.activeDays}
          </div>
          <div className="text-sm text-gray-600">Active Days</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
          <div className="text-2xl font-bold text-orange-600">
            {consistencyPercentage}%
          </div>
          <div className="text-sm text-gray-600">Consistency</div>
        </div>
      </div>
    </div>
  );
};

export default StreakMap;
