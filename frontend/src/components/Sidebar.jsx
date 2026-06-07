import React from "react";
import { NavLink } from "react-router-dom";
import { Activity, FileText, Gauge, LayoutDashboard, ScanLine, Users } from "lucide-react";

const links = [
  { to: "/patient", label: "Patient", icon: LayoutDashboard },
  { to: "/doctor", label: "Doctor", icon: Users },
  { to: "/admin", label: "Admin", icon: Gauge },
  { to: "/analysis", label: "Scan Analysis", icon: ScanLine },
  { to: "/report", label: "Report", icon: FileText }
];

export default function Sidebar() {
  return (
    <aside className="glass sticky top-24 hidden h-[calc(100vh-7rem)] rounded-3xl p-3 lg:block">
      <div className="mb-5 flex items-center gap-3 px-3 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white">
          <Activity size={20} />
        </div>
        <div>
          <p className="font-black text-slate-950 dark:text-white">MedAI</p>
          <p className="text-xs font-bold text-slate-500">Clinical OS</p>
        </div>
      </div>
      <nav className="grid gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                isActive ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg" : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
