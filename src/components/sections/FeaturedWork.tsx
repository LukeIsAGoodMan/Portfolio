"use client";

import { motion } from "framer-motion";
import BentoCard from "@/components/ui/BentoCard";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import { projects } from "@/data/projects";

/**
 * Responsive Bento Grid for "Featured Work".
 * First card spans 2 columns on large screens for visual hierarchy.
 * Each card fades in with the blur-to-clear scroll reveal effect.
 */

const gridSpan = (i: number): string => {
  if (i === 0) return "lg:col-span-2";
  return "";
};

export default function FeaturedWork() {
  return (
    <section id="work" className="mx-auto max-w-[1200px] px-6 pb-32">
      {/* Section header */}
      <motion.div {...scrollRevealProps(0)} className="mb-16">
        <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
          Featured Work
        </p>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-[-0.05em] leading-[1.08]">
          Selected projects that
          <br />
          shaped how people learn.
        </h2>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects
          .filter((p) => p.featured)
          .map((project, i) => (
            <motion.div
              key={project.slug}
              {...scrollRevealProps(i * 0.08)}
              className={gridSpan(i)}
            >
              <BentoCard project={project} />
            </motion.div>
          ))}
      </div>
    </section>
  );
}
