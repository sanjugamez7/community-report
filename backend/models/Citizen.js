const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  address: {
    type: String,
    trim: true,
    default: ""
  },

  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  isActive: {
    type: Boolean,
    default: true
  },

  verificationIdType: {
    type: String,
    enum: ["Aadhar", "Passport", "VoterID", "PAN"],
    required: true
  },

  verificationIdImage: {
    type: String,   // this stores uploaded image path
    required: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
