const catchAsync = require("../routers/utils/catchAsync");
const AppError = require("../routers/utils/appError");
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document find with that id", 404));
    }
    res.status(204).json({
      status: "success",
      message: "Deleted",
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: newDoc,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No document find with that id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
exports.getOne = (Model, Optional) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).populate(Optional);
    if (!doc) {
      return next(new AppError("No document find with that id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const queryObj = { ...req.query };
    //filtering
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((item) => delete queryObj[item]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryNewObj = JSON.parse(queryStr);
    let query = Model.find(queryNewObj);

    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("info.createdAt");
    }
    //limit fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v -artists._id -genres._id -info._id");
      // - tien to de k muon hien ra screen
    }
    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numDocs = await Model.countDocuments();
      if (numDocs < skip) {
        return next(new AppError("Page does not exist", 404));
      }
    }
    //Execute
    const docs = await query;

    res.status(200).json({
      status: "success",
      result: docs.length,
      page: page,
      limit: limit,
      data: {
        data: docs,
      },
    });
  });
