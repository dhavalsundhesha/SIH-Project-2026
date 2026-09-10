const Quiz = require("../models/Quiz");
const User = require("../models/User");

exports.list = async (req, res, next) => {
  try {
    // never leak correctIndex/explanation in the list view
    const quizzes = await Quiz.find().select("title difficulty xpReward relatedState questions").populate("relatedState", "name");
    res.json(quizzes.map((q) => ({
      _id: q._id, title: q.title, difficulty: q.difficulty, xpReward: q.xpReward,
      relatedState: q.relatedState, questionCount: q.questions.length,
    })));
  } catch (err) { next(err); }
};

// GET /api/quiz/:id/play — strips correct answers before sending to the client
exports.play = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({
      _id: quiz._id,
      title: quiz.title,
      xpReward: quiz.xpReward,
      questions: quiz.questions.map((q) => ({ _id: q._id, prompt: q.prompt, options: q.options })),
    });
  } catch (err) { next(err); }
};

// POST /api/quiz/:id/submit  { answers: [{questionId, selectedIndex}] }
exports.submit = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const { answers = [] } = req.body;
    let correctCount = 0;
    const results = quiz.questions.map((q) => {
      const submitted = answers.find((a) => String(a.questionId) === String(q._id));
      const correct = submitted && submitted.selectedIndex === q.correctIndex;
      if (correct) correctCount++;
      return { questionId: q._id, correct, correctIndex: q.correctIndex, explanation: q.explanation };
    });

    const scorePct = Math.round((correctCount / quiz.questions.length) * 100);
    const xpEarned = Math.round((scorePct / 100) * quiz.xpReward);

    const user = await User.findById(req.user._id);
    user.xp += xpEarned;
    user.recomputeLevel();
    user.touchStreak();
    user.quizHistory.push({ quiz: quiz._id, score: correctCount, total: quiz.questions.length });
    await user.save();

    res.json({ correctCount, total: quiz.questions.length, scorePct, xpEarned, newLevel: user.level, results });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await Quiz.create(req.body));
  } catch (err) { next(err); }
};
