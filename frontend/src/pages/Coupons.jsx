import { motion } from "framer-motion";
import { Ticket, Lock, Unlock, Zap, Coffee, Gamepad, Gift, Star } from "lucide-react";
import { useState, useEffect } from "react";

const Coupons = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const coupons = [
    {
      id: 1,
      name: "Guilt-Free Gaming",
      description: "Unlock 2 hours of uninterrupted video game time.",
      xpRequired: 500,
      icon: <Gamepad size={24} />,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      name: "Premium Coffee Run",
      description: "Treat yourself to a fancy coffee or bubble tea from your favorite cafe.",
      xpRequired: 800,
      icon: <Coffee size={24} />,
      color: "from-amber-400 to-amber-600",
    },
    {
      id: 3,
      name: "Binge Watcher",
      description: "Watch 3 consecutive episodes of your current favorite TV show.",
      xpRequired: 1500,
      icon: <Ticket size={24} />,
      color: "from-purple-400 to-purple-600",
    },
    {
      id: 4,
      name: "Cheat Meal Activated",
      description: "Order your favorite takeout or fast food without any diet guilt.",
      xpRequired: 3000,
      icon: <Gift size={24} />,
      color: "from-pink-400 to-pink-600",
    },
    {
      id: 5,
      name: "Retail Therapy",
      description: "Allow yourself to buy that one item sitting in your online cart.",
      xpRequired: 4500,
      icon: <Zap size={24} />,
      color: "from-emerald-400 to-emerald-600",
    },
    {
      id: 6,
      name: "$25 Amazon Gift Card",
      description: "Convert your XP into real purchasing power for any item you want.",
      xpRequired: 6000,
      icon: <Gift size={24} />,
      color: "from-orange-400 to-orange-600",
    },
    {
      id: 7,
      name: "Master's Day Off",
      description: "A full 24 hours of zero productivity expectations. Total relaxation.",
      xpRequired: 8000,
      icon: <Star size={24} />,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: 8,
      name: "Premium Spa Treatment",
      description: "Book a professional massage or spa day to recover your physical stats.",
      xpRequired: 12000,
      icon: <Coffee size={24} />,
      color: "from-teal-400 to-teal-600",
    },
  ];

  const totalXP = user?.xp || 0;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter">
          The <span className="text-pink-500">Treasury</span>_
        </h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
          Redeem your hard-earned Experience for elite vouchers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coupons.map((coupon) => {
          const isUnlocked = totalXP >= coupon.xpRequired;
          const progress = Math.min(100, (totalXP / coupon.xpRequired) * 100);

          return (
            <motion.div
              key={coupon.id}
              whileHover={isUnlocked ? { y: -5, scale: 1.02 } : {}}
              className={`glass-panel p-8 relative overflow-hidden group transition-all duration-500 ${
                !isUnlocked ? "opacity-75 grayscale" : "premium-glow"
              }`}
            >
              <div className="flex items-start justify-between mb-8">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${coupon.color} text-white shadow-lg`}>
                  {coupon.icon}
                </div>
                {isUnlocked ? (
                  <div className="flex items-center gap-2 bg-green-50 text-green-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Unlock size={12} /> Unlocked
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-100 text-gray-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Lock size={12} /> {coupon.xpRequired - totalXP} XP More
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-black text-gray-900 uppercase italic leading-none">
                  {coupon.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-400">Progression</span>
                  <span className={isUnlocked ? "text-green-500" : "text-pink-500"}>
                    {totalXP} / {coupon.xpRequired} XP
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full bg-gradient-to-r ${coupon.color}`}
                  />
                </div>
              </div>

              {isUnlocked && (
                <button className="w-full mt-8 btn-primary !py-4 shadow-xl">
                  Redeem Voucher
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 p-10 glass-panel bg-gray-900 text-white text-center space-y-4">
        <Zap className="mx-auto text-yellow-400 animate-pulse" size={40} />
        <h2 className="text-2xl font-black uppercase italic tracking-widest">Mastering the Grind</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] max-w-xl mx-auto">
          Every task completed brings you closer to legendary status. Keep pushing operative.
        </p>
      </div>
    </div>
  );
};

export default Coupons;
