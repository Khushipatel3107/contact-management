const express = require("express");
const adminController = require("../controllers/adminController.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");
const router = express.Router();

console.log("routes");

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

module.exports = router;
