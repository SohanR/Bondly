const mongoose = require("mongoose");

const SpacePostVoteSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    value: {
      type: Number,
      enum: [1, -1],
      required: true,
    },
  },
  { timestamps: true }
);

SpacePostVoteSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("spacePostVote", SpacePostVoteSchema);
