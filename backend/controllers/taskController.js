const Task = require("../models/task");
const User = require("../models/User");

exports.completeTask = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const task = await Task.findById(req.params.id);

    if (!task || task.completed) {
      return res.status(400).json("Invalid task");
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json("Not authorized to complete this task");
    }

    task.completed = true;
    task.status = "completed";
    task.completedAt = new Date();

    // 🔁 RECURRING TASK LOGIC
    if (task.isRecurring) {
      const nextDueDate = new Date(task.dueDate || new Date());
      if (task.recurrenceType === "daily") {
        nextDueDate.setDate(nextDueDate.getDate() + 1);
      } else if (task.recurrenceType === "weekly") {
        nextDueDate.setDate(nextDueDate.getDate() + 7);
      }

      const newTask = new Task({
        userId: task.userId,
        title: task.title,
        description: task.description,
        isBoss: task.isBoss,
        isRiskMode: task.isRiskMode,
        difficulty: task.difficulty,
        category: task.category,
        timer: task.timer,
        subSteps: task.subSteps.map(s => ({ title: s.title, completed: false })),
        isRecurring: true,
        recurrenceType: task.recurrenceType,
        dueDate: nextDueDate,
      });
      await newTask.save();
    }

    // 🔋 ENERGY RESET (Daily — resets at calendar midnight, not login time)
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 00:00:00 today
    const lastReset = new Date(user.lastEnergyReset);
    const lastResetMidnight = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate());

    if (lastResetMidnight < todayMidnight) {
      user.energy = 100; // Full vitality restored at midnight
      user.lastEnergyReset = now;
    }

    // ⚡ ENERGY COST (Low cost = longer lasting vitality)
    const energyCost = {
      Easy: 3,
      Medium: 7,
      Hard: 15,
    };
    const cost = energyCost[task.difficulty] || 5;

    if (user.energy < cost) {
      return res.status(400).json("Insufficient energy. Vitality resets at midnight!");
    }
    user.energy -= cost;

    // 🎲 RANDOM EVENTS (5% chance)
    let eventBonus = 1;
    let eventMessage = "";
    if (Math.random() < 0.05) {
      eventBonus = 2;
      eventMessage = "⚡ RANDOM EVENT: Double XP Triggered!";
    }

    // 🎯 BASE XP
    const baseXP = {
      Easy: 10,
      Medium: 20,
      Hard: 40,
    };
    let xp = baseXP[task.difficulty] || 10;

    // ⚔️ BOSS MULTIPLIER
    if (task.isBoss) {
      xp *= 2.5;
      task.bossHealth = 0;
    }

    // 🎲 RISK MODE (Double or Nothing)
    if (task.isRiskMode) {
      if (Math.random() < 0.5) {
        xp *= 2;
        eventMessage = "🎲 RISK PAYOFF: Double XP Earned!";
      } else {
        xp = 0;
        eventMessage = "🎲 RISK FAILED: No XP gained.";
      }
    }

    // ⏳ TASK AGING (DYNAMIC XP)
    const daysOld = Math.floor((new Date() - new Date(task.createdAt)) / (1000 * 60 * 60 * 24));
    let agingPenalty = 1;
    if (daysOld === 1) agingPenalty = 0.75; 
    else if (daysOld >= 2) agingPenalty = 0.5; 
    xp = Math.floor(xp * agingPenalty);

    // 🔄 TASK EVOLUTION
    task.repetitionCount = (task.repetitionCount || 0) + 1;
    if (task.repetitionCount > 5) xp += 5;

    // 🔥 COMBO SYSTEM
    const oneHourAgo = new Date(new Date() - 60 * 60 * 1000);
    const recentTasks = user.completionPatterns.filter(p => new Date(p.time) > oneHourAgo);
    let comboBonus = recentTasks.length >= 2 ? 20 : 0;

    // 🛑 BURNOUT
    let burnoutPenalty = recentTasks.length >= 5 ? 0.5 : 1;
    let burnoutWarning = recentTasks.length >= 5;

    // 🧠 SKILL BONUSES
    let skillMultiplier = 1;
    if (user.skills && user.skills.includes("XP_BOOST_PASSIVE")) skillMultiplier = 1.1;

    xp = Math.floor((xp + comboBonus) * burnoutPenalty * eventBonus * skillMultiplier);

    // ⏳ TIME PENALTY
    let penaltyApplied = false;
    if (task.dueDate && new Date() > new Date(task.dueDate)) {
      xp = Math.floor(xp / 2);
      penaltyApplied = true;
    }

    // 🧭 QUEST PROGRESSION
    const today = new Date().toDateString();
    if (new Date(user.questProgress.lastQuestReset).toDateString() !== today) {
      user.questProgress.dailyMissions = 0;
      user.questProgress.lastQuestReset = new Date();
    }
    // Check weekly reset (simplified)
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 1 && new Date(user.questProgress.lastQuestReset).toDateString() !== today) {
       user.questProgress.weeklyMissions = 0;
    }

    user.questProgress.dailyMissions += 1;
    user.questProgress.weeklyMissions += 1;
    user.totalMissionsCompleted += 1;

    // 🔥 STREAK
    if (user.lastCompletedDate) {
      const last = new Date(user.lastCompletedDate).toDateString();
      const diff = (new Date() - new Date(user.lastCompletedDate)) / (1000 * 60 * 60 * 24);
      if (last !== today) {
        if (diff <= 1.5) user.streak += 1;
        else user.streak = 1;
      }
    } else user.streak = 1;

    user.lastCompletedDate = new Date();
    user.lastCompletionTime = new Date();
    
    // 🧬 PATTERN ANALYSIS
    user.completionPatterns.push({ time: new Date(), difficulty: task.difficulty });
    if (user.completionPatterns.length > 50) user.completionPatterns.shift();

    // 🔥 FINAL XP ADDITION
    const streakBonus = user.streak * 2;
    xp += streakBonus;
    user.xp += xp;

    // 📈 LEVEL & WORLD MAP
    const newLevel = Math.floor(user.xp / 100) + 1;
    let leveledUp = false;
    if (newLevel > user.level) {
      user.level = newLevel;
      leveledUp = true;
      
      // Update Title
      if (user.level >= 10) user.title = "Elite Productivity Arena Champion";
      else if (user.level >= 5) user.title = "Focus Forest Guardian";
      else user.title = "Beginner Operative";
    }

    // 🎁 LOOT DROP (Random chance based on difficulty)
    const lootTable = [
      { itemId: "ENERGY_BOOST", name: "Energy Boost" },
      { itemId: "XP_BOOST",     name: "XP Booster" },
      { itemId: "SHIELD",       name: "Shield" },
      { itemId: "LUCKY_CHARM",  name: "Lucky Charm" },
    ];
    const lootChance = { Easy: 0.10, Medium: 0.20, Hard: 0.35 };
    let lootDrop = null;

    if (Math.random() < (lootChance[task.difficulty] || 0.10)) {
      const dropped = lootTable[Math.floor(Math.random() * lootTable.length)];
      lootDrop = dropped;
      const existing = user.inventory.find(i => i.itemId === dropped.itemId);
      if (existing) {
        existing.quantity += 1;
      } else {
        user.inventory.push({ itemId: dropped.itemId, name: dropped.name, quantity: 1 });
      }
    }

    await task.save();
    await user.save();

    res.json({
      xpGained: xp,
      streak: user.streak,
      level: user.level,
      energy: user.energy,
      leveledUp,
      penaltyApplied,
      burnoutWarning,
      comboBonus: comboBonus > 0,
      eventMessage,
      title: user.title,
      questProgress: user.questProgress,
      lootDrop,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error completing mission");
  }
};

exports.completeSubStep = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const { subStepIndex } = req.body;

    if (!task || task.completed) return res.status(400).json("Invalid mission");
    if (task.subSteps[subStepIndex].completed) return res.status(400).json("Sub-step already completed");

    task.subSteps[subStepIndex].completed = true;
    
    // Reduce Boss Health
    if (task.isBoss) {
      const stepValue = 100 / task.subSteps.length;
      task.bossHealth = Math.max(0, task.bossHealth - stepValue);
    }

    await task.save();
    res.json({ message: "Sub-step complete", bossHealth: task.bossHealth });
  } catch (err) {
    res.status(500).json("Error completing sub-step");
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, difficulty, category, dueDate, description, isBoss, isRiskMode, timer, subSteps, isRecurring, recurrenceType } = req.body;

    if (!title || !difficulty) {
      return res.status(400).json({ message: "Title and difficulty are required" });
    }

    const newTask = new Task({
      userId: req.user.id,
      title,
      difficulty,
      category: category || "Work",
      description,
      timer,
      subSteps,
      isBoss,
      bossHealth: isBoss ? (subSteps && subSteps.length > 0 ? 100 : 0) : 100,
      isRiskMode,
      isRecurring,
      recurrenceType,
      dueDate,
      status: "pending"
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
};

exports.markAsMissed = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const { reason } = req.body;

    if (!task || task.completed) return res.status(400).json("Invalid mission");
    if (task.userId.toString() !== req.user.id) return res.status(403).json("Unauthorized");

    task.completed = true; // Mark as done so it doesn't show in active list
    task.status = "missed";
    task.missedReason = reason;
    
    // XP Penalty
    const user = await User.findById(req.user.id);
    user.xp = Math.max(0, user.xp - 20); // Flat penalty for missing
    user.streak = 0; // Reset streak
    
    await task.save();
    await user.save();

    res.json({ message: "Task marked as missed", xp: user.xp, streak: user.streak });
  } catch (err) {
    res.status(500).json("Error marking task as missed");
  }
};

// 🗑️ DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Mission not found" });
    if (task.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Mission terminated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting mission" });
  }
};