const Genre = require("../models/genreModel");
const catchAsync = require("../routers/utils/catchAsync");
const factory = require("./handleFactory");
exports.getAllGenres = factory.getAll(Genre);
exports.getGenre = factory.getOne(Genre);
exports.updateGenre = factory.updateOne(Genre);
exports.deleteGenre = factory.deleteOne(Genre);
exports.createGenre = factory.createOne(Genre);
