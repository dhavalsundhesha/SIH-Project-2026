const router = require("express").Router();
const ctrl = require("../controllers/guardianController");

router.get("/", ctrl.list);
router.post("/", ctrl.create); // seed/admin use

module.exports = router;
