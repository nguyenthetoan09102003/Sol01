const express = require("express");
const router = express.Router();
const waterController = require("../../controllers/waterelectric/waterController");

router.get("/", waterController.getWater);
router.post("/save", waterController.saveWater);
module.exports = router;
