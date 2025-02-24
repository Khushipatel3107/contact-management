const express = require("express");
const adminController = require("../controllers/adminController.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");
const router = express.Router();

router
  .route("/designation")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.addDesignation
  );

module.exports = router;
