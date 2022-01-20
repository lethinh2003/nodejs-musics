const express = require("express");
const musicController = require("../controllers/musicController");
const heartController = require("../controllers/heartController");
const authController = require("../controllers/authController");
const heartRouters = require("./heartRouters");

const router = express.Router();
router.use("/:idMusic/hearts", heartRouters);
router
  .route("/top-views-day")
  .get(musicController.getTopViewsDayMusics, musicController.getAllMusics);

router
  .route("/")
  .get(musicController.getAllMusics)
  .post(musicController.createMusic);

router
  .route("/:id")
  .get(musicController.getMusic)
  .patch(musicController.updateMusic)
  .delete(musicController.deleteMusic);
module.exports = router;
