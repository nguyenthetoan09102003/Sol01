const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    machineName: {
        type: String,
        required: true
    },
    dateChecked: Date,  // Date from the checklist
    checkedBy: String,  // Who checked
    position: String,
    checkpoint: String,
    comment: String,
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
    },
    completedDate: Date,
    resolvedBy: String,
    resolvedNote: String
}, { timestamps: true });

module.exports = mongoose.model("Todo", todoSchema);

