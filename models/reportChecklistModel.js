const mongoose = require('mongoose');

const reportChecklistItemSchema = new mongoose.Schema({
  position: {type: String, required: true},
  checkpoint: {type: String, required: true},
  comment: {type: String, required: true},
  imageBase64: String
});

const reportChecklistSchema = new mongoose.Schema({
  machineName: {type: String, required: true},
  dateChecked: { type: Date, default: Date.now, required: true },
  checkedBy: {type: String, required: true},
  checklist: [reportChecklistItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('reportChecklistModel', reportChecklistSchema);
