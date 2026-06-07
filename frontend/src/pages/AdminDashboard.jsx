import React from "react";
import { Activity, Gauge, ScanLine, Stethoscope, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getAnalytics, getScans } from "../api.js";
import { AnalyticsChart, RiskBarChart } from "../components/Charts.jsx";
import PageShell from "../components/PageShell.jsx";
import StatsCard from "../components/StatsCard.jsx";
import { activityLogs } from "../data/mockData.js";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [scans, setScans] = useState([]);

  async function refresh() {
    try {
      const [analyticsData, scansData] = await Promise.all([getAnalytics(), getScans()]);
      setAnalytics(analyticsData);
      setScans(scansData);
    } catch {
      setAnalytics(null);
      setScans([]);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <PageShell eyebrow="Admin Dashboard" title="Care operations overview" subtitle="Monitor scan volume, care-team activity, review progress, and patient service trends.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard icon={Users} label="Total Patients" value={analytics?.totalScans || 12840} />
        <StatsCard icon={Stethoscope} label="Total Doctors" value={312} />
        <StatsCard icon={ScanLine} label="Total Scans" value={analytics?.totalScans || 48200} />
        <StatsCard icon={Gauge} label="Review Confidence" value={94.8} suffix="%" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
        <AnalyticsChart />
        <section className="glass rounded-3xl p-5">
          <h2 className="mb-4 text-xl font-black dark:text-white">Risk Distribution</h2>
          <RiskBarChart />
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="glass rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black dark:text-white">User Management</h2>
            <button type="button" disabled title="User creation is handled from account registration." className="rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 px-4 py-2 font-black text-white opacity-70">Add User</button>
          </div>
          <div className="overflow-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                <tr>
                  <th className="py-3">Patient</th>
                  <th>Scan</th>
                  <th>Insight</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scans.slice(0, 8).map((scan) => (
                  <tr key={scan.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 font-bold">{scan.patientName}</td>
                    <td>{scan.scanType?.toUpperCase()}</td>
                    <td>{scan.prediction?.disease || "Pending"}</td>
                    <td><span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">{scan.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass rounded-3xl p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black dark:text-white"><Activity /> Activity Logs</h2>
          <div className="grid gap-3">
            {activityLogs.map((log) => (
              <div key={log} className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {log}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-cyan-50 p-5 dark:from-slate-900 dark:to-slate-800">
            <p className="font-black text-slate-950 dark:text-white">Service Health</p>
            <p className="mt-2 text-sm font-bold text-slate-500">Portal available, scan review flow normal, records accessible.</p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
