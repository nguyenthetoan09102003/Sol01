const Water = require("../../models/waterelectric/waterModel");

exports.getWater = (req, res) => {
    res.render("waterelectric/Form/waterForm",
    { 
      user: res.locals.user,
      activeNav: 'Water',
      title : 'Water Recording'
    });
};

exports.saveWater = async (req, res) => {
    const { stationCode, date, waterRecording } = req.body;
    try {
        await Water.create({
            stationCode,
            date: new Date(date),
            waterRecording: Number(waterRecording),
        });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

