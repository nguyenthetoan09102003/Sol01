const express = require("express");
const router = express.Router();
const reportChecklistController = require("../controllers/reportChecklistController");

router.get("/", reportChecklistController.getReportChecklist);
router.post('/save', reportChecklistController.saveReportChecklist);
router.get("/list", reportChecklistController.listReportChecklists);

module.exports = router;
