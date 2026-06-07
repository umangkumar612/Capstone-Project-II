import React from "react";
export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800" />
      ))}
    </div>
  );
}
