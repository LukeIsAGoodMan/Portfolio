"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import dynamic from "next/dynamic";
import Link from "next/link";

const ScrollNarrative = dynamic(
  () => import("@/components/ai-lab/ScrollNarrative"),
  { ssr: false },
);

const TerminalAgent = dynamic(
  () => import("@/components/ai-lab/TerminalAgent"),
  { ssr: false },
);

const EASE_EXPO = [0.23, 1, 0.32, 1] as const;

export default function FinanceSandboxPage() {
  const [narrativeComplete, setNarrativeComplete] = useState(false);

  return (
    <div className="bg-[#0A1221] min-h-screen text-white scroll-snap-y scroll-snap-mandatory">
      {/* ════════════════════════════════════════
         Section 1: The Narrative Waterfall
         ════════════════════════════════════════ */}
      {!narrativeComplete && (
        <>
          {/* Back link — floating */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="fixed top-28 left-6 md:left-10 z-50"
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

          <ScrollNarrative onEnter={() => setNarrativeComplete(true)} />
        </>
      )}

      {/* ════════════════════════════════════════
         Section 2: The Interactive Finance Lab
         ════════════════════════════════════════ */}
      {narrativeComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_EXPO }}
          className="min-h-screen pt-28 pb-32"
        >
          <div className="mx-auto max-w-[1200px] px-6">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_EXPO }}
              className="mb-12 flex items-center gap-4"
            >
              <Link
                href="/ai-lab"
                data-magnetic
                className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 font-medium tracking-[0.01em] transition-colors hover:text-white"
              >
                <span aria-hidden="true">&larr;</span>
                Back to Lab
              </Link>
              <button
                onClick={() => setNarrativeComplete(false)}
                className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors font-medium"
              >
                Replay Intro
              </button>
            </motion.div>

            {/* Header */}
            <motion.div {...scrollRevealProps(0)} className="text-center mb-14">
              <p className="text-[13px] uppercase tracking-[0.2em] text-cyan-400/50 mb-4 font-medium">
                Finance / Compliance
              </p>
              <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[-0.05em] leading-[1.08] text-white mb-5">
                Audit-Safe Compliance Sim
              </h1>
              <p className="text-[15px] text-slate-400 max-w-[560px] mx-auto leading-[1.6]">
                Navigate a high-stakes cross-border fund transfer. Every decision is documented.
                Every shortcut is flagged. The audit trail never lies.
              </p>
            </motion.div>

            {/* Terminal — cursor sentinel */}
            <motion.div
              {...scrollRevealProps(0.1)}
              onMouseEnter={() => document.body.classList.add("hide-custom-cursor")}
              onMouseLeave={() => document.body.classList.remove("hide-custom-cursor")}
              className="relative -mx-2 px-2"
            >
              <TerminalAgent scenarioId="finance-compliance-sandbox" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
