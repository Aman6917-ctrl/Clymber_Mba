// models/IIM.js
const mongoose = require("mongoose");

const CutoffSchema = new mongoose.Schema({
  category: String,        // GEN, OBC, SC, ST, EWS, PWD
  gender: String,          // male / female / Female_TG / any
  VARC: { type: Number, default: null },
  DILR: { type: Number, default: null },
  QA: { type: Number, default: null },
  OVERALL: { type: Number, default: null },
  class10: { type: Number, default: null },
  class12: { type: Number, default: null },
  graduation: { type: Number, default: null },
  note: String             // Optional notes about this cutoff
}, { _id: false });

const IIMSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  processType: String,          // CAP / NON_CAP
  cutoffs: [CutoffSchema],      // Stage-1 eligibility

  finalWeights: { type: Object, default: {} },         // CAT, PI, Academics, WorkEx, etc.
  academicsRules: { type: Object, default: {} },       // 10th/12th/UG slabs
  workexRules: { type: Object, default: {} },          // slabs OR formulas
  diversityRules: { type: Object, default: {} },       // gender / academic / trailblazer
  notes: [String],              // disclaimers
  source: String                // Official / Baseline
}, { timestamps: true });

module.exports = mongoose.model("IIM", IIMSchema);
