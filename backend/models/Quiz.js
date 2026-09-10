const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: "" },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    relatedState: { type: mongoose.Schema.Types.ObjectId, ref: "State", default: null },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    xpReward: { type: Number, default: 25 },
    questions: [quizQuestionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
