import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 1024,
    },
    // Streak and gamification data
    streakData: {
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastBlogDate: {
        type: Date,
        default: null,
      },
      streakStartDate: {
        type: Date,
        default: null,
      },
      // Array to track daily activity for streak map
      dailyActivity: [
        {
          date: {
            type: Date,
            required: true,
          },
          blogsPosted: {
            type: Number,
            default: 0,
          },
          streakDay: {
            type: Number,
            default: 0,
          },
        },
      ],
      // Weekly milestones and levels
      weeklyMilestones: {
        totalWeeks: {
          type: Number,
          default: 0,
        },
        completedWeeks: {
          type: Number,
          default: 0,
        },
        currentWeekProgress: {
          type: Number,
          default: 0,
        },
      },
      // Level and achievement system
      level: {
        type: Number,
        default: 1,
      },
      experience: {
        type: Number,
        default: 0,
      },
      badges: [
        {
          name: String,
          description: String,
          unlockedAt: Date,
          icon: String,
        },
      ],
      // Statistics
      stats: {
        totalBlogs: {
          type: Number,
          default: 0,
        },
        totalWords: {
          type: Number,
          default: 0,
        },
        averageBlogsPerWeek: {
          type: Number,
          default: 0,
        },
        streakFreezesUsed: {
          type: Number,
          default: 0,
        },
        maxStreakFreezesAllowed: {
          type: Number,
          default: 3,
        },
      },
    },
  },
  { timestamps: true }
);

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Methods
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

// Streak management methods
userSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastBlogDate = this.streakData.lastBlogDate;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (!lastBlogDate) {
    // First blog ever
    this.streakData.currentStreak = 1;
    this.streakData.longestStreak = 1;
    this.streakData.streakStartDate = today;
  } else {
    const lastBlogDateOnly = new Date(lastBlogDate);
    lastBlogDateOnly.setHours(0, 0, 0, 0);

    if (lastBlogDateOnly.getTime() === today.getTime()) {
      // Already blogged today, no streak change
      return;
    } else if (lastBlogDateOnly.getTime() === yesterday.getTime()) {
      // Consecutive day
      this.streakData.currentStreak += 1;
      if (this.streakData.currentStreak > this.streakData.longestStreak) {
        this.streakData.longestStreak = this.streakData.currentStreak;
      }
    } else {
      // Streak broken
      this.streakData.currentStreak = 1;
      this.streakData.streakStartDate = today;
    }
  }

  this.streakData.lastBlogDate = today;

  // Update daily activity
  this.updateDailyActivity(today);

  // Check for level ups and badges
  this.checkLevelUp();
  this.checkBadges();
};

userSchema.methods.updateDailyActivity = function (date) {
  // Ensure we're working with a Date object
  const targetDate = new Date(date);
  // Normalize to start of day in user's timezone
  targetDate.setHours(0, 0, 0, 0);

  // Find existing activity for this date with proper comparison
  const existingDayIndex = this.streakData.dailyActivity.findIndex((day) => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === targetDate.getTime();
  });

  if (existingDayIndex !== -1) {
    // Update existing day's count and streak
    this.streakData.dailyActivity[existingDayIndex] = {
      ...this.streakData.dailyActivity[existingDayIndex],
      blogsPosted:
        this.streakData.dailyActivity[existingDayIndex].blogsPosted + 1,
      streakDay: this.streakData.currentStreak,
      date: targetDate, // Ensure date is normalized
    };
  } else {
    // Add new day
    this.streakData.dailyActivity.push({
      date: targetDate,
      blogsPosted: 1,
      streakDay: this.streakData.currentStreak,
    });
  }

  // Keep only last 365 days and sort by date
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  oneYearAgo.setHours(0, 0, 0, 0);

  this.streakData.dailyActivity = this.streakData.dailyActivity
    .filter((day) => new Date(day.date) >= oneYearAgo)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

userSchema.methods.checkLevelUp = function () {
  const experienceNeeded = this.streakData.level * 100; // 100 XP per level

  if (this.streakData.experience >= experienceNeeded) {
    this.streakData.level += 1;
    // Award bonus for level up
    this.streakData.experience += 50; // Bonus XP
  }
};

userSchema.methods.checkBadges = function () {
  const badges = [];

  // Streak badges
  if (this.streakData.currentStreak >= 7 && !this.hasBadge("Week Warrior")) {
    badges.push({
      name: "Week Warrior",
      description: "Blog for 7 consecutive days",
      icon: "🔥",
      unlockedAt: new Date(),
    });
  }

  if (this.streakData.currentStreak >= 30 && !this.hasBadge("Month Master")) {
    badges.push({
      name: "Month Master",
      description: "Blog for 30 consecutive days",
      icon: "👑",
      unlockedAt: new Date(),
    });
  }

  if (
    this.streakData.currentStreak >= 100 &&
    !this.hasBadge("Century Champion")
  ) {
    badges.push({
      name: "Century Champion",
      description: "Blog for 100 consecutive days",
      icon: "💎",
      unlockedAt: new Date(),
    });
  }

  // Level badges
  if (this.streakData.level >= 5 && !this.hasBadge("Rising Star")) {
    badges.push({
      name: "Rising Star",
      description: "Reach level 5",
      icon: "⭐",
      unlockedAt: new Date(),
    });
  }

  if (this.streakData.level >= 10 && !this.hasBadge("Blog Veteran")) {
    badges.push({
      name: "Blog Veteran",
      description: "Reach level 10",
      icon: "🎖️",
      unlockedAt: new Date(),
    });
  }

  // Add new badges
  this.streakData.badges.push(...badges);
};

userSchema.methods.hasBadge = function (badgeName) {
  return this.streakData.badges.some((badge) => badge.name === badgeName);
};

userSchema.methods.addExperience = function (amount) {
  this.streakData.experience += amount;
  this.streakData.stats.totalBlogs += 1;
  this.checkLevelUp();
};

const User = mongoose.model("User", userSchema);
export default User;
