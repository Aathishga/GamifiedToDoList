import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const XPBar = ({ xp }) => {
  const percent = xp % 100;

  return (
    <div className="xp-bar-bg relative group">
      <motion.div
        className="xp-bar-fill"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
      >
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white/20"
        />
        <Sparkles size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 animate-pulse" />
      </motion.div>
    </div>
  );
};

export default XPBar;