require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/health", (req, res) => res.json({ status: "ok", service: "dharohar-backend" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/guardians", require("./routes/guardians"));
app.use("/api/states", require("./routes/states"));
app.use("/api/artifacts", require("./routes/artifacts"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/missions", require("./routes/missions"));
app.use("/api/awards", require("./routes/awards"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/stories", require("./routes/stories"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
