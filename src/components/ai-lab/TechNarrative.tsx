"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* ═══════════════════════════════════════════════
   TechNarrative — Three-phase scroll waterfall (SRE)
   Phase 1: SOP crisis (scatter wiki pages)
   Phase 2: AI evolution (converge to core)
   Phase 3: Scenario reveal + CTA
   ═══════════════════════════════════════════════ */

const DOC_NODES = [
  { x: 8, y: 15 }, { x: 82, y: 10 }, { x: 20, y: 70 }, { x: 75, y: 68 },
  { x: 45, y: 22 }, { x: 55, y: 85 }, { x: 12, y: 50 }, { x: 88, y: 42 },
  { x: 32, y: 58 }, { x: 68, y: 35 },
];

const PAIN_POINTS = [
  "DEVASTATING DOWNTIME",
  "HIGH ON-CALL ANXIETY",
  "STATIC KNOWLEDGE DECAY",
];

export default function TechNarrative({ onEnter }: { onEnter: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    ["#0B101A", "#0B101A", "#0B101A", "#080d16"],
  );

  const p1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.38], [1, 1, 0]);
  const p2Opacity = useTransform(scrollYProgress, [0.3, 0.42, 0.62, 0.72], [0, 1, 1, 0]);
  const p3Opacity = useTransform(scrollYProgress, [0.68, 0.82], [0, 1]);

  const scatter = useTransform(scrollYProgress, [0.05, 0.32], [0, 1]);
  const converge = useTransform(scrollYProgress, [0.38, 0.6], [0, 1]);
  const coreScale = useTransform(scrollYProgress, [0.4, 0.65], [0.2, 1]);
  const coreGlow = useTransform(scrollYProgress, [0.5, 0.68], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <motion.div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        {/* ── Phase 1: The Crisis ── */}
        <motion.div className="absolute inset-0" style={{ opacity: p1Opacity }}>
          {DOC_NODES.map((pos, i) => (
            <WikiIcon key={i} index={i} baseX={pos.x} baseY={pos.y} scatter={scatter} />
          ))}

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
            <p className="text-[11px] uppercase tracking-[0.15em] text-red-400/70 font-semibold mb-6">
              Current Status
            </p>
            <h2 className="text-3xl md:text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.05em] leading-[1.0] text-center text-white mb-6 max-w-[700px]">
              1,000+ Pages of
              <br />
              <span className="text-slate-500">Static SOPs</span>
            </h2>
            <p className="text-[14px] md:text-[15px] text-slate-500 leading-[1.7] text-center max-w-[520px] mb-10">
              SREs are buried in static runbooks. When production goes down, searching for the right command becomes a race against time and revenue loss.
            </p>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {PAIN_POINTS.map((point) => (
                <span
                  key={point}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2
                    text-[10px] md:text-[11px] font-semibold tracking-[0.06em] uppercase
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

        {/* ── Phase 2: The Evolution ── */}
        <motion.div className="absolute inset-0" style={{ opacity: p2Opacity }}>
          {DOC_NODES.map((_, i) => (
            <Particle key={i} index={i} total={DOC_NODES.length} converge={converge} />
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div className="relative" style={{ scale: coreScale }}>
              <motion.div
                className="absolute inset-[-20px] rounded-full"
                style={{
                  opacity: coreGlow,
                  boxShadow: "0 0 80px rgba(59,130,246,0.25), 0 0 160px rgba(59,130,246,0.08)",
                }}
              />
              <div
                className="w-24 h-24 rounded-full border border-blue-400/25 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 35% 35%, rgba(59,130,246,0.2), transparent 60%)",
                }}
              >
                <svg viewBox="0 0 40 40" className="w-14 h-14">
                  <ellipse cx="20" cy="20" rx="15" ry="6" fill="none" stroke="rgba(59,130,246,0.4)" strokeWidth="0.6" />
                  <ellipse cx="20" cy="20" rx="6" ry="15" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="0.6" />
                  <circle cx="20" cy="20" r="3" fill="rgba(59,130,246,0.5)" />
                </svg>
              </div>
            </motion.div>
          </div>

          <div className="absolute inset-0 flex items-end justify-center pb-[12vh] z-10">
            <div className="text-center max-w-[600px] px-6">
              <p className="text-[11px] uppercase tracking-[0.15em] text-blue-400/60 font-semibold mb-5">
                The Evolution
              </p>
              <h2 className="text-[clamp(1.5rem,3vw,2.4rem)] font-semibold tracking-[-0.04em] leading-[1.12] text-white mb-4">
                A zero-risk, heuristic sandbox.
                <br />
                <span className="text-slate-400">AI guides the inquiry, not the answer.</span>
              </h2>
              <p className="text-[14px] text-slate-400 leading-[1.7]">
                Real-time infrastructure fault simulation with Socratic AI mentoring.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Phase 3: The Scenario ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: p3Opacity }}
        >
          <div className="text-center max-w-[680px] px-6">
            <div className="flex justify-center mb-8">
              <span className="
                inline-flex items-center gap-2 px-4 py-2
                font-mono text-[10px] tracking-[0.06em] uppercase
                bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400/80
              ">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                GPT-5.4 mini LIVE // SRE_CORE
              </span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-5">
              Scenario
            </p>
            <h2 className="text-[clamp(1.6rem,3.5vw,2.6rem)] font-semibold tracking-[-0.04em] leading-[1.12] text-white mb-6">
              It&apos;s 2 AM. Payment-Service is down.
            </h2>
            <p className="text-[15px] text-slate-400 leading-[1.7] mb-4">
              504 Gateway Timeout. The database is unreachable. The transaction queue is filling up.
            </p>
            <p className="text-[14px] text-slate-500 leading-[1.7] mb-10 max-w-[540px] mx-auto">
              <span className="text-blue-400/80 font-medium">Your Mission:</span> Investigate the logs, trace the network path, and find the root cause before the queue overflows.
            </p>

            <motion.button
              onClick={onEnter}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              data-magnetic
              className="
                inline-flex items-center gap-2.5 px-8 py-4
                bg-blue-500 text-white
                text-[13px] font-semibold tracking-[0.01em]
                rounded-full
                shadow-[0_0_40px_rgba(59,130,246,0.3)]
                transition-shadow duration-300
                hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]
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

/* ── Wiki/SOP page icon (Phase 1) ── */
function WikiIcon({ index, baseX, baseY, scatter }: {
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
      {/* Terminal/wiki icon lines */}
      <div className="w-4 h-[2px] rounded-full bg-blue-500/20" />
      <div className="w-5 h-[2px] rounded-full bg-slate-700/30" />
      <div className="w-3 h-[2px] rounded-full bg-slate-700/20" />
    </motion.div>
  );
}

/* ── Data particle (Phase 2) ── */
function Particle({ index, total, converge }: {
  index: number; total: number; converge: MotionValue<number>;
}) {
  const angle = (index / total) * Math.PI * 2;
  const startR = typeof window !== "undefined" && window.innerWidth < 768 ? 120 : 220;
  const x = useTransform(converge, [0, 1], [Math.cos(angle) * startR, Math.cos(angle) * 35]);
  const y = useTransform(converge, [0, 1], [Math.sin(angle) * startR, Math.sin(angle) * 35]);
  const scale = useTransform(converge, [0, 0.5, 1], [0.4, 0.9, 0.2]);
  const opacity = useTransform(converge, [0, 0.2, 0.85, 1], [0, 0.8, 0.5, 0]);

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-blue-400/60"
      style={{ left: "50%", top: "50%", x, y, scale, opacity }}
    />
  );
}
