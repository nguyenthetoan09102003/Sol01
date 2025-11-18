const Assignment = require('../models/assignmentModel');
const ExcelJS = require('exceljs');

exports.getQueryPage = async (req, res) => {
  const members = await Assignment.distinct('members');
  console.log(members);
  const machines = await Assignment.distinct('machine');
  console.log(machines);
  const shifts = ['morning', 'evening']; 
  res.render('queryassignment', { 
    results: null, 
    filters: {}, 
    members, 
    machines, 
    shifts,
    user: res.locals.user,
      activeNav: 'queryAssignments',
      title : 'Query Assignments' 
 });
};

exports.filterAssignments = async (req, res) => {
  try {
    const { fromDate, toDate, member, machine, shift } = req.query;
    const query = {};

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    // Filter member from array members field
    if (member && member !== '-- Tất cả --') {
      query.members = member;
    }

    console.log("Query:", JSON.stringify(query, null, 2));
    if (machine && machine !== '-- Tất cả --') query.machine = machine;
    if (shift && shift !== '-- Tất cả --') query.shift = shift;


    const results = await Assignment.find(query).sort({ date: -1 }).lean();

    const members = await Assignment.distinct('members');
    const machines = await Assignment.distinct('machine');
    const shifts = ['morning', 'evening'];

    res.render('queryassignment', { 
      results, 
      filters: { fromDate, toDate, member, machine, shift }, 
      members, 
      machines, 
      shifts,
      user: res.locals.user,
      activeNav: 'queryAssignments',
      title : 'Query Assignments' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi truy vấn dữ liệu');
  }
};

// Export Excel based on filters
exports.exportFilteredExcel = async (req, res) => {
  try {
    const { fromDate, toDate, member, machine, shift } = req.query;
    const query = {};

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    if (member) query.members = member;
    if (machine) query.machine = machine;
    if (shift) query.shift = shift;

    const results = await Assignment.find(query).sort({ date: -1 }).lean();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Filtered Data');

    sheet.columns = [
      { header: 'Ngày', key: 'date', width: 15 },
      { header: 'Ca', key: 'shift', width: 10 },
      { header: 'Thành viên', key: 'member', width: 20 },
      { header: 'Máy', key: 'machine', width: 15 },
      { header: 'Công việc', key: 'task', width: 60 },
    ];

    results.forEach(r => {
    r.members.forEach(m => {
    if (!member || member === m) { 
      sheet.addRow({
        date: new Date(r.date).toLocaleDateString('vi-VN'),
        shift: r.shift === 'morning' ? 'Sáng' : 'Tối',
        member: m,
        machine: r.machine,
        task: r.task,
      });
    }
  });
    });


    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=FilteredAssignments.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi xuất Excel');
  }
};
