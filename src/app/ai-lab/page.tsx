"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, type MotionStyle } from "framer-motion";
import { useTranslation } from "react-i18next";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import dynamic from "next/dynamic";

const KnowledgeCore = dynamic(
  () => import("@/components/hero/KnowledgeCore"),
  { ssr: false },
);

const TerminalAgent = dynamic(
  () => import("@/components/ai-lab/TerminalAgent"),
  { ssr: false },
);

/* ═══════════════════════════════════════════════
   AI Powered Learning Experience Lab
   Dark-mode experimental showcase
   ═══════════════════════════════════════════════ */

const EASE_EXPO = [0.23, 1, 0.32, 1] as const;

export default function AiLabPage() {
  const { t } = useTranslation("aiLab");

  const cases = t("cases.items", { returnObjects: true }) as Array<{
    industry: string;
    title: string;
    description: string;
    stat: string;
    tags: string[];
  }>;

  return (
    <div className="bg-[#0B101A] min-h-screen text-white">
      {/* ════════════════════════════════════════
         Hero — Lab Manifesto
         ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Text content — pointer-events-none so drags pass through to 3D */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2, ease: EASE_EXPO }}
          className="relative z-[1] text-center max-w-[800px] px-6 pointer-events-none"
        >
          <p className="text-[13px] uppercase tracking-[0.2em] text-slate-400 mb-5 font-medium">
            {t("hero.label")}
          </p>

          <h1 className="text-7xl md:text-[10vw] font-extrabold tracking-tighter leading-[0.9] mb-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white">
            {t("hero.title")}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE_EXPO }}
            className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto"
          >
            {t("hero.hook")}
          </motion.p>

          {/* CTA — restore pointer-events */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-12 pointer-events-auto"
          >
            <a
              href="#cases"
              data-magnetic
              className="
                inline-flex items-center px-7 py-3.5
                bg-white text-[#0B101A]
                text-[13px] font-medium tracking-[0.01em]
                rounded-full
                transition-transform duration-300
                hover:scale-[1.04] active:scale-[0.98]
              "
            >
              {t("hero.cta")}
            </a>
          </motion.div>
        </motion.div>

        {/* KnowledgeCore 3D — highest z for drag priority */}
        <div
          className="
            absolute z-[5]
            right-[-10%] md:right-[2%] lg:right-[8%]
            top-1/2 -translate-y-[55%]
            w-[80vw] md:w-[50vw] lg:w-[42vw]
            max-w-[620px]
            h-[300px] md:h-[500px] lg:h-[600px]
            opacity-30 md:opacity-40 lg:opacity-50
            pointer-events-none md:pointer-events-auto
            transition-opacity duration-1000
          "
          style={{
            WebkitMaskImage: "radial-gradient(circle at 60% 50%, black 40%, transparent 85%)",
            maskImage: "radial-gradient(circle at 60% 50%, black 40%, transparent 85%)",
          }}
        >
          <KnowledgeCore />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[1] pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: "easeInOut",
            }}
            className="w-[1px] h-6 bg-slate-500/30"
          />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
         Trust & Integrity Badge
         ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1200px] px-6 pb-20">
        <motion.div
          {...scrollRevealProps(0)}
          className="
            mx-auto max-w-[800px]
            rounded-2xl
            border border-white/[0.06]
            bg-white/[0.02]
            backdrop-blur-lg
            px-8 py-7 md:px-12 md:py-9
            flex items-start gap-5
          "
        >
          {/* Shield icon */}
          <div className="flex-shrink-0 mt-0.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400/70">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-blue-400/60 font-semibold mb-2">
              {t("trust.label")}
            </p>
            <p className="text-[14px] md:text-[15px] text-slate-400 leading-[1.7]">
              {t("trust.body")}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
         Triple Use-Case Grid
         ════════════════════════════════════════ */}
      <section id="cases" className="mx-auto max-w-[1200px] px-6 py-20">
        <motion.div {...scrollRevealProps(0)} className="mb-16">
          <p className="text-[13px] uppercase tracking-[0.2em] text-slate-500 mb-4 font-medium">
            {t("cases.label")}
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-[-0.05em] leading-[1.08] text-white">
            {t("cases.heading_line1")}
            <br />
            <span className="text-slate-400">{t("cases.heading_line2")}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((item, i) => (
            <motion.div
              key={i}
              {...scrollRevealProps(i * 0.1)}
            >
              <LabCard
                industry={item.industry}
                title={item.title}
                description={item.description}
                stat={item.stat}
                tags={item.tags}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
         Mission-Critical Sandbox — Live Terminal
         ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <motion.div {...scrollRevealProps(0)} className="text-center mb-12">
          <p className="text-[13px] uppercase tracking-[0.2em] text-slate-500 mb-4 font-medium">
            {t("cases.items.0.industry", { defaultValue: "High Tech" })}
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12] text-white mb-4">
            {t("cases.items.0.title", { defaultValue: "Adaptive Skill-Pilot" })}
          </h2>
          <p className="text-[14px] md:text-[15px] text-slate-400 max-w-[520px] mx-auto leading-[1.6]">
            {t("sandbox.description", { defaultValue: "Step into a production incident. Diagnose, investigate, and resolve — guided by an AI mentor that never gives you the answer." })}
          </p>
        </motion.div>

        {/* Cursor sentinel — hide custom cursor over terminal */}
        <motion.div
          {...scrollRevealProps(0.1)}
          onMouseEnter={() => document.body.classList.add("hide-custom-cursor")}
          onMouseLeave={() => document.body.classList.remove("hide-custom-cursor")}
          className="relative -mx-2 px-2"
        >
          <TerminalAgent scenarioId="tech-sre-sandbox" />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
         Bottom Gradient Fade
         ════════════════════════════════════════ */}
      <div className="h-32 bg-gradient-to-b from-[#0B101A] to-[#0B101A]/0" />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Lab Card — dark glassmorphic card with 3D tilt
   Same geometry as MockupCard, dark palette
   ═══════════════════════════════════════════════ */

function LabCard({
  industry,
  title,
  description,
  stat,
  tags,
}: {
  industry: string;
  title: string;
  description: string;
  stat: string;
  tags: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(rawX, springConfig);
  const rotateY = useSpring(rawY, springConfig);

  const tiltStyle: MotionStyle = {
    rotateX,
    rotateY,
    transformPerspective: 800,
    transformStyle: "preserve-3d" as const,
  };

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      rawX.set(-ny * 6);
      rawY.set(nx * 6);
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [rawX, rawY],
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={ref}
      style={tiltStyle}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={onMouseLeave}
      className="
        group relative overflow-hidden
        rounded-[32px]
        border border-white/[0.08]
        bg-white/[0.03]
        backdrop-blur-xl
        shadow-[0_2px_24px_rgba(0,0,0,0.3)]
        transition-shadow duration-500
        hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]
        cursor-default
      "
    >
      {/* Shimmer glow */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 rounded-[32px]"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            500px circle at ${mousePos.x}% ${mousePos.y}%,
            rgba(99,102,241,0.12) 0%,
            rgba(99,102,241,0.04) 30%,
            transparent 60%
          )`,
        }}
      />

      {/* Edge highlight */}
      <div
        className="absolute inset-0 z-10 pointer-events-none rounded-[32px] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            400px circle at ${mousePos.x}% ${mousePos.y}%,
            rgba(255,255,255,0.15) 0%,
            transparent 50%
          )`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      <div className="relative z-[1] p-8 min-h-[340px] flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase bg-white/[0.06] border border-white/[0.08] rounded-full text-slate-400">
            {industry}
          </span>
          <span className="text-[12px] font-medium text-slate-500">
            {stat}
          </span>
        </div>

        {/* Title + description */}
        <div className="flex-1 flex flex-col justify-center py-6">
          <h3 className="text-[clamp(1.5rem,2.8vw,2rem)] font-semibold tracking-[-0.04em] leading-[1.1] text-white mb-4">
            {title}
          </h3>
          <p className="text-[14px] text-slate-400 leading-[1.7]">
            {description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-[11px] font-medium tracking-[0.02em] bg-white/[0.04] border border-white/[0.06] text-slate-500 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
