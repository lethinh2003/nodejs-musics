const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  account: {
    type: String,
    unique: true,
    required: [true, "Missing account"],
    trim: true,
    minLength: [6, "Account must have grate or equal than 6 characters"],
  },
  name: {
    type: String,
    required: [true, "Missing name"],
    trim: true,
    minLength: [2, "Name must have grate or equal than 2 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Missing email"],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Email is invalid"],
  },
  avatar: {
    type: String,
    default: "/avatar/1.png",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: 6,
    validate: {
      validator: function (el) {
        return this.password === el;
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});
//document middleware runs before save() and create()
// musicSchema.pre("save", function (next) {
//   this.info[0].slug = slugify(this.info[0].name, { lower: true });
//   next();
// });
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};
userSchema.methods.changedPassword = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const timeStampPasswordChanged = parseInt(
      this.passwordChangedAt.getTime() / 1000
    );

    return JWTTimeStamp < timeStampPasswordChanged;
  }
  return false;
};
userSchema.methods.createResetPasswordToken = async function (num) {
  const resetToken = await crypto.randomBytes(num).toString("hex");
  this.passwordResetToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
