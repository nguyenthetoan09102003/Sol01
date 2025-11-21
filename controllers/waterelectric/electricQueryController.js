// Simple placeholder query controller for electric readings
const Electric = require("../../models/waterelectric/electricModel");

exports.getElectricQuery = async (req, res) => {
  try {
    // Today: simple render. You can extend with query parameters later.
    // If request is AJAX with query params, return JSON results
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      const filter = {};
      if (req.query.from) filter.date = { $gte: new Date(req.query.from) };
      if (req.query.to) filter.date = filter.date || {}; if (req.query.to) filter.date.$lte = new Date(req.query.to);
      if (req.query.stationCode) filter.stationCode = req.query.stationCode;
      const rows = await Electric.find(filter).lean().sort({ date: -1 });
      return res.json(rows);
    }

    // also pass distinct station codes so view can render machine list
    const stations = await Electric.distinct('stationCode');
    res.render("waterelectric/Query/electricQuery", {
      user: res.locals.user,
      activeNav: 'queryElectric',
      title: 'Electric Query',
      stations
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
