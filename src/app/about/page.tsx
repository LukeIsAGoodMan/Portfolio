"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import {
  profile,
  stats,
  education,
  experience,
  coreCompetencies,
  tools,
  awards,
  professionalDevelopment,
} from "@/data/resumeData";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-32">
      {/* ── Hero intro with portrait ── */}
      <section className="mx-auto max-w-[900px] px-6 mb-24">
        {/* Mobile portrait — centered header background */}
        <motion.div
          {...scrollRevealProps(0)}
          className="md:hidden relative flex justify-center mb-10"
        >
          <div className="relative w-[220px] h-[300px]">
            {/* Aura glow */}
            <div
              className="absolute -inset-8 rounded-full blur-3xl opacity-60"
              style={{
                background:
                  "linear-gradient(to top right, rgba(59,130,246,0.10), rgba(139,92,246,0.06), transparent)",
              }}
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              }}
              className="relative w-full h-full rounded-[28px] overflow-hidden"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 60%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 60%, transparent 100%)",
              }}
            >
              <Image
                src="/photo_portfolio.jpg"
                alt={profile.name}
                fill
                className="object-cover object-top"
                priority
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Desktop: side-by-side layout */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-16">
          {/* Text column */}
          <div className="flex-1">
            <motion.div {...scrollRevealProps(0)} className="text-center md:text-left mb-12">
              <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
                About
              </p>
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.05em] leading-[1.08] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900">
                {profile.name}
              </h1>
              <p className="text-lg text-muted max-w-[600px] md:max-w-none leading-[1.6] mx-auto md:mx-0">
                {profile.headline}
              </p>
            </motion.div>

            {/* Bio paragraphs */}
            <motion.div
              {...scrollRevealProps(0.1)}
              className="max-w-[640px] mx-auto md:mx-0 space-y-5"
            >
              {profile.summary.map((paragraph, i) => (
                <p key={i} className="text-[15px] text-muted leading-[1.7]">
                  {paragraph}
                </p>
              ))}
            </motion.div>
          </div>

          {/* Desktop portrait — right column */}
          <motion.div
            {...scrollRevealProps(0.15)}
            className="hidden md:block flex-shrink-0 relative"
          >
            {/* Aura glow */}
            <div
              className="absolute -inset-10 rounded-full blur-3xl opacity-50"
              style={{
                background:
                  "linear-gradient(to top right, rgba(59,130,246,0.10), rgba(139,92,246,0.05), transparent)",
              }}
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              }}
              className="relative w-[260px] h-[340px] rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 70%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 70%, transparent 100%)",
              }}
            >
              <Image
                src="/photo_portfolio.jpg"
                alt={profile.name}
                fill
                className="object-cover object-top"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats banner ── */}
      <section className="mx-auto max-w-[900px] px-6 mb-32">
        <motion.div
          {...scrollRevealProps(0)}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-border"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.04em] leading-none mb-2">
                {stat.value}
              </p>
              <p className="text-[13px] text-muted font-medium tracking-[0.01em]">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Core competencies ── */}
      <section className="mx-auto max-w-[900px] px-6 mb-32">
        <motion.div {...scrollRevealProps(0)}>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] mb-3">
            Core Competencies
          </h2>
          <p className="text-[14px] text-muted mb-8">
            Instructional Design &middot; Scalable Delivery
          </p>
        </motion.div>
        <div className="flex flex-wrap gap-3">
          {coreCompetencies.map((skill, i) => (
            <motion.span
              key={skill}
              {...scrollRevealProps(i * 0.04)}
              className="px-4 py-2 text-[13px] font-medium border border-border rounded-full text-muted transition-colors hover:text-foreground hover:border-foreground"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ── Experience ── */}
      <section className="mx-auto max-w-[900px] px-6 mb-32">
        <motion.div {...scrollRevealProps(0)}>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] mb-12">
            Professional Experience
          </h2>
        </motion.div>
        <div className="space-y-16 border-l border-border pl-5 md:pl-8">
          {experience.map((item, i) => (
            <motion.div
              key={item.period}
              {...scrollRevealProps(i * 0.08)}
              className="relative"
            >
              <div className="absolute -left-[25px] md:-left-[37px] top-1.5 w-2 h-2 rounded-full bg-foreground" />
              <p className="text-[12px] uppercase tracking-[0.12em] text-muted mb-2 font-medium">
                {item.period}
              </p>
              <p className="text-[17px] font-semibold tracking-[-0.02em]">
                {item.role}
              </p>
              <p className="text-[14px] text-muted mb-3">
                {item.org} &middot; {item.location}
              </p>
              <ul className="space-y-2">
                {item.highlights.map((h, j) => (
                  <li
                    key={j}
                    className="text-[14px] text-muted leading-[1.6] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-[1px] before:bg-muted/40"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Education ── */}
      <section className="mx-auto max-w-[900px] px-6 mb-32">
        <motion.div {...scrollRevealProps(0)}>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] mb-12">
            Education
          </h2>
        </motion.div>
        <div className="space-y-12">
          {education.map((item, i) => {
            const eduImage =
              item.degree.includes("MBA") ? "/photo3.png"
              : item.degree.includes("Linguistics") ? "/photo2.png"
              : null;

            return (
              <motion.div
                key={item.degree}
                {...scrollRevealProps(i * 0.08)}
                className="relative overflow-hidden rounded-2xl"
              >
                {/* Floating accent image — right edge */}
                {eduImage && (
                  <div className="absolute -right-4 top-0 bottom-0 w-[140px] md:w-[180px] pointer-events-none z-0">
                    <Image
                      src={eduImage}
                      alt=""
                      fill
                      className="object-cover melt-mask opacity-[0.12] md:opacity-[0.18]"
                      sizes="180px"
                    />
                  </div>
                )}

                <div className="relative z-[1] grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.12em] text-muted font-medium">
                      {item.year} &middot; {item.location}
                    </p>
                    <p className="text-[14px] text-muted mt-1">
                      {item.institution}
                    </p>
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold tracking-[-0.02em] mb-2">
                      {item.degree}
                    </p>
                    <p className="text-[14px] text-muted leading-[1.6]">
                      {item.focus}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Professional Development ── */}
      <section className="mx-auto max-w-[900px] px-6 mb-32">
        <motion.div {...scrollRevealProps(0)}>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] mb-8">
            Professional Development
          </h2>
        </motion.div>
        {professionalDevelopment.map((item, i) => (
          <motion.div key={item.title} {...scrollRevealProps(i * 0.08)}>
            <p className="text-[12px] uppercase tracking-[0.12em] text-muted mb-2 font-medium">
              {item.year}
            </p>
            <p className="text-[16px] font-semibold tracking-[-0.02em] mb-2">
              {item.title}
            </p>
            <p className="text-[14px] text-muted leading-[1.6]">
              {item.detail}
            </p>
          </motion.div>
        ))}
      </section>

      {/* ── Tools & Technology ── */}
      <section className="mx-auto max-w-[900px] px-6 mb-32">
        <motion.div {...scrollRevealProps(0)}>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] mb-8">
            Tools &amp; Technology
          </h2>
        </motion.div>
        <div className="flex flex-wrap gap-3">
          {tools.map((tool, i) => (
            <motion.span
              key={tool}
              {...scrollRevealProps(i * 0.04)}
              className="px-4 py-2 text-[13px] font-medium bg-white border border-border rounded-full text-muted"
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ── Awards ── */}
      <section className="mx-auto max-w-[900px] px-6">
        <motion.div {...scrollRevealProps(0)}>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] mb-8">
            Awards
          </h2>
        </motion.div>
        <div className="space-y-6">
          {awards.map((award, i) => (
            <motion.div
              key={award.title}
              {...scrollRevealProps(i * 0.08)}
              className="flex items-baseline justify-between"
            >
              <div>
                <p className="text-[15px] font-medium tracking-[-0.01em]">
                  {award.title}
                </p>
                <p className="text-[13px] text-muted">{award.org}</p>
              </div>
              <span className="text-[12px] uppercase tracking-[0.1em] text-muted font-medium">
                {award.year}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
