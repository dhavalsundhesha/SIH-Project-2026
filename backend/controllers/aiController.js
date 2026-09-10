const axios = require("axios");

const AI = () => axios.create({ baseURL: process.env.AI_SERVICE_URL, timeout: 30000 });

// POST /api/ai/mittu-chat  { message, history }
// "Mittu AI" — the friendly in-app guide/mascot students can chat with.
exports.mittuChat = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ message: "message is required" });

    const { data } = await AI().post("/mittu-chat", {
      message,
      history: history || [],
      guardian_type: req.user?.guardianType || null,
    });
    res.json(data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({ message: err.response.data?.detail || "Mittu AI failed to respond" });
    }
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      return res.status(503).json({ message: "Mittu AI service is unavailable right now." });
    }
    next(err);
  }
};
