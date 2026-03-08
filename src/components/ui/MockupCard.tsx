"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { use3DTilt } from "@/hooks/use3DTilt";
import type { Project } from "@/data/projects";
import Link from "next/link";

/* ─────────────────────────────────────────────
 * MockupCard
 *
 * Typography-driven project card with no images.
 * Features:
 *  - Large display title text as visual hero
 *  - Glass shimmer that follows cursor on hover
 *  - Key metric badge
 *  - 3D tilt via use3DTilt hook
 * ───────────────────────────────────────────── */

interface MockupCardProps {
  project: Project;
  className?: string;
}

export default function MockupCard({ project, className = "" }: MockupCardProps) {
  const { ref, style, handlers } = use3DTilt(5);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      handlers.onMouseMove(e);
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [handlers],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(
    () => {
      handlers.onMouseLeave();
      setIsHovered(false);
    },
    [handlers],
  );

  const isLarge = project.size === "large";
  const isSmall = project.size === "small";

  const card = (
    <motion.div
      ref={ref}
      style={{
        ...style,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        group relative overflow-hidden
        rounded-[32px] border border-[#e5e7eb]
        bg-white
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        transition-shadow duration-500
        hover:shadow-[0_12px_48px_rgba(0,0,0,0.09)]
        ${project.caseStudy ? "cursor-pointer" : "cursor-default"}
        ${className}
      `}
    >
      {/* ── Glass shimmer overlay ── */}
      <div
        ref={shimmerRef}
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            600px circle at ${mousePos.x}% ${mousePos.y}%,
            rgba(255,255,255,0.35) 0%,
            rgba(255,255,255,0.12) 25%,
            transparent 60%
          )`,
        }}
      />

      {/* ── Shimmer edge highlight ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none rounded-[32px] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            400px circle at ${mousePos.x}% ${mousePos.y}%,
            rgba(255,255,255,0.6) 0%,
            transparent 50%
          )`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* ── Hero typography area ── */}
      <div
        className={`
          relative flex flex-col justify-between
          ${isLarge ? "p-10 min-h-[320px]" : isSmall ? "p-7 min-h-[220px]" : "p-8 min-h-[280px]"}
        `}
      >
        {/* Top row: category + year */}
        <div className="flex items-center justify-between">
          <span className="inline-block px-3 py-1 text-[11px] font-medium tracking-[0.06em] uppercase bg-[#f5f5f7] rounded-full text-muted">
            {project.category}
          </span>
          <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-muted/50">
            {project.year}
          </span>
        </div>

        {/* Display title — the visual hero */}
        <div className="flex-1 flex items-center py-6">
          <h3
            className={`
              font-semibold tracking-[-0.04em] leading-[1.1] whitespace-pre-line
              ${isLarge
                ? "text-[clamp(2rem,4.5vw,3.2rem)]"
                : isSmall
                  ? "text-[clamp(1.4rem,2.5vw,1.8rem)]"
                  : "text-[clamp(1.6rem,3vw,2.2rem)]"
              }
            `}
          >
            {project.displayTitle || project.title}
          </h3>
        </div>

        {/* Bottom row: stat + arrow */}
        <div className="flex items-end justify-between">
          {project.stat && (
            <span className="text-[13px] font-medium text-muted tracking-[-0.01em]">
              {project.stat}
            </span>
          )}
          {project.caseStudy && (
            <span className="text-[13px] font-medium text-muted group-hover:text-foreground transition-colors duration-300 flex items-center gap-1.5">
              View Case Study
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* ── Tags row ── */}
      <div className="px-8 pb-6 flex flex-wrap gap-2">
        {project.tags.slice(0, isSmall ? 2 : 4).map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-0.5 text-[11px] font-medium tracking-[0.02em] bg-[#f5f5f7] text-muted rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );

  if (project.caseStudy) {
    return <Link href={project.caseStudy}>{card}</Link>;
  }

  return card;
}
