const router = require("express").Router();
const ctrl = require("../controllers/awardController");
const { protect } = require("../middleware/auth");

function optionalAuth(req, res, next) {
  if (!req.headers.authorization) return next();
  return protect(req, res, next);
}

router.get("/", optionalAuth, ctrl.list);
router.post("/", ctrl.create);

module.exports = router;
