const express = require("express");
const router = express.Router();
const queryController = require("../controllers/queryController");

router.get("/", queryController.getQueryPage);


module.exports = router;
