const userModel = require("../models/users");
const { CustomHttpError } = require("../utils/customError");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const mongoose = require("mongoose");
const designationModel = require("../models/designations");

const addDesignation = catchAsyncErrors(async (req, res, next) => {
  const { designation } = req.body;
  if (!designation) {
    return next(new CustomHttpError(400, "Please write designation"));
  }
  const des = new designationModel({ name: designation });
  await des.save();
  res.status(200).json({
    success: true,
  });
});

module.exports = {
  addDesignation,
};
