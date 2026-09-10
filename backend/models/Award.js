const mongoose = require("mongoose");

// "Awards" tab badges
const awardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, default: "🏆" },
    criteria: { type: String, default: "" }, // human-readable unlock condition
  },
  { timestamps: true }
);

module.exports = mongoose.model("Award", awardSchema);
