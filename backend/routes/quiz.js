const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        prompt: {
            type: String,
            required: true,
            trim: true,
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length >= 2;
                },
                message: "A question must have at least 2 options.",
            },
        },

        correctIndex: {
            type: Number,
            required: true,
            min: 0,
        },

        explanation: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        relatedState: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "State",
            required: true,
        },

        difficulty: {
            type: String,

            // IMPORTANT:
            // Converts "easy" -> "Easy"
            // Converts "medium" -> "Medium"
            // Converts "hard" -> "Hard"
            set: function (value) {
                if (!value) return value;

                const normalized = String(value).toLowerCase();

                if (normalized === "easy") return "Easy";
                if (normalized === "medium") return "Medium";
                if (normalized === "hard") return "Hard";

                return value;
            },

            enum: ["Easy", "Medium", "Hard"],

            required: true,
        },

        xpReward: {
            type: Number,
            required: true,
            min: 0,
        },

        questions: {
            type: [questionSchema],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length > 0;
                },
                message: "Quiz must contain at least one question.",
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Quiz", quizSchema);