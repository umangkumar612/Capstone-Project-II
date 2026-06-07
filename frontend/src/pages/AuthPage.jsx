import React, { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, HeartPulse, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function AuthPage({ notify }) {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to={defaultPath(user.role)} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const payload = Object.fromEntries(
        new FormData(event.currentTarget).entries()
    );

    console.log("FORM SUBMITTED");
    console.log("PAYLOAD:", payload);

    try {
      const authUser =
          mode === "login"
              ? await signIn(payload)
              : await signUp(payload);

      console.log("AUTH SUCCESS:", authUser);

      notify?.({
        title: "Welcome back",
        message: `Your ${friendlyRole(authUser.role)} space is ready.`
      });

      navigate(defaultPath(authUser.role), { replace: true });
    } catch (authError) {
      console.error("AUTH ERROR:", authError);
      console.error("AUTH RESPONSE:", authError?.response);

      setError(
          authError.response?.data?.detail ||
          "We could not verify those details. Please try again."
      );
    }
  }

  return (
    <main className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-8 overflow-hidden px-5 py-10 lg:grid-cols-[1fr_480px]">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass relative overflow-hidden rounded-[2.5rem] p-8">
        <div className="absolute right-8 top-8 hidden h-24 w-24 rounded-[2rem] border border-white/60 bg-white/30 shadow-glow md:block" />
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black uppercase tracking-wide text-emerald-700">
          <ShieldCheck size={16} /> Private Care Entrance
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight text-slate-950 dark:text-white">
          Step into your personal medical imaging suite.
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-600 dark:text-slate-300">
          A calm, private entrance for patients, doctors, and care teams to review scans, reports, and next steps in the right place.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["Patients", "Track scans and reports", HeartPulse],
            ["Doctors", "Review findings faster", Fingerprint],
            ["Care Teams", "Oversee daily activity", Sparkles]
          ].map(([title, text, Icon]) => (
            <div key={title} className="rounded-3xl border border-white/70 bg-white/60 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
              <Icon className="mb-3 text-teal-600" size={22} />
              <p className="font-black text-slate-950 dark:text-white">{title}</p>
              <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.form initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleSubmit} className="glass rounded-[2rem] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-500 text-white">
            <LockKeyhole />
          </div>
          <div>
            <h2 className="text-2xl font-black dark:text-white">{mode === "login" ? "Sign in" : "Create account"}</h2>
            <p className="text-sm font-bold text-slate-500">Use your portal details to continue.</p>
          </div>
        </div>

        {mode === "register" && <Field label="Full Name" name="name" />}
        <Field label="Email" name="email" type="email" />
        <Field label="Password" name="password" type="password" minLength="6" />
        {mode === "register" && (
          <>
            <label className="mb-4 grid gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
              Role
              <select name="role" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <Field label="Patient ID (patients only)" name="patientId" placeholder="PAT-1001" required={false} />
          </>
        )}

        {error && <p className="mb-4 rounded-2xl bg-rose-50 p-3 text-sm font-black text-rose-700">{error}</p>}
        <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 px-5 py-4 font-black text-white shadow-glow">
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
        <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-cyan-700 dark:border-slate-800 dark:bg-slate-900">
          {mode === "login" ? "New here? Create your profile" : "Already have a profile? Sign in"}
        </button>
      </motion.form>
    </main>
  );
}

function Field({ label, required = true, ...props }) {
  return (
    <label className="mb-4 grid gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
      {label}
      <input {...props} required={required} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
    </label>
  );
}

function defaultPath(role) {
  if (role === "doctor") return "/doctor";
  if (role === "admin") return "/admin";
  return "/patient";
}

function friendlyRole(role) {
  if (role === "doctor") return "doctor";
  if (role === "admin") return "care team";
  return "patient";
}
