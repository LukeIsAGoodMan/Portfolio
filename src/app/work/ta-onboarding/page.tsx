"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
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

export default function TAOnboardingCaseStudy() {
  const { t } = useTranslation("caseStudy");

  const meta = t("meta", { returnObjects: true }) as Array<{
    label: string;
    value: string;
  }>;

  const processSteps = t("process.steps", { returnObjects: true }) as Array<{
    number: string;
    title: string;
    subtitle: string;
    body: string[];
  }>;

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
            {t("backLink")}
          </a>
        </motion.div>

        {/* Headline */}
        <motion.div {...scrollRevealProps(0.05)} className="text-center mb-10">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-5 font-medium">
            {t("label")}
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-semibold tracking-[-0.05em] leading-[1.08] mb-5">
            {t("title_line1")}
            <br />
            {t("title_line2")}
          </h1>
          <p className="text-lg text-muted max-w-[560px] mx-auto leading-[1.6]">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Meta chips */}
        <motion.div
          {...scrollRevealProps(0.15)}
          className="flex flex-wrap justify-center gap-3"
        >
          {meta.map((m, i) => (
            <span
              key={i}
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
            {t("problem.label")}
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12] mb-4">
            {t("problem.heading")}
          </h2>
          <p className="text-[15px] text-muted max-w-[520px] mx-auto leading-[1.6] mb-12">
            {t("problem.description")}
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
      <section className="relative mx-auto max-w-[900px] px-6 py-24 overflow-hidden">
        {/* Solution backdrop — photo4 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/photo4.png"
            alt=""
            fill
            className="object-cover melt-mask opacity-[0.10] md:opacity-[0.14]"
            sizes="900px"
          />
        </div>

        <motion.div {...scrollRevealProps(0)} className="relative z-[1] text-center mb-16">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            {t("process.label")}
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12]">
            {t("process.heading")}
          </h2>
        </motion.div>

        <div className="relative z-[1] space-y-24">
          {processSteps.map((section, i) => (
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
            {t("impact.label")}
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12] mb-4">
            {t("impact.heading")}
          </h2>
          <p className="text-[15px] text-muted max-w-[480px] mx-auto leading-[1.6]">
            {t("impact.description")}
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
            {t("footerCta")}
          </a>
        </motion.div>
      </section>
    </div>
  );
}
