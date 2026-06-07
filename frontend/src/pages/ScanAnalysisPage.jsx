import React from "react";
import { AlertTriangle, CheckCircle2, HeartPulse } from "lucide-react";
import { ConfidenceChart } from "../components/Charts.jsx";
import ImageViewer from "../components/ImageViewer.jsx";
import PageShell from "../components/PageShell.jsx";

const demoScan = {
  file: "",
  heatmap: "",
  prediction: {
    disease: "Pneumonia",
    confidence: "94.2%",
    confidenceValue: 94.2,
    riskLevel: "Medium",
    severity: "Moderate",
    recommendation: "Consult a Pulmonologist"
  }
};

export default function ScanAnalysisPage() {
  return (
    <PageShell eyebrow="Scan Analysis" title="AI heatmap and disease detection" subtitle="Compare original scans with AI heatmap visualization, risk level, confidence score, and recommendations.">
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="grid gap-5 lg:grid-cols-2">
          <ImageViewer title="Original Image" src={demoScan.file} badge="MRI / CT / X-Ray" />
          <ImageViewer title="AI Heatmap Visualization" src={demoScan.heatmap} badge="Grad-CAM" />
        </section>

        <aside className="grid gap-5">
          <section className="glass rounded-3xl p-5">
            <h2 className="text-xl font-black dark:text-white">Confidence Score Meter</h2>
            <ConfidenceChart value={demoScan.prediction.confidenceValue} />
            <p className="text-center text-3xl font-black text-cyan-600">{demoScan.prediction.confidence}</p>
          </section>
          <section className="glass rounded-3xl p-5">
            <h2 className="mb-4 text-xl font-black dark:text-white">Disease Detection Results</h2>
            <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-cyan-950 p-5 text-white">
              <p className="text-sm font-bold text-cyan-200">Detected Disease</p>
              <p className="text-3xl font-black">{demoScan.prediction.disease}</p>
            </div>
            <div className="mt-4 grid gap-3">
              <Badge icon={AlertTriangle} label="Risk Level" value={demoScan.prediction.riskLevel} />
              <Badge icon={HeartPulse} label="Severity" value={demoScan.prediction.severity} />
              <Badge icon={CheckCircle2} label="Recommendation" value={demoScan.prediction.recommendation} />
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}

function Badge({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900">
      <Icon className="text-cyan-600" />
      <div>
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="font-black dark:text-white">{value}</p>
      </div>
    </div>
  );
}
