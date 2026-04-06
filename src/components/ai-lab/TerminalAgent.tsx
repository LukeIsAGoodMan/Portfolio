"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getScenario, type SandboxResponse } from "@/config/aiLabScenarios";

/* ═══════════════════════════════════════════════
   TerminalAgent — Hybrid local/AI terminal
   Local: help, ls, clear, status (zero tokens)
   AI: inspect, apply, logs, rollback (streamed)
   ═══════════════════════════════════════════════ */

const EASE_EXPO = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface LogEntry {
  id: string;
  type: "input" | "output" | "system" | "mentor" | "error";
  text: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function TerminalAgent({ scenarioId }: { scenarioId: string }) {
  const scenario = getScenario(scenarioId);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "boot-0",
      type: "system",
      text: `[SRE Sandbox] ${scenario?.title ?? "Unknown"}\n${scenario?.context ?? ""}\nType "help" for available commands.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [complianceScore, setComplianceScore] = useState(70);
  const [prevScore, setPrevScore] = useState(70);
  const [mentorText, setMentorText] = useState("Awaiting your first command. Start by assessing the situation.");
  const [isProcessing, setIsProcessing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(1);
  const chatHistory = useRef<ChatMessage[]>([]);

  const nextId = () => `log-${idCounter.current++}`;

  // Auto-scroll on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = useCallback((type: LogEntry["type"], text: string) => {
    setLogs((prev) => [...prev, { id: nextId(), type, text }]);
  }, []);

  const sendToAI = useCallback(
    async (command: string) => {
      chatHistory.current.push({ role: "user", content: command });

      try {
        const res = await fetch("/api/chat/sandbox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatHistory.current,
            scenarioId,
          }),
        });

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }

        // Read the streamed text response
        const text = await res.text();
        chatHistory.current.push({ role: "assistant", content: text });

        // Parse JSON from the AI response
        try {
          const clean = text.replace(/```json\n?|```/g, "").trim();
          const parsed: SandboxResponse = JSON.parse(clean);

          addLog("output", parsed.terminalOutput);
          setMentorText(parsed.mentorHint);
          setPrevScore(complianceScore);
          setComplianceScore(parsed.complianceScore);
        } catch {
          // Non-JSON fallback — show raw
          addLog("output", text);
        }
      } catch {
        addLog("error", "[System] AI service unavailable. Configure OPENAI_API_KEY in .env.local to enable.");
      }

      setIsProcessing(false);
    },
    [scenarioId, addLog, complianceScore],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input.trim();
      if (!cmd || isProcessing) return;

      setInput("");
      addLog("input", `$ ${cmd}`);

      // Check local commands first (zero tokens)
      const baseCmd = cmd.split(" ")[0].toLowerCase();
      const localOutput = scenario?.localCommands[baseCmd];

      if (localOutput !== undefined) {
        if (localOutput === "__CLEAR__") {
          setLogs([]);
        } else {
          addLog("output", localOutput);
        }
        return;
      }

      // AI command — send to API
      setIsProcessing(true);
      addLog("system", "[Sending to AI mentor...]");
      sendToAI(cmd);
    },
    [input, isProcessing, scenario, addLog, sendToAI],
  );

  const scoreColor =
    complianceScore >= 70
      ? "text-green-400"
      : complianceScore >= 40
        ? "text-yellow-400"
        : "text-red-400";

  const scoreDelta = complianceScore - prevScore;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 w-full">
      {/* ── Terminal Panel ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Title bar */}
        <div className="flex items-center gap-3 px-5 py-3 bg-white/[0.03] border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="flex-1 text-center text-[11px] text-slate-500 font-medium tracking-[0.02em] select-none">
            sre-sandbox — cluster-a
          </span>
          <div className="w-[52px]" />
        </div>

        {/* Log area */}
        <div
          ref={scrollRef}
          className="h-[420px] overflow-y-auto p-5 font-mono text-[13px] leading-[1.7] scroll-smooth"
          onClick={() => inputRef.current?.focus()}
        >
          <AnimatePresence initial={false}>
            {logs.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE_EXPO }}
                className={`whitespace-pre-wrap mb-1 ${
                  entry.type === "input"
                    ? "text-blue-300"
                    : entry.type === "system"
                      ? "text-slate-500"
                      : entry.type === "error"
                        ? "text-red-400"
                        : entry.type === "mentor"
                          ? "text-emerald-400"
                          : "text-slate-300"
                }`}
              >
                {entry.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-blue-400"
            >
              Processing...
            </motion.span>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-5 py-3 border-t border-white/[0.06] bg-white/[0.02]"
        >
          <span className="text-blue-400 font-mono text-[13px] select-none">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isProcessing ? "waiting..." : "type a command..."}
            disabled={isProcessing}
            className="flex-1 bg-transparent text-slate-200 font-mono text-[13px] outline-none placeholder:text-slate-600 disabled:opacity-40"
            autoFocus
          />
        </form>
      </div>

      {/* ── Side Panel: Mentor + Compliance HUD ── */}
      <div className="flex flex-col gap-4">
        {/* Compliance HUD */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6">
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-3">
            Compliance Score
          </p>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={complianceScore}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className={`text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.04em] leading-none ${scoreColor}`}
            >
              {complianceScore}
            </motion.span>
            <span className="text-slate-500 text-[14px] font-medium">/100</span>
            {scoreDelta !== 0 && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-[12px] font-medium ${scoreDelta > 0 ? "text-green-400" : "text-red-400"}`}
              >
                {scoreDelta > 0 ? "+" : ""}{scoreDelta}
              </motion.span>
            )}
          </div>
          {/* Score bar */}
          <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                complianceScore >= 70
                  ? "bg-green-400"
                  : complianceScore >= 40
                    ? "bg-yellow-400"
                    : "bg-red-400"
              }`}
              initial={false}
              animate={{ width: `${complianceScore}%` }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
            />
          </div>
          {/* Rules */}
          <div className="mt-4 space-y-1.5">
            {scenario?.complianceRules.map((rule, i) => (
              <p key={i} className="text-[11px] text-slate-500 leading-[1.5] flex items-start gap-2">
                <span className="text-slate-600 mt-0.5 select-none">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </span>
                {rule}
              </p>
            ))}
          </div>
        </div>

        {/* Mentor Panel */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 flex-1">
          <p className="text-[10px] uppercase tracking-[0.12em] text-blue-400/60 font-semibold mb-3">
            AI Mentor
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={mentorText}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-[13px] text-slate-400 leading-[1.7]"
            >
              {mentorText}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
