const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    audience: {
      type: String,
      enum: ["citizen", "staff"],
      default: "citizen",
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.audience === "citizen";
      },
    },
    department: {
      type: String,
      required: function () {
        return this.audience === "staff";
      },
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authority",
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
