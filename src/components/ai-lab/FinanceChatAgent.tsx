"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getScenario, type SandboxResponse } from "@/config/aiLabScenarios";

/* ═══════════════════════════════════════════════
   FinanceChatAgent — White-mode professional chat
   AI persona: aggressive HNW client
   User: Private Banking RM maintaining compliance
   ═══════════════════════════════════════════════ */

const EASE_EXPO = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface ChatMessage {
  id: string;
  role: "user" | "client" | "system";
  text: string;
}

interface ChatHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

export default function FinanceChatAgent({ scenarioId }: { scenarioId: string }) {
  const scenario = getScenario(scenarioId);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "sys-0",
      role: "system",
      text: "Simulation initialized. You are meeting with a high-net-worth client interested in an Equity-Linked Structured Note. The client expects premium treatment and aggressive returns.",
    },
    {
      id: "client-0",
      role: "client",
      text: "Good morning. I've been reviewing your structured products. I want something that gives me at least 15% annualized. My last advisor couldn't deliver. Can you?",
    },
  ]);

  const [input, setInput] = useState("");
  const [complianceScore, setComplianceScore] = useState(60);
  const [prevScore, setPrevScore] = useState(60);
  const [mentorText, setMentorText] = useState("The client is testing you. How you frame risk disclosure in your first response sets the compliance tone for the entire meeting.");
  const [mentorSource, setMentorSource] = useState("FINRA Rule 2111 (Suitability)");
  const [isProcessing, setIsProcessing] = useState(false);
  const [redFlag, setRedFlag] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idCounter = useRef(2);
  const chatHistory = useRef<ChatHistoryEntry[]>([]);

  const nextId = () => `msg-${idCounter.current++}`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Dismiss red flag after 6s
  useEffect(() => {
    if (!redFlag) return;
    const timer = setTimeout(() => setRedFlag(null), 6000);
    return () => clearTimeout(timer);
  }, [redFlag]);

  const addMessage = useCallback((role: ChatMessage["role"], text: string) => {
    setMessages((prev) => [...prev, { id: nextId(), role, text }]);
  }, []);

  const sendToAI = useCallback(
    async (userMessage: string) => {
      chatHistory.current.push({ role: "user", content: userMessage });

      try {
        const res = await fetch("/api/chat/sandbox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatHistory.current,
            scenarioId,
          }),
        });

        if (!res.ok) throw new Error(`API ${res.status}`);

        const text = await res.text();
        chatHistory.current.push({ role: "assistant", content: text });

        try {
          const clean = text.replace(/```json\n?|```/g, "").trim();
          const parsed: SandboxResponse = JSON.parse(clean);

          addMessage("client", parsed.terminalOutput);
          setMentorText(parsed.mentorHint);
          setPrevScore(complianceScore);
          setComplianceScore(parsed.complianceScore);

          // Red flag if score drops below 50
          if (parsed.complianceScore < 50) {
            setRedFlag("REGULATORY WARNING: Response may violate suitability and disclosure requirements. Review SEC Rule 15c1-2 and FINRA Rule 2111.");
          }

          // Extract source reference from mentor hint
          const sourceMatch = parsed.mentorHint.match(/(?:Rule|Section|Article)\s+[\d\w.-]+(?:\s*\([^)]+\))?/i);
          if (sourceMatch) {
            setMentorSource(sourceMatch[0]);
          }
        } catch {
          addMessage("client", text);
        }
      } catch {
        addMessage("system", "Connection error. Check API configuration.");
      }

      setIsProcessing(false);
    },
    [scenarioId, addMessage, complianceScore],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const msg = input.trim();
      if (!msg || isProcessing) return;

      setInput("");
      addMessage("user", msg);
      setIsProcessing(true);
      sendToAI(msg);
    },
    [input, isProcessing, addMessage, sendToAI],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const scoreColor =
    complianceScore >= 70 ? "text-green-500" : complianceScore >= 40 ? "text-amber-500" : "text-red-500";
  const scoreDelta = complianceScore - prevScore;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 w-full">
      {/* ── Chat Panel (White Mode) ── */}
      <div className="rounded-2xl border border-[#e2e5ea] bg-white overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#f8f9fb] border-b border-[#e8eaee]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-[11px] font-bold text-white">
              HN
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-800 tracking-[-0.01em]">
                HNW Client Meeting
              </p>
              <p className="text-[11px] text-slate-400">Equity-Linked Structured Note</p>
            </div>
          </div>
          <span className="font-mono text-[10px] tracking-[0.04em] text-cyan-600/60 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isProcessing ? "bg-cyan-500 animate-pulse" : "bg-cyan-500/40"}`} />
            GPT-5.4 mini
          </span>
        </div>

        {/* Red flag banner */}
        <AnimatePresence>
          {redFlag && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 py-3 bg-red-50 border-b border-red-100 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1.5 flex-shrink-0" />
                <p className="text-[12px] text-red-700 leading-[1.5] font-medium">
                  {redFlag}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="h-[420px] overflow-y-auto px-5 py-5 space-y-4 scroll-smooth"
          onClick={() => inputRef.current?.focus()}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE_EXPO }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "system" ? (
                  <p className="text-[12px] text-slate-400 text-center w-full italic py-2">
                    {msg.text}
                  </p>
                ) : (
                  <div
                    className={`
                      max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-[1.6]
                      ${msg.role === "user"
                        ? "bg-[#0A1221] text-white rounded-br-md"
                        : "bg-[#f1f3f5] text-slate-800 rounded-bl-md"
                      }
                    `}
                  >
                    {msg.role === "client" && (
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-1">
                        Client
                      </p>
                    )}
                    {msg.text}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-[#f1f3f5] rounded-2xl rounded-bl-md px-4 py-3">
                <motion.div
                  className="flex gap-1"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3 px-5 py-3 border-t border-[#e8eaee] bg-[#f8f9fb]"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isProcessing ? "Client is responding..." : "Respond to the client..."}
            disabled={isProcessing}
            rows={1}
            className="flex-1 bg-white border border-[#e2e5ea] rounded-xl px-4 py-2.5 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-40 resize-none focus:border-[#0A1221] focus:ring-1 focus:ring-[#0A1221]/10 transition-colors"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="w-9 h-9 rounded-full bg-[#0A1221] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition-opacity hover:opacity-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>

      {/* ── Side Panel (Dark Mode for contrast) ── */}
      <div className="flex flex-col gap-4">
        {/* Compliance HUD */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-6">
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
          <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                complianceScore >= 70 ? "bg-green-400" : complianceScore >= 40 ? "bg-amber-400" : "bg-red-400"
              }`}
              initial={false}
              animate={{ width: `${complianceScore}%` }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
            />
          </div>
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

        {/* Thinking Core */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-5 flex items-center gap-4">
          <div className="relative w-10 h-10 flex-shrink-0">
            <motion.div
              className="absolute inset-[-4px] rounded-full"
              animate={{
                boxShadow: isProcessing
                  ? "0 0 20px rgba(34,211,238,0.4), 0 0 40px rgba(34,211,238,0.15)"
                  : "0 0 0px rgba(34,211,238,0)",
              }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              className="w-10 h-10 rounded-full border border-cyan-400/20"
              style={{
                background: isProcessing
                  ? "radial-gradient(circle at 35% 35%, rgba(34,211,238,0.3), rgba(34,211,238,0.05) 60%, transparent)"
                  : "radial-gradient(circle at 35% 35%, rgba(148,163,184,0.1), transparent 60%)",
              }}
              animate={isProcessing ? { rotate: 360 } : { rotate: 0 }}
              transition={isProcessing ? { repeat: Infinity, duration: 1.5, ease: "linear" } : { duration: 0.6 }}
            >
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <ellipse cx="20" cy="20" rx="14" ry="6" fill="none"
                  stroke={isProcessing ? "rgba(34,211,238,0.4)" : "rgba(148,163,184,0.15)"} strokeWidth="0.75" />
                <ellipse cx="20" cy="20" rx="6" ry="14" fill="none"
                  stroke={isProcessing ? "rgba(34,211,238,0.3)" : "rgba(148,163,184,0.1)"} strokeWidth="0.75" />
              </svg>
            </motion.div>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-slate-500">
              {isProcessing ? "Reasoning..." : "Standing by"}
            </p>
            <p className="font-mono text-[11px] text-cyan-400/70 tracking-[0.02em]">
              GPT-5.4 mini LIVE
            </p>
          </div>
        </div>

        {/* Mentor Panel */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-6 flex-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-blue-400/60 font-semibold">
              AI Mentor
            </p>
            {/* Source badge */}
            <span
              className="text-[9px] font-mono tracking-[0.04em] text-cyan-400/50 bg-cyan-400/[0.06] border border-cyan-400/10 rounded-full px-2.5 py-0.5 cursor-help"
              title={`Reference: ${mentorSource}`}
            >
              Source: {mentorSource}
            </span>
          </div>
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
