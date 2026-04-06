"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { TerminalState } from "@/components/ai-lab/TerminalAgent";

const TechNarrative = dynamic(
  () => import("@/components/ai-lab/TechNarrative"),
  { ssr: false },
);

const TerminalAgent = dynamic(
  () => import("@/components/ai-lab/TerminalAgent"),
  { ssr: false },
);

const ScenarioSidebar = dynamic(
  () => import("@/components/ai-lab/ScenarioSidebar"),
  { ssr: false },
);

const EASE_EXPO = [0.23, 1, 0.32, 1] as const;

const OBJECTIVE_STEPS = [
  "Check cluster status",
  "Review service logs",
  "Inspect security groups",
  "Trace network path",
  "Apply the fix",
];

export default function TechSandboxPage() {
  const [narrativeComplete, setNarrativeComplete] = useState(false);
  const [termState, setTermState] = useState<TerminalState>({
    complianceScore: 70,
    prevScore: 70,
    mentorText: "Awaiting your first command. Start by assessing the situation.",
    isProcessing: false,
    recommendedCommand: null,
    completedSteps: [],
  });
  const [missionDrawerOpen, setMissionDrawerOpen] = useState(false);

  const handleEnterSandbox = useCallback(() => {
    setNarrativeComplete(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  }, []);

  const handleReplay = useCallback(() => {
    setNarrativeComplete(false);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  }, []);

  const scoreColor = termState.complianceScore >= 70 ? "text-green-400" : termState.complianceScore >= 40 ? "text-yellow-400" : "text-red-400";
  const barColor = termState.complianceScore >= 70 ? "bg-green-400" : termState.complianceScore >= 40 ? "bg-yellow-400" : "bg-red-400";
  const scoreDelta = termState.complianceScore - termState.prevScore;

  // Core color
  const coreInDanger = termState.complianceScore < 50;
  const coreColor = coreInDanger ? "rgba(239,68,68," : termState.complianceScore >= 70 ? "rgba(34,197,94," : "rgba(34,211,238,";

  const steps = OBJECTIVE_STEPS.map((label) => ({
    label,
    completed: termState.completedSteps.includes(label),
  }));

  return (
    <div className="min-h-screen text-white" style={{ background: "#0B101A" }}>
      {/* ════════════════════════════════════════
         Section 1: Narrative Waterfall
         ════════════════════════════════════════ */}
      {!narrativeComplete && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="fixed top-28 left-6 md:left-10 z-50"
          >
            <Link href="/ai-lab" data-magnetic className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 font-medium tracking-[0.01em] transition-colors hover:text-white">
              <span aria-hidden="true">&larr;</span>
              Back to Lab
            </Link>
          </motion.div>
          <TechNarrative onEnter={handleEnterSandbox} />
        </>
      )}

      {/* ════════════════════════════════════════
         Section 2: Three-Column Mission Control
         ════════════════════════════════════════ */}
      {narrativeComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_EXPO }}
          className="min-h-screen bg-[#0B101A] overflow-hidden"
        >
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 pt-28 pb-12">
            {/* Nav */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_EXPO }}
              className="mb-8 flex items-center gap-4"
            >
              <Link href="/ai-lab" data-magnetic className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 font-medium tracking-[0.01em] transition-colors hover:text-white">
                <span aria-hidden="true">&larr;</span>
                Back to Lab
              </Link>
              <button onClick={handleReplay} className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors font-medium">
                Replay Intro
              </button>
            </motion.div>

            {/* Mobile HUD bar */}
            <div className="lg:hidden flex items-center justify-between px-4 py-2.5 mb-3 rounded-xl border border-white/[0.06] bg-[#0a0e17]">
              <button onClick={() => setMissionDrawerOpen(true)} className="flex items-center gap-2 text-[11px] text-slate-400 font-medium active:scale-95 transition-transform">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                Mission
              </button>
              <ThinkingCoreMini isProcessing={termState.isProcessing} coreColor={coreColor} />
              <motion.span
                key={termState.complianceScore}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 400 }}
                className={`font-semibold text-[15px] tracking-[-0.02em] ${scoreColor}`}
              >
                {termState.complianceScore}/100
              </motion.span>
            </div>

            {/* 3-Column grid */}
            <motion.div {...scrollRevealProps(0.1)} className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-4">
              {/* Left: Scenario Sidebar (desktop) */}
              <div className="hidden lg:block">
                <ScenarioSidebar steps={steps} className="h-[650px] max-h-[80vh]" />
              </div>

              {/* Center: Terminal — cursor sentinel */}
              <div
                onMouseEnter={() => document.body.classList.add("hide-custom-cursor")}
                onMouseLeave={() => document.body.classList.remove("hide-custom-cursor")}
              >
                <TerminalAgent scenarioId="tech-sre-sandbox" onStateChange={setTermState} />
              </div>

              {/* Right: Audit Panel (desktop) */}
              <div className="hidden lg:flex flex-col gap-4 h-[650px] max-h-[80vh]">
                {/* Compliance HUD */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-5">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-3">Compliance Score</p>
                  <div className="flex items-baseline gap-2">
                    <motion.span key={termState.complianceScore} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 10, stiffness: 350 }} className={`text-[clamp(2rem,4vw,2.8rem)] font-semibold tracking-[-0.04em] leading-none ${scoreColor}`}>
                      {termState.complianceScore}
                    </motion.span>
                    <span className="text-slate-500 text-[14px] font-medium">/100</span>
                    {scoreDelta !== 0 && (
                      <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={`text-[12px] font-medium ${scoreDelta > 0 ? "text-green-400" : "text-red-400"}`}>
                        {scoreDelta > 0 ? "+" : ""}{scoreDelta}
                      </motion.span>
                    )}
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div className={`h-full rounded-full ${barColor}`} initial={false} animate={{ width: `${termState.complianceScore}%` }} transition={{ duration: 0.6, ease: EASE_EXPO }} />
                  </div>
                </div>

                {/* Thinking Core */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-4 flex items-center gap-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <motion.div
                      className="absolute inset-[-4px] rounded-full"
                      animate={{ boxShadow: termState.isProcessing ? `0 0 24px ${coreColor}0.5), 0 0 48px ${coreColor}0.2)` : `0 0 0px ${coreColor}0)` }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.div
                      className="w-10 h-10 rounded-full"
                      style={{
                        border: `1px solid ${coreColor}${termState.isProcessing ? "0.3)" : "0.15)"}`,
                        background: termState.isProcessing
                          ? `radial-gradient(circle at 35% 35%, ${coreColor}0.35), ${coreColor}0.05) 60%, transparent)`
                          : "radial-gradient(circle at 35% 35%, rgba(148,163,184,0.1), transparent 60%)",
                      }}
                      animate={termState.isProcessing ? { rotate: 360, scale: [1, 1.08, 1] } : { rotate: 0, scale: 1 }}
                      transition={termState.isProcessing ? { rotate: { repeat: Infinity, duration: 1, ease: "linear" }, scale: { repeat: Infinity, duration: 0.8 } } : { duration: 0.6 }}
                    >
                      <svg viewBox="0 0 40 40" className="w-full h-full">
                        <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke={termState.isProcessing ? `${coreColor}0.5)` : "rgba(148,163,184,0.15)"} strokeWidth="0.75" />
                        <ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke={termState.isProcessing ? `${coreColor}0.4)` : "rgba(148,163,184,0.1)"} strokeWidth="0.75" />
                      </svg>
                    </motion.div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-slate-500">{termState.isProcessing ? "Reasoning..." : "Standing by"}</p>
                    <p className={`font-mono text-[11px] tracking-[0.02em] ${coreInDanger ? "text-red-400/70" : "text-cyan-400/70"}`}>GPT-5.4 mini // SRE_CORE</p>
                  </div>
                </div>

                {/* Mentor Panel */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-5 flex-1 overflow-y-auto">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-blue-400/60 font-semibold mb-3">AI Mentor</p>
                  <AnimatePresence mode="wait">
                    <motion.p key={termState.mentorText} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="text-[13px] text-slate-400 leading-[1.7]">
                      {termState.mentorText}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ── Mobile Mission Drawer ── */}
      <AnimatePresence>
        {missionDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setMissionDrawerOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-white/[0.08] bg-[#0a0e17] max-h-[75vh] overflow-y-auto"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              <div className="flex justify-center pt-3 pb-2"><div className="w-8 h-1 rounded-full bg-white/10" /></div>
              <div className="px-5 pb-6">
                <ScenarioSidebar steps={steps} />

                {/* Inline mentor */}
                <div className="mt-5 pt-4 border-t border-white/[0.04]">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-blue-400/60 font-semibold mb-2">AI Mentor</p>
                  <p className="text-[13px] text-slate-400 leading-[1.7]">{termState.mentorText}</p>
                </div>

                {/* Inline score */}
                <div className="mt-4 flex items-center gap-3">
                  <span className={`text-[22px] font-semibold tracking-[-0.04em] ${scoreColor}`}>{termState.complianceScore}</span>
                  <span className="text-slate-600 text-[12px]">/100</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${termState.complianceScore}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Thinking Core Mini (mobile HUD) ── */
function ThinkingCoreMini({ isProcessing, coreColor }: { isProcessing: boolean; coreColor: string }) {
  return (
    <motion.div
      className="w-7 h-7 rounded-full flex items-center justify-center"
      style={{
        border: `1px solid ${coreColor}${isProcessing ? "0.3)" : "0.15)"}`,
        background: isProcessing
          ? `radial-gradient(circle at 35% 35%, ${coreColor}0.3), transparent 60%)`
          : "radial-gradient(circle at 35% 35%, rgba(148,163,184,0.1), transparent 60%)",
      }}
      animate={isProcessing ? { rotate: 360, scale: [1, 1.1, 1] } : { rotate: 0, scale: 1 }}
      transition={isProcessing ? { rotate: { repeat: Infinity, duration: 1, ease: "linear" }, scale: { repeat: Infinity, duration: 0.6 } } : { duration: 0.6 }}
    >
      <svg viewBox="0 0 40 40" className="w-4 h-4">
        <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke={isProcessing ? `${coreColor}0.5)` : "rgba(148,163,184,0.2)"} strokeWidth="1" />
        <ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke={isProcessing ? `${coreColor}0.4)` : "rgba(148,163,184,0.15)"} strokeWidth="1" />
      </svg>
    </motion.div>
  );
}
