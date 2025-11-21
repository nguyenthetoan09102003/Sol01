const express = require("express");
const router = express.Router();
const checklistController = require("../controllers/checklistController");
const { requireAuth } = require('../middleware/authMiddleware');
const Checklist = require("../models/checklistModel"); 


router.get("/", requireAuth, checklistController.getChecklist);


router.post("/", requireAuth, checklistController.saveData);


module.exports = router;
