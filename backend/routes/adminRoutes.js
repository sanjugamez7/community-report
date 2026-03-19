const express = require("express");
const jwt = require("jsonwebtoken");
const Authority = require("../models/Staff");
const User = require("../models/Citizen");
const Complaint = require("../models/Complaint");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ================= ADMIN LOGIN =================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { role: "ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Admin login successful",
      token,
    });
  } else {
    return res.status(401).json({
      message: "Invalid admin credentials",
    });
  }
});


// =================================================
//                CITIZEN MANAGEMENT
// =================================================

// ================= GET SINGLE CITIZEN =================
router.get("/citizen/:id", async (req, res) => {
  try {
    const citizen = await User.findById(req.params.id).select("-password");

    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.json(citizen);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET PENDING CITIZENS =================
router.get("/pending-citizens", async (req, res) => {
  try {
    // status is stored in lowercase in the User model
    const citizens = await User.find({ status: "pending" });
    res.json(citizens);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET APPROVED CITIZENS =================
router.get("/approved-citizens", async (req, res) => {
  try {
    const citizens = await User.find({ status: "approved" });
    res.json(citizens);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET REJECTED CITIZENS =================
router.get("/rejected-citizens", async (req, res) => {
  try {
    const citizens = await User.find({ status: "rejected" });
    res.json(citizens);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= APPROVE CITIZEN =================
router.put("/approve-citizen/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });

    res.json({ message: "Citizen approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= REJECT CITIZEN =================
router.put("/reject-citizen/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });

    res.json({ message: "Citizen rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// =================================================
//                STAFF MANAGEMENT
// =================================================

// ================= GET SINGLE STAFF =================
router.get("/authority/:id", async (req, res) => {
  try {
    const authority = await Authority.findById(req.params.id).select("-password");

    if (!authority) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json(authority);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET PENDING STAFF =================
router.get("/pending-authorities", async (req, res) => {
  try {
    const authorities = await Authority.find({ status: "pending" });
    res.json(authorities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET APPROVED STAFF =================
router.get("/approved-authorities", async (req, res) => {
  try {
    const authorities = await Authority.find({ status: "approved" });
    res.json(authorities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET REJECTED STAFF =================
router.get("/rejected-authorities", async (req, res) => {
  try {
    const authorities = await Authority.find({ status: "rejected" });
    res.json(authorities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= APPROVE STAFF =================
router.put("/approve-authority/:id", async (req, res) => {
  try {
    await Authority.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });

    res.json({ message: "Staff approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= REJECT STAFF =================
router.put("/reject-authority/:id", async (req, res) => {
  try {
    await Authority.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });

    res.json({ message: "Staff rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Protect everything below (admin token required)
router.use(adminMiddleware);


// =================================================
//           FAKE COMPLAINTS (ADMIN)
// =================================================

// ================= GET FAKE COMPLAINTS =================
router.get("/fake-complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: "Reported as Fake" })
      .populate("citizenId", "name email")
      .populate("reportedAsFakeBy", "name email department")
      .sort({ updatedAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DEACTIVATE CITIZEN =================
router.put("/deactivate-citizen/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    res.json({ message: "Citizen deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ACTIVATE CITIZEN =================
router.put("/activate-citizen/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isActive: true,
    });

    res.json({ message: "Citizen activated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN STATS =================
router.get("/stats", async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days || "14", 10) || 14, 60);
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      totalCitizens,
      totalStaff,
      byDepartmentAgg,
      trendAgg,
    ] = await Promise.all([
      Complaint.countDocuments({}),
      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: "In Progress" }),
      Complaint.countDocuments({ status: "Resolved" }),
      User.countDocuments({}),
      Authority.countDocuments({}),
      Complaint.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 12 },
      ]),
      Complaint.aggregate([
        { $match: { createdAt: { $gte: start } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const byDepartment = (byDepartmentAgg || []).map((x) => ({
      department: x._id || "Unknown",
      count: x.count || 0,
    }));

    const trend = (trendAgg || []).map((x) => ({
      date: x._id,
      count: x.count || 0,
    }));

    res.json({
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      totalCitizens,
      totalStaff,
      byDepartment,
      trend,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LIST ALL COMPLAINTS =================
router.get("/complaints", async (req, res) => {
  try {
    const { q, status, wardNumber, limit, dateFrom, dateTo } = req.query;
    const query = {};

    if (status) query.status = status;
    if (wardNumber) query.wardNumber = wardNumber;
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { department: { $regex: q, $options: "i" } },
        { wardNumber: { $regex: q, $options: "i" } },
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const max = Math.min(parseInt(limit || "0", 10) || 0, 200);

    const complaints = await Complaint.find(query)
      .populate("citizenId", "name email")
      .populate("assignedStaff", "name email department")
      .sort({ createdAt: -1 })
      .limit(max > 0 ? max : 0);

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE COMPLAINT STATUS (ADMIN) =================
router.put("/complaints/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "In Progress", "Resolved", "Rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("citizenId", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ASSIGN STAFF TO COMPLAINT (ADMIN) =================
router.put("/complaints/:id/assign", async (req, res) => {
  try {
    const { staffId } = req.body;
    if (!staffId) {
      return res.status(400).json({ message: "staffId is required" });
    }

    const staff = await Authority.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.assignedStaff = staff._id;
    await complaint.save();

    const populated = await Complaint.findById(complaint._id)
      .populate("citizenId", "name email")
      .populate("assignedStaff", "name email department");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LIST ALL CITIZENS =================
router.get("/citizens", async (req, res) => {
  try {
    const citizens = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(citizens);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LIST ALL STAFF =================
router.get("/staff", async (req, res) => {
  try {
    const staff = await Authority.find({}).select("-password").sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
