const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: String,
  description: String, // Narrative story-style description

  // ⚔️ Boss Mechanics
  isBoss: { type: Boolean, default: false },
  isRiskMode: { type: Boolean, default: false },
  bossHealth: { type: Number, default: 100 }, // 0 to 100
  subSteps: [{
    title: String,
    completed: { type: Boolean, default: false }
  }],

  // ⏱️ Timer System
  timer: { type: Number }, // Duration in minutes for bonus XP

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
  },

  category: {
    type: String,
    enum: ["Work", "Study", "Fitness", "Personal"],
  },

  completed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "missed"],
    default: "pending",
  },
  completedAt: Date,
  missedReason: {
    type: String,
    enum: ["Too difficult", "No time", "Forgot", ""],
    default: "",
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrenceType: {
    type: String,
    enum: ["daily", "weekly", ""],
    default: "",
  },

  dueDate: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  repetitionCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Task", taskSchema);