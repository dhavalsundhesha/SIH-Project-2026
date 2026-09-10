const router = require("express").Router();
const ctrl = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

function optionalAuth(req, res, next) {
  if (!req.headers.authorization) return next();
  return protect(req, res, next);
}

router.post("/mittu-chat", optionalAuth, ctrl.mittuChat);

module.exports = router;
