const userModel = require("../models/users");
const { CustomHttpError } = require("../utils/customError");
const catchAsyncError = require("../middleware/catchAsyncError");
const designationModel = require("../models/designations");
const completeSignup = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(
      new CustomHttpError(400, "Confirm password and password does not match")
    );
  }
  const user = await userModel.findOne({ email, is_approved: 0 });
  if (!user) {
    return next(new CustomHttpError(400, "You cannot complete your profile"));
  }
  user.password = password;
  user.is_approved = 1;

  let newPermissions = [];
  for (const ele of user.designations) {
    const role = await designationModel.findById(ele);
    role.permissions.forEach((permission) => {
      newPermissions.push(permission);
    });
  }

  newPermissions.forEach((permission) => {
    user.permissions.push(permission);
  });

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = { completeSignup };
