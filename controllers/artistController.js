const Artist = require("../models/artistModel");
const catchAsync = require("../routers/utils/catchAsync");
const factory = require("./handleFactory");
exports.getAllArtists = factory.getAll(Artist);
exports.getArtist = factory.getOne(Artist);
exports.updateArtist = factory.updateOne(Artist);
exports.deleteArtist = factory.deleteOne(Artist);
exports.createArtist = factory.createOne(Artist);
