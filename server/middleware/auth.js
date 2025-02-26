const catchAsyncErrors = require("./catchAsyncError.js");
const userModel = require("../models/users");
const { CustomHttpError } = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return next(new CustomHttpError(401, "Please login to access resources"));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodedData.id);
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomHttpError(
          403,
          `${req.user.role} is not authorized to perform this action`
        )
      );
    }
    next();
  };
};

exports.verify = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  console.log(user);
  res.json({
    success: true,
    data: user,
  });
};
