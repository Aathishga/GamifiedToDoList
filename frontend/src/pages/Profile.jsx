import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateRole, getUserDNA, updateAvatar } from "../services/api";
import { motion } from "framer-motion";
import { Shield, Target, BookOpen, Fingerprint, Clock, Activity, Ghost, Zap, Sword, Smile, User, Camera } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [dna, setDna] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchDNA();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchDNA = async () => {
    try {
      const data = await getUserDNA();
      setDna(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarChange = async (avatarId) => {
    try {
      const updatedUser = await updateAvatar(avatarId);
      const fullUser = { ...JSON.parse(localStorage.getItem("user")), ...updatedUser };
      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      const updatedUser = await updateRole(newRole);
      const fullUser = { ...JSON.parse(localStorage.getItem("user")), ...updatedUser };
      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
    } catch (err) {
      console.error(err);
    }
  };

  const getInsight = () => {
    if (!dna || !dna.stats) return "Gathering data...";
    const { hourStats } = dna.stats;
    const hours = Object.keys(hourStats);
    if (hours.length === 0) return "Start completing tasks to see patterns!";
    
    const peakHour = hours.reduce((a, b) => hourStats[a] > hourStats[b] ? a : b);
    const period = peakHour < 12 ? "morning" : peakHour < 18 ? "afternoon" : "night";
    
    return `You are most productive in the ${period}.`;
  };

  const avatars = [
    { id: "warrior-1", icon: <Sword size={30} />, label: "Blade Master" },
    { id: "mage-1", icon: <Zap size={30} />, label: "Spark Caster" },
    { id: "ghost-1", icon: <Ghost size={30} />, label: "Stealth Operative" },
    { id: "happy-1", icon: <Smile size={30} />, label: "Optimist" },
    { id: "focus-1", icon: <Target size={30} />, label: "Deadeye" },
  ];

  const getAvatarIcon = (id) => {
    const avatar = avatars.find(a => a.id === id);
    return avatar ? avatar.icon : <User size={40} />;
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto text-gray-900 font-sans antialiased"
    >
      
      <div className="mb-16">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic"
        >
          Operative Dossier<span className="text-pink-500 animate-pulse">_</span>
        </motion.h1>
        <p className="text-[10px] font-black text-pink-300 uppercase tracking-[0.5em] mt-4">Analyzing performance parameters...</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* 🧑 USER STATS CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-16 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 bg-gray-900 p-2 rounded-[3rem] shadow-2xl shadow-pink-200 mb-12 relative group"
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 rounded-[2.5rem] flex items-center justify-center text-white font-black text-7xl italic">
              {getAvatarIcon(user.avatar)}
            </div>
          </motion.div>
          
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic mb-2 leading-none">
            {user.username}
          </h2>
          <p className="text-pink-600 font-black text-[10px] uppercase tracking-[0.4em] mb-12 border-b-2 border-pink-50 pb-6 w-full italic text-center">
            {user.title}
          </p>

          {/* AVATAR GALLERY */}
          <div className="w-full mb-12">
            <h3 className="text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
               <Camera size={12} className="text-pink-500" /> Identity Skins
            </h3>
            <div className="flex justify-center gap-4">
               {avatars.map((av) => (
                 <button
                   key={av.id}
                   onClick={() => handleAvatarChange(av.id)}
                   className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                     user.avatar === av.id 
                     ? "bg-pink-600 text-white scale-110 shadow-lg" 
                     : "bg-gray-100 text-gray-400 hover:bg-pink-50"
                   }`}
                 >
                   {av.icon}
                 </button>
               ))}
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-50 p-8 rounded-[2.5rem] text-center border border-pink-50/50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Missions Done</p>
              <p className="text-4xl font-black text-gray-900 italic tracking-tighter">{user.totalMissionsCompleted || 0}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-pink-600 p-8 rounded-[2.5rem] text-center text-white shadow-xl shadow-pink-100">
              <p className="text-[10px] font-black text-pink-200 uppercase tracking-widest mb-3">World Streak</p>
              <p className="text-4xl font-black italic tracking-tighter">{user.streak}D</p>
            </motion.div>
          </div>

          {/* BADGES */}
          <div className="w-full mt-16">
            <h3 className="text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <span className="w-8 h-px bg-pink-100"></span>
              Certifications Issued
            </h3>
            <div className="flex flex-wrap gap-3">
              {user.badges && user.badges.length > 0 ? (
                user.badges.map((badge, idx) => (
                  <motion.span 
                    key={idx} 
                    whileHover={{ scale: 1.1, backgroundColor: "#db2777", color: "#fff" }}
                    className="bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl italic border border-pink-100 transition-colors"
                  >
                    {badge}
                  </motion.span>
                ))
              ) : (
                <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic animate-pulse">Scanning for achievement data...</span>
              )}
            </div>
          </div>

        </motion.div>

        {/* 🧬 TASK DNA & INSIGHTS */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="glass-panel p-12 space-y-12">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <Fingerprint size={16} className="text-pink-500" /> Task DNA Analysis
            </h3>

            <div className="space-y-8">
              <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100">
                <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Activity size={12} /> Productivity Peak
                </p>
                <p className="text-xl font-black text-gray-900 italic">{getInsight()}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Analyzed</p>
                  <p className="text-2xl font-black text-gray-900 italic">{dna?.patterns?.length || 0}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Stability</p>
                  <p className="text-2xl font-black text-gray-900 italic">High</p>
                </div>
              </div>

              {/* ROLE SELECTION */}
              <div className="pt-8 border-t border-pink-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Change Operative Class</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "Warrior", icon: <Shield size={14} />, color: "bg-red-500" },
                    { id: "Developer", icon: <Target size={14} />, color: "bg-blue-500" },
                    { id: "Student", icon: <BookOpen size={14} />, color: "bg-green-500" },
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleChange(role.id)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all border-2 ${
                        user.role === role.id 
                        ? "border-pink-500 bg-pink-50/30" 
                        : "border-transparent bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className={`${user.role === role.id ? 'text-pink-500' : 'text-gray-400'}`}>
                        {role.icon}
                      </div>
                      <span className={`text-[9px] font-black uppercase ${user.role === role.id ? 'text-pink-600' : 'text-gray-500'}`}>
                        {role.id}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Profile;
