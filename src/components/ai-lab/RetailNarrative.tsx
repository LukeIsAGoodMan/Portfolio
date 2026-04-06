"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ═══════════════════════════════════════════════
   RetailNarrative — Horizontal scroll-snap lookbook
   3 panels: Bottleneck → Social Anxiety → Advantage
   ═══════════════════════════════════════════════ */

export default function RetailNarrative({ onEnter }: { onEnter: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map vertical scroll to horizontal translate (3 panels = 0%, -100%, -200%)
  const xTranslate = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ["0%", "-100%", "-200%", "-200%"]);

  // Panel opacities
  const p1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.36], [1, 1, 0.3]);
  const p2Opacity = useTransform(scrollYProgress, [0.28, 0.36, 0.6, 0.68], [0.3, 1, 1, 0.3]);
  const p3Opacity = useTransform(scrollYProgress, [0.6, 0.72], [0.3, 1]);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      {/* Sticky viewport — clips horizontal panels */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ x: xTranslate, width: "300%" }}
        >
          {/* ── Panel 1: The Bottleneck ── */}
          <motion.div
            className="w-screen h-full flex items-center justify-center px-6 bg-[#0B101A]"
            style={{ opacity: p1Opacity }}
          >
            <div className="text-center max-w-[600px]">
              {/* Manager vs intern visual */}
              <div className="flex items-center justify-center gap-8 mb-10">
                <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="text-slate-600 text-[20px] select-none">vs</div>
                <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center opacity-40">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
              </div>

              <p className="text-[11px] uppercase tracking-[0.15em] text-amber-400/60 font-semibold mb-5">
                Tradition
              </p>
              <h2 className="text-3xl md:text-[clamp(2rem,4.5vw,3rem)] font-bold tracking-[-0.05em] leading-[1.05] text-white mb-5">
                Rare, Expensive, and
                <br />
                <span className="text-slate-500">Inconsistent Human Coaching</span>
              </h2>
              <p className="text-[14px] text-slate-500 leading-[1.7] max-w-[440px] mx-auto">
                Expert mentors are scarce. New hires learn by trial-and-error on real customers. Every failed interaction costs loyalty.
              </p>
            </div>
          </motion.div>

          {/* ── Panel 2: The Social Anxiety ── */}
          <motion.div
            className="w-screen h-full flex items-center justify-center px-6 bg-[#0B101A]"
            style={{ opacity: p2Opacity }}
          >
            <div className="text-center max-w-[600px]">
              {/* Pulsing heart rate */}
              <div className="flex items-center justify-center gap-3 mb-10">
                {[0, 0.2, 0.4].map((delay) => (
                  <motion.div
                    key={delay}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay }}
                    className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400/70">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </motion.div>
                ))}
              </div>

              <p className="text-[11px] uppercase tracking-[0.15em] text-red-400/70 font-semibold mb-5">
                Pain
              </p>
              <h2 className="text-3xl md:text-[clamp(2rem,4.5vw,3rem)] font-bold tracking-[-0.05em] leading-[1.05] text-white mb-5">
                High-Stakes Fear.
                <br />
                <span className="text-slate-500">The first lesson shouldn&apos;t cost a real customer.</span>
              </h2>
              <p className="text-[14px] text-slate-500 leading-[1.7] max-w-[440px] mx-auto">
                Social anxiety, escalation pressure, and emotional exhaustion. New associates freeze when confronted by an aggressive VIP.
              </p>
            </div>
          </motion.div>

          {/* ── Panel 3: The Advantage ── */}
          <motion.div
            className="w-screen h-full flex items-center justify-center px-6"
            style={{
              opacity: p3Opacity,
              background: "linear-gradient(180deg, #0B101A 0%, #1a1510 50%, #FAF9F6 100%)",
            }}
          >
            <div className="text-center max-w-[600px]">
              {/* Rose quartz sphere */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div
                    className="absolute inset-[-12px] rounded-full"
                    style={{ boxShadow: "0 0 50px rgba(244,194,175,0.2), 0 0 100px rgba(244,194,175,0.08)" }}
                  />
                  <div
                    className="w-20 h-20 rounded-full border border-[#f4c2af]/30 flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, rgba(244,194,175,0.25), rgba(244,194,175,0.05) 60%, transparent)",
                    }}
                  >
                    <svg viewBox="0 0 40 40" className="w-12 h-12">
                      <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke="rgba(244,194,175,0.4)" strokeWidth="0.6" />
                      <ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke="rgba(244,194,175,0.3)" strokeWidth="0.6" />
                      <circle cx="20" cy="20" r="3" fill="rgba(244,194,175,0.5)" />
                    </svg>
                  </div>
                </div>
              </div>

              <p className="text-[11px] uppercase tracking-[0.15em] text-[#c49882] font-semibold mb-5">
                Advantage
              </p>
              <h2 className="text-3xl md:text-[clamp(2rem,4.5vw,3rem)] font-bold tracking-[-0.05em] leading-[1.05] text-[#1a1510] mb-5">
                The Infinite Sparring Partner.
              </h2>
              <p className="text-[15px] text-[#7a6e63] leading-[1.7] max-w-[460px] mx-auto mb-10">
                24/7 risk-free confrontation. Master the &quot;Unreasonable Request&quot; before it hits the floor.
              </p>

              <motion.button
                onClick={onEnter}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                data-magnetic
                className="
                  inline-flex items-center gap-2.5 px-8 py-4
                  bg-[#1a1510] text-[#FAF9F6]
                  text-[13px] font-semibold tracking-[0.01em]
                  rounded-full
                  shadow-[0_0_30px_rgba(244,194,175,0.2)]
                  transition-shadow duration-300
                  hover:shadow-[0_0_50px_rgba(244,194,175,0.35)]
                "
              >
                Enter the Boutique
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {[0, 0.33, 0.66].map((threshold, i) => (
            <ProgressDot key={i} progress={scrollYProgress} threshold={threshold} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressDot({ progress, threshold }: { progress: ReturnType<typeof useScroll>["scrollYProgress"]; threshold: number }) {
  const opacity = useTransform(progress, [threshold - 0.05, threshold, threshold + 0.3], [0.3, 1, 0.3]);
  const scale = useTransform(progress, [threshold - 0.05, threshold, threshold + 0.3], [0.8, 1.2, 0.8]);
  return (
    <motion.div
      className="w-2 h-2 rounded-full bg-white/40"
      style={{ opacity, scale }}
    />
  );
}
