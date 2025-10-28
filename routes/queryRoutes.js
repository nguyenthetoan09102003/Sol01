const express = require("express");
const router = express.Router();
const queryController = require("../controllers/queryController");

router.get("/", queryController.getQueryPage);

// API: get machines by group
router.get("/machines", queryController.getMachinesByGroup);

// API: search records
router.post("/search", queryController.search);

// API: export CSV
router.get("/export", queryController.exportCsv);


module.exports = router;
