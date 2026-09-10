const router = require("express").Router();
const ctrl = require("../controllers/stateController");
const { protect } = require("../middleware/auth");

router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);
router.post("/:id/explore", protect, ctrl.explore);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
