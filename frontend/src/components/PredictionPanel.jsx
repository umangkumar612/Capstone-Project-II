import React from "react";
import { useState } from "react";
import { api, generateReport } from "../api.js";

export default function PredictionPanel({ scan, onReport }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  if (!scan) {
    return (
      <div className="rounded-2xl border border-dashed border-cyan-300 bg-cyan-50/70 p-8 text-center font-bold text-slate-600">
        Upload a medical scan to generate AI-assisted diagnosis support.
      </div>
    );
  }

  const prediction = scan.prediction;

  async function handleReport() {
    setError("");
    setIsGenerating(true);
    try {
      const report = await generateReport({
        scanId: scan.id,
        remarks: "Generated from patient dashboard.",
        approvedBy: ""
      });
      onReport?.();
      window.open(`${api.defaults.baseURL}${report.file}`, "_blank");
    } catch (reportError) {
      setError(reportError.response?.data?.detail || reportError.message || "Report could not be generated.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-[240px_1fr]">
      <div className="grid gap-3">
        <img src={`${api.defaults.baseURL}${scan.file}`} alt="Original scan" className="aspect-square rounded-2xl border border-slate-200 object-cover shadow-lg" />
        <img src={`${api.defaults.baseURL}${scan.heatmap}`} alt="Grad-CAM heatmap" className="aspect-square rounded-2xl border border-slate-200 object-cover shadow-lg" />
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-950">{prediction.disease}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-lg bg-emerald-50 px-3 py-2 font-black text-clinical-teal">{prediction.confidence} confidence</span>
          <span className="rounded-lg bg-rose-50 px-3 py-2 font-black text-clinical-red">{prediction.riskLevel} risk</span>
          <span className="rounded-lg bg-amber-50 px-3 py-2 font-black text-clinical-amber">{prediction.severity} severity</span>
        </div>
        <p className="mt-4 leading-7 text-clinical-muted">{prediction.explanation}</p>
        <p className="mt-3 font-bold">Recommendation: {prediction.recommendation}</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-clinical-teal" style={{ width: `${prediction.confidenceValue}%` }} />
        </div>
        {error && <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-black text-rose-700">{error}</p>}
        <button type="button" disabled={isGenerating} onClick={handleReport} className="mt-5 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-3 font-black text-white shadow-lg shadow-cyan-900/20 disabled:cursor-not-allowed disabled:opacity-60">
          {isGenerating ? "Preparing Report..." : "Generate Report"}
        </button>
      </div>
    </div>
  );
}
