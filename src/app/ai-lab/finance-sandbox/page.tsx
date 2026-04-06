"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import dynamic from "next/dynamic";
import Link from "next/link";

const FinanceNarrative = dynamic(
  () => import("@/components/ai-lab/FinanceNarrative"),
  { ssr: false },
);

const FinanceChatAgent = dynamic(
  () => import("@/components/ai-lab/FinanceChatAgent"),
  { ssr: false },
);

const EASE_EXPO = [0.23, 1, 0.32, 1] as const;

export default function FinanceSandboxPage() {
  const [narrativeComplete, setNarrativeComplete] = useState(false);
  const sandboxRef = useRef<HTMLDivElement>(null);

  const handleEnterSandbox = useCallback(() => {
    setNarrativeComplete(true);
    // Scroll to top after state flip
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }, []);

  const handleReplay = useCallback(() => {
    setNarrativeComplete(false);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }, []);

  return (
    <div className="min-h-screen text-white" style={{ background: "#0A1221" }}>
      {/* ════════════════════════════════════════
         Section 1: The Narrative Waterfall
         ════════════════════════════════════════ */}
      {!narrativeComplete && (
        <>
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

          <FinanceNarrative onEnter={handleEnterSandbox} />
        </>
      )}

      {/* ════════════════════════════════════════
         Section 2: The Interactive Finance Lab
         ════════════════════════════════════════ */}
      {narrativeComplete && (
        <motion.div
          ref={sandboxRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_EXPO }}
          className="min-h-screen bg-[#0A1221] overflow-hidden"
        >
          <div className="mx-auto max-w-[1200px] px-4 md:px-6 pt-28 pb-12">
            {/* Nav */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_EXPO }}
              className="mb-10 flex items-center gap-4"
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
                onClick={handleReplay}
                className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors font-medium"
              >
                Replay Intro
              </button>
            </motion.div>

            {/* Compact header */}
            <motion.div {...scrollRevealProps(0)} className="text-center mb-10">
              <p className="text-[13px] uppercase tracking-[0.2em] text-cyan-400/50 mb-3 font-medium">
                Finance / Compliance
              </p>
              <h1 className="text-[clamp(1.5rem,3.5vw,2.4rem)] font-semibold tracking-[-0.05em] leading-[1.08] text-white mb-4">
                Audit-Safe Compliance Sim
              </h1>
              <p className="text-[14px] text-slate-400 max-w-[500px] mx-auto leading-[1.6]">
                You are the RM. The AI is your client. Maintain compliance under pressure.
              </p>
            </motion.div>

            {/* Chat — cursor sentinel */}
            <motion.div
              {...scrollRevealProps(0.1)}
              onMouseEnter={() => document.body.classList.add("hide-custom-cursor")}
              onMouseLeave={() => document.body.classList.remove("hide-custom-cursor")}
              className="relative -mx-2 px-2"
            >
              <FinanceChatAgent scenarioId="finance-compliance-sandbox" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
