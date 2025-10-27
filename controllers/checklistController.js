const Checklist = require('../models/checklistModel');
exports.getChecklist = (req, res) => {
  res.render('checklist', 
    { user: res.locals.user,
      activeNav: 'checklist'
     });
};

exports.saveData = async (req, res) => {
  try {
    const { dateChecked, machineName, checkedBy, checklist } = req.body;

    const checklistArray = Array.isArray(checklist) ? checklist : [];

    const newChecklist = new Checklist({
      machineName: machineName,
      dateChecked,
      checkedBy: checkedBy,
      checklist: checklistArray
    });

    await newChecklist.save();

    res.status(200).json({
      success: true,
      message: "Checklist saved successfully!"
    });
  } catch (err) {
    console.error("Error saving checklist:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error saving checklist: " + err.message 
    });
  }
};