const userModel = require("../models/users");
const { CustomHttpError } = require("../utils/customError");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const designationModel = require("../models/designations");
const { sendEmail } = require("../utils/sendMail");
const catchAsyncError = require("../middleware/catchAsyncError");

const registerUser = catchAsyncError(async (req, res, next) => {
  const { email, fullname, permissions, designations } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return next(new CustomHttpError(400, "User with this mail already exsts"));
  }
  // const password = randomBytes(5).toString("hex");
  const newUser = new userModel({ email, fullname, permissions, designations });
  await newUser.save();
  const link = `http://localhost:3000/setPassword?user=${newUser._id}`;
  const message = `Please set your password by clicking upon this link: \n\n ${link}`;
  await sendEmail({
    email,
    subject: "Complete signup process",
    message,
  });
  res.status(200).json({
    success: true,
    data: newUser,
  });
});

const addDesignation = catchAsyncErrors(async (req, res, next) => {
  const { name, permissions } = req.body;
  if (!name) {
    return next(new CustomHttpError(400, "Please write designation"));
  }
  if (permissions.length <= 0) {
    return next(new CustomHttpError(400, "Please write permissions"));
  }
  const des = new designationModel({ name, permissions });
  await des.save();
  res.status(200).json({
    success: true,
  });
});

const editDesignation = catchAsyncError(async (req, res, next) => {
  const { name, permissions, designationId } = req.body;
  const designation = await designationModel.findById(designationId);
  designation.name = name;
  designation.permissions = permissions;
  await designation.save();
  res.status(200).json({
    success: true,
  });
});

const deleteDesignation = catchAsyncError(async (req, res, next) => {
  const { designationId } = req.body;
  const designation = await designationModel.findById(designationId);
  designation.is_active = 0;
  await designation.save();
  res.status(200).json({
    success: true,
  });
});

const getDesignations = catchAsyncError(async (req, res, next) => {
  const designations = await designationModel.find({ is_active: 1 });
  res.status(200).json({
    success: true,
    data: designations,
  });
});

module.exports = {
  addDesignation,
  registerUser,
  editDesignation,
  deleteDesignation,
  getDesignations,
};
