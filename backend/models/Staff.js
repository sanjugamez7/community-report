const mongoose = require("mongoose");

const authoritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  certificate: {
    type: String,   // file path
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  role: {
    type: String,
    default: "authority",
  },
});

module.exports = mongoose.model("Authority", authoritySchema);
