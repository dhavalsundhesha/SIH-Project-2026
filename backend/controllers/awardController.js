const Award = require("../models/Award");
const User = require("../models/User");

exports.list = async (req, res, next) => {
  try {
    const awards = await Award.find();
    if (!req.user) return res.json(awards.map((a) => ({ ...a.toObject(), unlocked: false })));

    const user = await User.findById(req.user._id);
    const unlockedSet = new Set(user.awards.map((id) => String(id)));
    res.json(awards.map((a) => ({ ...a.toObject(), unlocked: unlockedSet.has(String(a._id)) })));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await Award.create(req.body));
  } catch (err) { next(err); }
};
