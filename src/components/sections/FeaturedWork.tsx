"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import MockupCard from "@/components/ui/MockupCard";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import { useProjects } from "@/data/useProjects";

/* ─────────────────────────────────────────────
 * FeaturedWork
 *
 * Bento grid of MockupCards.
 * First card (TA Onboarding, size=large) spans 2 cols.
 * Cards are sorted: large → medium → small.
 * ───────────────────────────────────────────── */

function gridSpan(size?: string): string {
  if (size === "large") return "lg:col-span-2";
  return "";
}

export default function FeaturedWork() {
  const { t } = useTranslation("work");
  const projects = useProjects();
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="work" className="mx-auto max-w-[1200px] px-6 pb-32">
      {/* Section header */}
      <motion.div {...scrollRevealProps(0)} className="mb-16">
        <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
          {t("label")}
        </p>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-[-0.05em] leading-[1.08]">
          {t("heading_line1")}
          <br />
          {t("heading_line2")}
        </h2>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((project, i) => (
          <motion.div
            key={project.slug}
            {...scrollRevealProps(i * 0.08)}
            className={gridSpan(project.size)}
          >
            <MockupCard project={project} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
