const express = require("express");
const userController = require("../controllers/userController.js");
const commonController = require("../controllers/commonController.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");
const router = express.Router();

router.post("/completeSignup", userController.completeSignup);
router
  .route("/contact")
  .post(
    isAuthenticatedUser,
    authorizeRoles("user"),
    commonController.addContact
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles("user"),
    commonController.editContact
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles("user"),
    commonController.deleteContact
  );
module.exports = router;
