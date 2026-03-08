"use client";

import { motion } from "framer-motion";
import { scrollRevealProps } from "@/hooks/scrollReveal";

const expertise = [
  "Instructional Design",
  "Learning Science",
  "Curriculum Architecture",
  "Assessment Design",
  "VR/XR Experiences",
  "Adaptive Learning",
  "Gamification",
  "UX Research",
];

const timeline = [
  {
    period: "2024 — Present",
    role: "Senior Learning Experience Designer",
    org: "EdTech Innovations",
    detail:
      "Leading the design of AI-powered adaptive learning platforms serving 2M+ learners worldwide.",
  },
  {
    period: "2022 — 2024",
    role: "Learning Designer",
    org: "Global Corp University",
    detail:
      "Designed immersive onboarding journeys that reduced time-to-productivity by 40%.",
  },
  {
    period: "2020 — 2022",
    role: "Instructional Designer",
    org: "University of Design",
    detail:
      "Created competency-based curricula for graduate programs in HCI and Learning Science.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-28 pb-32">
      {/* Intro */}
      <section className="mx-auto max-w-[900px] px-6 mb-32">
        <motion.div {...scrollRevealProps(0)} className="text-center mb-16">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            About
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.05em] leading-[1.08] mb-8">
            Bridging cognitive science
            <br />
            with design craft.
          </h1>
        </motion.div>

        <motion.div
          {...scrollRevealProps(0.1)}
          className="max-w-[640px] mx-auto"
        >
          <p className="text-muted leading-[1.7] mb-6">
            I&apos;m a Learning Experience Designer with 6+ years crafting
            digital learning journeys at the intersection of pedagogy,
            technology, and human-centered design.
          </p>
          <p className="text-muted leading-[1.7]">
            My work is grounded in learning science&mdash;spaced repetition,
            cognitive load theory, constructive alignment&mdash;and expressed
            through world-class interface design. Every interaction I design
            serves a learning objective.
          </p>
        </motion.div>
      </section>

      {/* Expertise */}
      <section className="mx-auto max-w-[900px] px-6 mb-32">
        <motion.div {...scrollRevealProps(0)}>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] mb-8">
            Expertise
          </h2>
        </motion.div>
        <div className="flex flex-wrap gap-3">
          {expertise.map((skill, i) => (
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

      {/* Timeline */}
      <section className="mx-auto max-w-[900px] px-6">
        <motion.div {...scrollRevealProps(0)}>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] mb-12">
            Experience
          </h2>
        </motion.div>
        <div className="space-y-16 border-l border-border pl-8">
          {timeline.map((item, i) => (
            <motion.div
              key={item.period}
              {...scrollRevealProps(i * 0.1)}
              className="relative"
            >
              <div className="absolute -left-[37px] top-1.5 w-2 h-2 rounded-full bg-foreground" />
              <p className="text-[12px] uppercase tracking-[0.12em] text-muted mb-2 font-medium">
                {item.period}
              </p>
              <p className="text-[17px] font-semibold tracking-[-0.02em]">
                {item.role}
              </p>
              <p className="text-[14px] text-muted mb-1">{item.org}</p>
              <p className="text-[14px] text-muted leading-[1.6]">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
