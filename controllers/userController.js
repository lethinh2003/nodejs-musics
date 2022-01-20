const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.login = async (req, res) => {
  const { account, password } = req.body;
  if (!account || !password) {
    return res.status(404).json({
      status: "err",
      message: "fill in account and password",
    });
  }
  const user = await User.findOne({ account: account });
  if (!user) {
    return res.status(404).json({
      status: "err",
      message: "account invalid",
    });
  }
  const correct = await user.correctPassword(password, user.password);
  if (!correct) {
    return res.status(404).json({
      status: "err",
      message: "password invalid",
    });
  }
  req.user = user;
  const token = signToken(user._id);
  return res.status(200).json({
    status: "success",
    token,
  });
};
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      token,
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "err",
      message: err,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    //filtering
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((item) => delete queryObj[item]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryNewObj = JSON.parse(queryStr);
    let query = User.find(queryNewObj);
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
      const numUsers = await User.countDocuments();
      console.log(req.query);
      console.log(numUsers, skip);
      if (numUsers < skip) {
        throw new Error("Page doesn't exist");
      }
    }
    //Execute
    const users = await query;
    res.status(200).json({
      status: "success",
      result: users.length,
      page: page,
      limit: limit,
      data: {
        users,
      },
    });
  } catch {
    res.status(404).json({
      status: "err",
      message: "Error",
    });
  }
};
// exports.getMusic = async (req, res) => {
//   try {
//     const music = await Music.findById(req.params.id);
//     res.status(200).json({
//       status: "success",
//       data: {
//         music,
//       },
//     });
//   } catch {
//     res.status(404).json({
//       status: "err",
//       message: "Error",
//     });
//   }
// };
// exports.updateMusic = async (req, res) => {
//   try {
//     const music = await Music.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: "success",
//       data: {
//         music,
//       },
//     });
//   } catch {
//     res.status(404).json({
//       status: "err",
//       message: "Error",
//     });
//   }
// };
// exports.deleteMusic = async (req, res) => {
//   try {
//     await Music.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: "success",
//       message: "Deleted",
//     });
//   } catch {
//     res.status(400).json({
//       status: "err",
//       message: "Error",
//     });
//   }
// };
