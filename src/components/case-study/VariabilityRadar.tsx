"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

/* ─────────────────────────────────────────────
 * VariabilityRadar
 *
 * SVG radar chart with 4 axes:
 *   Grading · Facilitation · Tech · Admin
 *
 * "Before" = jagged, high-variance polygon
 * "After"  = uniform circle (high consistency)
 * Toggle via "Standardize" / "Reset" button.
 * ───────────────────────────────────────────── */

const AXIS_COUNT = 4;

// 0-1 scale: how far out each axis reaches
const BEFORE_VALUES = [0.9, 0.45, 0.3, 0.75]; // jagged
const AFTER_VALUES = [0.82, 0.82, 0.82, 0.82]; // uniform

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 110;
const RINGS = [0.25, 0.5, 0.75, 1.0];

function polarToCartesian(
  angle: number,
  radius: number,
): { x: number; y: number } {
  // Start from top (-90°), go clockwise
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

const EASE_EXPO = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function VariabilityRadar() {
  const { t } = useTranslation("radar");
  const axes = t("axes", { returnObjects: true }) as string[];
  const [standardized, setStandardized] = useState(false);
  const values = standardized ? AFTER_VALUES : BEFORE_VALUES;

  const axisStep = 360 / AXIS_COUNT;
  const path = useMemo(() => buildPolygonPath(values), [values]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Radar SVG */}
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
            const labelPos = polarToCartesian(angle, RADIUS + 20);
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
                  className="fill-muted text-[11px] font-medium tracking-[0.02em]"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Data polygon — animated path */}
          <motion.path
            d={path}
            fill={standardized ? "rgba(0,113,227,0.10)" : "rgba(220,60,60,0.08)"}
            stroke={standardized ? "#0071e3" : "#dc3c3c"}
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
                fill={standardized ? "#0071e3" : "#dc3c3c"}
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
            key={standardized ? "after" : "before"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className={`
              absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap
              px-3 py-1 text-[11px] font-medium tracking-[0.04em] uppercase
              rounded-full
              ${
                standardized
                  ? "bg-[#0071e3]/10 text-[#0071e3]"
                  : "bg-[#dc3c3c]/10 text-[#dc3c3c]"
              }
            `}
          >
            {standardized ? t("badgeAfter") : t("badgeBefore")}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setStandardized((s) => !s)}
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
        {standardized ? t("buttonReset") : t("buttonStandardize")}
        <span className="text-[15px]" aria-hidden="true">
          {standardized ? "\u21A9" : "\u2192"}
        </span>
      </button>
    </div>
  );
}
