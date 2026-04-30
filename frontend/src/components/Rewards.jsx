import React from "react";
import { motion } from "framer-motion";

const Rewards = ({ xp = 0 }) => {
  const rewards = [
    { id: 1, title: "Milestone: Amazon Premium", cost: 500 },
    { id: 2, title: "Achievement: Apple Elite", cost: 1000 },
    { id: 3, title: "Benefit: Sephora Gold", cost: 2000 },
    { id: 4, title: "Executive: Spa Pass", cost: 5000 },
  ];

  return (
    <div className="bg-white">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
        Rewards Loot
      </h2>
      <div className="space-y-10">
        {rewards.map((reward) => {
          const progress = Math.min((xp / reward.cost) * 100, 100);
          const unlocked = xp >= reward.cost;

          return (
            <div key={reward.id} className="group">
              <div className="flex justify-between items-end mb-3">
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${unlocked ? "text-gray-900" : "text-gray-400"}`}>
                    {reward.title}
                  </span>
                  {!unlocked && (
                    <span className="text-[9px] font-bold text-pink-300 uppercase tracking-widest">
                      {Math.max(reward.cost - xp, 0)} XP Remaining
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block">
                    {reward.cost} XP
                  </span>
                  <span className="text-[10px] font-black text-pink-500 italic">
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className={`h-full relative ${
                    unlocked 
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg shadow-pink-200" 
                      : "bg-pink-100"
                  }`}
                >
                  {/* Glossy overlay for the bar */}
                  <div className="absolute inset-0 bg-white/20 opacity-50"></div>
                </motion.div>
              </div>
              
              {unlocked && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[9px] font-bold text-pink-500 uppercase tracking-widest mt-2 flex items-center gap-1"
                >
                  <span className="w-1 h-1 bg-pink-500 rounded-full animate-ping"></span>
                  Claimable
                </motion.p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;

