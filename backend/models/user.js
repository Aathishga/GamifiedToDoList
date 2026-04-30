const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "warrior-1" }, // Default avatar id

  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },

  // 🔋 Energy System
  energy: { type: Number, default: 100 },
  lastEnergyReset: { type: Date, default: () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()); // midnight today
  }},

  // 🎭 Role-Playing & Mood
  role: { 
    type: String, 
    enum: ["Student", "Warrior", "Developer"], 
    default: "Developer" 
  },
  mood: { 
    type: String, 
    enum: ["Happy", "Neutral", "Tired", "Stressed"],
    default: "Neutral"
  },

  // 📈 Analytics & Patterns
  lastCompletionTime: { type: Date },
  completionPatterns: [{
    time: { type: Date },
    difficulty: { type: String }
  }],

  // ⚔️ RPG Elements
  title: { type: String, default: "Beginner Operative" },
  inventory: [{
    itemId: String,
    name: String,
    quantity: { type: Number, default: 0 }
  }],
  skills: [String], // Array of skill IDs
  
  questProgress: {
    dailyMissions: { type: Number, default: 0 },
    weeklyMissions: { type: Number, default: 0 },
    lastQuestReset: { type: Date, default: Date.now }
  },
  
  totalMissionsCompleted: { type: Number, default: 0 },

  badges: [String],
});

module.exports = mongoose.model("User", userSchema);