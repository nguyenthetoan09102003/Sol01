const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    stationCode: { type: String, required: true },
    waterRecording: { type: Number, required: true },
    createdAt: Date,
});

module.exports = mongoose.model('Water', waterSchema);
