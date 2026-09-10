const Story = require("../models/Story");
const User = require("../models/User");

exports.list = async (req, res, next) => {
  try {
    const stories = await Story.find().select("title coverIcon era relatedState xpReward").populate("relatedState", "name");
    res.json(stories);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id).populate("relatedState", "name");
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (err) { next(err); }
};

// POST /api/stories/:id/read — small XP reward for reading, once per story
exports.markRead = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    const user = await User.findById(req.user._id);
    user.xp += story.xpReward;
    user.recomputeLevel();
    user.touchStreak();
    await user.save();
    res.json({ xpEarned: story.xpReward, newLevel: user.level });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await Story.create(req.body));
  } catch (err) { next(err); }
};
