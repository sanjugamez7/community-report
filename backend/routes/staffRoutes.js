const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Authority = require("../models/Staff");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// 🔹 REGISTER AUTHORITY WITH CERTIFICATE
router.post(
  "/register",
  upload.single("certificate"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        department,
        employeeId,
      } = req.body;

      const existing = await Authority.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Authority already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const authority = new Authority({
        name,
        email,
        phone,
        department,
        employeeId,
        certificate: req.file ? req.file.path : "",
        password: hashedPassword,
        status: "pending",
      });

      await authority.save();

      res.json({
        message:
          "Registration successful. Waiting for admin approval.",
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// 🔹 LOGIN AUTHORITY (Only if Approved)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const authority = await Authority.findOne({ email });

    if (!authority) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // 🔥 IMPORTANT CHECK
    if (authority.status !== "approved") {
      return res.status(403).json({
        message:
          "Your account is pending admin approval.",
      });
    }

    const isMatch = await bcrypt.compare(password, authority.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: authority._id, role: authority.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      authority,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
