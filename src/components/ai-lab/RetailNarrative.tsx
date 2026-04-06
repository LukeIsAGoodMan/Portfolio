"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* ═══════════════════════════════════════════════
   RetailNarrative — Two-phase vertical waterfall
   Phase 1: The Human Bottleneck (Legacy Training)
   Phase 2: The 24/7 Infinite Sparring Partner (AI Advantage)
   ═══════════════════════════════════════════════ */

const DOC_NODES = [
  { x: 10, y: 12 }, { x: 80, y: 8 }, { x: 22, y: 72 }, { x: 76, y: 65 },
  { x: 48, y: 20 }, { x: 58, y: 82 }, { x: 14, y: 48 }, { x: 86, y: 40 },
  { x: 34, y: 60 }, { x: 66, y: 32 },
];

const PAIN_POINTS = [
  "RARE EXPERT MENTORS",
  "TRIAL-AND-ERROR ON REAL CUSTOMERS",
  "EVERY FAILURE COSTS LOYALTY",
];

export default function RetailNarrative({ onEnter }: { onEnter: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["#0B101A", "#0B101A", "#0B101A", "#080d16"],
  );

  // Phase 1: 0 → 0.45 (visible), fades out by 0.55
  const p1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.45], [1, 1, 0]);
  // Phase 2: fades in at 0.45, fully visible by 0.58
  const p2Opacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);

  const scatter = useTransform(scrollYProgress, [0.02, 0.3], [0, 1]);
  const converge = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const coreScale = useTransform(scrollYProgress, [0.5, 0.7], [0.2, 1]);
  const coreGlow = useTransform(scrollYProgress, [0.55, 0.72], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <motion.div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        {/* ── Phase 1: The Human Bottleneck ── */}
        <motion.div className="absolute inset-0" style={{ opacity: p1Opacity }}>
          {DOC_NODES.map((pos, i) => (
            <TrainingDoc key={i} index={i} baseX={pos.x} baseY={pos.y} scatter={scatter} />
          ))}

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
            <p className="text-[11px] uppercase tracking-[0.15em] text-red-400 font-semibold mb-6 drop-shadow-sm">
              Legacy Training
            </p>
            <h2 className="text-3xl md:text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.05em] leading-[1.0] text-center text-white drop-shadow-sm mb-6 max-w-[700px]">
              The Human Bottleneck
            </h2>
            <p className="text-[14px] md:text-[15px] text-gray-50 leading-[1.7] text-center max-w-[520px] mb-10 drop-shadow-sm">
              Expert mentors are scarce. New hires learn by trial-and-error on real customers.
              Every failed interaction costs loyalty and revenue.
            </p>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {PAIN_POINTS.map((point) => (
                <span
                  key={point}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2
                    text-[10px] md:text-[11px] font-semibold tracking-[0.06em] uppercase
                    bg-red-500/10 border border-red-500/20 rounded-full text-red-400
                  "
                >
                  <span className="text-red-400">&#x2717;</span>
                  {point}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Phase 2: The 24/7 Infinite Sparring Partner ── */}
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
                  boxShadow: "0 0 80px rgba(212,175,55,0.25), 0 0 160px rgba(244,194,175,0.1)",
                }}
              />
              <div
                className="w-24 h-24 rounded-full border border-[#D4AF37]/25 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 35% 35%, rgba(212,175,55,0.2), rgba(244,194,175,0.08) 60%, transparent)",
                }}
              >
                <svg viewBox="0 0 40 40" className="w-14 h-14">
                  <ellipse cx="20" cy="20" rx="15" ry="6" fill="none" stroke="rgba(212,175,55,0.4)" strokeWidth="0.6" />
                  <ellipse cx="20" cy="20" rx="6" ry="15" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="0.6" />
                  <circle cx="20" cy="20" r="3" fill="rgba(212,175,55,0.5)" />
                </svg>
              </div>
            </motion.div>
          </div>

          <div className="absolute inset-0 flex items-end justify-center pb-[12vh] z-10">
            <div className="text-center max-w-[600px] px-6">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#D4AF37] font-semibold mb-5 drop-shadow-sm">
                Advantage
              </p>
              <h2 className="text-[clamp(1.5rem,3vw,2.4rem)] font-semibold tracking-[-0.04em] leading-[1.12] text-white drop-shadow-sm mb-4">
                The 24/7 Infinite Sparring Partner.
                <br />
                <span className="text-gray-50">Master the &quot;Unreasonable Request&quot; before it hits the floor.</span>
              </h2>
              <p className="text-[14px] text-gray-50 leading-[1.7] mb-10 drop-shadow-sm">
                Risk-free confrontation training. An AI client that escalates, judges,
                and coaches every response in real time.
              </p>

              <motion.button
                onClick={onEnter}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                data-magnetic
                className="
                  inline-flex items-center gap-2.5 px-8 py-4
                  bg-[#D4AF37] text-[#0B101A]
                  text-[13px] font-semibold tracking-[0.01em]
                  rounded-full
                  shadow-[0_4px_24px_rgba(212,175,55,0.3),0_0_60px_rgba(212,175,55,0.15)]
                  transition-shadow duration-300
                  hover:shadow-[0_4px_32px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.2)]
                "
              >
                Enter the Boutique
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Training document icon (Phase 1) ── */
function TrainingDoc({ index, baseX, baseY, scatter }: {
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
      <div className="w-4 h-[2px] rounded-full bg-[#D4AF37]/20" />
      <div className="w-5 h-[2px] rounded-full bg-slate-700/30" />
      <div className="w-3 h-[2px] rounded-full bg-slate-700/20" />
    </motion.div>
  );
}

/* ── Converging particle (Phase 2) ── */
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
      className="absolute w-2 h-2 rounded-full bg-[#D4AF37]/60"
      style={{ left: "50%", top: "50%", x, y, scale, opacity }}
    />
  );
}
