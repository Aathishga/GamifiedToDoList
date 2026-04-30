import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingBag, Zap, Sparkles, Shield, Star, CheckCircle, AlertCircle } from "lucide-react";
import { buyItem } from "../services/api";

const SHOP_ITEMS = [
  {
    id: "ENERGY_BOOST",
    name: "Energy Boost",
    description: "Instantly restores +80 Vitality points to keep you going.",
    xpCost: 50,
    icon: <Zap size={28} />,
    color: "from-yellow-400 to-orange-500",
    rarity: "Common",
  },
  {
    id: "XP_BOOST",
    name: "XP Booster",
    description: "Grants +100 bonus XP directly to your operative account.",
    xpCost: 75,
    icon: <Sparkles size={28} />,
    color: "from-pink-400 to-pink-600",
    rarity: "Uncommon",
  },
  {
    id: "SHIELD",
    name: "Shield",
    description: "Equip to nullify the next XP penalty from a missed mission.",
    xpCost: 100,
    icon: <Shield size={28} />,
    color: "from-blue-400 to-blue-600",
    rarity: "Rare",
  },
  {
    id: "LUCKY_CHARM",
    name: "Lucky Charm",
    description: "Boosts XP earned from your next task completion by 50%.",
    xpCost: 150,
    icon: <Star size={28} />,
    color: "from-purple-400 to-purple-600",
    rarity: "Epic",
  },
];

const rarityColor = {
  Common: "text-gray-400 bg-gray-50",
  Uncommon: "text-green-500 bg-green-50",
  Rare: "text-blue-500 bg-blue-50",
  Epic: "text-purple-500 bg-purple-50",
};

const Shop = () => {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
  const [buying, setBuying] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBuy = async (item) => {
    if (buying) return;
    setBuying(item.id);
    try {
      const updatedUser = await buyItem(item.id);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage"));
      setUser(updatedUser);
      showToast("success", `${item.name} acquired! Check your inventory.`);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Transaction failed.");
    } finally {
      setBuying(null);
    }
  };

  const userXP = user?.xp || 0;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-[11px] font-black uppercase tracking-widest ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter">
            The <span className="text-pink-500">Armory</span>_
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
            Exchange XP for tactical power-ups
          </p>
        </div>
        <div className="glass-panel px-8 py-5 flex items-center gap-4">
          <Sparkles className="text-pink-500" size={20} />
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Available XP</p>
            <p className="text-2xl font-black text-gray-900">{userXP} <span className="text-pink-500 text-sm">XP</span></p>
          </div>
        </div>
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SHOP_ITEMS.map((item) => {
          const canAfford = userXP >= item.xpCost;
          return (
            <motion.div
              key={item.id}
              whileHover={canAfford ? { y: -6, scale: 1.01 } : {}}
              className={`glass-panel p-8 relative overflow-hidden group transition-all duration-300 ${
                !canAfford ? "opacity-60" : "premium-glow"
              }`}
            >
              {/* Background glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 bg-gradient-to-br ${item.color} rounded-full blur-2xl pointer-events-none`} />

              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                  {item.icon}
                </div>
                <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${rarityColor[item.rarity]}`}>
                  {item.rarity}
                </span>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-black text-gray-900 uppercase italic">{item.name}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-pink-500" />
                  <span className="text-lg font-black text-gray-900">{item.xpCost}</span>
                  <span className="text-[10px] font-black text-pink-400 uppercase">XP</span>
                </div>
                <motion.button
                  whileHover={canAfford ? { scale: 1.05 } : {}}
                  whileTap={canAfford ? { scale: 0.95 } : {}}
                  onClick={() => canAfford && handleBuy(item)}
                  disabled={!canAfford || buying === item.id}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    canAfford
                      ? "btn-primary shadow-xl shadow-pink-200"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed border-none"
                  }`}
                >
                  {buying === item.id ? "Acquiring..." : canAfford ? "Acquire" : "Need More XP"}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Loot Drop Info */}
      <div className="mt-16 p-10 glass-panel bg-gray-900 text-white text-center space-y-4">
        <div className="flex justify-center gap-6 text-sm font-black uppercase tracking-widest">
          <span className="text-gray-400">🎲 Beginner: <span className="text-white">10% loot drop</span></span>
          <span className="text-gray-400">⚡ Advanced: <span className="text-white">20% loot drop</span></span>
          <span className="text-gray-400">💀 Elite: <span className="text-white">35% loot drop</span></span>
        </div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
          Complete missions to earn random item drops — no XP required
        </p>
      </div>
    </div>
  );
};

export default Shop;
