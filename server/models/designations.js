const mongoose = require("mongoose");
const designationSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, unique: true, require: true },
    permissions: { type: [String], default: [] },
    is_active: { type: Number, default: 1 },
  },
  { timestamps: true }
);
const designationModel = mongoose.model("designations", designationSchema);
module.exports = designationModel;
