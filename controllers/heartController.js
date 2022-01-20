const Heart = require("../models/heartModel");
const catchAsync = require("../routers/utils/catchAsync");
const factory = require("./handleFactory");
exports.getAllHearts = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.idMusic) {
    filter = { music: req.params.idMusic };
  }
  const heart = await Heart.find(filter);
  res.status(200).json({
    status: "success",
    data: {
      heart,
    },
  });
});
exports.getHeart = factory.getOne(Heart);
exports.deleteHeart = factory.deleteOne(Heart);

exports.createHeart = catchAsync(async (req, res, next) => {
  if (!req.body.music) {
    req.body.music = req.params.idMusic;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  const newHeart = await Heart.create(req.body);
  res.status(201).json({
    status: "success",
    data: newHeart,
  });
});
