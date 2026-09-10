const router = require("express").Router();
const ctrl = require("../controllers/artifactController");
const { protect } = require("../middleware/auth");

// optional auth: attach req.user if a token is present, but don't block guests browsing
function optionalAuth(req, res, next) {
  if (!req.headers.authorization) return next();
  return protect(req, res, next);
}

router.get("/", optionalAuth, ctrl.list);
router.post("/:id/collect", protect, ctrl.collect);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
