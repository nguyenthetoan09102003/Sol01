const Checklist = require("../models/checklistModel");

const GROUP_TO_MACHINES = {
  group1: ["PD1"],
  group2: ["PB1", "PC3", "PC4", "PR1", "PR2", "PR3", "PR4", "PR5", "PR6", "PP1"],
  group3: ["PM1", "PM2", "PM3", "PM4", "PM5", "PM6"],
  group4: ["PE1"]
};

exports.getQueryPage = (req, res) => {
  res.render('query', 
    { user: res.locals.user,
      activeNav: 'query'
     });
};

exports.getMachinesByGroup = (req, res) => {
  const group = (req.query.group || "").trim();
  const machines = group && GROUP_TO_MACHINES[group] ? GROUP_TO_MACHINES[group] : [];
  res.json({ success: true, machines });
};

exports.search = async (req, res) => {
  try {
    const { group, machineName, dateFrom, dateTo } = req.body || {};

    const machinesFilter = group && GROUP_TO_MACHINES[group] ? GROUP_TO_MACHINES[group] : undefined;

    const match = {};
    if (machineName) {
      match.machineName = machineName;
    } else if (machinesFilter && machinesFilter.length > 0) {
      match.machineName = { $in: machinesFilter };
    }

    if (dateFrom || dateTo) {
      match.dateChecked = {};
      if (dateFrom) match.dateChecked.$gte = new Date(dateFrom);
      if (dateTo) match.dateChecked.$lte = new Date(dateTo);
    }

    const pipeline = [
      { $match: match },
      { $unwind: { path: "$checklist", preserveNullAndEmptyArrays: true } },
      { $project: {
          _id: 0,
          machineName: 1,
          dateChecked: 1,
          checkedBy: 1,
          position: "$checklist.position",
          checkpoint: "$checklist.checkpoint",
          comment: "$checklist.comment"
        }
      },
      { $sort: { dateChecked: -1 } }
    ];

    const rows = await Checklist.aggregate(pipeline).exec();
    res.json({ success: true, rows });
  } catch (err) {
    console.error("Query search error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.exportCsv = async (req, res) => {
  try {
    const { group, machineName, dateFrom, dateTo } = req.query || {};

    const machinesFilter = group && GROUP_TO_MACHINES[group] ? GROUP_TO_MACHINES[group] : undefined;

    const match = {};

    if (machineName) {
      match.machineName = machineName;
    } else if (machinesFilter && machinesFilter.length > 0) {
      match.machineName = { $in: machinesFilter };
    }

    if (dateFrom || dateTo) {
      match.dateChecked = {};
      if (dateFrom) match.dateChecked.$gte = new Date(dateFrom);
      if (dateTo) match.dateChecked.$lte = new Date(dateTo);
    }

    const pipeline = [
      { $match: match },
      { $unwind: { path: "$checklist", preserveNullAndEmptyArrays: true } },
      { $project: {
          _id: 0,
          machineName: 1,
          dateChecked: 1,
          checkedBy: 1,
          position: "$checklist.position",
          checkpoint: "$checklist.checkpoint",
          comment: "$checklist.comment"
        }
      },
      { $sort: { dateChecked: -1 } }
    ];

    const rows = await Checklist.aggregate(pipeline).exec();

    const header = ["Date", "Machine", "Checked By", "Position", "Checkpoint", "Comment"];
    const csvLines = [header.join(",")];
    for (const r of rows) {
      const d = r.dateChecked ? new Date(r.dateChecked) : null;
      const dateStr = d ? d.toISOString() : "";
      const fields = [
        dateStr,
        r.machineName || "",
        r.checkedBy || "",
        r.position || "",
        r.checkpoint || "",
        (r.comment || "").replace(/\n|\r/g, " ").replace(/"/g, '""')
      ];
      const line = fields.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(",");
      csvLines.push(line);
    }

    const filename = `checklist_export_${Date.now()}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(csvLines.join("\n"));
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).send("Export failed");
  }
};
