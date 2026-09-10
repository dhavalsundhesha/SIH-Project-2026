const router = require("express").Router();
const ctrl = require("../controllers/storyController");
const { protect } = require("../middleware/auth");

router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);
router.post("/:id/read", protect, ctrl.markRead);
router.post("/", ctrl.create);

module.exports = router;
