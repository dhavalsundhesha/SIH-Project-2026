const Artifact = require("../models/Artifact");
const User = require("../models/User");

// GET /api/artifacts  (attaches "collected" flag if the caller is authenticated)
exports.list = async (req, res, next) => {
  try {
    const artifacts = await Artifact.find().populate("relatedState", "name");
    if (!req.user) return res.json(artifacts.map((a) => ({ ...a.toObject(), collected: false })));

    const user = await User.findById(req.user._id);
    const collectedSet = new Set(user.collectedArtifacts.map((id) => String(id)));
    res.json(artifacts.map((a) => ({ ...a.toObject(), collected: collectedSet.has(String(a._id)) })));
  } catch (err) { next(err); }
};

// POST /api/artifacts/:id/collect
exports.collect = async (req, res, next) => {
  try {
    const artifact = await Artifact.findById(req.params.id);
    if (!artifact) return res.status(404).json({ message: "Artifact not found" });

    const user = await User.findById(req.user._id);
    const already = user.collectedArtifacts.some((id) => String(id) === String(artifact._id));
    if (already) {
      return res.json({ alreadyCollected: true, xpEarned: 0, totalCollected: user.collectedArtifacts.length });
    }

    user.collectedArtifacts.push(artifact._id);
    user.xp += artifact.xpReward;
    user.recomputeLevel();
    user.touchStreak();
    await user.save();

    res.json({
      alreadyCollected: false,
      xpEarned: artifact.xpReward,
      newLevel: user.level,
      totalCollected: user.collectedArtifacts.length,
    });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await Artifact.create(req.body));
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    res.json(await Artifact.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Artifact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};
