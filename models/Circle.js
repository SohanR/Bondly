const mongoose = require("mongoose");
const filter = require("../util/filter");

const STACKS = [
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
];

const CircleSchema = new mongoose.Schema(
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
    bannerImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [300, "Must be no more than 300 characters"],
    },
    stack: {
      type: String,
      required: true,
      enum: STACKS,
    },
    mode: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    joinApprovalRequired: {
      type: Boolean,
      default: false,
    },
    postApprovalRequired: {
      type: Boolean,
      default: false,
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    helpfulCount: {
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

CircleSchema.pre("save", function (next) {
  if (this.name.length > 0) {
    this.name = filter.clean(this.name);
  }

  if (this.description.length > 0) {
    this.description = filter.clean(this.description);
  }

  next();
});

module.exports = mongoose.model("circle", CircleSchema);
module.exports.STACKS = STACKS;
