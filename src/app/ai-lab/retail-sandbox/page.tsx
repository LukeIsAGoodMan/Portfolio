"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { scrollRevealProps } from "@/hooks/scrollReveal";
import dynamic from "next/dynamic";
import Link from "next/link";

const RetailNarrative = dynamic(
  () => import("@/components/ai-lab/RetailNarrative"),
  { ssr: false },
);

const RetailCockpit = dynamic(
  () => import("@/components/ai-lab/RetailCockpit"),
  { ssr: false },
);

const EASE_EXPO = [0.23, 1, 0.32, 1] as const;

export default function RetailSandboxPage() {
  const [narrativeComplete, setNarrativeComplete] = useState(false);

  const handleEnterSandbox = useCallback(() => {
    setNarrativeComplete(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  }, []);

  const handleReplay = useCallback(() => {
    setNarrativeComplete(false);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  }, []);

  return (
    <div className="min-h-screen text-white" style={{ background: narrativeComplete ? "#FAF9F6" : "#0B101A" }}>
      {/* ════════════════════════════════════════
         Section 1: Horizontal Narrative
         ════════════════════════════════════════ */}
      {!narrativeComplete && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="fixed top-28 left-6 md:left-10 z-50"
          >
            <Link href="/ai-lab" data-magnetic className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 font-medium tracking-[0.01em] transition-colors hover:text-white">
              <span aria-hidden="true">&larr;</span>
              Back to Lab
            </Link>
          </motion.div>

          <RetailNarrative onEnter={handleEnterSandbox} />
        </>
      )}

      {/* ════════════════════════════════════════
         Section 2: The Decision Cockpit
         ════════════════════════════════════════ */}
      {narrativeComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_EXPO }}
          className="min-h-screen overflow-hidden"
          style={{ background: "#0a0e17" }}
        >
          <div className="mx-auto max-w-[1200px] px-4 md:px-6 pt-28 pb-12">
            {/* Nav */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_EXPO }}
              className="mb-10 flex items-center gap-4"
            >
              <Link href="/ai-lab" data-magnetic className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 font-medium tracking-[0.01em] transition-colors hover:text-white">
                <span aria-hidden="true">&larr;</span>
                Back to Lab
              </Link>
              <button onClick={handleReplay} className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors font-medium">
                Replay Intro
              </button>
            </motion.div>

            {/* Header */}
            <motion.div {...scrollRevealProps(0)} className="text-center mb-10">
              <p className="text-[13px] uppercase tracking-[0.2em] text-[#f4c2af]/50 mb-3 font-medium">
                Retail / Luxury CX
              </p>
              <h1 className="text-[clamp(1.5rem,3.5vw,2.4rem)] font-semibold tracking-[-0.05em] leading-[1.08] text-white mb-4">
                The Empathetic Frontline
              </h1>
              <p className="text-[14px] text-slate-400 max-w-[500px] mx-auto leading-[1.6]">
                Navigate a VIP confrontation. Choose your approach — the AI client escalates based on your decisions.
              </p>
            </motion.div>

            {/* Cockpit — cursor sentinel */}
            <motion.div
              {...scrollRevealProps(0.1)}
              onMouseEnter={() => document.body.classList.add("hide-custom-cursor")}
              onMouseLeave={() => document.body.classList.remove("hide-custom-cursor")}
              className="relative -mx-2 px-2"
            >
              <RetailCockpit scenarioId="retail-cx-baiting" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
