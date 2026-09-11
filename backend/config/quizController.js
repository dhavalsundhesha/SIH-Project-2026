const Quiz = require("../models/Quiz");

// GET all quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });

        res.json(quizzes);
    } catch (error) {
        console.error("Get quizzes error:", error);

        res.status(500).json({
            message: "Failed to load quizzes",
        });
    }
};


// GET single quiz
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        res.json(quiz);
    } catch (error) {
        console.error("Get quiz error:", error);

        res.status(500).json({
            message: "Failed to load quiz",
        });
    }
};


// CREATE quiz
exports.createQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);

        res.status(201).json(quiz);
    } catch (error) {
        console.error("Create quiz error:", error);

        res.status(500).json({
            message: "Failed to create quiz",
        });
    }
};


// DELETE quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        res.json({
            message: "Quiz deleted successfully",
        });
    } catch (error) {
        console.error("Delete quiz error:", error);

        res.status(500).json({
            message: "Failed to delete quiz",
        });
    }
};