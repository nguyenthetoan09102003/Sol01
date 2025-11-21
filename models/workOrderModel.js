// models/workOrderModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ĐÚNG: Dùng Schema con
const specificationsSchema = new Schema({
  itemType: { type: String, default: 'ES - Elect. Switboard' },
  manufacturer: { type: String },
  model: { type: String },
  serialNo: { type: String },
  year: { type: String },
  standards: { type: String },
  certificateNo: { type: String },
  loc: { type: String },
  type: { type: String },
  material: { type: String },
  dimensions: { type: String },
  weight: { type: String },
  nominalPower: { type: String },
  energyType: { type: String },
  ipClass: { type: String },
  insulClass: { type: String }
}, { _id: false });

const operationalDataSchema = new Schema({
  recordH: { type: Number, default: 0 },
  usefulLife: { type: Number, default: 0 },
  investment: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  fmd: { type: Number, default: 0 },
  lastRecH: { type: Number, default: 0 },
  lastRecDate: { type: Date }
}, { _id: false });

const codingSchema = new Schema({
  type: { type: String },
  structuredCode: { type: String },
  vehicleId: { type: String },
  mmeCode: { type: String },
  userCode1: { type: String },
  userCode2: { type: String },
  plant: { type: String },
  criticality: { type: String, default: 'Highly Critical' }
}, { _id: false });

const otherInfoSchema = new Schema({
  family: { type: String },
  fuel: { type: String }
}, { _id: false });

const workOrderSchema = new Schema({
  itemCode: { type: String, required: true, default: 'ES-0000' },
  itemName: { type: String, default: 'Main Electrical Switchboard (MODEL)' },
  system: { type: String, default: '09.03 - Electrical Distribution' },
  costCenter: { type: String, default: '9999 - Organization "Model"' },
  operator: { type: String },
  since: { type: Date },
  supplier: { type: String },
  date: { type: Date, default: Date.now },

  operationalData: { type: operationalDataSchema, default: {} },
  specifications: { type: specificationsSchema, default: {} },
  coding: { type: codingSchema, default: {} },
  otherInfo: { type: otherInfoSchema, default: {} },

  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('WorkOrder', workOrderSchema);