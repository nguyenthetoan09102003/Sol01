const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema({
    position: String,
    checkpoint: String,
    comment: String
});

const checklistSchema = new mongoose.Schema({
    machineName: String,
    dateChecked: Date,
    checkedBy: String,
    checklist: [checklistItemSchema]
}, { timestamps: true });

module.exports = mongoose.model("Checklist", checklistSchema);
