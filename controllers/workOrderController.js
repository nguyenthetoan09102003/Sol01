const WorkOrder = require("../models/workOrderModel");
const generatePDF = require("../utils/generatePdf");
const path = require("path");

const getAll = async (req, res) => {
  const workOrders = await WorkOrder.find();
  res.render("workOrder/list", { workOrders , activeNav: 'list',
      title : 'workOrders'});
};

const getNew = (req, res) => {
  res.render("workOrder/new", { activeNav: 'new', title: 'new' });
};

const moment = require('moment'); // ← ĐÃ CÓ

const previewPDF = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (!workOrder) return res.status(404).send('Not found');
    
    res.render('workOrder/pdfTemplate', { 
      workOrder, 
      moment // ← truyền moment vào EJS
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const create = async (req, res) => {
  try {
    const imagePath = req.file ? "/uploads/" + req.file.filename : null;
    const workOrder = new WorkOrder({
      ...req.body,
      image: imagePath ? path.join("public", imagePath) : null,
    });
    await workOrder.save();
    res.redirect("/workorders");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getDetail = async (req, res) => {
  const workOrder = await WorkOrder.findById(req.params.id);
  res.render("workOrder/detail", { workOrder });
};

const exportPDF = async (req, res) => {
  const workOrder = await WorkOrder.findById(req.params.id);
  if (!workOrder) return res.status(404).send("Not found");
  await generatePDF(workOrder, res);
};

module.exports = { getAll, getNew, create, getDetail, exportPDF , previewPDF };
