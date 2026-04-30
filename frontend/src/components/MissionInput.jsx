import { useState } from "react";
import { createTask } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Sword, List, Timer, Sparkles, Zap, Shield, Activity, X } from "lucide-react";

const MissionInput = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [description, setDescription] = useState("");
  const [isBoss, setIsBoss] = useState(false);
  const [timer, setTimer] = useState("");
  const [subSteps, setSubSteps] = useState([]);
  const [newSubStep, setNewSubStep] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isRiskMode, setIsRiskMode] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState("daily");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const handleAddSubStep = () => {
    if (!newSubStep) return;
    setSubSteps([...subSteps, { title: newSubStep, completed: false }]);
    setNewSubStep("");
  };

  const handleAdd = async () => {
    if (!title || isAdding) return;
    setIsAdding(true);
    setError("");

    try {
      const newTask = await createTask({
        title,
        difficulty,
        description,
        isBoss,
        isRiskMode,
        timer: timer ? parseInt(timer) : undefined,
        subSteps,
        isRecurring,
        recurrenceType: isRecurring ? recurrenceType : "",
        category: "Work",
      });

      addTask(newTask);
      setTitle("");
      setDescription("");
      setIsBoss(false);
      setIsRiskMode(false);
      setIsRecurring(false);
      setTimer("");
      setSubSteps([]);
      setShowAdvanced(false);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to deploy mission protocol.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-100 p-4 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-3"
          >
            <Shield size={14} className="animate-pulse" /> {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 flex flex-col items-stretch border-pink-100 premium-glow"
      >
        <div className="flex flex-col 2xl:flex-row items-center gap-6">
          <div className="relative flex-1 w-full">
            <Sword className="absolute left-6 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
            <input
              className="w-full bg-gray-50/50 border-none text-gray-900 placeholder-pink-200 focus:ring-2 focus:ring-pink-500 rounded-[2rem] pl-16 pr-8 py-7 font-black uppercase italic text-lg md:text-xl tracking-tighter transition-all"
              placeholder="Deploy next mission protocol..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

            <div className="flex flex-wrap items-center justify-center gap-4 w-full xl:w-auto p-2">
              <div className="relative min-w-[120px]">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={14} />
                <select
                  className="w-full bg-white border-2 border-pink-50 text-gray-900 focus:ring-2 focus:ring-pink-500 rounded-2xl pl-10 pr-6 py-4 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-pink-200 transition-all appearance-none"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="Easy">Beginner</option>
                  <option value="Medium">Advanced</option>
                  <option value="Hard">Elite</option>
                </select>
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="btn-secondary !px-8 !py-4 shadow-xl shadow-gray-100 flex items-center gap-3 whitespace-nowrap"
              >
                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <Activity size={14} />
                Options
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAdding}
                onClick={handleAdd}
                className={`${isAdding ? "bg-gray-100 text-gray-400 border-none cursor-not-allowed px-10 py-5 rounded-2xl" : "btn-primary !px-10 !py-5 shadow-2xl shadow-pink-200 whitespace-nowrap"}`}
              >
                {isAdding ? "Syncing..." : <><Zap size={18} className="animate-pulse" /> Deploy Mission</>}
              </motion.button>
            </div>
          </div>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-t border-pink-50 mt-4 pt-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Story / Description */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={12} className="text-pink-400" /> Narrative Mode
                  </label>
                  <textarea
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-[11px] font-bold text-gray-600 focus:ring-1 focus:ring-pink-500 min-h-[100px]"
                    placeholder="Enter the mission backstory..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Sub-steps & Mechanics */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-pink-50/50 hover:border-pink-200 transition-colors">
                       <input 
                         type="checkbox" 
                         id="isBoss" 
                         checked={isBoss} 
                         onChange={(e) => setIsBoss(e.target.checked)}
                         className="w-5 h-5 text-pink-600 rounded-lg focus:ring-pink-500 border-gray-300 cursor-pointer"
                       />
                       <label htmlFor="isBoss" className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                         <Sword size={12} className="text-pink-500" /> Boss Mission
                       </label>
                    </div>

                    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-pink-50/50 hover:border-pink-200 transition-colors">
                       <input 
                         type="checkbox" 
                         id="isRiskMode" 
                         checked={isRiskMode} 
                         onChange={(e) => setIsRiskMode(e.target.checked)}
                         className="w-5 h-5 text-red-600 rounded-lg focus:ring-red-500 border-gray-300 cursor-pointer"
                       />
                       <label htmlFor="isRiskMode" className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                         <Shield size={12} /> Risk Mode
                       </label>
                    </div>

                    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-pink-50/50 hover:border-pink-200 transition-colors">
                       <Timer size={14} className="text-gray-400" />
                       <input 
                         type="number" 
                         placeholder="Timer (min)" 
                         className="bg-transparent border-none p-0 text-[10px] font-black w-full focus:ring-0 placeholder-gray-300"
                         value={timer}
                         onChange={(e) => setTimer(e.target.value)}
                       />
                    </div>

                    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-pink-50/50 hover:border-pink-200 transition-colors">
                       <input 
                         type="checkbox" 
                         id="isRecurring" 
                         checked={isRecurring} 
                         onChange={(e) => setIsRecurring(e.target.checked)}
                         className="w-5 h-5 text-purple-600 rounded-lg focus:ring-purple-500 border-gray-300 cursor-pointer"
                       />
                       <label htmlFor="isRecurring" className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                         Recurring
                       </label>
                       {isRecurring && (
                         <select 
                           value={recurrenceType}
                           onChange={(e) => setRecurrenceType(e.target.value)}
                           className="bg-transparent border-none p-0 text-[10px] font-black text-purple-500 uppercase tracking-widest focus:ring-0 cursor-pointer ml-auto"
                         >
                           <option value="daily">Daily</option>
                           <option value="weekly">Weekly</option>
                         </select>
                       )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <List size={12} className="text-pink-400" /> Objective Steps
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-[10px] font-black focus:ring-1 focus:ring-pink-500"
                        placeholder="Add sub-objective (Press Enter)..."
                        value={newSubStep}
                        onChange={(e) => setNewSubStep(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubStep();
                          }
                        }}
                      />
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddSubStep();
                        }}
                        className="btn-primary !px-6 !py-3 !text-[9px] !rounded-xl shadow-md"
                      >
                        <Sparkles size={12} className="animate-pulse" /> Deploy Step
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subSteps.map((s, i) => (
                        <span key={i} className="bg-pink-50 text-pink-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase italic border border-pink-100 flex items-center gap-2">
                          {s.title}
                          <button 
                            onClick={() => setSubSteps(subSteps.filter((_, idx) => idx !== i))}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MissionInput;