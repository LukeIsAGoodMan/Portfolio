"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import MockupCard from "@/components/ui/MockupCard";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import { useProjects } from "@/data/useProjects";

/* ─────────────────────────────────────────────
 * FeaturedWork
 *
 * Two-tier layout:
 *  1. Hero row — the two flagship case studies
 *     (TA Onboarding + Strategic Communication)
 *     each gets full width on mobile, side-by-side on desktop
 *  2. Secondary grid — remaining projects in a 3-col bento
 * ───────────────────────────────────────────── */

export default function FeaturedWork() {
  const { t } = useTranslation(["work", "common"]);
  const projects = useProjects();
  const featured = projects.filter((p) => p.featured);

  // Flagships = projects with caseStudy links (live demos), in array order
  const flagships = featured.filter((p) => p.caseStudy);
  const secondary = featured.filter((p) => !p.caseStudy);

  return (
    <section id="work" className="mx-auto max-w-[1200px] px-6 pb-32">
      {/* Section header */}
      <motion.div {...scrollRevealProps(0)} className="mb-16">
        <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
          {t("work:label")}
        </p>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-[-0.05em] leading-[1.08]">
          {t("work:heading_line1")}
          <br />
          {t("work:heading_line2")}
        </h2>
      </motion.div>

      {/* ── Hero Row — Flagships ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {flagships.map((project, i) => (
          <motion.div
            key={project.slug}
            {...scrollRevealProps(i * 0.08)}
            className="relative"
          >
            {/* Live Demo badge */}
            <div className="absolute top-5 right-5 z-20">
              <span className="
                inline-flex items-center gap-1.5
                px-3 py-1.5
                bg-foreground/90 text-background
                text-[10px] font-semibold tracking-[0.08em] uppercase
                rounded-full
                backdrop-blur-sm
                shadow-[0_2px_8px_rgba(0,0,0,0.15)]
              ">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                </span>
                {t("common:liveDemo", { defaultValue: "Live Demo" })}
              </span>
            </div>
            <MockupCard project={project} className="min-h-[340px] md:min-h-[400px]" />
          </motion.div>
        ))}
      </div>

      {/* ── Secondary Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secondary.map((project, i) => (
          <motion.div
            key={project.slug}
            {...scrollRevealProps((flagships.length + i) * 0.08)}
          >
            <MockupCard project={project} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
