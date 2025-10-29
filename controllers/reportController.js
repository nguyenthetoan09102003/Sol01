const Checklist = require("../models/checklistModel");

// Base on documents structure, define groups to machines mapping
const GROUP_TO_MACHINES = {
  group1: ["PD1","PD2"],
  group2: ["PS2", "PS3", "PB1", "PB2"],
  group3: ["PM1", "PM2", "PM3", "PM4", "PM5", "PM6","PP1","PT1","PT2","PT3","PT4","PT5",
    "PR1", "PR2", "PR3","PR4","PR5","PR6","PC1","PC2","PC3","PC4","PC5"
  ],
  group4: ["PE2","PE3","PV1","PV2"]
};

// Render Report Page
exports.getReportPage = (req, res) => {
  res.render('report', 
    { user: res.locals.user,
      activeNav: 'report'
     });
};

// Create API to get machines by group : http://localhost:3000/report/machines?group=group1
exports.getMachinesByGroup = (req, res) => {
  const group = (req.query.group || "").trim();
  const machines = group && GROUP_TO_MACHINES[group] ? GROUP_TO_MACHINES[group] : [];
  res.json({ success: true, machines });
};

// Handle Query Search
exports.search = async (req, res) => {
  try {
    const { group, machineName, dateFrom, dateTo } = req.body || {};
    const filter = {};

    //1: Machine filter
    if (machineName) {
      filter.machineName = machineName;
    } 
    //2: Group filter
    else if (group && GROUP_TO_MACHINES[group]) {
      filter.machineName = { $in: GROUP_TO_MACHINES[group] };
    }
    //3: Date filter
    if (dateFrom || dateTo) {
      filter.dateChecked = {};
      if (dateFrom) filter.dateChecked.$gte = new Date(dateFrom);
      if (dateTo) filter.dateChecked.$lte = new Date(dateTo);
    }

    //Query Monogo Database
    const results = await Checklist.find(filter)
          .sort({ dateChecked: -1 }) 
          .lean(); 
    
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("Search API error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Handle Export CSV
exports.exportCsv = async (req, res) => {
  try {
    const { group, machineName, dateFrom, dateTo } = req.query || {};
    const filter = {};

    //1: Machine filter
    if (machineName) {
      filter.machineName = machineName;
    } 
    //2: Group filter
    else if (group && GROUP_TO_MACHINES[group]) {
      filter.machineName = { $in: GROUP_TO_MACHINES[group] };
    }

    //3: Date filter
    if (dateFrom || dateTo) {
      filter.dateChecked = {};
      if (dateFrom) filter.dateChecked.$gte = new Date(dateFrom);
      if (dateTo) filter.dateChecked.$lte = new Date(dateTo);
    }

    //Query MongoDB
    const results = await Checklist.find(filter)
      .sort({ dateChecked: -1 })
      .lean();

    //Create CSV file content
    const header = ["Date", "Machine", "Checked By", "Position", "Checkpoint", "Comment"];
    const csvLines = [header.join(",")];

    results.forEach(item => {
      const dateStr = item.dateChecked ? new Date(item.dateChecked).toISOString() : "";
      const checklist = item.checklist || [];
      if (checklist.length === 0) {
        //If don't have checklist, write a single line
        csvLines.push([dateStr, item.machineName || "", item.checkedBy || "", "", "", ""]
          .map(v => `"${v}"`).join(","));
      } else {
        //If have checklist, write multiple lines
        checklist.forEach(c => {
          const line = [
            dateStr,
            item.machineName || "",
            item.checkedBy || "",
            c.position || "",
            c.checkpoint || "",
            (c.comment || "").replace(/\n|\r/g, " ") 
          ];
          csvLines.push(line.map(v => `"${v}"`).join(","));
        });
      }
    });

    //Send CSV file to client
    
    //Pretty filename
    const now = new Date();
    const pad = n => n.toString().padStart(2, "0");

    const filename = `CHECKLIST_${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}.csv`;

    const csvContent = "\uFEFF" + csvLines.join("\n"); // Add BOM for UTF-8
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (err) {
    console.error("Export CSV error:", err);
    res.status(500).send("Export failed");
  }
};
