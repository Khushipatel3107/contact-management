const express = require("express");
const userController = require("../controllers/userController.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");
const router = express.Router();

router.post("/completeSignup", userController.completeSignup);

module.exports = router;
