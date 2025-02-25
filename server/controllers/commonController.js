const userModel = require("../models/users");
const { CustomHttpError } = require("../utils/customError");
const catchAsyncError = require("../middleware/catchAsyncError");
const { sendEmail } = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { randomBytes } = require("crypto");

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomHttpError(400, "Invalid Credentials"));
  }
  let isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return next(new CustomHttpError(401, "Invalid Credentials"));
  }
  sendToken(user, 200, res);
});

module.exports = {
  login,
};
