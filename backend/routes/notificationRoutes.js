const express = require("express");
const Notification = require("../models/Notification");
const protect = require("../middleware/authMiddleware");
const protectStaff = require("../middleware/staffAuth");

const router = express.Router();

// Citizen: list own notifications
router.get("/", protect, async (req, res) => {
  try {
    const list = await Notification.find({ citizenId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Staff: list department notifications
router.get("/staff", protectStaff, async (req, res) => {
  try {
    const list = await Notification.find({
      audience: "staff",
      department: req.staff.department,
    })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
