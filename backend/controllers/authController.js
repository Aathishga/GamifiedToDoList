const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "secret123"; // later move to .env

// 📝 SIGNUP
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashed,
    });

    await user.save();

    res.json({ message: "User created" });

  } catch (err) {
    res.status(500).json({ message: "Signup error" });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id }, SECRET);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        energy: user.energy,
        role: user.role,
        mood: user.mood,
        title: user.title,
        inventory: user.inventory,
        questProgress: user.questProgress,
        totalMissionsCompleted: user.totalMissionsCompleted
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};