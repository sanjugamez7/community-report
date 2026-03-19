const User = require("../models/Citizen");

// Get all pending users
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "PENDING" }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve user
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndUpdate(userId, { status: "APPROVED" });

    res.json({ message: "User approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPendingUsers, approveUser };
