const mongoose = require('mongoose');

const electricSchema = new mongoose.Schema({
	date: { type: Date, required: true },
	stationCode: { type: String, required: true },
	electricReading: { type: Number, required: true },
	// computed consumption (kWh) between this record and previous record for the same station
	consumption: { type: Number, default: null },
	// number of days between this record and previous record (1 = consecutive)
	daysBetween: { type: Number, default: null },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Electric', electricSchema);

