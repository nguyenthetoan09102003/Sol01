const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Render Report Page
router.get("/", reportController.getReportPage);

// API: get machines by group
router.get("/machines", reportController.getMachinesByGroup);

// API: search records
router.post("/search", reportController.search);

// API: export CSV
router.get("/export", reportController.exportCsv);

module.exports = router;
