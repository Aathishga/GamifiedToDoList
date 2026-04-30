import { motion } from "framer-motion";
import { Trophy, Target, Calendar } from "lucide-react";

const QuestTracker = ({ progress }) => {
  if (!progress) return null;

  const quests = [
    {
      id: "daily",
      title: "Daily Quest",
      description: "Complete 3 missions",
      current: progress.dailyMissions || 0,
      total: 3,
      icon: <Target size={14} className="text-pink-500" />
    },
    {
      id: "weekly",
      title: "Weekly Quest",
      description: "Complete 10 missions",
      current: progress.weeklyMissions || 0,
      total: 10,
      icon: <Calendar size={14} className="text-pink-500" />
    }
  ];

  return (
    <div className="glass-panel p-8 space-y-8 animate-soft-pulse">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
        <Trophy size={14} className="text-pink-500" /> Active Quests
      </h3>
      
      <div className="space-y-6">
        {quests.map((q) => (
          <div key={q.id} className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {q.icon}
                <span className="text-[10px] font-black text-gray-900 uppercase italic">{q.title}</span>
              </div>
              <span className="text-[10px] font-black text-pink-500 bg-pink-50 px-2 py-1 rounded-md">
                {q.current}/{q.total}
              </span>
            </div>
            <div className="xp-bar-bg h-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (q.current / q.total) * 100)}%` }}
                className="h-full bg-pink-500"
              />
            </div>
            <p className="text-[9px] text-gray-400 font-bold italic uppercase tracking-widest">{q.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestTracker;
