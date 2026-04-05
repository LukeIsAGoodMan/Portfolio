"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { scrollRevealProps } from "@/hooks/scrollReveal";

/* ═══════════════════════════════════════════════
   The Strategic Communicator — Case Study
   Corporate Leadership × High-Stakes Influence
   ═══════════════════════════════════════════════ */

const EASE_EXPO = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function StrategicCommunicatorCaseStudy() {
  const { t } = useTranslation("strategicCommunicator");

  const meta = t("meta", { returnObjects: true }) as Array<{
    label: string;
    value: string;
  }>;

  const processSteps = t("process.steps", { returnObjects: true }) as Array<{
    number: string;
    title: string;
    subtitle: string;
    body: string[];
  }>;

  return (
    <div className="pt-28 pb-32">
      {/* ════════════════════════════════════════
         Section 1: Executive Header
         ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[900px] px-6 mb-24">
        {/* Back link */}
        <motion.div {...scrollRevealProps(0)} className="mb-12">
          <a
            href="/work"
            data-magnetic
            className="inline-flex items-center gap-1.5 text-[13px] text-muted font-medium tracking-[0.01em] transition-colors hover:text-foreground"
          >
            <span aria-hidden="true">&larr;</span>
            {t("backLink")}
          </a>
        </motion.div>

        {/* Headline */}
        <motion.div {...scrollRevealProps(0.05)} className="text-center mb-10">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-5 font-medium">
            {t("label")}
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-semibold tracking-[-0.05em] leading-[1.08] mb-5">
            {t("title_line1")}
            <br />
            {t("title_line2")}
          </h1>
          <p className="text-lg text-muted max-w-[560px] mx-auto leading-[1.6]">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Meta chips */}
        <motion.div
          {...scrollRevealProps(0.15)}
          className="flex flex-wrap justify-center gap-3"
        >
          {meta.map((m, i) => (
            <span
              key={i}
              className="
                inline-flex items-center gap-1.5
                px-4 py-2
                bg-white border border-[#e5e7eb]
                rounded-full
                text-[12px] font-medium tracking-[0.02em]
              "
            >
              <span className="text-muted">{m.label}:</span>
              <span className="text-foreground">{m.value}</span>
            </span>
          ))}
        </motion.div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[900px] px-6">
        <div className="border-t border-border" />
      </div>

      {/* ════════════════════════════════════════
         Section 2: The Gap — Strategy Radar
         ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[900px] px-6 py-24">
        <motion.div {...scrollRevealProps(0)} className="text-center mb-4">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            {t("problem.label")}
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12] mb-4">
            {t("problem.heading")}
          </h2>
          <p className="text-[15px] text-muted max-w-[520px] mx-auto leading-[1.6] mb-12">
            {t("problem.description")}
          </p>
        </motion.div>

        <motion.div {...scrollRevealProps(0.1)}>
          <StrategyRadar />
        </motion.div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[900px] px-6">
        <div className="border-t border-border" />
      </div>

      {/* ════════════════════════════════════════
         Section 3: The Framework — LXD Process
         ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[900px] px-6 py-24">
        <motion.div {...scrollRevealProps(0)} className="text-center mb-16">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            {t("process.label")}
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12]">
            {t("process.heading")}
          </h2>
        </motion.div>

        <div className="space-y-24">
          {processSteps.map((section, i) => (
            <motion.div
              key={section.number}
              {...scrollRevealProps(i * 0.06)}
              className="relative"
            >
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-[clamp(2.5rem,5vw,3.5rem)] font-semibold tracking-[-0.06em] text-border leading-none select-none">
                  {section.number}
                </span>
                <div>
                  <h3 className="text-[20px] font-semibold tracking-[-0.03em] mb-1">
                    {section.title}
                  </h3>
                  <p className="text-[14px] text-muted font-medium">
                    {section.subtitle}
                  </p>
                </div>
              </div>

              <div className="pl-0 md:pl-[72px] space-y-4">
                {section.body.map((paragraph, j) => (
                  <p
                    key={j}
                    className="text-[15px] text-muted leading-[1.7]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
         Section 3.5: The Strategy Lab — Simulation
         ════════════════════════════════════════ */}
      <SimulationSection t={t} />

      {/* Divider */}
      <div className="mx-auto max-w-[900px] px-6">
        <div className="border-t border-border" />
      </div>

      {/* ════════════════════════════════════════
         Section 4: Business Impact Dashboard
         ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[900px] px-6 py-24">
        <motion.div {...scrollRevealProps(0)} className="text-center mb-14">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            {t("impact.label")}
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12] mb-4">
            {t("impact.heading")}
          </h2>
          <p className="text-[15px] text-muted max-w-[480px] mx-auto leading-[1.6]">
            {t("impact.description")}
          </p>
        </motion.div>

        <StrategicImpactStats />
      </section>

      {/* ════════════════════════════════════════
         Footer CTA
         ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[900px] px-6 pt-8 text-center">
        <motion.div {...scrollRevealProps(0)}>
          <a
            href="/work"
            data-magnetic
            className="
              inline-flex items-center gap-2 px-7 py-3.5
              border border-[#d1d1d6] text-muted
              text-[13px] font-medium tracking-[0.01em]
              rounded-full
              transition-all duration-300
              hover:border-foreground hover:text-foreground
            "
          >
            <span aria-hidden="true">&larr;</span>
            {t("footerCta")}
          </a>
        </motion.div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Strategy Radar — 5-axis SVG radar chart
   Before: Information Dumping (jagged)
   After: Strategic Influencing (high, uniform)
   ═══════════════════════════════════════════════ */

const AXIS_COUNT = 5;
const BEFORE_VALUES = [0.35, 0.25, 0.20, 0.45, 0.15]; // jagged, low
const AFTER_VALUES  = [0.85, 0.80, 0.88, 0.82, 0.78]; // high, near-uniform

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 110;
const RINGS = [0.25, 0.5, 0.75, 1.0];

function polarToCartesian(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function buildPolygonPath(values: number[]): string {
  const step = 360 / AXIS_COUNT;
  return values
    .map((v, i) => {
      const { x, y } = polarToCartesian(i * step, v * RADIUS);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ") + " Z";
}

function StrategyRadar() {
  const { t } = useTranslation("strategicCommunicator");
  const axes = t("radar.axes", { returnObjects: true }) as string[];
  const [transformed, setTransformed] = useState(false);
  const values = transformed ? AFTER_VALUES : BEFORE_VALUES;

  const axisStep = 360 / AXIS_COUNT;
  const path = useMemo(() => buildPolygonPath(values), [values]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="overflow-visible"
        >
          {/* Grid rings */}
          {RINGS.map((r) => (
            <circle
              key={r}
              cx={CENTER}
              cy={CENTER}
              r={r * RADIUS}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={0.75}
            />
          ))}

          {/* Axis lines + labels */}
          {axes.map((label, i) => {
            const angle = i * axisStep;
            const end = polarToCartesian(angle, RADIUS + 2);
            const labelPos = polarToCartesian(angle, RADIUS + 24);
            return (
              <g key={i}>
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={end.x}
                  y2={end.y}
                  stroke="#e5e7eb"
                  strokeWidth={0.75}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-muted text-[10px] font-medium tracking-[0.02em]"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Data polygon */}
          <motion.path
            d={path}
            fill={transformed ? "rgba(0,113,227,0.10)" : "rgba(220,60,60,0.08)"}
            stroke={transformed ? "#0071e3" : "#dc3c3c"}
            strokeWidth={1.5}
            strokeLinejoin="round"
            initial={false}
            animate={{ d: path }}
            transition={{ duration: 0.9, ease: EASE_EXPO }}
          />

          {/* Data points */}
          {values.map((v, i) => {
            const { x, y } = polarToCartesian(i * axisStep, v * RADIUS);
            return (
              <motion.circle
                key={i}
                r={3.5}
                fill={transformed ? "#0071e3" : "#dc3c3c"}
                initial={false}
                animate={{ cx: x, cy: y }}
                transition={{ duration: 0.9, ease: EASE_EXPO }}
              />
            );
          })}
        </svg>

        {/* State badge */}
        <AnimatePresence mode="wait">
          <motion.span
            key={transformed ? "after" : "before"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className={`
              absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap
              px-3 py-1 text-[11px] font-medium tracking-[0.04em] uppercase
              rounded-full
              ${
                transformed
                  ? "bg-[#0071e3]/10 text-[#0071e3]"
                  : "bg-[#dc3c3c]/10 text-[#dc3c3c]"
              }
            `}
          >
            {transformed ? t("radar.badgeAfter") : t("radar.badgeBefore")}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setTransformed((s) => !s)}
        data-magnetic
        className="
          inline-flex items-center gap-2 px-6 py-3
          bg-foreground text-background
          text-[13px] font-medium tracking-[0.01em]
          rounded-full
          transition-transform duration-300
          hover:scale-[1.04] active:scale-[0.98]
        "
      >
        {transformed ? t("radar.buttonReset") : t("radar.buttonStandardize")}
        <span className="text-[15px]" aria-hidden="true">
          {transformed ? "\u21A9" : "\u2192"}
        </span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Live Simulation — with silky cursor transition
   ═══════════════════════════════════════════════ */

function SimulationSection({ t }: { t: (key: string, opts?: Record<string, unknown>) => string }) {
  const [active, setActive] = useState(false);

  const hideCustomCursor = useCallback(() => {
    document.body.classList.add("hide-custom-cursor");
  }, []);

  const showCustomCursor = useCallback(() => {
    document.body.classList.remove("hide-custom-cursor");
  }, []);

  return (
    <section className="bg-[#fbfbfd] py-16 md:py-28">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <motion.div {...scrollRevealProps(0)} className="text-center mb-10 md:mb-14">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            {t("simulation.label")}
          </p>
          <h2 className="text-[clamp(1.3rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12] mb-4">
            {t("simulation.heading")}
          </h2>
          <p className="text-[14px] md:text-[15px] text-muted max-w-[520px] mx-auto leading-[1.6]">
            {t("simulation.description")}
          </p>
        </motion.div>

        {/* Cursor sentinel */}
        <div
          className="relative -mx-2 px-2"
          onMouseEnter={hideCustomCursor}
          onMouseLeave={showCustomCursor}
        >
          {/* Browser mockup */}
          <motion.div
            {...scrollRevealProps(0.1)}
            whileHover={active ? undefined : { scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-none md:rounded-2xl shadow-none md:shadow-2xl md:border border-border bg-white overflow-hidden"
          >
            {/* Title bar — hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 px-5 py-3.5 bg-[#f5f5f7] border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-[12px] text-muted/60 font-medium tracking-[0.01em] select-none">
                  Strategic Communicator Simulation
                </span>
              </div>
              <div className="w-[52px]" />
            </div>

            {/* Iframe container */}
            <div className="relative w-full aspect-[3/4] md:aspect-[16/10]">
              <iframe
                src="/Projects/Strategic_Communicator/story.html"
                title="Strategic Communicator Simulation"
                className="absolute inset-0 w-full h-full border-0"
                style={{ pointerEvents: active ? "auto" : "none" }}
                allowFullScreen
              />

              {/* Overlay — frosted glass with CTA */}
              {!active && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[3px] cursor-pointer"
                  onClick={() => setActive(true)}
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 shadow-lg flex items-center justify-center mb-4"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-7 h-7 md:w-8 md:h-8 text-foreground ml-1"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                  <span className="text-[13px] font-medium text-foreground/80 tracking-[0.02em]">
                    {t("simulation.startLabel", { defaultValue: "Begin Strategy Analysis" })}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Fallback link */}
        <motion.div {...scrollRevealProps(0.2)} className="text-center mt-6">
          <a
            href="/Projects/Strategic_Communicator/story.html"
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
            className="inline-flex items-center gap-1.5 text-[13px] text-muted font-medium tracking-[0.01em] transition-colors hover:text-foreground"
          >
            {t("simulation.openTab", { defaultValue: "Open in New Tab" })}
            <span aria-hidden="true" className="ml-0.5 opacity-70">↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   Business Impact Dashboard — animated counters
   ═══════════════════════════════════════════════ */

const AlignIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" />
    <path d="M8 12h8" />
  </svg>
);

const SpeedIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const ResonanceIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IMPACT_ICONS = [<AlignIcon />, <SpeedIcon />, <ResonanceIcon />];
const IMPACT_VALUES = [45, 30, 87];

function useCountUp(target: number, trigger: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (current !== start) {
        start = current;
        setCount(current);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [trigger, target, duration]);

  return count;
}

function ImpactCard({ icon, value, suffix, description, index }: {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCountUp(value, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: EASE_EXPO,
      }}
      className="
        relative p-8
        bg-white rounded-[24px]
        border border-[#e5e7eb]
        shadow-[0_2px_12px_rgba(0,0,0,0.03)]
      "
    >
      <div className="text-muted mb-5">{icon}</div>

      <p className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.04em] leading-none mb-1">
        {count}
        <span className="text-[clamp(0.9rem,1.8vw,1.1rem)] text-muted font-medium tracking-[-0.02em]">
          {suffix}
        </span>
      </p>

      <p className="text-[14px] text-muted leading-[1.6] mt-3">
        {description}
      </p>
    </motion.div>
  );
}

function StrategicImpactStats() {
  const { t } = useTranslation("strategicCommunicator");
  const stats = t("impactStats", { returnObjects: true }) as Array<{
    suffix: string;
    label: string;
    description: string;
  }>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <ImpactCard
          key={i}
          icon={IMPACT_ICONS[i]}
          value={IMPACT_VALUES[i]}
          suffix={stat.suffix}
          description={stat.description}
          index={i}
        />
      ))}
    </div>
  );
}
