const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, trim: true },
    email: { type: String, trim: true, unique: true },
    password: { type: String, select: false },
    is_active: { type: Number, default: 1 },
    role: { type: String, default: "user" },
    designation: { type: mongoose.SchemaTypes.ObjectId, ref: "designations" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
