const userModel = require("../models/users");
const teamModel = require("../models/teams");
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
  if (user.is_active == 0) {
    return next(new CustomHttpError(400, "User is inactive"));
  }
  user.password = password;
  user.is_approved = 1;
  let allPermissions = [...user.permissions];
  for (const designationId of user.designations) {
    const role = await designationModel.findById(designationId);
    allPermissions = allPermissions.concat(role.permissions);
  }
  for (const teamId of user.teams) {
    const team = await teamModel.findById(teamId);
    allPermissions = allPermissions.concat(team.permissions);
  }

  allPermissions.forEach((permission) => {
    user.permissions.push(permission);
  });

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = { completeSignup };
