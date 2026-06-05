import { useEffect, useState } from "react";
import { ClipboardList, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../config/api";

// ── stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, loading, gradient, icon }) {
  return (
    <div className={`rounded-2xl p-5 text-white ${gradient}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      {loading ? (
        <div className="h-9 w-16 bg-white/20 rounded-lg animate-pulse" />
      ) : (
        <p className="text-4xl font-bold">{value ?? 0}</p>
      )}
    </div>
  );
}

// ── module card ───────────────────────────────────────────────────────────────

function ModuleCard({ title, description, path, icon, gradient }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className="cursor-pointer group bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-3xl p-8 transition-all hover:scale-[1.02] hover:bg-white/15"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${gradient}`}>
        {icon}
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      <div className="mt-5 flex items-center text-white/50 text-sm group-hover:text-white/80 transition">
        Open module
        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API.dashboard)
      .then(({ data }) => setSummary(data))
      .catch(() => setSummary({ total: 0, open: 0, inProgress: 0, closed: 0 }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-blue-700">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-2xl font-bold text-white">
          Inspection<span className="text-yellow-300">Pro</span>
        </h1>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-10 text-center">
        <h1 className="text-6xl font-bold text-white mb-4 leading-tight">
          Management System
        </h1>
        <p className="text-white/70 text-xl max-w-3xl mx-auto">
          Create inspection templates, manage checklists, track corrective
          actions and monitor compliance from a single platform.
        </p>
      </section>

      {/* STAT CARDS */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Actions"
            value={summary?.total}
            loading={loading}
            gradient="bg-gradient-to-br from-white/20 to-white/10 border border-white/20"
            icon="📋"
          />
          <StatCard
            label="Open"
            value={summary?.open}
            loading={loading}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            icon="🔵"
          />
          <StatCard
            label="In Progress"
            value={summary?.inProgress}
            loading={loading}
            gradient="bg-gradient-to-br from-amber-400 to-orange-600"
            icon="⚡"
          />
          <StatCard
            label="Closed"
            value={summary?.closed}
            loading={loading}
            gradient="bg-gradient-to-br from-emerald-400 to-green-600"
            icon="✅"
          />
        </div>
      </section>

      {/* MODULE CARDS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <ModuleCard
            title="Checklist & Form Builder"
            description="Create inspection templates with dynamic questions, multiple field types and reusable forms."
            path="/checklist"
            icon={<ClipboardList size={32} className="text-white" />}
            gradient="bg-gradient-to-br from-blue-400 to-cyan-500"
          />
          <ModuleCard
            title="Corrective Action Management"
            description="Track action items, priorities, due dates and workflow status using dashboards."
            path="/actions"
            icon={<AlertTriangle size={32} className="text-white" />}
            gradient="bg-gradient-to-br from-orange-400 to-red-500"
          />
        </div>
      </section>
    </div>
  );
}