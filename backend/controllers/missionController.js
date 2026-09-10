const Mission = require("../models/Mission");
const User = require("../models/User");

exports.list = async (req, res, next) => {
  try {
    const missions = await Mission.find().populate("relatedState", "name");
    if (!req.user) return res.json(missions.map((m) => ({ ...m.toObject(), completed: false })));

    const user = await User.findById(req.user._id);
    const doneSet = new Set(user.completedMissions.map((id) => String(id)));
    res.json(missions.map((m) => ({ ...m.toObject(), completed: doneSet.has(String(m._id)) })));
  } catch (err) { next(err); }
};

// POST /api/missions/:id/complete
exports.complete = async (req, res, next) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ message: "Mission not found" });

    const user = await User.findById(req.user._id);
    const already = user.completedMissions.some((id) => String(id) === String(mission._id));
    if (already) return res.json({ alreadyCompleted: true, xpEarned: 0 });

    user.completedMissions.push(mission._id);
    user.xp += mission.xpReward;
    user.recomputeLevel();
    user.touchStreak();
    await user.save();

    res.json({ alreadyCompleted: false, xpEarned: mission.xpReward, newLevel: user.level });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await Mission.create(req.body));
  } catch (err) { next(err); }
};
