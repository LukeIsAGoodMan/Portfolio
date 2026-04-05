"use client";

import { useCallback, useState } from "react";
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

      {/* ════════════════════════════════════════
         Section 3.5: Live Simulation — Final Product
         ════════════════════════════════════════ */}
      <SimulationSection t={t} />

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

/* ═══════════════════════════════════════════════
   Live Simulation — extracted for state isolation
   ═══════════════════════════════════════════════ */

function SimulationSection({ t }: { t: (key: string, opts?: Record<string, unknown>) => string }) {
  const [active, setActive] = useState(false);

  const hideCustomCursor = useCallback(() => {
    document.body.classList.add("hide-custom-cursor");
  }, []);

  const showCustomCursor = useCallback(() => {
    document.body.classList.remove("hide-custom-cursor");
  }, []);

  return (
    <section className="bg-[#fbfbfd] py-16 md:py-28">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <motion.div {...scrollRevealProps(0)} className="text-center mb-10 md:mb-14">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            {t("simulation.label")}
          </p>
          <h2 className="text-[clamp(1.3rem,3vw,2.2rem)] font-semibold tracking-[-0.04em] leading-[1.12] mb-4">
            {t("simulation.heading")}
          </h2>
          <p className="text-[14px] md:text-[15px] text-muted max-w-[520px] mx-auto leading-[1.6]">
            {t("simulation.description")}
          </p>
        </motion.div>

        {/* Cursor sentinel — slightly larger hit area so mouseleave
            fires reliably even at iframe edges */}
        <div
          className="relative -mx-2 px-2"
          onMouseEnter={hideCustomCursor}
          onMouseLeave={showCustomCursor}
        >
          {/* Browser mockup */}
          <motion.div
            {...scrollRevealProps(0.1)}
            whileHover={active ? undefined : { scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-none md:rounded-2xl shadow-none md:shadow-2xl md:border border-border bg-white overflow-hidden"
          >
            {/* Title bar — hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 px-5 py-3.5 bg-[#f5f5f7] border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-[12px] text-muted/60 font-medium tracking-[0.01em] select-none">
                  BUS303 TA Onboarding Simulation
                </span>
              </div>
              <div className="w-[52px]" />
            </div>

            {/* Iframe container */}
            <div className="relative w-full aspect-[3/4] md:aspect-[16/10]">
              <iframe
                src="/Projects/TA_boarding/index.html"
                title="BUS303 TA Onboarding Simulation"
                className="absolute inset-0 w-full h-full border-0"
                style={{ pointerEvents: active ? "auto" : "none" }}
                allowFullScreen
              />

              {/* Overlay — click to activate */}
              {!active && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/5 backdrop-blur-[2px] cursor-pointer"
                  onClick={() => setActive(true)}
                >
                  {/* Play button */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 shadow-lg flex items-center justify-center mb-4"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-7 h-7 md:w-8 md:h-8 text-foreground ml-1"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                  <span className="text-[13px] font-medium text-foreground/80 tracking-[0.02em]">
                    {t("simulation.startLabel", { defaultValue: "Start Simulation" })}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Fallback link */}
        <motion.div {...scrollRevealProps(0.2)} className="text-center mt-6">
          <a
            href="/Projects/TA_boarding/index.html"
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
            className="inline-flex items-center gap-1.5 text-[13px] text-muted font-medium tracking-[0.01em] transition-colors hover:text-foreground"
          >
            {t("simulation.openTab", { defaultValue: "Open in New Tab" })}
            <span aria-hidden="true" className="text-[14px]">&nearr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
