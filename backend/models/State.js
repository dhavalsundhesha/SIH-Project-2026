const mongoose = require("mongoose");

// Represents a dot on the "Explore Bharat" map
const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // "Rajasthan"
    icon: { type: String, default: "🏛️" },
    mapPosition: { x: Number, y: Number }, // percentage-based coords for the map SVG/overlay
    region: { type: String, default: "" },

    culture: { type: String, default: "" },
    food: { type: String, default: "" },
    art: { type: String, default: "" },
    heritage: { type: String, default: "" },
    coverImage: { type: String, default: "" },

    xpReward: { type: Number, default: 20 }, // awarded first time a guardian explores this state
    locked: { type: Boolean, default: false }, // some states could require a level to unlock
  },
  { timestamps: true }
);

module.exports = mongoose.model("State", stateSchema);
