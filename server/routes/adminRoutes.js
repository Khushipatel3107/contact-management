const express = require("express");
const adminController = require("../controllers/adminController.js");
const commonController = require("../controllers/commonController.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");
const router = express.Router();

router.post(
  "/addUser",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  adminController.registerUser
);

router
  .route("/designation")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.addDesignation
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.editDesignation
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.deleteDesignation
  )
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getDesignations
  );

router
  .route("/contact")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    commonController.addContact
  );

router
  .route("/team")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.createTeam
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.deleteTeam
  );

module.exports = router;
