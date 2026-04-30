import { motion } from "framer-motion";
import { Zap, Shield, Sparkles, Sword, Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const Skills = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [unlocked, setUnlocked] = useState(user.skills || []);

  const skillTree = [
    {
      id: "XP_BOOST_PASSIVE",
      name: "Neural Overclock",
      description: "Passive +10% XP gain on all missions.",
      cost: 5,
      levelRequired: 3,
      icon: <Sparkles className="text-pink-500" />
    },
    {
      id: "ENERGY_EFFICIENCY",
      name: "Biological Optimization",
      description: "Reduce energy cost of Hard missions by 5.",
      cost: 8,
      levelRequired: 5,
      icon: <Zap className="text-pink-500" />
    },
    {
      id: "PENALTY_RESISTANCE",
      name: "Temporal Aegis",
      description: "Reduce overdue XP penalty to 25% (was 50%).",
      cost: 10,
      levelRequired: 8,
      icon: <Shield className="text-pink-500" />
    }
  ];

  const handleUnlock = (skillId) => {
    if (unlocked.includes(skillId)) return;
    const newUnlocked = [...unlocked, skillId];
    setUnlocked(newUnlocked);
    const updatedUser = { ...user, skills: newUnlocked };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-16 px-6"
    >
      <div className="mb-16">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none mb-4">
          Skill Tree<span className="text-pink-500">_</span>
        </h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Unlock neural enhancements using legacy points.</p>
      </div>

      <div className="grid gap-8">
        {skillTree.map((skill) => {
          const isUnlocked = unlocked.includes(skill.id);
          const canUnlock = user.level >= skill.levelRequired;

          return (
            <motion.div 
              key={skill.id}
              whileHover={{ x: 10 }}
              className={`glass-panel p-8 flex items-center justify-between border-2 transition-all ${
                isUnlocked ? "border-pink-500 bg-pink-50/20" : "border-pink-50"
              }`}
            >
              <div className="flex items-center gap-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isUnlocked ? "bg-pink-500 text-white shadow-xl shadow-pink-200" : "bg-gray-100 text-gray-400"}`}>
                   {isUnlocked ? <Sword size={24} /> : skill.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 uppercase italic mb-1">{skill.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{skill.description}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-[9px] font-black text-pink-500 bg-pink-50 px-3 py-1 rounded-full uppercase">Req. Level {skill.levelRequired}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleUnlock(skill.id)}
                disabled={isUnlocked || !canUnlock}
                className={`${
                  isUnlocked 
                  ? "bg-green-500 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-2 uppercase italic text-[10px] cursor-default" 
                  : canUnlock 
                    ? "btn-secondary px-8" 
                    : "bg-gray-100 text-gray-300 font-black px-8 py-4 rounded-2xl flex items-center gap-2 uppercase italic text-[10px] cursor-not-allowed"
                }`}
              >
                {isUnlocked ? <><CheckCircle2 size={14} /> Active</> : canUnlock ? <><Zap size={14} /> Unlock Skill</> : <><Lock size={14} /> Locked</>}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Skills;
