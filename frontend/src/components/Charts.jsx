import React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { analyticsData } from "../data/mockData.js";

export function AnalyticsChart() {
  return (
    <div className="glass h-80 rounded-3xl p-5">
      <h3 className="mb-4 font-black text-slate-950 dark:text-white">Scan Volume and Accuracy</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={analyticsData}>
          <defs>
            <linearGradient id="scans" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="scans" stroke="#06b6d4" fill="url(#scans)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConfidenceChart({ value = 94 }) {
  const data = [{ name: "Confidence", value }, { name: "Remaining", value: 100 - value }];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={70} outerRadius={95} startAngle={90} endAngle={-270}>
          <Cell fill="#06b6d4" />
          <Cell fill="#e2e8f0" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RiskBarChart() {
  const data = [
    { risk: "Low", count: 42 },
    { risk: "Medium", count: 28 },
    { risk: "High", count: 12 }
  ];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="risk" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#14b8a6" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
