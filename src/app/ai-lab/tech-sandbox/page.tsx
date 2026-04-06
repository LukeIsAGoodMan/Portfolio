"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import dynamic from "next/dynamic";
import Link from "next/link";

const TerminalAgent = dynamic(
  () => import("@/components/ai-lab/TerminalAgent"),
  { ssr: false },
);

const EASE_EXPO = [0.23, 1, 0.32, 1] as const;

export default function TechSandboxPage() {
  const { t } = useTranslation("aiLab");

  return (
    <div className="bg-[#0B101A] min-h-screen text-white pt-28 pb-32">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: EASE_EXPO }}
          className="mb-12"
        >
          <Link
            href="/ai-lab"
            data-magnetic
            className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 font-medium tracking-[0.01em] transition-colors hover:text-white"
          >
            <span aria-hidden="true">&larr;</span>
            Back to Lab
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div {...scrollRevealProps(0)} className="text-center mb-14">
          <p className="text-[13px] uppercase tracking-[0.2em] text-slate-500 mb-4 font-medium">
            {t("cases.items.0.industry", { defaultValue: "High Tech" })}
          </p>
          <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[-0.05em] leading-[1.08] text-white mb-5">
            {t("cases.items.0.title", { defaultValue: "Adaptive Skill-Pilot" })}
          </h1>
          <p className="text-[15px] text-slate-400 max-w-[560px] mx-auto leading-[1.6]">
            {t("sandbox.description", { defaultValue: "Step into a production incident. Diagnose, investigate, and resolve — guided by an AI mentor that never gives you the answer." })}
          </p>
        </motion.div>

        {/* Terminal — cursor sentinel */}
        <motion.div
          {...scrollRevealProps(0.1)}
          onMouseEnter={() => document.body.classList.add("hide-custom-cursor")}
          onMouseLeave={() => document.body.classList.remove("hide-custom-cursor")}
          className="relative -mx-2 px-2"
        >
          <TerminalAgent scenarioId="tech-sre-sandbox" />
        </motion.div>
      </div>
    </div>
  );
}
