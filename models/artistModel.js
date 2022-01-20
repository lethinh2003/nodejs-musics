const mongoose = require("mongoose");
const slugify = require("slugify");
const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Missing name artist"],
    trim: true,
    unique: true,
  },
  slug: String,
  thumbnail: {
    type: String,
    trim: true,
    unique: true,
  },
});
//document middleware runs before save() and create()
// musicSchema.pre("save", function (next) {
//   this.info[0].slug = slugify(this.info[0].name, { lower: true });
//   next();
// });
artistSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.thumbnail = `/images/artists/${this.slug}.png`;
  next();
});

const Artist = mongoose.model("Artist", artistSchema);
module.exports = Artist;
