const mongoose = require("mongoose");
const { CustomHttpError } = require("../utils/customError");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: [{ type: String, trim: true }],
    contactNumber: { type: Number, unique: true },
    is_active: { type: Number, default: 1 },
  },
  { timestamps: true }
);

contactSchema.pre("save", async function (next) {
  if (this.email && this.email.length > 0) {
    this.email = [...new Set(this.email)];

    const existingContact = await contactModel.findOne({
      email: { $in: this.email },
    });
    if (existingContact) {
      return next(
        new CustomHttpError(400, "Email already exists in certain contact")
      );
    }
  }
  next();
});

const contactModel = mongoose.model("contacts", contactSchema);
module.exports = contactModel;
