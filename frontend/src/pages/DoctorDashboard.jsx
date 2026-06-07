import React from "react";
import { Search, ShieldCheck, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { getScans, saveDoctorReview } from "../api.js";
import { ConfidenceChart } from "../components/Charts.jsx";
import ImageViewer from "../components/ImageViewer.jsx";
import PageShell from "../components/PageShell.jsx";
import ScanCard from "../components/ScanCard.jsx";

export default function DoctorDashboard({ notify }) {
  const [scans, setScans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  async function refresh() {
    try {
      const data = await getScans();
      setScans(data);
      setSelected((current) => current || data[0] || null);
    } catch {
      setScans([]);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.approved = form.approved.checked;
    await saveDoctorReview(payload);
    notify?.({ title: "Review saved", message: payload.approved ? "Case approved and report generated." : "Doctor recommendation added." });
    await refresh();
  }

  const filtered = scans.filter((scan) => `${scan.patientName} ${scan.id}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <PageShell eyebrow="Doctor Dashboard" title="Clinical review and approval" subtitle="Review patient cases, inspect scans, confirm guided insights, and generate final reports.">
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <section className="glass rounded-3xl p-5">
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <Search size={18} className="text-cyan-600" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients..." className="w-full bg-transparent outline-none" />
          </div>
          <h2 className="mb-4 text-xl font-black dark:text-white">Patient Queue</h2>
          <div className="grid max-h-[680px] gap-3 overflow-auto pr-1">
            {filtered.length ? filtered.map((scan) => <ScanCard key={scan.id} scan={scan} onReview={setSelected} />) : <p className="text-slate-500">No cases available.</p>}
          </div>
        </section>

        <section className="grid gap-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <ImageViewer title="Scan Viewer" src={selected?.file} badge={selected?.scanType?.toUpperCase()} />
            <div className="glass rounded-3xl p-5">
              <h2 className="text-xl font-black dark:text-white">Guided Insight Panel</h2>
              <div className="mt-4 rounded-3xl bg-gradient-to-br from-slate-950 to-cyan-950 p-5 text-white">
                <p className="text-sm font-bold text-cyan-200">Detected Condition</p>
                <p className="text-3xl font-black">{selected?.prediction?.disease || "Awaiting scan insight"}</p>
                <p className="mt-3 text-cyan-50">{selected?.prediction?.recommendation || "Upload a scan to prepare clinical recommendations."}</p>
              </div>
              <ConfidenceChart value={selected?.prediction?.confidenceValue || 78} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-3xl p-5">
            <h2 className="mb-4 text-xl font-black dark:text-white">Add Recommendations</h2>
            <input name="scanId" value={selected?.id || ""} readOnly className="mb-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900" />
            <input name="doctorName" defaultValue="Dr. Meera Rao" className="mb-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900" />
            <textarea name="remarks" rows="5" defaultValue="Scan findings reviewed. Recommend clinical correlation and follow-up." className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900" />
            <label className="mt-4 flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
              <input type="checkbox" name="approved" className="h-5 w-5" /> Approve Diagnosis
            </label>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="submit" disabled={!selected} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 px-5 py-3 font-black text-white disabled:opacity-50">
                <ShieldCheck size={18} /> Approve Diagnosis
              </button>
              <button type="submit" disabled={!selected} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-cyan-700 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900">
                <FileText size={18} /> Save Review
              </button>
            </div>
          </form>
        </section>
      </div>
    </PageShell>
  );
}
