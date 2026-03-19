const User = require("../models/Citizen");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 CITIZEN REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, verificationIdType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Citizen already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      verificationIdType, // ✅ ADD THIS (VERY IMPORTANT)
      verificationIdImage: req.file ? req.file.path : "",
      status: "pending",
    });

    await newUser.save();

    res.json({
      message: "Registration successful. Waiting for admin approval.",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 CITIZEN LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // ✅ APPROVAL CHECK
    if (user.status !== "approved") {
      return res.status(403).json({
        message: "Your account is pending admin approval.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "Your account is deactivated. Please contact admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: "citizen" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
