const express = require("express");
const router = express.Router();
const waterController = require("../../controllers/waterelectric/waterController");
const waterQueryController = require("../../controllers/waterelectric/waterQueryController");

router.get("/", waterController.getWater);
router.post("/save", waterController.saveWater);
router.get("/query", waterQueryController.getWaterQuery);

module.exports = router;
