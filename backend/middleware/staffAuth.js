const jwt = require("jsonwebtoken");
const Authority = require("../models/Staff");

const protectStaff = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== "authority") {
        return res.status(403).json({ message: "Not authorized for staff access" });
      }

      req.staff = await Authority.findById(decoded.id).select("-password");

      if (!req.staff) {
        return res.status(401).json({ message: "Staff not found" });
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

module.exports = protectStaff;
