const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // "Guardian Name"
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String, select: false }, // absent for guest accounts
    isGuest: { type: Boolean, default: false },

    guardianType: {
      type: String,
      enum: ["explorer", "historian", "artist", "protector", null],
      default: null,
    },

    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
    },

    // Skill stats shown on the guardian card, 0-100
    stats: {
      courage: { type: Number, default: 50 },
      wisdom: { type: Number, default: 50 },
      creativity: { type: Number, default: 50 },
      discipline: { type: Number, default: 50 },
    },

    unlockedStates: [{ type: mongoose.Schema.Types.ObjectId, ref: "State" }],
    collectedArtifacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artifact" }],
    awards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Award" }],
    completedMissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mission" }],
    quizHistory: [
      {
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
        score: Number,
        total: Number,
        playedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.recomputeLevel = function () {
  this.level = Math.floor(Math.sqrt(this.xp / 100)) + 1;
};

// call whenever the guardian does ANY activity (quiz, mission, artifact collect, explore)
userSchema.methods.touchStreak = function () {
  const today = new Date();
  const todayKey = today.toDateString();
  const last = this.streak.lastActiveDate;
  if (!last) {
    this.streak.current = 1;
  } else if (last.toDateString() !== todayKey) {
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
    this.streak.current = diffDays === 1 ? this.streak.current + 1 : 1;
  }
  this.streak.longest = Math.max(this.streak.longest, this.streak.current);
  this.streak.lastActiveDate = today;
};

module.exports = mongoose.model("User", userSchema);
