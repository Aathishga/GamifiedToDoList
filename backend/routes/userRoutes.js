const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

router.use(auth);

// 🎭 UPDATE MOOD
router.put("/mood", async (req, res) => {
  try {
    const { mood } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { mood },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating mood" });
  }
});

// ⚔️ UPDATE ROLE
router.put("/role", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { role },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
});

// 🎭 UPDATE AVATAR
router.put("/avatar", async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating avatar" });
  }
});

// 🧬 GET USER DNA / PATTERNS
router.get("/dna", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Simple analysis
    const patterns = user.completionPatterns;
    const hourStats = patterns.reduce((acc, p) => {
      const hour = new Date(p.time).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const diffStats = patterns.reduce((acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, {});

    res.json({
      patterns,
      stats: {
        hourStats,
        diffStats
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching DNA" });
  }
});

// 🎒 USE ITEM
router.post("/use-item", async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.user.id);

    const itemIndex = user.inventory.findIndex(i => i.itemId === itemId);
    if (itemIndex === -1 || user.inventory[itemIndex].quantity <= 0) {
      return res.status(400).json("Item not found or empty");
    }

    // Apply effect
    if (itemId === "ENERGY_BOOST") user.energy = Math.min(100, user.energy + 80);
    // XP boost could be a temporary state, but for simplicity let's just add XP
    if (itemId === "XP_BOOST") user.xp += 50; 

    user.inventory[itemIndex].quantity -= 1;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json("Error using item");
  }
});

// 🏪 SHOP CATALOG
const SHOP_CATALOG = {
  ENERGY_BOOST: { name: "Energy Boost", xpCost: 50,  description: "Restores +80 Vitality" },
  XP_BOOST:     { name: "XP Booster",   xpCost: 75,  description: "Grants +100 bonus XP" },
  SHIELD:       { name: "Shield",        xpCost: 100, description: "Protects against next XP penalty" },
  LUCKY_CHARM:  { name: "Lucky Charm",  xpCost: 150, description: "+50% XP on next task" },
};

// 🏪 BUY ITEM
router.post("/buy-item", async (req, res) => {
  try {
    const { itemId } = req.body;
    const shopItem = SHOP_CATALOG[itemId];
    if (!shopItem) return res.status(400).json({ message: "Item not found in shop" });

    const user = await User.findById(req.user.id);
    if (user.xp < shopItem.xpCost) {
      return res.status(400).json({ message: `Need ${shopItem.xpCost} XP to buy this item` });
    }

    user.xp -= shopItem.xpCost;

    const existing = user.inventory.find(i => i.itemId === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      user.inventory.push({ itemId, name: shopItem.name, quantity: 1 });
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error purchasing item" });
  }
});

module.exports = router;