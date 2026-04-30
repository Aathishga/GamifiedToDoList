import { motion } from "framer-motion";
import { Package, Zap, Sparkles } from "lucide-react";
import { consumeItem } from "../services/api";

const InventoryUI = ({ inventory }) => {
  const handleUseItem = async (itemId) => {
    try {
      const updatedUser = await consumeItem(itemId);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload(); // Quick way to update state across app
    } catch (err) {
      console.error(err);
    }
  };

  const items = inventory || [];

  return (
    <div className="glass-panel p-8 space-y-8">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
        <Package size={14} className="text-pink-500" /> Inventory
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {items.length === 0 ? (
          <p className="col-span-2 text-[9px] text-gray-300 font-bold uppercase italic text-center py-4">
            No items in storage.
          </p>
        ) : (
          items.map((item) => (
            <motion.button
              key={item.itemId}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleUseItem(item.itemId)}
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-pink-50 hover:bg-white transition-all group"
            >
              <div className="text-pink-500 group-hover:scale-110 transition-transform">
                {item.itemId === "ENERGY_BOOST" ? <Zap size={16} /> : <Sparkles size={16} />}
              </div>
              <div className="text-center">
                <span className="text-[9px] font-black text-gray-900 uppercase block">{item.name}</span>
                <span className="text-[8px] font-bold text-pink-400 uppercase tracking-widest">x{item.quantity}</span>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryUI;
