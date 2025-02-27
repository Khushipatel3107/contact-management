const express = require("express");
const adminController = require("../controllers/adminController.js");
const commonController = require("../controllers/commonController.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
  verify,
} = require("../middleware/auth.js");
const router = express.Router();

router.get("/verify", isAuthenticatedUser, authorizeRoles("admin"), verify);

router.post(
  "/addUser",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  adminController.registerUser
);
router.get(
  "/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  adminController.getUsers
);

router.put(
  "/user/:userId",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  adminController.editUser
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
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    commonController.editContact
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
  )
  .put(isAuthenticatedUser, authorizeRoles("admin"), adminController.editTeam)
  .get(isAuthenticatedUser, authorizeRoles("admin"), adminController.getTeams);

module.exports = router;
