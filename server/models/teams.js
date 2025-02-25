const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    is_active: { type: Number, default: 1 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    permissions: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teams", teamSchema);
