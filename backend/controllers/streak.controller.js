import User from "../models/user.model.js";

export const getStreakData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("streakData");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate weekly progress
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyProgress = user.streakData.dailyActivity.filter(
      (day) => day.date >= startOfWeek
    ).length;

    const streakStatus = getStreakStatus(user.streakData.currentStreak);
    const nextLevelXP = user.streakData.level * 100;
    const currentLevelProgress =
      (user.streakData.experience / nextLevelXP) * 100;

    res.status(200).json({
      currentStreak: user.streakData.currentStreak,
      longestStreak: user.streakData.longestStreak,
      level: user.streakData.level,
      experience: user.streakData.experience,
      nextLevelXP,
      currentLevelProgress: Math.min(currentLevelProgress, 100),
      weeklyProgress,
      badges: user.streakData.badges,
      streakStatus,
      stats: user.streakData.stats,
      lastBlogDate: user.streakData.lastBlogDate,
      streakStartDate: user.streakData.streakStartDate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getStreakMap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("streakData");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate last 365 days
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setDate(today.getDate() - 365);

    const streakMap = [];
    const currentDate = new Date(oneYearAgo);

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const activity = user.streakData.dailyActivity.find(
        (day) => day.date.toISOString().split("T")[0] === dateStr
      );

      streakMap.push({
        date: dateStr,
        blogsPosted: activity ? activity.blogsPosted : 0,
        streakDay: activity ? activity.streakDay : 0,
        level: getBlogActivityLevel(activity ? activity.blogsPosted : 0),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.status(200).json({
      streakMap,
      totalDays: streakMap.length,
      activeDays: streakMap.filter((day) => day.blogsPosted > 0).length,
      currentStreak: user.streakData.currentStreak,
      longestStreak: user.streakData.longestStreak,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateStreakOnBlog = async (userId, wordCount = 0) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Update streak
    user.updateStreak();

    // Add experience based on blog length
    const experienceGained = Math.max(10, Math.floor(wordCount / 100) * 5);
    user.addExperience(experienceGained);

    // Update stats
    user.streakData.stats.totalWords += wordCount;

    await user.save();

    return {
      currentStreak: user.streakData.currentStreak,
      level: user.streakData.level,
      experienceGained,
      newBadges: user.streakData.badges.filter(
        (badge) =>
          new Date(badge.unlockedAt).toDateString() ===
          new Date().toDateString()
      ),
    };
  } catch (error) {
    console.error("Error updating streak:", error);
    throw error;
  }
};

export const useStreakFreeze = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { stats } = user.streakData;

    if (stats.streakFreezesUsed >= stats.maxStreakFreezesAllowed) {
      return res.status(400).json({
        message: "No streak freezes remaining",
        freezesRemaining: 0,
      });
    }

    // Use a streak freeze (extend last blog date by 1 day)
    const today = new Date();
    user.streakData.lastBlogDate = today;
    stats.streakFreezesUsed += 1;

    await user.save();

    res.status(200).json({
      message: "Streak freeze used successfully",
      freezesRemaining: stats.maxStreakFreezesAllowed - stats.streakFreezesUsed,
      currentStreak: user.streakData.currentStreak,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Helper functions
const getStreakStatus = (streak) => {
  if (streak === 0)
    return { level: "newbie", message: "Start your blogging journey!" };
  if (streak < 7)
    return { level: "getting-started", message: "Building momentum!" };
  if (streak < 30)
    return { level: "consistent", message: "Great consistency!" };
  if (streak < 100)
    return { level: "dedicated", message: "Truly dedicated blogger!" };
  return { level: "legendary", message: "Legendary blogger!" };
};

const getBlogActivityLevel = (blogsPosted) => {
  if (blogsPosted === 0) return 0;
  if (blogsPosted === 1) return 1;
  if (blogsPosted <= 3) return 2;
  if (blogsPosted <= 5) return 3;
  return 4; // 5+ blogs in a day
};
