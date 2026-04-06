"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* ═══════════════════════════════════════════════
   ScrollNarrative — Three-phase vertical waterfall
   Phase 1: Legacy pain (scatter docs)
   Phase 2: Catalyst (converge to core)
   Phase 3: Entry (reveal CTA)
   ═══════════════════════════════════════════════ */

const EASE_EXPO = [0.23, 1, 0.32, 1] as const;

/** Positions for the 8 "document" nodes — normalized 0-1 */
const DOC_POSITIONS = [
  { x: 12, y: 20 }, { x: 78, y: 15 }, { x: 25, y: 65 }, { x: 70, y: 70 },
  { x: 45, y: 30 }, { x: 55, y: 80 }, { x: 15, y: 45 }, { x: 85, y: 50 },
];

export default function ScrollNarrative({ onEnter }: { onEnter: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phase mapping: 0-0.33 = Legacy, 0.33-0.66 = Catalyst, 0.66-1 = Entry
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66],
    ["#0B101A", "#0B101A", "#0A1221"],
  );

  // Phase 1 opacity (visible 0-0.4, fade out)
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.45], [1, 1, 0]);
  // Phase 2 opacity (fade in 0.3-0.5, visible, fade out 0.7-0.85)
  const phase2Opacity = useTransform(scrollYProgress, [0.3, 0.45, 0.7, 0.85], [0, 1, 1, 0]);
  // Phase 3 opacity (fade in 0.75-0.9)
  const phase3Opacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);

  // Doc scatter intensity (0 = grid, 1 = fully scattered)
  const scatter = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);
  // Doc convergence (0 = scattered, 1 = converged to center)
  const converge = useTransform(scrollYProgress, [0.4, 0.65], [0, 1]);

  // Core glow
  const coreScale = useTransform(scrollYProgress, [0.4, 0.7], [0.3, 1]);
  const coreGlow = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      {/* Sticky viewport */}
      <motion.div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        {/* ── Phase 1: Legacy — Scattered Documents ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: phase1Opacity }}
        >
          {/* Document nodes */}
          {DOC_POSITIONS.map((pos, i) => (
            <DocNode key={i} index={i} baseX={pos.x} baseY={pos.y} scatter={scatter} />
          ))}

          {/* Copy */}
          <div className="relative z-10 text-center max-w-[640px] px-6">
            <p className="text-[11px] uppercase tracking-[0.15em] text-red-400/60 font-semibold mb-4">
              Current Status
            </p>
            <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold tracking-[-0.04em] leading-[1.12] text-white mb-6">
              50+ hours of static reading.
              <br />
              <span className="text-slate-500">Zero retention. 100% risk exposure.</span>
            </h2>
            <p className="text-[14px] text-slate-500 leading-[1.7] max-w-[440px] mx-auto">
              New compliance analysts face a wall of policy documents before their first live client meeting. The knowledge gap is invisible until it becomes an audit failure.
            </p>
          </div>
        </motion.div>

        {/* ── Phase 2: Catalyst — Convergence ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: phase2Opacity }}
        >
          {/* Converging data nodes */}
          {DOC_POSITIONS.map((_, i) => (
            <DataNode key={i} index={i} converge={converge} />
          ))}

          {/* Central core */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            style={{ scale: coreScale }}
          >
            {/* Glow */}
            <motion.div
              className="absolute w-32 h-32 rounded-full"
              style={{
                opacity: coreGlow,
                boxShadow: "0 0 60px rgba(34,211,238,0.3), 0 0 120px rgba(34,211,238,0.1)",
              }}
            />
            {/* Core sphere */}
            <div className="w-20 h-20 rounded-full border border-cyan-400/30 flex items-center justify-center mb-8"
              style={{
                background: "radial-gradient(circle at 35% 35%, rgba(34,211,238,0.2), transparent 60%)",
              }}
            >
              <svg viewBox="0 0 40 40" className="w-12 h-12">
                <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="0.75" />
                <ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="0.75" />
                <circle cx="20" cy="20" r="3" fill="rgba(34,211,238,0.5)" />
              </svg>
            </div>
          </motion.div>

          {/* Copy */}
          <div className="absolute inset-0 flex items-end justify-center pb-[15vh] z-10">
            <div className="text-center max-w-[600px] px-6">
              <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-400/60 font-semibold mb-4">
                The Evolution
              </p>
              <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12] text-white mb-4">
                Generative High-Stakes Simulation.
              </h2>
              <p className="text-[14px] text-slate-400 leading-[1.7]">
                Every dialogue is an audit. Every nudge is an evolution.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Phase 3: Entry — CTA ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: phase3Opacity }}
        >
          <div className="text-center">
            <motion.p
              initial={false}
              className="text-[11px] uppercase tracking-[0.15em] text-cyan-400/60 font-semibold mb-6"
            >
              Ready
            </motion.p>
            <motion.h2
              className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[-0.05em] leading-[1.08] text-white mb-10"
            >
              Enter the Compliance Lab.
            </motion.h2>
            <motion.button
              onClick={onEnter}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              data-magnetic
              className="
                inline-flex items-center gap-2 px-8 py-4
                bg-cyan-400 text-[#0A1221]
                text-[13px] font-semibold tracking-[0.01em]
                rounded-full
                shadow-[0_0_30px_rgba(34,211,238,0.3)]
                transition-shadow duration-300
                hover:shadow-[0_0_50px_rgba(34,211,238,0.5)]
              "
            >
              Start Simulation
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

/* ── Document node (Phase 1) ── */
function DocNode({
  index,
  baseX,
  baseY,
  scatter,
}: {
  index: number;
  baseX: number;
  baseY: number;
  scatter: MotionValue<number>;
}) {
  // Scatter outward from center
  const angle = (index / DOC_POSITIONS.length) * Math.PI * 2;
  const scatterX = useTransform(scatter, [0, 1], [0, Math.cos(angle) * 15]);
  const scatterY = useTransform(scatter, [0, 1], [0, Math.sin(angle) * 15]);
  const opacity = useTransform(scatter, [0.6, 1], [0.6, 0.2]);
  const rotate = useTransform(scatter, [0, 1], [0, (index % 2 === 0 ? 1 : -1) * 12]);

  return (
    <motion.div
      className="absolute w-12 h-16 rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm flex items-center justify-center"
      style={{
        left: `${baseX}%`,
        top: `${baseY}%`,
        x: scatterX,
        y: scatterY,
        opacity,
        rotate,
      }}
    >
      {/* PDF icon lines */}
      <div className="space-y-1">
        <div className="w-5 h-[2px] bg-slate-600/40 rounded-full" />
        <div className="w-4 h-[2px] bg-slate-600/30 rounded-full" />
        <div className="w-5 h-[2px] bg-slate-600/20 rounded-full" />
      </div>
    </motion.div>
  );
}

/* ── Data node (Phase 2) — converges to center ── */
function DataNode({
  index,
  converge,
}: {
  index: number;
  converge: MotionValue<number>;
}) {
  const angle = (index / DOC_POSITIONS.length) * Math.PI * 2;
  const startRadius = 200;

  const x = useTransform(converge, [0, 1], [Math.cos(angle) * startRadius, Math.cos(angle) * 40]);
  const y = useTransform(converge, [0, 1], [Math.sin(angle) * startRadius, Math.sin(angle) * 40]);
  const scale = useTransform(converge, [0, 0.5, 1], [0.5, 0.8, 0.3]);
  const opacity = useTransform(converge, [0, 0.3, 0.9, 1], [0, 0.8, 0.6, 0]);

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-cyan-400/60"
      style={{
        left: "50%",
        top: "50%",
        x,
        y,
        scale,
        opacity,
      }}
    />
  );
}
