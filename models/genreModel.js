const mongoose = require("mongoose");
const slugify = require("slugify");
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Missing name artist"],
    trim: true,
    unique: true,
  },
  keyword: String,
  slug: String,
});
//document middleware runs before save() and create()
// musicSchema.pre("save", function (next) {
//   this.info[0].slug = slugify(this.info[0].name, { lower: true });
//   next();
// });
genreSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.keyword = this.slug;
  next();
});

const Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;
