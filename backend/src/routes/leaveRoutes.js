const express = require("express");
const router = express.Router();
const LeaveRequest = require("../models/LeaveRequest");
const { protect, authorize } = require("../middleware/authMiddleware");

// Apply for leave (Lecturer)
router.post("/", protect, async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  const leave = await LeaveRequest.create({
    user: req.user._id,
    startDate,
    endDate,
    reason,
  });
  res.status(201).json(leave);
});

// Get all leave requests (HOD/VP/Principal)
router.get("/", protect, authorize(["HOD", "VP", "Principal"]), async (req, res) => {
  const leaves = await LeaveRequest.find().populate("user", "name email role");
  res.json(leaves);
});

// Approve/Reject leave
router.put("/:id", protect, authorize(["HOD", "VP", "Principal"]), async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave not found" });

  leave.status = req.body.status; // "Approved" or "Rejected"
  await leave.save();
  res.json(leave);
});

module.exports = router;
