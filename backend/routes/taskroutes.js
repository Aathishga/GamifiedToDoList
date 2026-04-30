const express = require("express");
const router = express.Router();

const Task = require("../models/task");
const { completeTask, completeSubStep, createTask, markAsMissed, deleteTask } = require("../controllers/taskController");
const auth = require("../middleware/auth");

// Apply auth middleware to all task routes
router.use(auth);

// ✅ COMPLETE TASK
router.put("/:id/complete", completeTask);

// ✅ COMPLETE SUB-STEP
router.put("/:id/substep", completeSubStep);

// ✅ MARK AS MISSED
router.put("/:id/missed", markAsMissed);

// ✅ GET ALL TASKS FOR USER
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, completed: false }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// ✅ CREATE TASK
router.post("/", createTask);

// 🗑️ DELETE TASK
router.delete("/:id", deleteTask);

module.exports = router;