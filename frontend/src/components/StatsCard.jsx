import React from "react";
import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter.jsx";

export default function StatsCard({ icon: Icon, label, value, suffix = "", accent = "from-cyan-500 to-teal-500" }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-3xl p-5">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}>
        {Icon && <Icon size={22} />}
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
    </motion.div>
  );
}
