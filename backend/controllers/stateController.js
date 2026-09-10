const State = require("../models/State");
const User = require("../models/User");

exports.list = async (req, res, next) => {
  try {
    res.json(await State.find().sort({ name: 1 }));
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) return res.status(404).json({ message: "State not found" });
    res.json(state);
  } catch (err) { next(err); }
};

// POST /api/states/:id/explore — first-time visit awards XP + unlocks it on the map
exports.explore = async (req, res, next) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) return res.status(404).json({ message: "State not found" });

    const user = await User.findById(req.user._id);
    const alreadyUnlocked = user.unlockedStates.some((s) => String(s) === String(state._id));

    if (!alreadyUnlocked) {
      user.unlockedStates.push(state._id);
      user.xp += state.xpReward;
      user.recomputeLevel();
    }
    user.touchStreak();
    await user.save();

    res.json({ state, xpEarned: alreadyUnlocked ? 0 : state.xpReward, alreadyUnlocked });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await State.create(req.body));
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(state);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await State.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};
