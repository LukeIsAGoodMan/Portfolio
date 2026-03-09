"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";

/**
 * Hero section with:
 * - Massive centered typography with blur-to-clear staggered reveal
 * - Parallax fade on scroll
 * - 3D KnowledgeCore glass element, offset right for asymmetric balance
 */

const KnowledgeCore = dynamic(
  () => import("@/components/hero/KnowledgeCore"),
  { ssr: false },
);

const EASE_EXPO = [0.23, 1, 0.32, 1] as const;

const lineVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(12px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      delay: 0.2 + i * 0.15,
      ease: EASE_EXPO,
    },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* ── KnowledgeCore 3D element ──
          Positioned off-center right for Lionel Taurus-style asymmetric balance.
          Mobile: decorative backdrop (pointer-events disabled, low opacity).
          Desktop: interactive (orbit controls active, higher opacity). */}
      <div
        className="
          absolute z-[1]
          right-[-10%] md:right-[2%] lg:right-[8%]
          top-1/2 -translate-y-[55%]
          w-[80vw] md:w-[50vw] lg:w-[42vw]
          max-w-[620px]
          h-[300px] md:h-[500px] lg:h-[600px]
          opacity-50 md:opacity-65 lg:opacity-80
          pointer-events-none md:pointer-events-auto
          transition-opacity duration-1000
          canvas-feather
        "
      >
        <KnowledgeCore />
      </div>

      {/* ── Text content — z-above the 3D element ── */}
      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-10 text-center max-w-[800px] px-6"
      >
        {/* H1 — Identity anchor */}
        <motion.h1
          custom={0}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="text-7xl md:text-[10vw] font-extrabold tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900"
        >
          Zoey Wu.
        </motion.h1>

        {/* H2 — Role */}
        <motion.h2
          custom={1}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="text-2xl md:text-4xl font-semibold text-[#1e293b] mt-2 tracking-[-0.03em]"
        >
          Learning Experience Designer
        </motion.h2>

        {/* H3 — Value proposition */}
        <motion.h3
          custom={2}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="text-lg md:text-2xl font-medium mt-4 max-w-2xl mx-auto leading-[1.5] tracking-[-0.01em] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900"
        >
          Bridging the gap between complexity and clarity.
        </motion.h3>

        {/* P — Philosophy */}
        <motion.p
          custom={3}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="text-base md:text-lg text-[#64748b] mt-6 leading-relaxed max-w-xl mx-auto"
        >
          Where pedagogy meets precision&mdash;blending cognitive science
          with interface design to transform how people learn.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          custom={4}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center gap-4 flex-wrap mt-12"
        >
          <a
            href="/work"
            data-magnetic
            className="
              inline-flex items-center px-7 py-3.5
              bg-foreground text-background
              text-[13px] font-medium tracking-[0.01em]
              rounded-full
              transition-transform duration-300
              hover:scale-[1.04]
              active:scale-[0.98]
            "
          >
            View Selected Work
          </a>
          <a
            href="/about"
            data-magnetic
            className="
              inline-flex items-center px-7 py-3.5
              border border-[#d1d1d6] text-muted
              text-[13px] font-medium tracking-[0.01em]
              rounded-full
              transition-all duration-300
              hover:border-foreground hover:text-foreground
            "
          >
            About Me
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[11px] uppercase tracking-[0.15em] text-muted/50 font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2.4,
            ease: "easeInOut",
          }}
          className="w-[1px] h-6 bg-muted/30"
        />
      </motion.div>
    </section>
  );
}
