import React from "react";
import { api } from "../api.js";

export default function ImageViewer({ title, src, badge }) {
  return (
    <div className="glass rounded-3xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-black text-slate-950 dark:text-white">{title}</h3>
        {badge && <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700">{badge}</span>}
      </div>
      {src ? (
        <img src={src.startsWith("http") ? src : `${api.defaults.baseURL}${src}`} alt={title} className="aspect-square w-full rounded-2xl border border-slate-200 object-cover dark:border-slate-800" />
      ) : (
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-cyan-200 bg-cyan-50 text-sm font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          No image selected
        </div>
      )}
    </div>
  );
}
