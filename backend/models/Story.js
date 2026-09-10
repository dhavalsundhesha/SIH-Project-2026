const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    relatedState: { type: mongoose.Schema.Types.ObjectId, ref: "State", default: null },
    coverIcon: { type: String, default: "📜" },
    era: { type: String, default: "" },
    body: { type: String, required: true }, // short narrative, a few paragraphs
    xpReward: { type: Number, default: 15 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
