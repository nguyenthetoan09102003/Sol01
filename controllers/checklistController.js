const Checklist = require('../models/checklistModel');
exports.getChecklist = (req, res) => {
  res.render('checklist', 
    { user: res.locals.user,
      activeNav: 'checklist',
      title : 'Checklist'
     });
};


exports.saveData = async (req, res) => {
  try {
    let { dateChecked, machineName, checkedBy, checklist } = req.body;

    // If client submitted form-urlencoded inputs named "comment",
    // bodyParser will produce req.body.comment (string or array).
    // Normalize into checklist array of objects when checklist not present.
    if (!checklist) {
      const comments = req.body.comment;
      if (comments) {
        const arr = Array.isArray(comments) ? comments : [comments];
        checklist = arr.map(c => ({ comment: (c || "").trim() }));
      } else {
        checklist = [];
      }
    }

    const newChecklist = new Checklist({
      machineName: machineName,
      dateChecked,
      checkedBy: checkedBy,
      checklist: checklist
    });

    await newChecklist.save();

    res.status(200).json({
      success: true,
      message: "Checklist saved successfully"
    });
  } catch (err) {
    console.error("Error saving checklist:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error saving checklist: " + err.message 
    });
  }
};