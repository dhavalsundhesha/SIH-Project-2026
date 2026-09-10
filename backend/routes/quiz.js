const router = require("express").Router();
const ctrl = require("../controllers/quizController");
const { protect } = require("../middleware/auth");

router.get("/", ctrl.list);
router.get("/:id/play", ctrl.play);
router.post("/:id/submit", protect, ctrl.submit);
router.post("/", ctrl.create);

module.exports = router;
