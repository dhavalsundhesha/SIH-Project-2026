const mongoose = require("mongoose");

const artifactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },        // "Dancing Girl Bronze"
    icon: { type: String, default: "🏺" },
    era: { type: String, required: true },          // "2300 BCE"
    location: { type: String, required: true },     // "Mohenjo-daro"
    rarity: { type: String, enum: ["rare", "epic", "legendary"], default: "rare" },
    description: { type: String, required: true },
    xpReward: { type: Number, default: 30 },
    relatedState: { type: mongoose.Schema.Types.ObjectId, ref: "State", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artifact", artifactSchema);
