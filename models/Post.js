const mongoose = require("mongoose");
const filter = require("../util/filter");
const PostLike = require("./PostLike");
const SpacePostVote = require("./SpacePostVote");
const CirclePostHelpful = require("./CirclePostHelpful");

const PostSchema = new mongoose.Schema(
  {
    poster: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    postType: {
      type: String,
      enum: ["user", "space", "circle"],
      default: "user",
    },
    space: {
      type: mongoose.Types.ObjectId,
      ref: "space",
    },
    circle: {
      type: mongoose.Types.ObjectId,
      ref: "circle",
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "approved",
    },
    title: {
      type: String,
      required: true,
      maxLength: [80, "Must be no more than 80 characters"],
    },
    content: {
      type: String,
      required: true,
      maxLength: [8000, "Must be no more than 8000 characters"],
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    downvoteCount: {
      type: Number,
      default: 0,
    },
    voteScore: {
      type: Number,
      default: 0,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    impressionCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: "tag",
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

PostSchema.pre("save", function (next) {
  if (this.title.length > 0) {
    this.title = filter.clean(this.title);
  }

  if (this.content.length > 0) {
    this.content = filter.clean(this.content);
  }

  next();
});

PostSchema.pre("remove", async function (next) {
  console.log(this._id);
  await PostLike.deleteMany({ postId: this._id });
  await SpacePostVote.deleteMany({ postId: this._id });
  await CirclePostHelpful.deleteMany({ postId: this._id });
  next();
});

module.exports = mongoose.model("post", PostSchema);
