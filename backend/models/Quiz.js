const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correctIndex: {
      type: Number,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "History",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    questions: {
      type: [questionSchema],
      required: true,
    },

    xpReward: {
      type: Number,
      default: 100,
    },

    timeLimit: {
      type: Number,
      default: 60,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);