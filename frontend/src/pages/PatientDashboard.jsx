import React from "react";
import { motion } from "framer-motion";
import { CalendarClock, Download, FileHeart, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { getHistory, uploadAndPredict } from "../api.js";
import { useAuth } from "../auth.jsx";
import FileUpload from "../components/FileUpload.jsx";
import PageShell from "../components/PageShell.jsx";
import PredictionPanel from "../components/PredictionPanel.jsx";
import ScanCard from "../components/ScanCard.jsx";
import StatsCard from "../components/StatsCard.jsx";

export default function PatientDashboard({ notify }) {
  const { user } = useAuth();
  const [patientId, setPatientId] = useState(user?.patientId || "PAT-1001");
  const [latestScan, setLatestScan] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function refreshHistory(id = patientId) {
    setIsRefreshing(true);
    try {
      setHistory(await getHistory(id));
    } catch (error) {
      setHistory([]);
      notify?.({ title: "Could not refresh", message: getErrorMessage(error) });
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    refreshHistory();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentPatient = formData.get("patientId");
    if (selectedFile && !formData.get("file")?.name) {
      formData.set("file", selectedFile);
    }
    setPatientId(currentPatient);
    setStatus("Preparing your scan review...");
    setIsUploading(true);
    try {
      const scan = await uploadAndPredict(formData);
      setLatestScan(scan);
      await refreshHistory(currentPatient);
      setStatus("");
      notify?.({ title: "Scan review ready", message: `${scan.prediction?.disease || "Insight"} prepared successfully.` });
    } catch (error) {
      setStatus("The scan could not be uploaded right now. Please try again in a moment.");
      notify?.({ title: "Upload failed", message: getErrorMessage(error) });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <PageShell eyebrow="Patient Dashboard" title="Personal scan workspace" subtitle="Upload scans, review guided insights, download reports, and follow your medical timeline.">
      <div className="grid gap-5 xl:grid-cols-[410px_1fr]">
        <section className="glass rounded-3xl p-5">
          <div className="mb-5 rounded-3xl bg-gradient-to-r from-cyan-600 to-teal-500 p-5 text-white">
            <p className="font-bold text-cyan-50">Profile Overview</p>
            <h2 className="text-2xl font-black">{user?.name || "Aarav Sharma"}</h2>
            <p className="text-sm text-cyan-50">Patient ID: {patientId}</p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <Field label="Patient ID" name="patientId" defaultValue={patientId} />
            <Field label="Patient Name" name="patientName" defaultValue={user?.name || "Aarav Sharma"} />
            <label className="grid gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
              Scan Type
              <select name="scanType" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                <option value="xray">X-Ray</option>
                <option value="mri">MRI</option>
                <option value="ct">CT Scan</option>
              </select>
            </label>
            <FileUpload onFile={setSelectedFile} />
            <button type="submit" disabled={isUploading} className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 px-5 py-4 font-black text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-60">
              {isUploading ? "Preparing Review..." : "Upload Scan"}
            </button>
          </form>
          {status && <p className="mt-4 rounded-2xl bg-cyan-50 p-4 text-sm font-bold text-slate-600">{status}</p>}
        </section>

        <section className="glass rounded-3xl p-5">
          <h2 className="mb-5 text-2xl font-black dark:text-white">Scan Insights</h2>
          <PredictionPanel scan={latestScan} onReport={() => refreshHistory()} />
        </section>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <StatsCard icon={UploadCloud} label="Uploaded Scans" value={history.length} />
        <StatsCard icon={FileHeart} label="Recent Insights" value={history.filter((scan) => scan.prediction).length} />
        <StatsCard icon={Download} label="Reports Ready" value={history.filter((scan) => scan.report).length} />
      </div>

      <section className="glass mt-5 rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black dark:text-white">Scan History Table</h2>
          <button type="button" disabled={isRefreshing} onClick={() => refreshHistory()} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 font-black text-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900">
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {history.length ? history.map((scan) => <ScanCard key={scan.id} scan={scan} />) : <p className="text-slate-500">No scans found.</p>}
        </div>
      </section>

      <section className="glass mt-5 rounded-3xl p-5">
        <h2 className="mb-5 flex items-center gap-2 text-2xl font-black dark:text-white"><CalendarClock /> Medical Timeline</h2>
        <div className="grid gap-4">
          {["Scan uploaded", "Insight prepared", "Doctor review pending", "Report ready for download"].map((item, index) => (
            <motion.div key={item} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 font-black text-cyan-700">{index + 1}</div>
              <p className="font-bold text-slate-600 dark:text-slate-300">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function getErrorMessage(error) {
  return error.response?.data?.detail || error.message || "Please check the service and try again.";
}

function Field({ label, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
      {label}
      <input {...props} required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
    </label>
  );
}
