
const reportChecklistModel = require("../models/reportChecklistModel");

exports.getReportChecklist = (req, res) => {
  res.render('reportChecklist', 
    { user: res.locals.user,
      activeNav: 'Report Checklist',
      title: 'Report Checklist'
     });
};

exports.saveReportChecklist = async (req, res) => {
    try {
        const { machineName, dateChecked, checkedBy, checklist } = req.body;
        
        // console.log("Received body:", req.body);

        const parsedDate = dateChecked ? new Date(dateChecked) : new Date();
        const parsedChecklist = Array.isArray(checklist) ? checklist : JSON.parse(checklist || '[]');
        
        const filteredChecklist = parsedChecklist.filter(item =>
            item.position && item.checkpoint &&  (item.comment && item.comment.trim()) || item.imageBase64
        );
        const newReportChecklist = new reportChecklistModel({
            machineName,
            checkedBy,
            dateChecked: parsedDate,
            checklist: filteredChecklist
        });
        await newReportChecklist.save();
        return res.status(200).json({
        success: true,
        message: "Checklist saved successfully",
        id: newReportChecklist._id
        });

    } catch (error) {
        console.error('Error saving checklist:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.listReportChecklists = async (req, res) => {
  try {
    // Lấy tất cả checklist, sắp xếp theo dateChecked giảm dần
    const checklists = await reportChecklistModel.find({})
      .sort({ dateChecked: -1 })
      .lean(); // lean() trả về plain object cho EJS dễ dùng

    res.render('reportChecklistList', {
      title: 'Danh sách Checklist',
      checklists
    });
  } catch (error) {
    console.error('Error fetching checklists:', error);
    res.status(500).send('Error fetching checklists');
  }
};