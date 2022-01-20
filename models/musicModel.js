const mongoose = require("mongoose");
const slugify = require("slugify");
const Artist = require("../models/artistModel");
const musicSchema = new mongoose.Schema(
  {
    artist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Artist",
      },
    ],

    genres: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Genre",
      },
    ],
    info: [
      {
        name: {
          type: String,
          required: [true, "Missing name info"],
          trim: true,
        },
        slug: String,
        hide: {
          type: Boolean,
          default: false,
          enum: {
            values: [true, false],
            message: "Hide is true or false",
          },
        },
        thumbnail: {
          type: String,
          required: [true, "Missing thumbnail info"],
          trim: true,
        },
        rating: {
          type: Number,
          default: 0,
          max: [5, "max rating is 5 "],
        },
        views: {
          type: Number,
          default: 0,
        },
        hearts: {
          type: Number,
          default: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },

  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

//document middleware runs before save() and create()
musicSchema.pre("save", function (next) {
  this.info[0].slug = slugify(this.info[0].name, { lower: true });
  next();
});
musicSchema.pre(/^find/, function (next) {
  this.populate({
    path: "artist",
    select: "-__v",
  }).populate({
    path: "genres",
    select: "-__v -_id -slug",
  });

  next();
});
musicSchema.virtual("hearts", {
  ref: "Heart",
  foreignField: "music",
  localField: "_id",
});

// musicSchema.pre("save", async function (next) {
//   const artistPromise = this.artist.map(
//     async (id) => await Artist.findById(id)
//   );
//   this.artist = await Promise.all(artistPromise);
//   next();
// });

const Music = mongoose.model("Music", musicSchema);
module.exports = Music;
