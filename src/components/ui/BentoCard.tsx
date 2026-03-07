"use client";

import { motion } from "framer-motion";
import { use3DTilt } from "@/hooks/use3DTilt";
import type { Project } from "@/data/projects";

interface BentoCardProps {
  project: Project;
  className?: string;
}

/**
 * Bento-style card with:
 * - 32px border-radius, subtle 1px border, soft drop shadow
 * - 3D tilt effect using mouse position (via use3DTilt hook)
 * - Shadow deepens on hover
 */
export default function BentoCard({ project, className = "" }: BentoCardProps) {
  const { ref, style, handlers } = use3DTilt(6);

  return (
    <motion.div
      ref={ref}
      style={{
        ...style,
        transformStyle: "preserve-3d",
      }}
      {...handlers}
      className={`
        group relative overflow-hidden
        rounded-[32px] border border-[#e5e7eb]
        bg-white
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        transition-shadow duration-500
        hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]
        cursor-pointer
        ${className}
      `}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[4/3] bg-[#f5f5f7] overflow-hidden">
        {/* Category badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-3 py-1 text-[11px] font-medium tracking-[0.04em] uppercase bg-white/80 backdrop-blur-sm rounded-full text-muted">
            {project.category}
          </span>
        </div>

        {/* Icon / visual placeholder */}
        <div className="w-full h-full flex items-center justify-center select-none">
          <span className="text-7xl opacity-[0.08] transition-transform duration-700 group-hover:scale-110">
            {project.icon}
          </span>
        </div>

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-[17px] font-semibold tracking-[-0.03em]">
            {project.title}
          </h3>
          <span className="text-[11px] font-medium tracking-[0.04em] uppercase text-muted">
            {project.year}
          </span>
        </div>

        <p className="text-[14px] text-muted leading-[1.6]">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[11px] font-medium tracking-[0.02em] bg-[#f5f5f7] text-muted rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
