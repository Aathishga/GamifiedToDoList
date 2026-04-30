const Task = require("../models/task");
const mongoose = require("mongoose");

exports.getDailyReport = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId: req.user.id,
      $or: [
        { completedAt: { $gte: startOfDay, $lte: endOfDay } },
        { status: "missed", createdAt: { $gte: startOfDay, $lte: endOfDay } }
      ]
    });

    const completed = tasks.filter(t => t.status === "completed").length;
    const missed = tasks.filter(t => t.status === "missed").length;
    
    // Calculate XP earned today (This is a bit complex as XP is added to user total, 
    // but we can estimate based on task difficulty if needed, 
    // or track XP gains in a separate collection. For simplicity, we'll estimate)
    const baseXP = { Easy: 10, Medium: 20, Hard: 40 };
    const xpEarned = tasks
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + (baseXP[t.difficulty] || 10), 0);

    res.json({
      completed,
      missed,
      xpEarned
    });
  } catch (err) {
    res.status(500).json("Error generating daily report");
  }
};

exports.getWeeklyReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // Go back 6 more days to include today
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      userId: req.user.id,
      $or: [
        { completedAt: { $gte: sevenDaysAgo, $lte: today } },
        { status: "missed", createdAt: { $gte: sevenDaysAgo, $lte: today } }
      ]
    });

    const completed = tasks.filter(t => t.status === "completed").length;
    const missed = tasks.filter(t => t.status === "missed").length;

    // Generate full 7-day range for the graph
    const dailyStats = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toDateString();
      
      const count = tasks.filter(t => 
        t.status === "completed" && 
        t.completedAt &&
        new Date(t.completedAt).toDateString() === dateStr
      ).length;
      
      dailyStats.push({ 
        day: dateStr, 
        count: count 
      });
    }

    let mostProductiveDay = "N/A";
    let maxTasks = 0;
    dailyStats.forEach(stat => {
      if (stat.count > maxTasks) {
        maxTasks = stat.count;
        mostProductiveDay = stat.day;
      }
    });

    res.json({
      completed,
      missed,
      mostProductiveDay,
      dailyStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating weekly report" });
  }
};

exports.getMissedAnalysis = async (req, res) => {
  try {
    const missedTasks = await Task.find({
      userId: req.user.id,
      status: "missed"
    });

    const reasons = {};
    missedTasks.forEach(t => {
      if (t.missedReason) {
        reasons[t.missedReason] = (reasons[t.missedReason] || 0) + 1;
      }
    });

    let mostCommonReason = "None";
    let maxCount = -1;
    for (const reason in reasons) {
      if (reasons[reason] > maxCount) {
        maxCount = reasons[reason];
        mostCommonReason = reason;
      }
    }

    res.json({
      totalMissed: missedTasks.length,
      mostCommonReason,
      reasons
    });
  } catch (err) {
    res.status(500).json("Error analyzing missed tasks");
  }
};
