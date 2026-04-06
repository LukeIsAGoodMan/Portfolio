"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getScenario, type SandboxResponse } from "@/config/aiLabScenarios";

/* ═══════════════════════════════════════════════
   TerminalAgent — Hybrid local/AI terminal
   Local: help, ls, clear, status (zero tokens)
   AI: inspect, apply, logs, rollback (streamed)
   Exposes state via onStateChange for parent layout
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

export interface TerminalState {
  complianceScore: number;
  prevScore: number;
  mentorText: string;
  isProcessing: boolean;
  recommendedCommand: string | null;
  completedSteps: string[];
}

interface TerminalAgentProps {
  scenarioId: string;
  onStateChange?: (state: TerminalState) => void;
}

const STATIC_PILLS = ["help", "status"];

// Step detection patterns
const STEP_PATTERNS: Array<{ pattern: RegExp; step: string }> = [
  { pattern: /\b(status|health)\b/i, step: "Check cluster status" },
  { pattern: /\blog(s)?\b/i, step: "Review service logs" },
  { pattern: /\binspect\b.*\b(sg|security)/i, step: "Inspect security groups" },
  { pattern: /\binspect\b.*\b(vpc|network|cidr)/i, step: "Trace network path" },
  { pattern: /\bapply\b.*\b(fix|update|cidr)/i, step: "Apply the fix" },
];

export default function TerminalAgent({ scenarioId, onStateChange }: TerminalAgentProps) {
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
  const [recommendedCmd, setRecommendedCmd] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(1);
  const chatHistory = useRef<ChatMessage[]>([]);

  const nextId = () => `log-${idCounter.current++}`;

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  // Expose state to parent
  useEffect(() => {
    onStateChange?.({ complianceScore, prevScore, mentorText, isProcessing, recommendedCommand: recommendedCmd, completedSteps });
  }, [complianceScore, prevScore, mentorText, isProcessing, recommendedCmd, completedSteps, onStateChange]);

  const addLog = useCallback((type: LogEntry["type"], text: string) => {
    setLogs((prev) => [...prev, { id: nextId(), type, text }]);
  }, []);

  const trackStep = useCallback((cmd: string) => {
    for (const { pattern, step } of STEP_PATTERNS) {
      if (pattern.test(cmd)) {
        setCompletedSteps((prev) => prev.includes(step) ? prev : [...prev, step]);
      }
    }
  }, []);

  const sendToAI = useCallback(
    async (command: string) => {
      chatHistory.current.push({ role: "user", content: command });

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
          const parsed: SandboxResponse = JSON.parse(clean);

          addLog("output", parsed.terminalOutput);
          setMentorText(parsed.mentorHint);
          setPrevScore(complianceScore);
          setComplianceScore(parsed.complianceScore);

          if (parsed.recommendedCommand) {
            setRecommendedCmd(parsed.recommendedCommand);
          }
        } catch {
          addLog("output", text);
        }
      } catch {
        addLog("error", "[System] AI service unavailable. Configure OPENAI_API_KEY in .env.local to enable.");
      }

      setIsProcessing(false);
    },
    [scenarioId, addLog, complianceScore],
  );

  const executeCommand = useCallback(
    (cmd: string) => {
      if (!cmd.trim() || isProcessing) return;

      addLog("input", `$ ${cmd}`);
      trackStep(cmd);

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

      setIsProcessing(true);
      addLog("system", "[Sending to AI mentor...]");
      sendToAI(cmd);
    },
    [isProcessing, scenario, addLog, sendToAI, trackStep],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input.trim();
      if (!cmd) return;
      setInput("");
      executeCommand(cmd);
    },
    [input, executeCommand],
  );

  const handlePillClick = useCallback(
    (cmd: string) => {
      setInput("");
      executeCommand(cmd);
    },
    [executeCommand],
  );

  // Core color: green when following path, red when score drops
  const coreInDanger = complianceScore < 50;
  const coreColor = coreInDanger ? "rgba(239,68,68," : complianceScore >= 70 ? "rgba(34,197,94," : "rgba(34,211,238,";

  // Build dynamic pills
  const dynamicPills: string[] = [];
  if (recommendedCmd && !STATIC_PILLS.includes(recommendedCmd)) {
    dynamicPills.push(recommendedCmd);
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-[650px] max-h-[80vh] flex flex-col">
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
        <span className="font-mono text-[10px] tracking-[0.04em] text-cyan-400/60 select-none flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${isProcessing ? "bg-cyan-400 animate-pulse" : "bg-cyan-400/40"}`} />
          GPT-5.4 mini // SRE_CORE
        </span>
      </div>

      {/* Log area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 font-mono text-[13px] leading-[1.7] scroll-smooth"
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

      {/* Command pills */}
      <div className="flex items-center gap-2 px-5 py-2 border-t border-white/[0.04] overflow-x-auto">
        {STATIC_PILLS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handlePillClick(cmd)}
            disabled={isProcessing}
            className="px-3 py-1 text-[11px] font-mono font-medium text-slate-500 bg-white/[0.03] border border-white/[0.08] rounded-full hover:border-blue-400/30 hover:text-blue-400 transition-colors disabled:opacity-30 flex-shrink-0 active:scale-95"
          >
            {cmd}
          </button>
        ))}
        <AnimatePresence>
          {dynamicPills.map((cmd) => (
            <motion.button
              key={cmd}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => handlePillClick(cmd)}
              disabled={isProcessing}
              className="px-3 py-1 text-[11px] font-mono font-medium text-blue-400 bg-blue-400/[0.06] border border-blue-400/20 rounded-full hover:border-blue-400/40 hover:bg-blue-400/[0.1] transition-colors disabled:opacity-30 flex-shrink-0 active:scale-95 shadow-[0_0_8px_rgba(59,130,246,0.1)]"
            >
              {cmd}
            </motion.button>
          ))}
        </AnimatePresence>
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
  );
}
