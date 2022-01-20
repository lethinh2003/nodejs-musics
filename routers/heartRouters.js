const express = require("express");
const heartController = require("../controllers/heartController");
const authController = require("../controllers/authController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(heartController.getAllHearts)
  .post(authController.protect, heartController.createHeart);

router
  .route("/:id")
  .get(heartController.getHeart)
  .delete(heartController.deleteHeart);
module.exports = router;
