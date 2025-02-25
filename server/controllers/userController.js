const userModel = require("../models/users");
const { CustomHttpError } = require("../utils/customError");
const catchAsyncError = require("../middleware/catchAsyncError");
const { use } = require("../routes/userRoutes");

const completeSignup = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(
      new CustomHttpError(400, "Confirm password and password does not match")
    );
  }
  console.log(email);
  const user = await userModel.findOne({ email });
  console.log(user);
  if (!user) {
    return next(new CustomHttpError(400, "You cannot complete your profile"));
  }
  user.password = password;
  user.is_approved = 1;
  await user.save();
  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = { completeSignup };
