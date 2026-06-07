import React from "react";
import { Download, FileText, Printer } from "lucide-react";
import PageShell from "../components/PageShell.jsx";

export default function ReportPage({ notify }) {
  function handleDownload() {
    notify?.({ title: "PDF download", message: "Connect this button to /api/report after selecting a real scan." });
  }

  return (
    <PageShell eyebrow="Medical Report" title="Professional diagnosis report" subtitle="Clean report layout for patient details, scan information, AI findings, doctor remarks, and PDF export.">
      <section className="mx-auto max-w-4xl">
        <div className="glass rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-200 pb-6 dark:border-slate-800">
            <div>
              <p className="flex items-center gap-2 text-sm font-black uppercase text-cyan-700"><FileText size={16} /> AI-Assisted Diagnostic Report</p>
              <h2 className="mt-2 text-3xl font-black dark:text-white">Medical Imaging Diagnosis Portal</h2>
              <p className="mt-2 text-slate-500">Report ID: REPORT-2026-001</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 px-4 py-3 font-black text-white"><Download size={18} /> PDF Download</button>
              <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-black text-cyan-700 dark:border-slate-800 dark:bg-slate-900"><Printer size={18} /> Print</button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Info title="Patient Details" rows={[["Name", "Aarav Sharma"], ["Patient ID", "PAT-1001"], ["Age", "42"], ["Gender", "Male"]]} />
            <Info title="Scan Information" rows={[["Scan Type", "X-Ray"], ["Body Region", "Chest"], ["Date", "June 1, 2026"], ["Status", "Doctor Reviewed"]]} />
          </div>

          <div className="mt-6 rounded-3xl bg-gradient-to-br from-slate-950 to-cyan-950 p-6 text-white">
            <p className="text-sm font-bold text-cyan-200">AI Findings</p>
            <h3 className="mt-2 text-3xl font-black">Pneumonia Detected</h3>
            <p className="mt-3 leading-7 text-cyan-50">The AI model identified lung opacity patterns associated with pneumonia. Confidence score is 94.2% with medium clinical risk. Radiologist confirmation is required.</p>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white/70 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="font-black dark:text-white">Doctor Remarks</p>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">AI findings reviewed. Recommend clinical correlation, symptom review, and follow-up imaging if clinically indicated.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Info({ title, rows }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 font-black dark:text-white">{title}</h3>
      <div className="grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <span className="font-bold text-slate-500">{label}</span>
            <span className="font-black dark:text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
