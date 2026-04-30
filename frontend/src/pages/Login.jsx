import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Key, User } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 antialiased bg-white relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-100/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-100/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="glass-panel w-full max-w-5xl flex flex-col md:flex-row overflow-hidden shadow-2xl relative z-10"
      >
        <div className="w-full md:w-5/12 bg-gradient-to-br from-pink-500 to-pink-700 p-16 text-white flex flex-col justify-center items-start relative overflow-hidden">
          <motion.div 
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,white,transparent)] opacity-10"
          ></motion.div>
          
          <h1 className="text-7xl font-black mb-6 italic uppercase tracking-tighter leading-none">
            Taskly<span className="text-pink-200">.</span>
          </h1>
          <p className="text-sm font-black uppercase tracking-[0.4em] opacity-60 italic">
            Focus Protocol Active
          </p>
        </div>

        <div className="w-full md:w-7/12 p-16 bg-white/50 backdrop-blur-md flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-black text-gray-900 mb-12 tracking-tighter uppercase italic">
              Authentication_
            </h2>

            <div className="space-y-8">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 transition-colors group-focus-within:text-pink-500 flex items-center gap-2">
                  <User size={12} /> Operative ID
                </label>
                <input
                  className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent text-gray-900 focus:bg-white focus:border-pink-500/20 focus:ring-0 font-bold uppercase italic text-sm transition-all shadow-inner"
                  placeholder="USERNAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 transition-colors group-focus-within:text-pink-500 flex items-center gap-2">
                  <Key size={12} /> Access Key
                </label>
                <input
                  className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent text-gray-900 focus:bg-white focus:border-pink-500/20 focus:ring-0 font-bold uppercase italic text-sm transition-all shadow-inner"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                className="btn-primary w-full !p-6 !text-xs !tracking-[0.4em] mt-8 shadow-2xl shadow-pink-200"
              >
                <Activity size={16} /> Establish Link
              </motion.button>
            </div>

            <p className="mt-16 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
              New to the system? <Link to="/signup" className="text-pink-600 font-black hover:underline italic ml-1">Generate Profile</Link>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;