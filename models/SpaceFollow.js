const mongoose = require("mongoose");

const SpaceFollowSchema = new mongoose.Schema(
  {
    spaceId: {
      type: mongoose.Types.ObjectId,
      ref: "space",
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

SpaceFollowSchema.index({ spaceId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("spaceFollow", SpaceFollowSchema);
