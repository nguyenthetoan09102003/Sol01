const Water = require("../../models/waterelectric/waterModel");

exports.getWaterQuery = async (req, res) => {
  try {
    // If AJAX/JSON requested, return filtered rows
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      const filter = {};
      if (req.query.from) filter.date = { $gte: new Date(req.query.from) };
      if (req.query.to) filter.date = filter.date || {}; if (req.query.to) filter.date.$lte = new Date(req.query.to);
      if (req.query.stationCode) filter.stationCode = req.query.stationCode;

      const rows = await Water.find(filter).lean().sort({ date: -1 });
      return res.json(rows);
    }

    // Otherwise render the query page
    res.render("waterelectric/Query/waterQuery", {
      user: res.locals.user,
      activeNav: 'queryWater',
      title: 'Water Query'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
