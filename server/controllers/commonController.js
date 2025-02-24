const userModel = require("../models/users");
const { CustomHttpError } = require("../utils/customError");
const catchAsyncError = require("../middleware/catchAsyncError");
const { sendEmail } = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { randomBytes } = require("crypto");

const registerUser = catchAsyncError(async (req, res, next) => {
  const { email, fullname, designation } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return next(new CustomHttpError(400, "User with this mail already exsts"));
  }
  const password = randomBytes(5).toString("hex");
  const newUser = new userModel({ email, fullname, password, designation });
  await newUser.save();
  const message = `Your credentials are : \n\n <h1>Email: </h1>${email}\n\n <h1>Password: </h1>${password}\n\n`;
  await sendEmail({
    email,
    subject: "credentials",
    message,
  });
  res.status(200).json({
    success: true,
    data: newUser,
  });
});

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
  registerUser,
  login,
};
