const jwt = require("jsonwebtoken");
const User = require("../models/Citizen");
const Authority = require("../models/Staff");

const protectAny = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === "authority") {
        req.staff = await Authority.findById(decoded.id).select("-password");
        if (!req.staff) {
          return res.status(401).json({ message: "Staff not found" });
        }
      } else {
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
          return res.status(401).json({ message: "User not found" });
        }
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protectAny;
