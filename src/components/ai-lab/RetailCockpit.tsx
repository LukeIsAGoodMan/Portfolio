"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getScenario } from "@/config/aiLabScenarios";

/* ═══════════════════════════════════════════════
   RetailCockpit — Boutique Decision Cockpit
   3-col: Customer Card | Decision Hub | Audit Bar
   Expand/retract audit bar on selection
   ═══════════════════════════════════════════════ */

const EASE_EXPO = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface RadarScores {
  brandVoice: number; empathy: number; costControl: number; efficiency: number; resolution: number;
}

interface DialogueEntry {
  id: string; role: "client" | "user" | "system"; text: string;
}

const RADAR_LABELS = ["Brand Voice", "Empathy", "Cost Control", "Efficiency", "Resolution"];
const RADAR_KEYS: (keyof RadarScores)[] = ["brandVoice", "empathy", "costControl", "efficiency", "resolution"];

const RESPONSE_OPTIONS = [
  { id: "empathetic", label: "Empathetic but Firm", desc: "Acknowledge the frustration, then gently reference the care guide and policy.", accent: "#D4AF37" },
  { id: "apologetic", label: "Over-Apologetic", desc: "Profusely apologize and offer a full refund plus store credit.", accent: "#f4c2af" },
  { id: "policy", label: "Policy-First", desc: "Immediately cite the 14-day return window and damage clause.", accent: "#94a3b8" },
  { id: "escalate", label: "Escalation", desc: "Offer to bring in the store manager to handle the situation.", accent: "#a78bfa" },
];

interface ChatHistoryEntry { role: "user" | "assistant"; content: string; }

export default function RetailCockpit({ scenarioId }: { scenarioId: string }) {
  const scenario = getScenario(scenarioId);

  const [dialogue, setDialogue] = useState<DialogueEntry[]>([
    { id: "sys-0", role: "system", text: "Mrs. Zhang approaches the counter with a shopping bag." },
    { id: "client-0", role: "client", text: "I bought this bag three weeks ago and look at this \u2014 the leather is already stained. This is clearly a quality defect. I want a full refund, immediately." },
  ]);

  const [radar, setRadar] = useState<RadarScores>({ brandVoice: 50, empathy: 50, costControl: 50, efficiency: 50, resolution: 50 });
  const [mentorText, setMentorText] = useState("Mrs. Zhang is emotionally charged. Your first words set the tone. Acknowledge her frustration before addressing the damage.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [round, setRound] = useState(0);
  const [auditExpanded, setAuditExpanded] = useState(false);
  const [mobileAuditOpen, setMobileAuditOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(2);
  const chatHistory = useRef<ChatHistoryEntry[]>([]);

  const nextId = () => `d-${idCounter.current++}`;
  const avgScore = useMemo(() => Math.round(RADAR_KEYS.reduce((s, k) => s + radar[k], 0) / 5), [radar]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [dialogue]);

  const addEntry = useCallback((role: DialogueEntry["role"], text: string) => {
    setDialogue((prev) => [...prev, { id: nextId(), role, text }]);
  }, []);

  const handleChoice = useCallback(
    async (optionId: string) => {
      if (isProcessing || auditExpanded) return;
      const option = RESPONSE_OPTIONS.find((o) => o.id === optionId);
      if (!option) return;

      addEntry("user", `[${option.label}] ${option.desc}`);
      setIsProcessing(true);

      const userMsg = `The RM chose: "${option.label}" \u2014 ${option.desc}`;
      chatHistory.current.push({ role: "user", content: userMsg });

      try {
        const res = await fetch("/api/chat/sandbox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: chatHistory.current, scenarioId }),
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const text = await res.text();
        chatHistory.current.push({ role: "assistant", content: text });

        try {
          const clean = text.replace(/```json\n?|```/g, "").trim();
          const parsed = JSON.parse(clean);
          addEntry("client", parsed.terminalOutput);
          setMentorText(parsed.mentorHint);
          if (parsed.radarScores) {
            setRadar({
              brandVoice: clamp(parsed.radarScores.brandVoice ?? radar.brandVoice),
              empathy: clamp(parsed.radarScores.empathy ?? radar.empathy),
              costControl: clamp(parsed.radarScores.costControl ?? radar.costControl),
              efficiency: clamp(parsed.radarScores.efficiency ?? radar.efficiency),
              resolution: clamp(parsed.radarScores.resolution ?? radar.resolution),
            });
          }
        } catch {
          addEntry("client", text);
        }
      } catch {
        addEntry("system", "Connection error.");
      }

      setIsProcessing(false);
      // Expand audit bar to show results
      setAuditExpanded(true);
      setMobileAuditOpen(true);
    },
    [isProcessing, auditExpanded, addEntry, scenarioId, radar],
  );

  const handleNextRound = useCallback(() => {
    setAuditExpanded(false);
    setMobileAuditOpen(false);
    setRound((r) => r + 1);
  }, []);

  const coreColor = "rgba(244,194,175,";

  return (
    <>
      {/* ── Mobile HUD ── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 mb-3 rounded-xl border border-white/[0.06] bg-[#0a0e17]">
        <div className="flex items-center gap-2">
          <RoseCore isProcessing={isProcessing} size={28} />
          <span className="font-mono text-[10px] text-[#f4c2af]/60 tracking-[0.04em]">
            {isProcessing ? "Evaluating..." : "CX_CORE"}
          </span>
        </div>
        <span className={`font-semibold text-[15px] tracking-[-0.02em] ${avgScore >= 60 ? "text-[#f4c2af]" : avgScore >= 40 ? "text-amber-400" : "text-red-400"}`}>
          {avgScore}/100
        </span>
      </div>

      {/* ── 3-Column Desktop Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_auto] gap-4 w-full">

        {/* ── Left: Customer Card (desktop) ── */}
        <div className="hidden lg:block rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-5 h-[650px] max-h-[80vh]">
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c49882] to-[#8b6f5c] flex items-center justify-center text-[16px] font-bold text-white mb-3">
              MZ
            </div>
            <p className="text-[14px] font-semibold text-white tracking-[-0.01em]">Mrs. Zhang</p>
            <p className="text-[11px] text-[#D4AF37] font-medium mt-0.5">VIP Member</p>
          </div>

          {/* Mood */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 mb-4">
            <p className="text-[10px] uppercase tracking-[0.1em] text-slate-600 font-semibold mb-2">Mood</p>
            <div className="flex items-center gap-2">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0" />
              <span className="text-[12px] text-red-400/80 font-medium">Escalating</span>
            </div>
          </div>

          {/* Brief */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 mb-4">
            <p className="text-[10px] uppercase tracking-[0.1em] text-slate-600 font-semibold mb-2">The Case</p>
            <p className="text-[11px] text-slate-400 leading-[1.6]">
              Leather crossbody bag, $4,200.
              <br />Water stains visible. Purchased 3 weeks ago.
              <br />Claims: quality defect.
              <br />Policy: 14-day return, damage voids warranty.
            </p>
          </div>

          {/* Round */}
          <div className="text-center mt-auto">
            <p className="text-[10px] uppercase tracking-[0.1em] text-slate-600 font-semibold mb-1">Round</p>
            <p className="text-[20px] font-semibold text-white">{round + 1}</p>
          </div>
        </div>

        {/* ── Center: Decision Hub ── */}
        <div className="rounded-2xl border border-[#e8e4df] bg-[#FAF9F6] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-[650px] max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-5 py-3 bg-[#f5f0eb] border-b border-[#e8e4df]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c49882] to-[#8b6f5c] flex items-center justify-center text-[11px] font-bold text-white lg:hidden">MZ</div>
              <div>
                <p className="text-[13px] font-semibold text-[#3d3029] tracking-[-0.01em]">Client Interaction</p>
                <p className="text-[11px] text-[#9a8b7e]">Round {round + 1}</p>
              </div>
            </div>
            <span className="text-[11px] text-red-500/70 font-medium flex items-center gap-1.5">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
              Live
            </span>
          </div>

          {/* Dialogue */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-5 py-5 space-y-4 scroll-smooth">
            <AnimatePresence initial={false}>
              {dialogue.map((entry) => (
                <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE_EXPO }} className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
                  {entry.role === "system" ? (
                    <p className="text-[12px] text-[#9a8b7e] text-center w-full italic py-2">{entry.text}</p>
                  ) : (
                    <div className={`max-w-[85%] md:max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-[1.6] shadow-[0_1px_4px_rgba(0,0,0,0.05)] ${entry.role === "user" ? "bg-[#3d3029] text-[#FAF9F6] rounded-br-md" : "bg-white text-[#3d3029] rounded-bl-md border border-[#e8e4df]"}`}>
                      {entry.role === "client" && <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#c49882] mb-1">Mrs. Zhang</p>}
                      {entry.text}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-[#e8e4df]">
                  <motion.div className="flex gap-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c49882]" /><span className="w-1.5 h-1.5 rounded-full bg-[#c49882]" /><span className="w-1.5 h-1.5 rounded-full bg-[#c49882]" />
                  </motion.div>
                </div>
              </div>
            )}
          </div>

          {/* Choice cards */}
          <div className="border-t border-[#e8e4df] bg-[#f5f0eb] p-4">
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#9a8b7e] font-semibold mb-3">
              {auditExpanded ? "Review your results above" : "Choose your response"}
            </p>
            <AnimatePresence mode="wait">
              {!auditExpanded && (
                <motion.div key="choices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: 10 }} className="grid grid-cols-2 gap-2">
                  {RESPONSE_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleChoice(opt.id)}
                      disabled={isProcessing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-left p-3 rounded-xl border border-white/[0.15] bg-white/80 backdrop-blur-sm transition-all duration-200 disabled:opacity-30 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                      style={{ borderColor: `${opt.accent}30` }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: opt.accent }} />
                        <p className="text-[12px] font-semibold tracking-[-0.01em] text-[#3d3029]">{opt.label}</p>
                      </div>
                      <p className="text-[10px] text-[#9a8b7e] leading-[1.4]">{opt.desc}</p>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right: Audit Bar — expands/retracts ── */}
        <motion.div
          className="hidden lg:flex flex-col gap-4 h-[650px] max-h-[80vh] overflow-hidden"
          initial={false}
          animate={{ width: auditExpanded ? 360 : 280 }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
        >
          {/* Thinking Core */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-4 flex items-center gap-3 flex-shrink-0">
            <RoseCore isProcessing={isProcessing} size={40} />
            <div>
              <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-slate-500">{isProcessing ? "Evaluating..." : "Standing by"}</p>
              <p className="font-mono text-[11px] text-[#f4c2af]/70 tracking-[0.02em]">GPT-5.4 mini // CX_CORE</p>
            </div>
          </div>

          {/* Radar + Scores */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-5 flex-1 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-4">Performance Radar</p>
            <div className="flex justify-center mb-4">
              <MiniRadar scores={radar} />
            </div>
            <div className="space-y-2">
              {RADAR_KEYS.map((key, i) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{RADAR_LABELS[i]}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: radar[key] >= 60 ? "#f4c2af" : radar[key] >= 40 ? "#fbbf24" : "#ef4444" }} initial={false} animate={{ width: `${radar[key]}%` }} transition={{ duration: 0.5 }} />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 w-6 text-right">{radar[key]}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.04] text-center">
              <span className="text-[10px] uppercase tracking-[0.1em] text-slate-600">Overall</span>
              <p className={`text-[24px] font-semibold tracking-[-0.04em] ${avgScore >= 60 ? "text-[#f4c2af]" : avgScore >= 40 ? "text-amber-400" : "text-red-400"}`}>{avgScore}</p>
            </div>

            {/* Mentor feedback — visible when expanded */}
            <AnimatePresence>
              {auditExpanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="mt-4 pt-4 border-t border-white/[0.04]">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-[#f4c2af]/50 font-semibold mb-2">Service Handbook</p>
                    <p className="text-[13px] text-slate-400 leading-[1.7] mb-4">{mentorText}</p>
                    <button
                      onClick={handleNextRound}
                      className="w-full py-2.5 bg-[#D4AF37] text-[#0a0e17] text-[12px] font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      Next Round &rarr;
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ── Mobile Audit Bottom Sheet ── */}
      <AnimatePresence>
        {mobileAuditOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={handleNextRound} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-white/[0.08] bg-[#0a0e17] max-h-[80vh] overflow-y-auto"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              <div className="flex justify-center pt-3 pb-2"><div className="w-8 h-1 rounded-full bg-white/10" /></div>
              <div className="px-5 pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <RoseCore isProcessing={false} size={32} />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500 font-semibold">Round {round + 1} Results</p>
                    <p className={`text-[20px] font-semibold tracking-[-0.04em] ${avgScore >= 60 ? "text-[#f4c2af]" : avgScore >= 40 ? "text-amber-400" : "text-red-400"}`}>{avgScore}/100</p>
                  </div>
                </div>

                {/* Radar bars */}
                <div className="space-y-2 mb-4">
                  {RADAR_KEYS.map((key, i) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 w-24">{RADAR_LABELS[i]}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden mx-2">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${radar[key]}%`, background: radar[key] >= 60 ? "#f4c2af" : radar[key] >= 40 ? "#fbbf24" : "#ef4444" }} />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 w-6 text-right">{radar[key]}</span>
                    </div>
                  ))}
                </div>

                {/* Mentor */}
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#f4c2af]/50 font-semibold mb-2">Service Handbook</p>
                  <p className="text-[13px] text-slate-400 leading-[1.7]">{mentorText}</p>
                </div>

                <button onClick={handleNextRound} className="w-full py-3 bg-[#D4AF37] text-[#0a0e17] text-[13px] font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all">
                  Next Round &rarr;
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function clamp(v: number) { return Math.max(0, Math.min(100, Math.round(v))); }

/* ── Rose Quartz Thinking Core ── */
function RoseCore({ isProcessing, size }: { isProcessing: boolean; size: number }) {
  const c = "rgba(244,194,175,";
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <motion.div
        className="absolute rounded-full"
        style={{ inset: -4 }}
        animate={{ boxShadow: isProcessing ? `0 0 ${size * 0.5}px ${c}0.4), 0 0 ${size}px ${c}0.15)` : `0 0 0px ${c}0)` }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        className="rounded-full"
        style={{
          width: size, height: size,
          border: `1px solid ${c}${isProcessing ? "0.3)" : "0.15)"}`,
          background: isProcessing
            ? `radial-gradient(circle at 35% 35%, ${c}0.35), ${c}0.05) 60%, transparent)`
            : `radial-gradient(circle at 35% 35%, ${c}0.1), transparent 60%)`,
        }}
        animate={isProcessing ? { rotate: 360, scale: [1, 1.08, 1] } : { rotate: 0, scale: 1 }}
        transition={isProcessing ? { rotate: { repeat: Infinity, duration: 1.2, ease: "linear" }, scale: { repeat: Infinity, duration: 0.8 } } : { duration: 0.6 }}
      >
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke={isProcessing ? `${c}0.5)` : `${c}0.15)`} strokeWidth="0.75" />
          <ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke={isProcessing ? `${c}0.4)` : `${c}0.1)`} strokeWidth="0.75" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ── Mini SVG Radar Chart ── */
function MiniRadar({ scores }: { scores: RadarScores }) {
  const size = 140; const center = size / 2; const radius = 50;
  const values = RADAR_KEYS.map((k) => scores[k] / 100);
  const step = 360 / 5;
  function polar(angle: number, r: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) };
  }
  const path = values.map((v, i) => { const { x, y } = polar(i * step, v * radius); return `${i === 0 ? "M" : "L"}${x},${y}`; }).join(" ") + " Z";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {[0.25, 0.5, 0.75, 1].map((r) => <circle key={r} cx={center} cy={center} r={r * radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" />)}
      {RADAR_LABELS.map((label, i) => {
        const end = polar(i * step, radius + 2); const lp = polar(i * step, radius + 14);
        return (<g key={i}><line x1={center} y1={center} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" /><text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central" className="fill-slate-600 text-[7px] font-medium">{label}</text></g>);
      })}
      <motion.path d={path} fill="rgba(244,194,175,0.12)" stroke="#f4c2af" strokeWidth="1.5" strokeLinejoin="round" initial={false} animate={{ d: path }} transition={{ duration: 0.6, ease: EASE_EXPO }} />
      {values.map((v, i) => { const { x, y } = polar(i * step, v * radius); return <motion.circle key={i} r={2.5} fill="#f4c2af" initial={false} animate={{ cx: x, cy: y }} transition={{ duration: 0.6, ease: EASE_EXPO }} />; })}
    </svg>
  );
}
