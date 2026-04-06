"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getScenario } from "@/config/aiLabScenarios";

/* ═══════════════════════════════════════════════
   RetailCockpit — Decision-based luxury CX sandbox
   Choice cards → AI escalation → Radar scoring
   Rose-gold "Boutique" aesthetic
   ═══════════════════════════════════════════════ */

const EASE_EXPO = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface RadarScores {
  brandVoice: number;
  empathy: number;
  costControl: number;
  efficiency: number;
  resolution: number;
}

interface DialogueEntry {
  id: string;
  role: "client" | "user" | "system";
  text: string;
}

const RADAR_LABELS = ["Brand Voice", "Empathy", "Cost Control", "Efficiency", "Resolution"];
const RADAR_KEYS: (keyof RadarScores)[] = ["brandVoice", "empathy", "costControl", "efficiency", "resolution"];

const RESPONSE_OPTIONS = [
  { id: "empathetic", label: "Empathetic but Firm", desc: "Acknowledge the frustration, then gently reference the care guide and policy.", color: "border-emerald-400/30 hover:border-emerald-400/50 text-emerald-300" },
  { id: "apologetic", label: "Over-Apologetic", desc: "Profusely apologize and offer a full refund plus store credit.", color: "border-amber-400/30 hover:border-amber-400/50 text-amber-300" },
  { id: "policy", label: "Policy-First", desc: "Immediately cite the 14-day return window and damage clause.", color: "border-blue-400/30 hover:border-blue-400/50 text-blue-300" },
  { id: "escalate", label: "Escalation", desc: "Offer to bring in the store manager to handle the situation.", color: "border-purple-400/30 hover:border-purple-400/50 text-purple-300" },
];

interface ChatHistoryEntry { role: "user" | "assistant"; content: string; }

export default function RetailCockpit({ scenarioId }: { scenarioId: string }) {
  const scenario = getScenario(scenarioId);

  const [dialogue, setDialogue] = useState<DialogueEntry[]>([
    { id: "sys-0", role: "system", text: "Mrs. Zhang approaches the counter with a shopping bag." },
    { id: "client-0", role: "client", text: "I bought this bag three weeks ago and look at this — the leather is already stained. This is clearly a quality defect. I want a full refund, immediately." },
  ]);

  const [radar, setRadar] = useState<RadarScores>({ brandVoice: 50, empathy: 50, costControl: 50, efficiency: 50, resolution: 50 });
  const [mentorText, setMentorText] = useState("Mrs. Zhang is emotionally charged. Your first words set the tone. Acknowledge her frustration before addressing the damage.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [round, setRound] = useState(0);

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
      if (isProcessing) return;
      const option = RESPONSE_OPTIONS.find((o) => o.id === optionId);
      if (!option) return;

      addEntry("user", `[${option.label}] ${option.desc}`);
      setIsProcessing(true);
      setRound((r) => r + 1);

      const userMsg = `The RM chose: "${option.label}" — ${option.desc}`;
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
            setRadar((prev) => ({
              brandVoice: clamp(parsed.radarScores.brandVoice ?? prev.brandVoice),
              empathy: clamp(parsed.radarScores.empathy ?? prev.empathy),
              costControl: clamp(parsed.radarScores.costControl ?? prev.costControl),
              efficiency: clamp(parsed.radarScores.efficiency ?? prev.efficiency),
              resolution: clamp(parsed.radarScores.resolution ?? prev.resolution),
            }));
          }
        } catch {
          addEntry("client", text);
        }
      } catch {
        addEntry("system", "Connection error. Check API configuration.");
      }

      setIsProcessing(false);
    },
    [isProcessing, addEntry, scenarioId],
  );

  // Core colors — rose-gold theme
  const coreColor = "rgba(244,194,175,";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 w-full">
      {/* ── Main Panel: Dialogue + Choices ── */}
      <div className="rounded-2xl border border-[#e8e4df] bg-[#FAF9F6] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-[650px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#f5f0eb] border-b border-[#e8e4df]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c49882] to-[#8b6f5c] flex items-center justify-center text-[11px] font-bold text-white">
              MZ
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#3d3029] tracking-[-0.01em]">Mrs. Zhang — VIP Client</p>
              <p className="text-[11px] text-[#9a8b7e]">Return Request — $4,200 Leather Bag</p>
            </div>
          </div>
          <span className="text-[11px] text-red-500/70 font-medium flex items-center gap-1.5">
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
            Mood: Escalating
          </span>
        </div>

        {/* Dialogue area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scroll-smooth">
          <AnimatePresence initial={false}>
            {dialogue.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE_EXPO }}
                className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {entry.role === "system" ? (
                  <p className="text-[12px] text-[#9a8b7e] text-center w-full italic py-2">{entry.text}</p>
                ) : (
                  <div className={`
                    max-w-[85%] md:max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-[1.6]
                    shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                    ${entry.role === "user"
                      ? "bg-[#3d3029] text-[#FAF9F6] rounded-br-md"
                      : "bg-white text-[#3d3029] rounded-bl-md border border-[#e8e4df]"
                    }
                  `}>
                    {entry.role === "client" && (
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#c49882] mb-1">Mrs. Zhang</p>
                    )}
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
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c49882]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c49882]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c49882]" />
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Choice cards */}
        <div className="border-t border-[#e8e4df] bg-[#f5f0eb] p-4">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#9a8b7e] font-semibold mb-3">
            Choose your response — Round {round + 1}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {RESPONSE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleChoice(opt.id)}
                disabled={isProcessing}
                className={`text-left p-3 rounded-xl border bg-[#0a0e17]/[0.03] transition-all duration-200 disabled:opacity-30 active:scale-[0.98] ${opt.color.replace(/text-\w+-\d+/g, "text-[#3d3029]")}`}
                style={{ borderColor: undefined }}
              >
                <p className="text-[12px] font-semibold tracking-[-0.01em] text-[#3d3029] mb-0.5">{opt.label}</p>
                <p className="text-[10px] text-[#9a8b7e] leading-[1.4]">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Audit Panel ── */}
      <div className="hidden lg:flex flex-col gap-4 h-[650px] max-h-[80vh]">
        {/* Radar Chart */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-5 flex-1">
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
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: radar[key] >= 60 ? "#f4c2af" : radar[key] >= 40 ? "#fbbf24" : "#ef4444" }}
                      initial={false}
                      animate={{ width: `${radar[key]}%` }}
                      transition={{ duration: 0.5 }}
                    />
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
        </div>

        {/* Thinking Core — Rose Quartz */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <motion.div
              className="absolute inset-[-4px] rounded-full"
              animate={{ boxShadow: isProcessing ? `0 0 20px ${coreColor}0.4), 0 0 40px ${coreColor}0.15)` : `0 0 0px ${coreColor}0)` }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              className="w-10 h-10 rounded-full"
              style={{
                border: `1px solid ${coreColor}${isProcessing ? "0.3)" : "0.15)"}`,
                background: isProcessing
                  ? `radial-gradient(circle at 35% 35%, ${coreColor}0.35), ${coreColor}0.05) 60%, transparent)`
                  : `radial-gradient(circle at 35% 35%, ${coreColor}0.1), transparent 60%)`,
              }}
              animate={isProcessing ? { rotate: 360, scale: [1, 1.08, 1] } : { rotate: 0, scale: 1 }}
              transition={isProcessing ? { rotate: { repeat: Infinity, duration: 1.2, ease: "linear" }, scale: { repeat: Infinity, duration: 0.8 } } : { duration: 0.6 }}
            >
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke={isProcessing ? `${coreColor}0.5)` : `${coreColor}0.15)`} strokeWidth="0.75" />
                <ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke={isProcessing ? `${coreColor}0.4)` : `${coreColor}0.1)`} strokeWidth="0.75" />
              </svg>
            </motion.div>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-slate-500">{isProcessing ? "Evaluating..." : "Standing by"}</p>
            <p className="font-mono text-[11px] text-[#f4c2af]/70 tracking-[0.02em]">GPT-5.4 mini // CX_CORE</p>
          </div>
        </div>

        {/* Mentor Panel */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-5">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#f4c2af]/50 font-semibold mb-3">Service Handbook</p>
          <AnimatePresence mode="wait">
            <motion.p key={mentorText} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="text-[13px] text-slate-400 leading-[1.7]">
              {mentorText}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function clamp(v: number) { return Math.max(0, Math.min(100, Math.round(v))); }

/* ── Mini SVG Radar Chart ── */
function MiniRadar({ scores }: { scores: RadarScores }) {
  const size = 160;
  const center = size / 2;
  const radius = 60;
  const values = RADAR_KEYS.map((k) => scores[k] / 100);

  function polar(angle: number, r: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) };
  }

  const step = 360 / 5;
  const path = values.map((v, i) => {
    const { x, y } = polar(i * step, v * radius);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <circle key={r} cx={center} cy={center} r={r * radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" />
      ))}
      {RADAR_LABELS.map((label, i) => {
        const end = polar(i * step, radius + 2);
        const lp = polar(i * step, radius + 16);
        return (
          <g key={i}>
            <line x1={center} y1={center} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central" className="fill-slate-600 text-[8px] font-medium">{label}</text>
          </g>
        );
      })}
      <motion.path
        d={path}
        fill="rgba(244,194,175,0.12)"
        stroke="#f4c2af"
        strokeWidth="1.5"
        strokeLinejoin="round"
        initial={false}
        animate={{ d: path }}
        transition={{ duration: 0.6, ease: EASE_EXPO }}
      />
      {values.map((v, i) => {
        const { x, y } = polar(i * step, v * radius);
        return <motion.circle key={i} r={3} fill="#f4c2af" initial={false} animate={{ cx: x, cy: y }} transition={{ duration: 0.6, ease: EASE_EXPO }} />;
      })}
    </svg>
  );
}
