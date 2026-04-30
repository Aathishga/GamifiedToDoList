import { completeTask, completeSubStep, markAsMissed, deleteTask } from "../services/api";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sword, Timer, CheckCircle, Circle, ShieldAlert, Heart, Sparkles, AlertTriangle, X, Trash2 } from "lucide-react";

const MissionCard = ({ task, user, onComplete, onDelete, highlight }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [bossHealth, setBossHealth] = useState(task.isBoss && (!task.subSteps || task.subSteps.length === 0) ? 0 : task.bossHealth);
  const [subSteps, setSubSteps] = useState(task.subSteps || []);
  const [timeLeft, setTimeLeft] = useState(task.timer ? task.timer * 60 : null);

  // ⏱️ TIMER LOGIC
  useEffect(() => {
    if (timeLeft === null) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [task._id]); // Reset only if task ID changes

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleComplete = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    setError("");
    try {
      const res = await completeTask(task._id);
      onComplete(task._id, res);

      if (res.leveledUp) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#db2777', '#f472b6', '#ffffff']
        });
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data || "Objective synchronization failed.");
      setIsCompleting(false);
    }
  };

  const handleSubStep = async (idx) => {
    if (subSteps[idx].completed) return;
    try {
      const res = await completeSubStep(task._id, idx);
      setBossHealth(res.bossHealth);
      const newSteps = [...subSteps];
      newSteps[idx].completed = true;
      setSubSteps(newSteps);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMissed = async (reason) => {
    setIsCompleting(true);
    try {
      const res = await markAsMissed(task._id, reason);
      onComplete(task._id, res);
    } catch (err) {
      console.error(err);
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // auto-reset after 3s
      return;
    }
    setIsDeleting(true);
    try {
      await deleteTask(task._id);
      onDelete(task._id);
    } catch (err) {
      setError("Failed to terminate mission.");
      setIsDeleting(false);
    }
  };

  const isOverdue = task.dueDate && new Date() > new Date(task.dueDate);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: highlight ? 1.02 : 1,
        borderColor: highlight ? "#db2777" : "#fdf2f8"
      }}
      whileHover={{ y: -5 }}
      className={`glass-panel p-8 relative overflow-hidden group ${task.isBoss ? 'border-2 border-pink-200' : ''}`}
    >
      {/* ⚔️ BOSS INDICATOR BACKGROUND */}
      {task.isBoss && (
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Sword size={200} />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
            <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${
              task.difficulty === "Hard" ? "bg-red-500 text-white" : 
              task.difficulty === "Medium" ? "bg-pink-500 text-white" : 
              "bg-pink-50 text-pink-600"
            }`}>
              {task.isBoss ? "BOSS MISSION" : task.difficulty}
            </span>
            {timeLeft !== null && (
              <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase flex items-center gap-1 ${timeLeft < 60 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'}`}>
                <Timer size={10} /> {timeLeft > 0 ? formatTime(timeLeft) : "EXPIRED"}
              </span>
            )}
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{task.category}</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900 leading-tight uppercase italic group-hover:text-pink-600 transition-colors">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider italic leading-relaxed max-w-xl">
                {task.description}
              </p>
            )}
          </div>

          {/* 🛡️ BOSS HEALTH BAR */}
          {task.isBoss && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1">
                  <Heart size={10} /> Enemy Health
                </span>
                <span className="text-[10px] font-black text-red-500">{Math.round(bossHealth)}%</span>
              </div>
              <div className="h-3 w-full bg-red-50 rounded-full overflow-hidden border border-red-100 p-0.5">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: `${bossHealth}%` }}
                  className="h-full bg-gradient-to-r from-red-500 to-pink-600 rounded-full"
                />
              </div>
            </div>
          )}

          {/* 📋 SUB-STEPS */}
          {subSteps.length > 0 && (
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {subSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubStep(idx)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                    step.completed 
                    ? "bg-pink-50 border-pink-100 text-pink-300" 
                    : "bg-white border-pink-50 text-gray-600 hover:border-pink-200"
                  }`}
                >
                  {step.completed ? <CheckCircle size={14} /> : <Circle size={14} />}
                  <span className="text-[10px] font-black uppercase italic">{step.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 min-w-[160px]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isCompleting || (task.isBoss && bossHealth > 0)}
            onClick={handleComplete}
            className={`${
              isCompleting || (task.isBoss && bossHealth > 0)
                ? "bg-gray-100 text-gray-300 cursor-not-allowed border-none px-8 py-5 rounded-[1.5rem]" 
                : "btn-secondary !text-[11px] !px-8 !py-5 shadow-xl"
            }`}
          >
            {isCompleting ? "Defeating..." : task.isBoss ? <><Sword size={14} /> Final Blow</> : <><Sparkles size={14} /> Complete</>}
          </motion.button>
          
          {isOverdue && (
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setShowReasonModal(true)}
               className="bg-red-50 text-red-500 p-4 rounded-2xl border border-red-100 text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
             >
                <AlertTriangle size={12} /> Declare Failure
             </motion.button>
          )}

          {task.isBoss && bossHealth > 0 && (
            <p className="text-[8px] text-center text-red-400 font-black uppercase italic animate-pulse">
              Finish sub-steps to weaken the boss!
            </p>
          )}

          {error && (
            <p className="text-[8px] text-center text-red-500 font-black uppercase italic bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          {/* 🗑️ DELETE BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            disabled={isDeleting}
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all ${
              confirmDelete
                ? 'bg-red-500 text-white border-red-500 animate-pulse'
                : 'bg-white text-gray-300 border-gray-100 hover:bg-red-50 hover:text-red-400 hover:border-red-100'
            }`}
          >
            <Trash2 size={11} />
            {isDeleting ? 'Terminating...' : confirmDelete ? 'Confirm Termination' : 'Terminate'}
          </motion.button>
        </div>
      </div>

      {/* ❗ MISSED REASON MODAL */}
      <AnimatePresence>
        {showReasonModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
          >
            <button 
              onClick={() => setShowReasonModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <AlertTriangle className="text-red-500 mb-4" size={40} />
            <h4 className="text-lg font-black text-gray-900 uppercase italic mb-2">Mission Failed</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">What compromised the objective?</p>
            
            <div className="grid gap-3 w-full max-w-xs">
              {["Too difficult", "No time", "Forgot"].map(reason => (
                <button
                  key={reason}
                  onClick={() => handleMissed(reason)}
                  className="bg-gray-50 hover:bg-red-50 hover:text-red-500 border border-gray-100 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  {reason}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MissionCard;