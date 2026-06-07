import React from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar.jsx";

export default function PageShell({ eyebrow, title, subtitle, children }) {
  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[250px_1fr]">
      <Sidebar />
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="min-w-0"
      >
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-950 via-cyan-950 to-teal-900 p-6 text-white shadow-glow">
          <p className="text-sm font-black uppercase text-cyan-200">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 max-w-3xl text-cyan-50">{subtitle}</p>}
        </div>
        {children}
      </motion.section>
    </main>
  );
}
