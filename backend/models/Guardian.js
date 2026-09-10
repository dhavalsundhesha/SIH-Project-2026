const mongoose = require("mongoose");

const guardianSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    hindiName: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "🏛️",
    },

    description: {
      type: String,
      default: "",
    },

    specialPowerTitle: {
      type: String,
      default: "",
    },

    specialPower: {
      type: String,
      default: "",
    },

    skillTags: {
      type: [String],
      default: [],
    },

    baseStats: {
      knowledge: {
        type: Number,
        default: 50,
      },

      exploration: {
        type: Number,
        default: 50,
      },

      creativity: {
        type: Number,
        default: 50,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guardian", guardianSchema);