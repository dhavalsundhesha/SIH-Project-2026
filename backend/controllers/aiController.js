exports.mittuChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const response = await fetch(
      `${process.env.AI_SERVICE_URL}/mittu/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Mittu AI Service Error:", data);

      return res.status(response.status).json(data);
    }

    return res.json(data);

  } catch (error) {

    console.error("Mittu Chat Error:", error);

    return res.status(500).json({
      message: "Failed to generate Mittu response",
    });
  }
};