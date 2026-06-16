const mongoose = require("mongoose");
const filter = require("../util/filter");

const linkSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["instagram", "youtube", "facebook", "linkedin", "github"],
      required: true,
    },
    url: {
      type: String,
      required: true,
      maxlength: [300, "Must be no more than 300 characters"],
    },
  },
  { _id: false }
);

const SpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Must be at least 3 characters long"],
      maxlength: [60, "Must be no more than 60 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    avatarImage: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
      maxlength: [500, "Must be no more than 500 characters"],
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        "Backend",
        "Frontend",
        "Full Stack",
        "DevOps",
        "AI / ML",
        "Cybersecurity",
        "Mobile",
        "Blockchain / Web3",
        "Data Science",
        "Cloud",
        "Open Source",
        "UI / UX",
        "Game Development",
        "Other",
      ],
    },
    links: {
      type: [linkSchema],
      default: [],
      validate: {
        validator: (links) => links.length <= 2,
        message: "A space can have at most 2 links",
      },
    },
    followerCount: {
      type: Number,
      default: 0,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
    impressionCount: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

SpaceSchema.pre("save", function (next) {
  if (this.name.length > 0) {
    this.name = filter.clean(this.name);
  }

  if (this.about.length > 0) {
    this.about = filter.clean(this.about);
  }

  next();
});

module.exports = mongoose.model("space", SpaceSchema);
