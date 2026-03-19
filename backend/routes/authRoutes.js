const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/signup",
  upload.single("verificationIdImage"), // image field name
  registerUser
);

router.post("/login", loginUser);

module.exports = router;
