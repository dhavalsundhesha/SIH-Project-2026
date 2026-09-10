const Guardian = require("../models/Guardian");

exports.list = async (req, res) => {
  try {
    const guardians = await Guardian.find().sort({ createdAt: 1 });

    res.json(guardians);
  } catch (error) {
    console.error("Guardian list error:", error);
    res.status(500).json({
      message: "Failed to load guardians",
    });
  }
};

exports.create = async (req, res) => {
  try {
    const guardian = await Guardian.create(req.body);

    res.status(201).json(guardian);
  } catch (error) {
    console.error("Guardian create error:", error);
    res.status(500).json({
      message: "Failed to create guardian",
    });
  }
};