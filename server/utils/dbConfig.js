const mongoose = require("mongoose");
require("dotenv").config();

module.exports.getDBConnection = function () {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB connected"))
    .catch((err) => {
      console.log(err);
    });
};
