"use client";

import { motion } from "framer-motion";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import dynamic from "next/dynamic";

const VariabilityRadar = dynamic(
  () => import("@/components/case-study/VariabilityRadar"),
  { ssr: false },
);
const ImpactStats = dynamic(
  () => import("@/components/case-study/ImpactStats"),
  { ssr: false },
);

/* ─── Metadata chips for the header ─── */
const meta = [
  { label: "Role", value: "Lead LXD" },
  { label: "Tools", value: "Storyline 360, Canvas" },
  { label: "Methodology", value: "Backward Design" },
];

/* ─── Process sections content ─── */
const processSections = [
  {
    number: "01",
    title: "Backward Design",
    subtitle: "Starting from the business goal, not the content.",
    body: [
      "The first question wasn\u2019t \u201CWhat should TAs learn?\u201D but \u201CWhat does a consistently excellent seminar look like?\u201D By starting from the desired performance outcome\u2014standardized facilitation quality across all sections\u2014I reverse-engineered the curriculum.",
      "Each module maps directly to a measurable behavioral objective: grading calibration, discussion facilitation techniques, LMS navigation, and administrative protocols. Nothing exists in the course that doesn\u2019t trace back to an observed performance gap.",
    ],
  },
  {
    number: "02",
    title: "Cognitive Load Management",
    subtitle: "Applying the Segmenting Principle to reduce overload.",
    body: [
      "New TAs face an overwhelming amount of information in their first week\u2014policies, tools, pedagogy, logistics. Dumping it all into a single orientation session guarantees cognitive overload and near-zero retention.",
      "I applied Mayer\u2019s Segmenting Principle: complex material is broken into learner-paced segments, each focused on one skill domain. TAs complete 10\u201315 minute modules across their first two weeks, with knowledge checks gating progression. This approach respects working memory limits while building durable understanding.",
    ],
  },
  {
    number: "03",
    title: "Interactive Simulations",
    subtitle: "A safe-to-fail environment built in Storyline 360.",
    body: [
      "Reading about how to handle a difficult grading dispute is fundamentally different from experiencing one. I built branching scenario simulations in Articulate Storyline 360 where TAs navigate realistic classroom situations\u2014a student contesting a grade, a disengaged cohort, a time-overrun seminar.",
      "Each branch leads to different outcomes with immediate, contextual feedback. The simulation creates a psychologically safe space to make mistakes before the stakes are real. Post-completion analytics showed 94% of TAs replayed at least one scenario to explore alternative approaches\u2014exactly the reflective practice the design intended.",
    ],
  },
];

export default function TAOnboardingCaseStudy() {
  return (
    <div className="pt-28 pb-32">
      {/* ════════════════════════════════════════
         Section 1: Apple Product-Launch Header
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
            All Projects
          </a>
        </motion.div>

        {/* Headline */}
        <motion.div {...scrollRevealProps(0.05)} className="text-center mb-10">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-5 font-medium">
            Case Study
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-semibold tracking-[-0.05em] leading-[1.08] mb-5">
            Standardizing Excellence:
            <br />
            The New TA Onboarding System
          </h1>
          <p className="text-lg text-muted max-w-[560px] mx-auto leading-[1.6]">
            Reducing variability and scaling delivery for 500+ learners
            per semester.
          </p>
        </motion.div>

        {/* Meta chips */}
        <motion.div
          {...scrollRevealProps(0.15)}
          className="flex flex-wrap justify-center gap-3"
        >
          {meta.map((m) => (
            <span
              key={m.label}
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
         Section 2: The "Before" — Variability Radar
         ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[900px] px-6 py-24">
        <motion.div {...scrollRevealProps(0)} className="text-center mb-4">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            The Problem
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12] mb-4">
            Every TA was teaching differently.
          </h2>
          <p className="text-[15px] text-muted max-w-[520px] mx-auto leading-[1.6] mb-12">
            Without standardized onboarding, quality varied wildly across
            grading consistency, facilitation style, technology use, and
            administrative compliance.
          </p>
        </motion.div>

        <motion.div {...scrollRevealProps(0.1)}>
          <VariabilityRadar />
        </motion.div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[900px] px-6">
        <div className="border-t border-border" />
      </div>

      {/* ════════════════════════════════════════
         Section 3: The Process — LXD Mindset
         ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[900px] px-6 py-24">
        <motion.div {...scrollRevealProps(0)} className="text-center mb-16">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            The Process
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12]">
            The LXD Mindset
          </h2>
        </motion.div>

        <div className="space-y-24">
          {processSections.map((section, i) => (
            <motion.div
              key={section.number}
              {...scrollRevealProps(i * 0.06)}
              className="relative"
            >
              {/* Step number */}
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

              {/* Body paragraphs */}
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

      {/* Divider */}
      <div className="mx-auto max-w-[900px] px-6">
        <div className="border-t border-border" />
      </div>

      {/* ════════════════════════════════════════
         Section 4: The Impact Dashboard
         ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[900px] px-6 py-24">
        <motion.div {...scrollRevealProps(0)} className="text-center mb-14">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            The Impact
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12] mb-4">
            Measurable outcomes.
          </h2>
          <p className="text-[15px] text-muted max-w-[480px] mx-auto leading-[1.6]">
            The standardized onboarding system transformed TA readiness from
            the first semester of deployment.
          </p>
        </motion.div>

        <ImpactStats />
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
            Back to All Projects
          </a>
        </motion.div>
      </section>
    </div>
  );
}
