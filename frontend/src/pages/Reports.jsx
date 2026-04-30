import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDailyReport, getWeeklyReport, getMissedAnalysis } from "../services/api";
import { BarChart3, TrendingUp, AlertCircle, Calendar, Zap, Target, Trophy } from "lucide-react";

const Reports = () => {
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [d, w, a] = await Promise.all([
          getDailyReport(),
          getWeeklyReport(),
          getMissedAnalysis()
        ]);
        setDaily(d);
        setWeekly(w);
        setAnalysis(a);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-20 text-center font-black uppercase italic tracking-widest text-pink-500 animate-pulse">Analyzing Intel...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-8 space-y-12"
    >
      <header className="border-b border-pink-100 pb-12">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic mb-4">
          Productivity <span className="text-pink-500">Intel_</span>
        </h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Performance Metrics & Pattern Analysis</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Daily Stats */}
        <div className="glass-panel p-8 space-y-6 border-pink-100">
          <div className="flex items-center gap-3 text-pink-500">
            <Calendar size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest">Daily Log</h3>
          </div>
          <div className="space-y-4">
            <StatRow label="Completed" value={daily?.completed} color="text-pink-600" />
            <StatRow label="Missed" value={daily?.missed} color="text-red-500" />
            <StatRow label="XP Earned" value={`+${daily?.xpEarned}`} color="text-yellow-500" />
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="glass-panel p-8 space-y-6 border-pink-100">
          <div className="flex items-center gap-3 text-pink-500">
            <BarChart3 size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest">7-Day Protocol</h3>
          </div>
          <div className="space-y-4">
            <StatRow label="Total Completed" value={weekly?.completed} color="text-pink-600" />
            <StatRow label="Peak Performance" value={weekly?.mostProductiveDay?.split(' ')[0]} color="text-green-500" />
            <StatRow label="Missions Failed" value={weekly?.missed} color="text-red-500" />
          </div>
        </div>

        {/* Analysis */}
        <div className="glass-panel p-8 space-y-6 border-pink-100">
          <div className="flex items-center gap-3 text-pink-500">
            <TrendingUp size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest">Missed Analysis</h3>
          </div>
          <div className="space-y-4">
            <StatRow label="Common Culprit" value={analysis?.mostCommonReason} color="text-red-500" />
            <StatRow label="Total Failures" value={analysis?.totalMissed} color="text-gray-900" />
            <div className="pt-2">
               <p className="text-[9px] font-bold text-gray-400 uppercase italic leading-relaxed">
                 "You often miss tasks due to {analysis?.mostCommonReason?.toLowerCase()}. Consider adjusting your schedule."
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Map */}
      <div className="glass-panel p-10 space-y-8">
         <div className="flex items-center justify-between">
           <h3 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
             <Target size={18} className="text-pink-500" /> Weekly Activity Map
           </h3>
           {weekly?.dailyStats?.length > 0 && Math.max(...weekly.dailyStats.map(s => s.count)) === 0 && (
             <span className="text-[10px] font-bold text-red-400 uppercase italic">No activity recorded this week</span>
           )}
         </div>
         
         <div className="flex items-end justify-between gap-2 h-48 pt-8">
            {(weekly?.dailyStats || []).map((stat) => {
              const maxCount = Math.max(...(weekly?.dailyStats || []).map(s => s.count), 5); // Default scale to 5 if low activity
              const heightPercentage = (stat.count / maxCount) * 100;
              const isToday = stat.day === new Date().toDateString();

              return (
                <div key={stat.day} className="flex-1 flex flex-col items-center gap-3 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {stat.count} Missions
                  </div>
                  
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPercentage, 2)}%` }} // Minimum 2% height for visibility
                    className={`w-full max-w-[40px] rounded-t-xl shadow-lg transition-all duration-500 ${
                      stat.count > 0 
                        ? 'bg-gradient-to-t from-pink-600 to-pink-400 shadow-pink-100' 
                        : 'bg-gray-100'
                    } ${isToday ? 'ring-2 ring-pink-500 ring-offset-2' : ''}`}
                  />
                  <span className={`text-[8px] font-black uppercase ${isToday ? 'text-pink-500' : 'text-gray-400'}`}>
                    {stat.day.split(' ')[0]}
                  </span>
                </div>
              );
            })}
         </div>
      </div>
    </motion.div>
  );
};

const StatRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <span className={`text-sm font-black uppercase italic ${color}`}>{value}</span>
  </div>
);

export default Reports;
