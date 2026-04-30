import MissionCard from "../components/MissionCard";
import XPBar from "../components/XPBar";
import Achievement from "../components/Achievement";
import MissionInput from "../components/MissionInput";
import Rewards from "../components/Rewards";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, updateMood } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Sparkles, Brain, Target, Shield, BookOpen, Sword, Map, Trophy, Package, Sparkle, Heart, Ghost, Smile, User as UserIcon } from "lucide-react";
import InventoryUI from "../components/InventoryUI";
import QuestTracker from "../components/QuestTracker";

const Dashboard = () => {
  const avatars = [
    { id: "warrior-1", icon: <Sword size={30} />, label: "Blade Master" },
    { id: "mage-1", icon: <Zap size={30} />, label: "Spark Caster" },
    { id: "ghost-1", icon: <Ghost size={30} />, label: "Stealth Operative" },
    { id: "happy-1", icon: <Smile size={30} />, label: "Optimist" },
    { id: "focus-1", icon: <Target size={30} />, label: "Deadeye" },
  ];

  const getAvatarIcon = (id) => {
    const avatar = avatars.find(a => a.id === id);
    return avatar ? avatar.icon : <UserIcon size={30} />;
  };

  // 👤 USER STATE
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        navigate("/");
      }
    };
    
    // Initial load
    handleStorageChange();
    
    // Listen for manual updates from other pages (like Shop)
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  // 📋 TASK STATE
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🏆 ACHIEVEMENT
  const [achievement, setAchievement] = useState("");

  // ❌ ERROR STATE
  const [error, setError] = useState("");
  
  // ✨ HIGHLIGHT TASK
  const [highlightTaskId, setHighlightTaskId] = useState(null);

  // 🎭 MOOD CHANGE
  const handleMoodChange = async (newMood) => {
    try {
      const updatedUser = await updateMood(newMood);
      const fullUser = { ...JSON.parse(localStorage.getItem("user")), ...updatedUser };
      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
    } catch (err) {
      console.error(err);
    }
  };

  // 🎲 SURPRISE ME
  const handleSurpriseMe = () => {
    if (tasks.length === 0) return;
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    setHighlightTaskId(randomTask._id);
    setTimeout(() => setHighlightTaskId(null), 3000);
  };

  // 🔮 FUTURE SELF SIMULATOR
  const predictLevelUp = () => {
    if (!user || tasks.length === 0) return "Analyzing...";
    const avgXP = 20; // assumed average
    const remainingXP = user.level * 100 - user.xp;
    const days = Math.ceil(remainingXP / (tasks.length * avgXP));
    return `Level ${user.level + 1} in approx. ${days} day${days !== 1 ? 's' : ''}`;
  };

  // 🏷️ ROLE LABELS
  const labels = {
    Warrior: { task: "Mission", tasks: "Missions", icon: <Shield size={14} /> },
    Developer: { task: "Ticket", tasks: "Tickets", icon: <Target size={14} /> },
    Student: { task: "Assignment", tasks: "Assignments", icon: <BookOpen size={14} /> },
  };
  const roleLabel = labels[user?.role || "Developer"];

  // 🎭 MOOD SUGGESTIONS
  const filteredTasks = tasks.filter(task => {
    if (user?.mood === "Tired") return task.difficulty === "Easy";
    if (user?.mood === "Stressed") return task.difficulty !== "Hard";
    return true;
  });

  // 📥 FETCH TASKS
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
        
        // 🔔 Request Notification Permission
        if ("Notification" in window && Notification.permission === "default") {
          Notification.requestPermission();
        }
      } catch (err) {
        setError("Failed to load tasks");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 🔔 NOTIFICATION LOGIC (1 Hour Before)
  useEffect(() => {
    if (tasks.length === 0) return;

    const checkDeadlines = () => {
      const now = new Date();
      tasks.forEach((task) => {
        if (!task.dueDate) return;
        
        const dueTime = new Date(task.dueDate);
        const diffInMs = dueTime - now;
        const oneHourInMs = 60 * 60 * 1000;

        // If deadline is within 1 hour (and hasn't passed)
        if (diffInMs > 0 && diffInMs <= oneHourInMs) {
          const notifiedKey = `notified_${task._id}`;
          if (!localStorage.getItem(notifiedKey)) {
            new Notification("🚨 Task Deadline Approaching!", {
              body: `"${task.title}" is due in less than 1 hour. Complete it now to avoid the 50% XP penalty!`,
              icon: "/favicon.ico"
            });
            localStorage.setItem(notifiedKey, "true");
          }
        }
      });
    };

    const interval = setInterval(checkDeadlines, 60000); // Check every minute
    checkDeadlines(); // Initial check

    return () => clearInterval(interval);
  }, [tasks]);

  // ➕ ADD TASK
  const addTask = (task) => {
    setTasks((prev) => {
      // 🛡️ Prevent Duplicates
      if (prev.find(t => t._id === task._id)) return prev;
      return [task, ...prev];
    });
  };

  // 🗑️ DELETE TASK
  const handleTaskDelete = (taskId) => {
    setTasks((prev) => prev.filter(t => t._id !== taskId));
  };

  // 🧭 WORLD MAP ZONES
  const getZone = () => {
    if (!user) return "Loading...";
    if (user.level >= 10) return "Productivity Arena";
    if (user.level >= 5) return "Focus Forest";
    return "Beginner Zone";
  };

  // ✅ COMPLETE TASK
  const handleTaskComplete = (taskId, data) => {

    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = {
      ...savedUser,
      xp: (savedUser.xp || 0) + data.xpGained,
      streak: data.streak,
      level: data.level,
      energy: data.energy,
      title: data.title,
      questProgress: data.questProgress
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    setTasks((prev) => prev.filter((t) => t._id !== taskId));

    if (data.eventMessage) {
      setAchievement(data.eventMessage);
    } else if (data.burnoutWarning) {
      setAchievement("⚠️ Burnout Detected: XP reduced.");
    } else if (data.comboBonus) {
      setAchievement("🔥 Triple Combo! +20 XP");
    } else if (data.leveledUp) {
      setAchievement(`🆙 LEVEL UP! Welcome to ${getZone()}`);
    } else {
      setAchievement(`+${data.xpGained} XP Gained`);
    }
  };

  // 🧠 AUTO HIDE ACHIEVEMENT
  useEffect(() => {
    if (!achievement) return;

    const timer = setTimeout(() => {
      setAchievement("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [achievement]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-transparent text-gray-900 max-w-6xl mx-auto font-sans antialiased px-4 py-8"
    >
      {/* ⚔️ RPG HEADER: CHARACTER DOSSIER */}
      <div className="mb-12 flex flex-col xl:flex-row items-start justify-between gap-10 border-b border-pink-100 pb-12">
        <div className="flex items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 bg-gray-900 rounded-[2rem] p-1 shadow-2xl shadow-pink-200 relative group"
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-pink-600 rounded-[1.8rem] flex items-center justify-center text-white text-4xl font-black italic">
              {getAvatarIcon(user?.avatar)}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1.5 rounded-xl shadow-xl border border-pink-50 text-[9px] font-black text-pink-600 uppercase italic">
              LVL {user?.level}
            </div>
          </motion.div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-black text-pink-500 bg-pink-50 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <Trophy size={10} /> {user?.title}
              </span>
              <span className="text-[9px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <Map size={10} /> {getZone()}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              {user?.username}<span className="text-pink-500">_</span>
            </h1>
          </div>
        </div>

        {/* 🎭 MOOD SELECTOR */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-2.5 rounded-[1.5rem] border border-pink-50 shadow-sm">
            {[
              { m: "Happy", emoji: "😊", desc: "Happy: Shows all active missions" },
              { m: "Neutral", emoji: "😐", desc: "Neutral: Shows all active missions" },
              { m: "Tired", emoji: "😴", desc: "Tired: Only shows Easy missions to prevent burnout" },
              { m: "Stressed", emoji: "😰", desc: "Stressed: Hides Hard missions to keep things manageable" }
            ].map(({ m, emoji, desc }) => (
              <button
                key={m}
                title={desc}
                onClick={() => handleMoodChange(m)}
                className={`text-[12px] font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                  user?.mood === m 
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-200" 
                  : "text-gray-400 hover:bg-pink-50/50"
                }`}
              >
                <span>{emoji}</span>
                <span className="text-[9px] uppercase tracking-widest hidden sm:inline">{m}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-12">
        <MissionInput addTask={addTask} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* 🌟 LEFT COLUMN: QUESTS & INVENTORY (3 cols) */}
        <div className="lg:col-span-3 space-y-12 order-2 lg:order-1">
          <QuestTracker progress={user?.questProgress} />
          <InventoryUI inventory={user?.inventory} />
        </div>

        {/* 🌟 MIDDLE COLUMN: MISSIONS (6 cols) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-6 space-y-12 order-1 lg:order-2"
        >
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-pink-50 pb-6">
              <div className="flex items-center gap-4">
                <Target className="text-pink-500" size={18} />
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] italic">Active Missions</h2>
                <span className="text-[10px] font-black text-pink-500 bg-pink-50 px-3 py-1 rounded-full uppercase">{filteredTasks.length}</span>
              </div>
              <button 
                onClick={handleSurpriseMe}
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-pink-600 transition-all shadow-xl shadow-pink-100"
              >
                <Sparkles size={12} /> Surprise Me
              </button>
            </div>

            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <motion.div key={task._id} layout>
                    <MissionCard
                      task={task}
                      user={user}
                      onComplete={handleTaskComplete}
                      onDelete={handleTaskDelete}
                      highlight={highlightTaskId === task._id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* 🌟 RIGHT COLUMN: XP & ENERGY (3 cols) */}
        <div className="lg:col-span-3 space-y-12 order-3">
          <div className="glass-panel p-10 space-y-12 lg:sticky lg:top-12">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Heart size={12} className="text-red-400" /> Vitality
                </h3>
                <span className="text-[10px] font-black text-pink-500">{user?.energy}/100</span>
              </div>
              <div className="xp-bar-bg h-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, user?.energy || 0)}%` }}
                  className="h-full bg-gradient-to-r from-pink-400 to-pink-600"
                />
              </div>
              <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-2">
                ⏰ Resets at midnight
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Zap size={12} className="text-yellow-400" /> Experience
                </h3>
                <span className="text-[10px] font-black text-pink-500">{user?.xp % 100} / 100</span>
              </div>
              <XPBar xp={user?.xp} />
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-pink-400 italic">
                <Brain size={12} /> {predictLevelUp()}
              </div>
            </div>

            <div className="pt-8 border-t border-pink-50 space-y-6">
               <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Rank</span>
                 <span className="text-[10px] font-black text-gray-900 uppercase italic">Master</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fire Streak</span>
                 <span className="text-[10px] font-black text-pink-500 uppercase italic">{user?.streak} Days</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {achievement && <Achievement text={achievement} />}

    </motion.div>
  );
};

export default Dashboard;