const router = require("express").Router();
const ctrl = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

function optionalAuth(req, res, next) {
  if (!req.headers.authorization) return next();
  return protect(req, res, next);
}


// ===============================
// MITTU AI
// ===============================
router.post("/mittu-chat", optionalAuth, ctrl.mittuChat);


// ===============================
// AI QUIZ GENERATOR
// ===============================
router.post("/quiz", async (req, res) => {
  try {
    const {
      topic,
      difficulty,
      questionCount,
    } = req.body;

    // Validation
    if (!topic || !difficulty || !questionCount) {
      return res.status(400).json({
        message: "topic, difficulty and questionCount are required",
      });
    }

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({
        message: "Difficulty must be Easy, Medium or Hard",
      });
    }

    const count = Number(questionCount);

    if (count < 1 || count > 20) {
      return res.status(400).json({
        message: "Question count must be between 1 and 20",
      });
    }

    console.log("Generating AI Quiz:", {
      topic,
      difficulty,
      questionCount: count,
    });

    // Call Python AI service
    const response = await fetch(
      `${process.env.AI_SERVICE_URL}/quiz/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          difficulty,
          questionCount: count,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("AI Service Error:", data);

      return res.status(response.status).json(data);
    }

    res.json(data);

  } catch (error) {
    console.error("AI Quiz Error:", error);

    res.status(500).json({
      message: "Failed to generate AI quiz",
    });
  }
});


module.exports = router;