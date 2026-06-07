import React from "react";
import { api } from "../api.js";

export default function ScanCard({ scan, onReview }) {
  const prediction = scan.prediction;
  const image = scan.heatmap || scan.file;

  return (
    <article className="grid grid-cols-[108px_1fr] gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-xl">
      <img
        src={`${api.defaults.baseURL}${image}`}
        alt="Medical scan"
        className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
      />
      <div className="min-w-0 space-y-1 text-sm">
        <h3 className="truncate font-black text-slate-950">{scan.patientName || scan.id}</h3>
        <p className="text-slate-500">{scan.scanType?.toUpperCase()} | {scan.status}</p>
        <p className="text-slate-500">{prediction?.disease || "Awaiting prediction"}</p>
        {prediction && (
          <p className="font-extrabold text-clinical-teal">
            {prediction.confidence} | {prediction.riskLevel} risk
          </p>
        )}
        <p className="truncate text-xs text-clinical-muted">{scan.id}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {onReview && (
            <button
              type="button"
              onClick={() => onReview(scan)}
            className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-3 py-2 text-xs font-black text-white"
            >
              Review
            </button>
          )}
          {scan.report && (
            <a
              href={`${api.defaults.baseURL}${scan.report}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-teal-700"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
