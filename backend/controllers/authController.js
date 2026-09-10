const User = require("../models/User");
const generateToken = require("../utils/generateToken");

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isGuest: user.isGuest,
    guardianType: user.guardianType,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    stats: user.stats,
  };
}

// POST /api/auth/register  { name, email, password }
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "That email is already registered" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
};

// POST /api/auth/login  { email, password }
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: generateToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
};

// POST /api/auth/guest  { name }
// "Continue as Guest" — creates a real (but tagged) user so progress still saves.
exports.guest = async (req, res, next) => {
  try {
    const name = req.body.name?.trim() || `Guardian${Math.floor(1000 + Math.random() * 9000)}`;
    const user = await User.create({ name, isGuest: true });
    res.status(201).json({ token: generateToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
};

// GET /api/auth/me
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("unlockedStates", "name icon")
      .populate("collectedArtifacts", "name icon rarity")
      .populate("awards", "name icon");
    res.json(user);
  } catch (err) { next(err); }
};

// PUT /api/auth/guardian  { guardianType }
// "Choose Your Guardian" screen — sets the type and seeds base stats.
exports.chooseGuardian = async (req, res, next) => {
  try {
    const GuardianType = require("../models/Guardian");
    const { guardianType } = req.body;
    const type = await GuardianType.findOne({ key: guardianType });
    if (!type) return res.status(400).json({ message: "Unknown guardian type" });

    const user = await User.findById(req.user._id);
    user.guardianType = guardianType;
    user.stats = type.baseStats;
    await user.save();

    res.json(publicUser(user));
  } catch (err) { next(err); }
};
