const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    relatedState: { type: mongoose.Schema.Types.ObjectId, ref: "State", default: null },
    steps: [{ type: String }],
    xpReward: { type: Number, default: 40 },
    requiredGuardianType: { type: String, enum: ["explorer", "historian", "artist", "protector", null], default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mission", missionSchema);
