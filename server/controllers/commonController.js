const userModel = require("../models/users");
const contactModel = require("../models/contacts");
const { CustomHttpError } = require("../utils/customError");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");

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

const addContact = catchAsyncError(async (req, res, next) => {
  if (
    req.user.role != "admin" &&
    !req.user.permissions.includes("CREATE_CONTACT")
  ) {
    return next(
      new CustomHttpError(
        401,
        "User does not have permission to create contact"
      )
    );
  }

  const { name, email, contactNumber } = req.body;

  const contact = await contactModel.find({ contactNumber });
  if (contact.length) {
    return next(new CustomHttpError(401, "Contact already exists"));
  }
  const newContact = new contactModel({ name, email, contactNumber });
  await newContact.save();
  res.status(200).json({
    success: true,
    data: newContact,
  });
});

const editContact = catchAsyncError(async (req, res, next) => {
  if (
    req.user.role != "admin" ||
    !req.user.permissions.includes("EDIT_CONTACT")
  ) {
    return next(
      new CustomHttpError(401, "User does not have permission to edit contact")
    );
  }
});
module.exports = {
  login,
  addContact,
};
