import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ toast, onClose }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-cyan-100 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-cyan-500" />
            <div>
              <p className="font-black text-slate-950 dark:text-white">{toast.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{toast.message}</p>
            </div>
            <button type="button" onClick={onClose} className="ml-2 text-slate-400">x</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
