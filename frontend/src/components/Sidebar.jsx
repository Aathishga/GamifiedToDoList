import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Sword, User, LogOut, Activity, Zap, BarChart3, Ticket, ShoppingBag } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Skills", path: "/skills", icon: <Sword size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
    { name: "Armory", path: "/shop", icon: <ShoppingBag size={18} /> },
    { name: "Coupons", path: "/coupons", icon: <Ticket size={18} /> },
    { name: "My Profile", path: "/profile", icon: <User size={18} /> },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className="w-72 h-screen fixed left-0 top-0 p-8 flex flex-col hidden md:flex z-50 glass-sidebar overflow-y-auto custom-scrollbar"
    >
      <div className="flex-1 flex flex-col">
        
        <div className="mb-16 relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -left-12 -top-12 opacity-5"
          >
            <Activity size={120} />
          </motion.div>
          <motion.h1 
            whileHover={{ scale: 1.05 }}
            className="text-3xl font-black tracking-tighter text-gray-900 cursor-default flex items-center gap-2"
          >
            <Sword className="text-pink-500" size={24} />
            Taskly<span className="text-pink-500 animate-pulse">.</span>
          </motion.h1>
          <p className="text-[10px] font-black text-pink-300 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Zap size={10} /> Neural Link Active
          </p>
        </div>

        <motion.div 
          whileHover={{ x: 5 }}
          className="mb-12 p-4 bg-pink-50/50 rounded-2xl flex items-center gap-4 border border-pink-100/50"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-pink-200">
            {user.username ? user.username[0].toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tighter">{user.username}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <p className="text-[9px] font-black text-pink-500 uppercase tracking-widest">Level {user.level}</p>
            </div>
          </div>
        </motion.div>

        <nav className="space-y-3">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <motion.div key={link.name} whileHover={{ x: 8 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight ${
                    isActive
                       ? "bg-pink-600 text-white shadow-xl shadow-pink-200"
                      : "text-gray-400 hover:text-pink-500 hover:bg-pink-50"
                  }`}
                >
                  <span className={`${isActive ? "text-white" : "text-pink-500"}`}>{link.icon}</span>
                  <span className="uppercase italic tracking-tighter text-[11px] font-black">{link.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-pink-50">
          <motion.button
            whileHover={{ x: 5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full px-6 py-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 border border-red-100 shadow-sm shadow-red-50"
          >
            <div className="bg-red-500 text-white p-1.5 rounded-lg">
              <LogOut size={12} />
            </div>
            Terminate Session
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
