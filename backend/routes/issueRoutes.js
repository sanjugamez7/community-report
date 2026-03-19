const express = require("express");
const router = express.Router();
const {
  createIssue,
  getAllIssues,
} = require("../controllers/issueController");

const protect = require("../middleware/authMiddleware");

// 🔐 Only logged-in users can create issue
router.post("/", protect, createIssue);

// Anyone logged-in can view issues
router.get("/", protect, getAllIssues);

module.exports = router;
