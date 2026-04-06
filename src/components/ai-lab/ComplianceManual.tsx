"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════
   ComplianceManual — Searchable regulatory reference
   Supports `highlightRule` prop for violation sync
   ═══════════════════════════════════════════════ */

interface ManualEntry {
  id: string;
  rule: string;
  title: string;
  summary: string;
  tags: string[];
}

const MANUAL_ENTRIES: ManualEntry[] = [
  {
    id: "finra-2111",
    rule: "FINRA Rule 2111",
    title: "Suitability",
    summary: "A member or associated person must have a reasonable basis to believe a recommended transaction is suitable for the customer, based on their investment profile including risk tolerance, financial situation, and investment objectives.",
    tags: ["suitability", "recommendation", "risk tolerance"],
  },
  {
    id: "sec-15c1-2",
    rule: "SEC Rule 15c1-2",
    title: "Fraud & Misrepresentation",
    summary: "It is unlawful for any broker-dealer to effect transactions by means of manipulative, deceptive, or fraudulent devices. This includes making untrue statements of material fact or omitting material facts necessary to make statements not misleading.",
    tags: ["fraud", "misrepresentation", "disclosure"],
  },
  {
    id: "finra-2210",
    rule: "FINRA Rule 2210",
    title: "Communications with the Public",
    summary: "All member communications must be fair, balanced, and not misleading. No member may make any false, exaggerated, or unwarranted claim. Projected returns must be clearly labeled as hypothetical.",
    tags: ["communications", "marketing", "projections", "guarantee"],
  },
  {
    id: "aml-bsa",
    rule: "BSA / AML",
    title: "Bank Secrecy Act — Anti-Money Laundering",
    summary: "Financial institutions must implement AML programs including Customer Identification (CIP), Customer Due Diligence (CDD), Enhanced Due Diligence (EDD) for high-risk clients, and Suspicious Activity Reporting (SAR).",
    tags: ["aml", "kyc", "edd", "sar"],
  },
  {
    id: "sec-reg-bi",
    rule: "SEC Reg BI",
    title: "Regulation Best Interest",
    summary: "Broker-dealers must act in the best interest of retail customers when making recommendations. This includes disclosure of material conflicts of interest and cannot place their own interests ahead of the customer's.",
    tags: ["best interest", "conflicts", "retail"],
  },
  {
    id: "finra-2232",
    rule: "FINRA Rule 2232",
    title: "Customer Confirmations — Structured Products",
    summary: "For structured products, firms must disclose: the product's name, estimated initial value, material risks including potential loss of principal, issuer credit risk, and any caps or limits on returns.",
    tags: ["structured products", "confirmation", "disclosure"],
  },
];

interface ComplianceManualProps {
  className?: string;
  /** Rule ID to highlight and auto-expand (e.g., "finra-2111") */
  highlightRule?: string | null;
}

export default function ComplianceManual({ className = "", highlightRule }: ComplianceManualProps) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-expand and scroll to highlighted rule
  useEffect(() => {
    if (!highlightRule) return;
    setExpandedId(highlightRule);
    setSearch("");

    // Scroll into view after a short delay for animation
    setTimeout(() => {
      const el = cardRefs.current[highlightRule];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  }, [highlightRule]);

  const filtered = search.trim()
    ? MANUAL_ENTRIES.filter((e) => {
        const q = search.toLowerCase();
        return (
          e.rule.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q) ||
          e.tags.some((t) => t.includes(q))
        );
      })
    : MANUAL_ENTRIES;

  return (
    <div className={className}>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rules..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-slate-300 outline-none placeholder:text-slate-600 focus:border-cyan-400/30 transition-colors"
        />
      </div>

      <div ref={scrollContainerRef} className="space-y-3">
        <AnimatePresence initial={false}>
          {filtered.map((entry) => (
            <ManualCard
              key={entry.id}
              ref={(el) => { cardRefs.current[entry.id] = el; }}
              entry={entry}
              isHighlighted={highlightRule === entry.id}
              isExpanded={expandedId === entry.id}
              onToggle={() => setExpandedId((prev) => (prev === entry.id ? null : entry.id))}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="text-[13px] text-slate-600 text-center py-6">No matching rules found.</p>
        )}
      </div>
    </div>
  );
}

interface ManualCardProps {
  entry: ManualEntry;
  isHighlighted: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

import { forwardRef } from "react";

const ManualCard = forwardRef<HTMLDivElement, ManualCardProps>(
  function ManualCard({ entry, isHighlighted, isExpanded, onToggle }, ref) {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={`rounded-xl border overflow-hidden transition-colors duration-500 ${
          isHighlighted
            ? "border-red-500/40 bg-red-500/[0.06] shadow-[0_0_20px_rgba(239,68,68,0.1)]"
            : "border-white/[0.06] bg-white/[0.02]"
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-4 py-3 text-left active:bg-white/[0.02] transition-colors"
        >
          <div>
            <p className={`font-mono text-[11px] tracking-[0.04em] mb-0.5 transition-colors duration-500 ${
              isHighlighted ? "text-red-400" : "text-cyan-400/60"
            }`}>
              {entry.rule}
            </p>
            <p className="text-[13px] text-slate-300 font-medium tracking-[-0.01em]">
              {entry.title}
            </p>
          </div>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`text-slate-600 transition-transform duration-200 flex-shrink-0 ml-3 ${isExpanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <p className="text-[12px] text-slate-500 leading-[1.7]">
                  {entry.summary}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-[9px] font-mono tracking-[0.04em] bg-white/[0.03] border border-white/[0.06] rounded-full text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);
