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
        className="relative z-10 text-center max-w-[920px]"
      >
        {/* Eyebrow */}
        <motion.p
          custom={0}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="text-[13px] uppercase tracking-[0.2em] text-muted mb-8 font-medium"
        >
          Learning Experience Designer
        </motion.p>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="text-[clamp(2rem,6vw,6.5rem)] font-semibold tracking-[-0.05em] leading-[1.04] mb-8 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900"
        >
          Designing experiences
          <br />
          that teach, inspire,
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#86868b] via-[#6b7280] to-[#86868b]">and transform.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="text-[17px] md:text-lg text-muted max-w-[540px] mx-auto leading-[1.6] mb-12"
        >
          I craft digital learning journeys where pedagogy meets
          precision&mdash;blending cognitive science with world-class
          interface design.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          custom={3}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center gap-4 flex-wrap"
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
