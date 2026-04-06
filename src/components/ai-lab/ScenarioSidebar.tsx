"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════
   ScenarioSidebar — Mission objectives + checklist
   ═══════════════════════════════════════════════ */

interface ObjectiveStep {
  label: string;
  completed: boolean;
}

interface ScenarioSidebarProps {
  className?: string;
  steps: ObjectiveStep[];
}

export default function ScenarioSidebar({ className = "", steps }: ScenarioSidebarProps) {
  const completed = steps.filter((s) => s.completed).length;

  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-5 overflow-y-auto ${className}`}>
      {/* Mission header */}
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.12em] text-red-400/60 font-semibold mb-2">
          Active Incident
        </p>
        <h3 className="text-[15px] font-semibold text-white tracking-[-0.02em] mb-1">
          DB Outage @ 2AM
        </h3>
        <p className="text-[12px] text-slate-500 leading-[1.5]">
          Service: payment-service
          <br />
          Cluster: cluster-a
          <br />
          Severity: P1 — Critical
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-[0.1em] text-slate-500 font-semibold">
            Progress
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {completed}/{steps.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-blue-400"
            initial={false}
            animate={{ width: `${steps.length > 0 ? (completed / steps.length) * 100 : 0}%` }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
      </div>

      {/* Objective checklist */}
      <div className="space-y-2.5">
        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600 font-semibold mb-1">
          Objectives
        </p>
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 py-1 transition-opacity duration-300 ${
              step.completed ? "opacity-50" : "opacity-100"
            }`}
          >
            <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300 ${
              step.completed
                ? "bg-blue-500/20 border-blue-500/40"
                : "border-white/[0.1] bg-transparent"
            }`}>
              {step.completed && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className={`text-[12px] leading-[1.5] transition-colors duration-300 ${
              step.completed ? "text-slate-600 line-through" : "text-slate-400"
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Timer aesthetic */}
      <div className="mt-6 pt-4 border-t border-white/[0.04]">
        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600 font-semibold mb-1">
          MTTR Target
        </p>
        <p className="font-mono text-[14px] text-slate-400 tracking-[0.02em]">
          &lt; 15 min
        </p>
      </div>
    </div>
  );
}
