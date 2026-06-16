const mongoose = require("mongoose");

const CirclePostHelpfulSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

CirclePostHelpfulSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("circlePostHelpful", CirclePostHelpfulSchema);
