import React from "react";
import { motion } from "framer-motion";
import { Activity, LogOut, Moon, Stethoscope, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth.jsx";

const navItems = [
  ["Home", "/"],
  ["Patient", "/patient"],
  ["Doctor", "/doctor"],
  ["Admin", "/admin"],
  ["Analysis", "/analysis"],
  ["Report", "/report"]
];

export default function Navbar({ darkMode, onToggleDark }) {
  const { user, signOut } = useAuth();
  const visibleNavItems = navItems.filter(([label]) => {
    if (!user) return ["Home"].includes(label);
    if (user.role === "patient") return ["Home", "Patient", "Analysis", "Report"].includes(label);
    if (user.role === "doctor") return ["Home", "Patient", "Doctor", "Analysis", "Report"].includes(label);
    return true;
  });

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-white/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 text-white shadow-lg shadow-cyan-500/25">
            <Stethoscope size={22} />
          </div>
          <div>
            <p className="text-lg font-black text-slate-950 dark:text-white">Medical Imaging Portal</p>
            <p className="flex items-center gap-1 text-xs font-bold text-cyan-700 dark:text-cyan-300">
              <Activity size={13} /> AI Diagnosis Suite
            </p>
          </div>
        </NavLink>

        <nav className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 p-1 dark:border-slate-800 dark:bg-slate-900/80">
          {visibleNavItems.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-extrabold transition ${
                  isActive ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow" : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button type="button" onClick={onToggleDark} className="rounded-xl bg-white p-2 text-slate-700 shadow-sm dark:bg-slate-800 dark:text-cyan-200">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-extrabold text-white dark:bg-white dark:text-slate-950">
              <LogOut size={16} /> {user.role}
            </button>
          ) : (
            <NavLink to="/auth" className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-3 py-2 text-sm font-extrabold text-white shadow">
              Sign In
            </NavLink>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
