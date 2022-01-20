const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();
router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").post(authController.resetPassword);
router
  .route("/updatePassword")
  .post(authController.protect, authController.updatePassword);
router
  .route("/")
  .get(
    authController.protect,
    authController.reStrictTo("admin", "user"),
    userController.getAllUsers
  );
// router
//   .route("/:id")
//   .get(musicController.getMusic)
//   .patch(musicController.updateMusic)
//   .delete(musicController.deleteMusic);
module.exports = router;
