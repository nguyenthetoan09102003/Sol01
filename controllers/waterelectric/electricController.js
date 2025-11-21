const Electric = require("../../models/waterelectric/electricModel");

exports.getElectric = (req, res) => {
  // pass existing station codes so the form can offer a datalist for quick selection
  Electric.distinct('stationCode').then(stations => {
    res.render("waterelectric/Form/electricForm", {
      user: res.locals.user,
      activeNav: 'electric',
      title: 'Electric Recording',
      stations
    });
  }).catch(err => {
    console.error('Error fetching stations', err);
    res.render("waterelectric/Form/electricForm", {
      user: res.locals.user,
      activeNav: 'electric',
      title: 'Electric Recording',
      stations: []
    });
  });
};

exports.saveElectric = async (req, res) => {
  const { stationCode, date, electricReading } = req.body;
  try {
    const currentDate = new Date(date);
    const readingNum = Number(electricReading);

    // find last record for this station before currentDate
    const prev = await Electric.findOne({ stationCode, date: { $lt: currentDate } }).sort({ date: -1 }).lean();

    let consumption = null;
    let daysBetween = null;

    if (prev) {
      consumption = readingNum - Number(prev.electricReading);
      const prevDate = new Date(prev.date);
      // calculate days difference (floor of ms / (1000*60*60*24))
      const ms = currentDate.setHours(0,0,0,0) - prevDate.setHours(0,0,0,0);
      daysBetween = Math.round(ms / (1000 * 60 * 60 * 24));
      if (isNaN(daysBetween) || daysBetween < 1) daysBetween = 1;
    }

    const doc = await Electric.create({
      stationCode,
      date: new Date(date),
      electricReading: readingNum,
      consumption,
      daysBetween,
    });

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Save multiple readings in one request. Each item: { stationCode, date, electricReading }
exports.saveMulti = async (req, res) => {
  try {
    const { readings } = req.body; // expect an array
    if (!Array.isArray(readings) || readings.length === 0) {
      return res.status(400).json({ success: false, message: 'No readings provided' });
    }

    // Group readings by stationCode and sort by date ascending for each station
    const byStation = {};
    readings.forEach(r => {
      if (!r.stationCode || !r.date || r.electricReading == null) return;
      const st = r.stationCode;
      byStation[st] = byStation[st] || [];
      byStation[st].push({ date: new Date(r.date), electricReading: Number(r.electricReading) });
    });

    const docsToInsert = [];

    // For each station, fetch the last existing record before the earliest date in this batch
    for (const station of Object.keys(byStation)) {
      const arr = byStation[station].sort((a,b) => a.date - b.date);

      const earliest = arr[0].date;
      let prev = await Electric.findOne({ stationCode: station, date: { $lt: earliest } }).sort({ date: -1 }).lean();
      let prevReading = prev ? Number(prev.electricReading) : null;
      let prevDate = prev ? new Date(prev.date) : null;

      for (const item of arr) {
        const currentReading = item.electricReading;
        const currentDate = item.date;
        let consumption = null;
        let daysBetween = null;
        if (prevReading !== null) {
          consumption = currentReading - prevReading;
          const ms = new Date(currentDate).setHours(0,0,0,0) - new Date(prevDate).setHours(0,0,0,0);
          daysBetween = Math.round(ms / (1000*60*60*24));
          if (isNaN(daysBetween) || daysBetween < 1) daysBetween = 1;
        }

        docsToInsert.push({
          stationCode: station,
          date: currentDate,
          electricReading: currentReading,
          consumption,
          daysBetween,
        });

        // advance prev
        prevReading = currentReading;
        prevDate = currentDate;
      }
    }

    const inserted = await Electric.insertMany(docsToInsert);
    return res.status(200).json({ success: true, inserted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
