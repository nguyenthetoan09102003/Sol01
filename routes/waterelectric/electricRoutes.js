const express = require("express");
const router = express.Router();
const electricController = require("../../controllers/waterelectric/electricController");
const electricQueryController = require("../../controllers/waterelectric/electricQueryController");

router.get("/", electricController.getElectric);
router.post("/save", electricController.saveElectric);
router.post("/save-multi", electricController.saveMulti);
router.get("/query", electricQueryController.getElectricQuery);

module.exports = router;
