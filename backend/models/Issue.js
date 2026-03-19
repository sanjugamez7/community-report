const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Road", "Garbage", "Water", "Electricity", "Other"],
    },

    location: {
      type: String,
      required: true,
    },

    image: {
      type: String, // image URL (later: Cloudinary / local)
    },

    status: {
      type: String,
      default: "Reported",
      enum: ["Reported", "In Progress", "Resolved"],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
