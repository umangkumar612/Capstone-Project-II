import React from "react";
import { motion } from "framer-motion";
import { Activity, Brain, Cloud, FileText, Gauge, Microscope, ScanSearch, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { Link } from "react-router-dom";
import StatsCard from "../components/StatsCard.jsx";
import { faq, features, stats, testimonials } from "../data/mockData.js";

const featureIcons = [Brain, Microscope, ScanSearch, Activity, FileText, Cloud];

export default function LandingPage() {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_500px] lg:items-center">
          <div>
            <motion.p initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-sm font-black text-cyan-700 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <ShieldCheck size={16} /> Healthcare-grade AI imaging workflow
            </motion.p>
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }} className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-950 dark:text-white md:text-7xl">
              AI-Powered Medical Imaging Diagnosis Portal
            </motion.h1>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.16 }} className="mt-6 max-w-2xl text-xl leading-9 text-slate-600 dark:text-slate-300">
              Upload MRI, CT Scan, and X-Ray images for guided review, clearer reporting, and faster clinical conversations.
            </motion.p>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.24 }} className="mt-8 flex flex-wrap gap-3">
              <Link to="/patient" className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 px-6 py-4 font-black text-white shadow-glow">Upload Scan</Link>
              <Link to="/admin" className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 font-black text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white">View Dashboard</Link>
            </motion.div>
          </div>

          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass relative rounded-[2rem] p-6">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-cyan-950 to-teal-900 p-5 text-white">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-cyan-200">Medical AI Viewer</p>
                  <p className="text-2xl font-black">Brain MRI Scan</p>
                </div>
                <Stethoscope className="text-cyan-200" />
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
                <div className="flex aspect-square items-center justify-center rounded-3xl border border-cyan-300/20 bg-cyan-400/10">
                  <div className="relative h-56 w-56 rounded-full bg-gradient-to-br from-cyan-300/70 to-teal-300/20">
                    <div className="absolute left-10 top-8 h-28 w-20 rounded-full border-4 border-white/60" />
                    <div className="absolute right-10 top-12 h-28 w-20 rounded-full border-4 border-white/50" />
                    <div className="absolute bottom-12 left-20 h-16 w-16 rounded-full bg-rose-400/80 shadow-[0_0_60px_rgba(251,113,133,.7)]" />
                  </div>
                </div>
                <div className="grid content-between gap-3">
                  <Panel label="Disease" value="Tumor" />
                  <Panel label="Confidence" value="94.2%" />
                  <Panel label="Risk" value="Medium" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 md:grid-cols-4">
        {stats.map((item, index) => (
          <StatsCard key={item.label} {...item} icon={[Users, ScanSearch, Gauge, Stethoscope][index]} />
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <p className="font-black uppercase text-cyan-700">Features</p>
        <h2 className="text-4xl font-black dark:text-white">Built for clinical workflows</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <motion.article whileHover={{ y: -5 }} key={feature} className="glass rounded-3xl p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white">
                  <Icon />
                </div>
                <h3 className="text-xl font-black dark:text-white">{feature}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Premium AI-assisted tooling for image review, triage, reporting, and medical collaboration.</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-10 lg:grid-cols-3">
        {testimonials.map((item) => (
          <article key={item.name} className="glass rounded-3xl p-6">
            <p className="leading-7 text-slate-600 dark:text-slate-300">"{item.quote}"</p>
            <p className="mt-5 font-black dark:text-white">{item.name}</p>
            <p className="text-sm font-bold text-cyan-700">{item.role}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10">
        <h2 className="text-center text-4xl font-black dark:text-white">FAQ</h2>
        <div className="mt-6 grid gap-3">
          {faq.map(([question, answer]) => (
            <details key={question} className="glass rounded-2xl p-5">
              <summary className="cursor-pointer font-black dark:text-white">{question}</summary>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/70 px-5 py-8 text-center text-sm font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950">
        Medical Imaging Diagnosis Portal - guided clinical decision support for research and final-year engineering projects.
      </footer>
    </motion.main>
  );
}

function Panel({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-bold text-cyan-200">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}
