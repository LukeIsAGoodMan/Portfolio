"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

/* ─────────────────────────────────────────────
 * ImpactStats
 *
 * 3 major metrics with animated number counters
 * that trigger on scroll-into-view.
 *
 * Each stat has an SVG icon, numeric value,
 * unit suffix, and description.
 * ───────────────────────────────────────────── */

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

/* ── SVG Icons ── */
const ClockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MessageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const STAT_ICONS = [<ClockIcon />, <MessageIcon />, <ShieldIcon />];
const STAT_VALUES = [30, 50, 90];

/* ── Animated counter hook ── */
function useCountUp(target: number, trigger: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
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

/* ── Single stat card ── */
function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCountUp(stat.value, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.23, 1, 0.32, 1] as const,
      }}
      className="
        relative p-8
        bg-white rounded-[24px]
        border border-[#e5e7eb]
        shadow-[0_2px_12px_rgba(0,0,0,0.03)]
      "
    >
      {/* Icon */}
      <div className="text-muted mb-5">{stat.icon}</div>

      {/* Animated number */}
      <p className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.04em] leading-none mb-1">
        {count}
        <span className="text-[clamp(0.9rem,1.8vw,1.1rem)] text-muted font-medium tracking-[-0.02em]">
          {stat.suffix.replace(String(stat.value), "")}
        </span>
      </p>

      {/* Description */}
      <p className="text-[14px] text-muted leading-[1.6] mt-3">
        {stat.description}
      </p>
    </motion.div>
  );
}

/* ── Main component ── */
export default function ImpactStats() {
  const { t } = useTranslation("impact");
  const translatedStats = t("stats", { returnObjects: true }) as Array<{
    suffix: string;
    label: string;
    description: string;
  }>;

  const stats: Stat[] = translatedStats.map((ts, i) => ({
    icon: STAT_ICONS[i],
    value: STAT_VALUES[i],
    suffix: ts.suffix,
    label: ts.label,
    description: ts.description,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} index={i} />
      ))}
    </div>
  );
}
