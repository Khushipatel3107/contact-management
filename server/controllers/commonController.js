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
  if (user?.is_active == 0) {
    return next(new CustomHttpError(400, "User is not active"));
  }
  if (user.role == "user" && user.is_approved == 0) {
    return next(
      new CustomHttpError(
        401,
        "Complete you signup process then you can access resources"
      )
    );
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

  let contact = await contactModel.findOne({ contactNumber });

  if (contact) {
    if (contact.is_active == 1) {
      return next(new CustomHttpError(401, "Contact number already exists"));
    } else {
      contact.is_active = 1;
      contact.name = name;
      contact.email = email;
      contact.contactNumber = contactNumber;
      await contact.save();
      res.status(200).json({
        success: true,
      });
    }
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
    req.user.role != "admin" &&
    !req.user.permissions.includes("EDIT_CONTACT")
  ) {
    return next(
      new CustomHttpError(401, "User does not have permission to edit contact")
    );
  }
  const { name, email, contactNumber, contactId } = req.body;
  const contact = await contactModel.findById(contactId);
  if (!contact) {
    return next(new CustomHttpError(401, "Contact does not exists"));
  }
  const contactCheck = await contactModel.findOne({
    contactNumber,
    _id: { $ne: contactId },
  });
  if (contactCheck) {
    return next(new CustomHttpError(401, "This contact number already exists"));
  }
  contact.name = name;
  contact.email = email;
  contact.contactNumber = contactNumber;
  await contact.save();
  res.status(200).json({
    success: true,
    data: contact,
  });
});

const getContacts = catchAsyncError(async (req, res, next) => {
  const contacts = await contactModel.find({ is_active: 1 });
  res.status(200).json({ success: true, data: contacts });
});

const deleteContact = catchAsyncError(async (req, res, next) => {
  if (
    req.user.role != "admin" &&
    !req.user.permissions.includes("DELETE_CONTACT")
  ) {
    return next(
      new CustomHttpError(
        401,
        "User does not have permission to delete contact"
      )
    );
  }
  const { contactId } = req.body;
  const contact = await contactModel.findById(contactId);
  if (!contact) {
    new CustomHttpError(401, "User does not have permission to delete contact");
  }
  contact.is_active = 0;
  await contact.save();

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  login,
  addContact,
  editContact,
  deleteContact,
  getContacts,
};
