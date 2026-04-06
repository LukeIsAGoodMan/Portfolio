"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* ═══════════════════════════════════════════════
   FinanceNarrative — Three-phase scroll waterfall
   Phase 1: Legacy crisis (scatter docs)
   Phase 2: AI pivot (converge to core)
   Phase 3: Scenario reveal + CTA
   ═══════════════════════════════════════════════ */

const DOC_NODES = [
  { x: 10, y: 18 }, { x: 80, y: 12 }, { x: 22, y: 68 }, { x: 72, y: 72 },
  { x: 48, y: 25 }, { x: 58, y: 82 }, { x: 14, y: 48 }, { x: 86, y: 45 },
  { x: 35, y: 55 }, { x: 65, y: 38 },
];

const PAIN_POINTS = [
  "LOW ENGAGEMENT",
  "CANNOT SIMULATE REAL PRESSURE",
  "HIGH VULNERABILITY RISK",
];

export default function FinanceNarrative({ onEnter }: { onEnter: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Background color transition
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    ["#0B101A", "#0B101A", "#0A1221", "#080e1a"],
  );

  // Phase opacities
  const p1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.38], [1, 1, 0]);
  const p2Opacity = useTransform(scrollYProgress, [0.3, 0.42, 0.62, 0.72], [0, 1, 1, 0]);
  const p3Opacity = useTransform(scrollYProgress, [0.68, 0.82], [0, 1]);

  // Scatter (phase 1) & converge (phase 2)
  const scatter = useTransform(scrollYProgress, [0.05, 0.32], [0, 1]);
  const converge = useTransform(scrollYProgress, [0.38, 0.6], [0, 1]);

  // Core
  const coreScale = useTransform(scrollYProgress, [0.4, 0.65], [0.2, 1]);
  const coreGlow = useTransform(scrollYProgress, [0.5, 0.68], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[400vh]" style={{ scrollSnapAlign: "start" }}>
      <motion.div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        {/* ── Phase 1: Legacy ── */}
        <motion.div className="absolute inset-0" style={{ opacity: p1Opacity }}>
          {/* Scattered doc nodes */}
          {DOC_NODES.map((pos, i) => (
            <DocIcon key={i} index={i} baseX={pos.x} baseY={pos.y} scatter={scatter} />
          ))}

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
            <p className="text-[11px] uppercase tracking-[0.15em] text-red-400/70 font-semibold mb-6">
              Current Status
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.05em] leading-[1.0] text-center text-white mb-6 max-w-[700px]">
              1,000+ Pages of
              <br />
              <span className="text-slate-500">Static Compliance</span>
            </h2>
            <p className="text-[14px] md:text-[15px] text-slate-500 leading-[1.7] text-center max-w-[520px] mb-10">
              Traditional compliance training means endless reading, boring multiple-choice quizzes, and awkward peer role-play. Employees struggle to retain knowledge and fear making catastrophic errors with real clients.
            </p>

            {/* Pain points */}
            <div className="flex flex-wrap justify-center gap-3">
              {PAIN_POINTS.map((point) => (
                <span
                  key={point}
                  className="
                    inline-flex items-center gap-1.5 px-4 py-2
                    text-[11px] font-semibold tracking-[0.06em] uppercase
                    bg-red-500/10 border border-red-500/20 rounded-full text-red-400/80
                  "
                >
                  <span className="text-red-400">&#x2717;</span>
                  {point}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Phase 2: AI Pivot ── */}
        <motion.div className="absolute inset-0" style={{ opacity: p2Opacity }}>
          {/* Converging particles */}
          {DOC_NODES.map((_, i) => (
            <Particle key={i} index={i} total={DOC_NODES.length} converge={converge} />
          ))}

          {/* Central core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div className="relative" style={{ scale: coreScale }}>
              <motion.div
                className="absolute inset-[-20px] rounded-full"
                style={{
                  opacity: coreGlow,
                  boxShadow: "0 0 80px rgba(34,211,238,0.25), 0 0 160px rgba(34,211,238,0.08)",
                }}
              />
              <div
                className="w-24 h-24 rounded-full border border-cyan-400/25 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 35% 35%, rgba(34,211,238,0.2), transparent 60%)",
                }}
              >
                <svg viewBox="0 0 40 40" className="w-14 h-14">
                  <ellipse cx="20" cy="20" rx="15" ry="6" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="0.6" />
                  <ellipse cx="20" cy="20" rx="6" ry="15" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="0.6" />
                  <circle cx="20" cy="20" r="3" fill="rgba(34,211,238,0.5)" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Copy */}
          <div className="absolute inset-0 flex items-end justify-center pb-[12vh] z-10">
            <div className="text-center max-w-[600px] px-6">
              <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-400/60 font-semibold mb-5">
                The AI Evolution
              </p>
              <h2 className="text-[clamp(1.5rem,3vw,2.4rem)] font-semibold tracking-[-0.04em] leading-[1.12] text-white mb-4">
                A controlled, generative simulation
                <br />
                <span className="text-slate-400">that audits every interaction.</span>
              </h2>
              <p className="text-[14px] text-slate-400 leading-[1.7]">
                We bridge the gap from knowledge to compliant muscle memory.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Phase 3: Scenario + CTA ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: p3Opacity }}
        >
          <div className="text-center max-w-[680px] px-6">
            {/* Glowing core badge */}
            <div className="flex justify-center mb-8">
              <span className="
                inline-flex items-center gap-2 px-4 py-2
                font-mono text-[10px] tracking-[0.06em] uppercase
                bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-400/80
              ">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                GPT-5.4 mini LIVE
              </span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-5">
              Scenario
            </p>
            <h2 className="text-[clamp(1.6rem,3.5vw,2.6rem)] font-semibold tracking-[-0.04em] leading-[1.12] text-white mb-6">
              You are a Private Banking RM.
            </h2>
            <p className="text-[15px] text-slate-400 leading-[1.7] mb-4">
              You are pitching an Equity-Linked Structured Note to a high-net-worth client.
            </p>
            <p className="text-[14px] text-slate-500 leading-[1.7] mb-10 max-w-[540px] mx-auto">
              <span className="text-red-400/80 font-medium">The Conflict:</span> The client is aggressive, demanding 15% guaranteed returns. You must maintain compliance standards for disclosure, risking the relationship, or risking a multi-million dollar fine.
            </p>

            <motion.button
              onClick={onEnter}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              data-magnetic
              className="
                inline-flex items-center gap-2.5 px-8 py-4
                bg-cyan-400 text-[#0A1221]
                text-[13px] font-semibold tracking-[0.01em]
                rounded-full
                shadow-[0_0_40px_rgba(34,211,238,0.3)]
                transition-shadow duration-300
                hover:shadow-[0_0_60px_rgba(34,211,238,0.5)]
              "
            >
              Enter Sandbox
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Document icon (Phase 1) ── */
function DocIcon({ index, baseX, baseY, scatter }: {
  index: number; baseX: number; baseY: number; scatter: MotionValue<number>;
}) {
  const angle = (index / DOC_NODES.length) * Math.PI * 2;
  const dx = useTransform(scatter, [0, 1], [0, Math.cos(angle) * 18]);
  const dy = useTransform(scatter, [0, 1], [0, Math.sin(angle) * 18]);
  const opacity = useTransform(scatter, [0.5, 1], [0.5, 0.15]);
  const rotate = useTransform(scatter, [0, 1], [0, (index % 2 === 0 ? 1 : -1) * 15]);

  return (
    <motion.div
      className="absolute w-11 h-14 rounded-lg border border-white/[0.05] bg-white/[0.02] flex flex-col items-center justify-center gap-1"
      style={{ left: `${baseX}%`, top: `${baseY}%`, x: dx, y: dy, opacity, rotate }}
    >
      <div className="w-5 h-[2px] rounded-full bg-slate-700/40" />
      <div className="w-4 h-[2px] rounded-full bg-slate-700/25" />
      <div className="w-5 h-[2px] rounded-full bg-slate-700/15" />
    </motion.div>
  );
}

/* ── Data particle (Phase 2) ── */
function Particle({ index, total, converge }: {
  index: number; total: number; converge: MotionValue<number>;
}) {
  const angle = (index / total) * Math.PI * 2;
  const x = useTransform(converge, [0, 1], [Math.cos(angle) * 220, Math.cos(angle) * 35]);
  const y = useTransform(converge, [0, 1], [Math.sin(angle) * 220, Math.sin(angle) * 35]);
  const scale = useTransform(converge, [0, 0.5, 1], [0.4, 0.9, 0.2]);
  const opacity = useTransform(converge, [0, 0.2, 0.85, 1], [0, 0.8, 0.5, 0]);

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-cyan-400/60"
      style={{ left: "50%", top: "50%", x, y, scale, opacity }}
    />
  );
}
