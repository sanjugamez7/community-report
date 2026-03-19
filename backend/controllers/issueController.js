const Issue = require("../models/Issue");

// CREATE ISSUE
const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, image } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    const newIssue = await Issue.create({
      title,
      description,
      category,
      location,
      image,
      reportedBy: req.user.id, // 🔥 VERY IMPORTANT
    });

    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ISSUES
const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("reportedBy", "name email") // 🔥 shows user details
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
};
