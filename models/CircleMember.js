const mongoose = require("mongoose");

const CircleMemberSchema = new mongoose.Schema(
  {
    circleId: {
      type: mongoose.Types.ObjectId,
      ref: "circle",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

CircleMemberSchema.index({ circleId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("circleMember", CircleMemberSchema);
