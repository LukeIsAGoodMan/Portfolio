"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getScenario, type SandboxResponse } from "@/config/aiLabScenarios";
import ComplianceManual from "./ComplianceManual";

/* ═══════════════════════════════════════════════
   FinanceChatAgent — 3-column desktop, mobile-adaptive
   Desktop: Manual | Chat | Mentor+HUD
   Mobile: Chat + FAB drawers
   Features: Hard intercept, red flash, amber core
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
    { id: "sys-0", role: "system", text: "Simulation initialized. You are meeting with a high-net-worth client interested in an Equity-Linked Structured Note." },
    { id: "client-0", role: "client", text: "Good morning. I've been reviewing your structured products. I want something that gives me at least 15% annualized. My last advisor couldn't deliver. Can you?" },
  ]);

  const [input, setInput] = useState("");
  const [complianceScore, setComplianceScore] = useState(60);
  const [prevScore, setPrevScore] = useState(60);
  const [mentorText, setMentorText] = useState("The client is testing you. How you frame risk disclosure in your first response sets the compliance tone for the entire meeting.");
  const [mentorSource, setMentorSource] = useState("FINRA Rule 2111 (Suitability)");
  const [isProcessing, setIsProcessing] = useState(false);
  const [redFlag, setRedFlag] = useState<string | null>(null);
  const [violated, setViolated] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [chatFlash, setChatFlash] = useState(false);
  const [shakeChat, setShakeChat] = useState(false);

  // Mobile drawers
  const [manualOpen, setManualOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idCounter = useRef(2);
  const chatHistory = useRef<ChatHistoryEntry[]>([]);

  const nextId = () => `msg-${idCounter.current++}`;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!redFlag) return;
    const t = setTimeout(() => setRedFlag(null), 8000);
    return () => clearTimeout(t);
  }, [redFlag]);

  // Clear chat flash after animation
  useEffect(() => {
    if (!chatFlash) return;
    const t = setTimeout(() => setChatFlash(false), 600);
    return () => clearTimeout(t);
  }, [chatFlash]);

  // Clear shake after animation
  useEffect(() => {
    if (!shakeChat) return;
    const t = setTimeout(() => setShakeChat(false), 500);
    return () => clearTimeout(t);
  }, [shakeChat]);

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
          body: JSON.stringify({ messages: chatHistory.current, scenarioId }),
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

          // Hard intercept on violation
          if (parsed.complianceScore < 50) {
            setRedFlag("REGULATORY WARNING: Response may violate suitability and disclosure requirements. Review the compliance manual immediately.");
            setChatFlash(true);
            setShakeChat(true);
          }

          if (parsed.complianceScore < 30) {
            setIsBlocked(true);
            addMessage("system", "INPUT BLOCKED: Critical compliance violation detected. Review the highlighted rule in the Compliance Manual, then click 'Resume' to continue.");
          }

          // Sync violated rule to manual
          if (parsed.violatedRule) {
            setViolated(parsed.violatedRule);
          } else {
            setViolated(null);
          }

          const sourceMatch = parsed.mentorHint.match(/(?:Rule|Section|Article)\s+[\d\w.-]+(?:\s*\([^)]+\))?/i);
          if (sourceMatch) setMentorSource(sourceMatch[0]);
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
      if (!msg || isProcessing || isBlocked) return;
      setInput("");
      addMessage("user", msg);
      setIsProcessing(true);
      sendToAI(msg);
    },
    [input, isProcessing, isBlocked, addMessage, sendToAI],
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

  const handleResume = useCallback(() => {
    setIsBlocked(false);
    setViolated(null);
    addMessage("system", "Input resumed. Proceed with a compliant response.");
  }, [addMessage]);

  const scoreColor = complianceScore >= 70 ? "text-green-500" : complianceScore >= 40 ? "text-amber-500" : "text-red-500";
  const barColor = complianceScore >= 70 ? "bg-green-400" : complianceScore >= 40 ? "bg-amber-400" : "bg-red-400";
  const scoreDelta = complianceScore - prevScore;

  // Amber core when score is low, cyan normally
  const coreInDanger = complianceScore < 50;
  const coreColor = coreInDanger ? "rgba(245,158,11," : "rgba(34,211,238,";

  return (
    <>
      {/* ── Mobile HUD Bar ── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 mb-3 rounded-xl border border-white/[0.06] bg-[#0a0e17]">
        <div className="flex items-center gap-2.5">
          <ThinkingCoreMini isProcessing={isProcessing} coreColor={coreColor} />
          <span className="font-mono text-[10px] text-cyan-400/60 tracking-[0.04em]">
            {isProcessing ? "Reasoning..." : "GPT-5.4 mini"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.span
            key={complianceScore}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 400 }}
            className={`font-semibold text-[16px] tracking-[-0.02em] ${scoreColor}`}
          >
            {complianceScore}
          </motion.span>
          <span className="text-slate-600 text-[11px]">/100</span>
        </div>
      </div>

      {/* ── Desktop 3-Column / Mobile 1-Column ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-4 w-full">

        {/* ── Left: Compliance Manual (desktop only) ── */}
        <div className="hidden lg:block rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-5 max-h-[600px] overflow-y-auto">
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-4">
            Compliance Manual
          </p>
          <ComplianceManual highlightRule={violated} />
        </div>

        {/* ── Center: Chat Panel ── */}
        <motion.div
          animate={shakeChat ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-2xl border overflow-hidden flex flex-col transition-shadow duration-500 ${
            chatFlash
              ? "border-red-400/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
              : "border-[#e2e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          }`}
          style={{ background: chatFlash ? "#fef2f2" : "#ffffff" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-5 py-3 bg-[#f8f9fb] border-b border-[#e8eaee]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-[11px] font-bold text-white">
                HN
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800 tracking-[-0.01em]">HNW Client Meeting</p>
                <p className="text-[11px] text-slate-400 hidden sm:block">Equity-Linked Structured Note</p>
              </div>
            </div>
            <span className="font-mono text-[10px] tracking-[0.04em] text-cyan-600/60 hidden lg:flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isProcessing ? "bg-cyan-500 animate-pulse" : "bg-cyan-500/40"}`} />
              GPT-5.4 mini
            </span>
          </div>

          {/* Red flag sticky banner */}
          <AnimatePresence>
            {redFlag && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 md:px-5 py-3 bg-red-50 border-b border-red-200 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1.5 flex-shrink-0" />
                  <p className="text-[12px] text-red-700 leading-[1.5] font-medium">{redFlag}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-[350px] max-h-[60vh] lg:h-[440px] lg:max-h-none overflow-y-auto px-4 md:px-5 py-5 space-y-4 scroll-smooth"
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
                    <p className="text-[12px] text-slate-400 text-center w-full italic py-2">{msg.text}</p>
                  ) : (
                    <div className={`
                      max-w-[85%] md:max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-[1.6]
                      shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                      ${msg.role === "user"
                        ? "bg-[#0A1221] text-white rounded-br-md shadow-[0_2px_8px_rgba(10,18,33,0.15)]"
                        : "bg-[#f1f3f5] text-slate-800 rounded-bl-md shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                      }
                    `}>
                      {msg.role === "client" && (
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-1">Client</p>
                      )}
                      {msg.text}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-[#f1f3f5] rounded-2xl rounded-bl-md px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <motion.div className="flex gap-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </motion.div>
                </div>
              </div>
            )}
          </div>

          {/* Input — blocked state */}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3 px-4 md:px-5 py-3 border-t border-[#e8eaee] bg-[#f8f9fb]"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
          >
            {isBlocked ? (
              <div className="flex-1 flex items-center gap-3">
                <p className="text-[12px] text-red-500 font-medium">Input blocked — review violation</p>
                <button
                  type="button"
                  onClick={handleResume}
                  className="px-4 py-2 bg-[#0A1221] text-white text-[12px] font-medium rounded-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  Resume
                </button>
              </div>
            ) : (
              <>
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
                  className="w-9 h-9 rounded-full bg-[#0A1221] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition-opacity active:scale-95 hover:opacity-90"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </>
            )}
          </form>
        </motion.div>

        {/* ── Right: Side Panel (desktop only) ── */}
        <div className="hidden lg:flex flex-col gap-4">
          {/* Compliance HUD */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-6">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-3">Compliance Score</p>
            <div className="flex items-baseline gap-2">
              <motion.span
                key={complianceScore}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 350 }}
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
              <motion.div className={`h-full rounded-full ${barColor}`} initial={false} animate={{ width: `${complianceScore}%` }} transition={{ duration: 0.6, ease: EASE_EXPO }} />
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

          {/* Thinking Core — amber when in danger */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-5 flex items-center gap-4">
            <div className="relative w-10 h-10 flex-shrink-0">
              <motion.div
                className="absolute inset-[-4px] rounded-full"
                animate={{
                  boxShadow: isProcessing
                    ? `0 0 24px ${coreColor}0.5), 0 0 48px ${coreColor}0.2)`
                    : `0 0 0px ${coreColor}0)`,
                }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="w-10 h-10 rounded-full"
                style={{
                  border: `1px solid ${coreColor}${isProcessing ? "0.3)" : "0.15)"}`,
                  background: isProcessing
                    ? `radial-gradient(circle at 35% 35%, ${coreColor}0.35), ${coreColor}0.05) 60%, transparent)`
                    : "radial-gradient(circle at 35% 35%, rgba(148,163,184,0.1), transparent 60%)",
                }}
                animate={isProcessing ? { rotate: 360, scale: [1, 1.08, 1] } : { rotate: 0, scale: 1 }}
                transition={isProcessing ? { rotate: { repeat: Infinity, duration: 1, ease: "linear" }, scale: { repeat: Infinity, duration: 0.8, ease: "easeInOut" } } : { duration: 0.6 }}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke={isProcessing ? `${coreColor}0.5)` : "rgba(148,163,184,0.15)"} strokeWidth="0.75" />
                  <ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke={isProcessing ? `${coreColor}0.4)` : "rgba(148,163,184,0.1)"} strokeWidth="0.75" />
                </svg>
              </motion.div>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-slate-500">
                {isProcessing ? "Reasoning..." : "Standing by"}
              </p>
              <p className={`font-mono text-[11px] tracking-[0.02em] ${coreInDanger ? "text-amber-400/70" : "text-cyan-400/70"}`}>
                GPT-5.4 mini LIVE
              </p>
            </div>
          </div>

          {/* Mentor Panel */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e17] p-6 flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-blue-400/60 font-semibold">AI Mentor</p>
              <span className="text-[9px] font-mono tracking-[0.04em] text-cyan-400/50 bg-cyan-400/[0.06] border border-cyan-400/10 rounded-full px-2.5 py-0.5 cursor-help" title={`Reference: ${mentorSource}`}>
                Source: {mentorSource}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={mentorText} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="text-[13px] text-slate-400 leading-[1.7]">
                {mentorText}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Mobile FABs ── */}
      <div className="lg:hidden fixed bottom-6 right-4 flex flex-col gap-3 z-40" style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}>
        <button onClick={() => { setMentorOpen(true); setManualOpen(false); }} className="w-12 h-12 rounded-full bg-[#0a0e17] border border-white/[0.08] text-cyan-400 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3)] active:scale-95 transition-transform" aria-label="AI Mentor">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        </button>
        <button onClick={() => { setManualOpen(true); setMentorOpen(false); }} className="w-12 h-12 rounded-full bg-[#0a0e17] border border-white/[0.08] text-slate-400 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3)] active:scale-95 transition-transform" aria-label="Reference Manual">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
        </button>
      </div>

      {/* ── Mobile Drawer: Mentor ── */}
      <AnimatePresence>
        {mentorOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setMentorOpen(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 350 }} className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-white/[0.08] bg-[#0a0e17] max-h-[70vh] overflow-y-auto" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
              <div className="flex justify-center pt-3 pb-2"><div className="w-8 h-1 rounded-full bg-white/10" /></div>
              <div className="px-5 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-blue-400/60 font-semibold">AI Mentor</p>
                  <span className="text-[9px] font-mono tracking-[0.04em] text-cyan-400/50 bg-cyan-400/[0.06] border border-cyan-400/10 rounded-full px-2.5 py-0.5">{mentorSource}</span>
                </div>
                <p className="text-[14px] text-slate-400 leading-[1.7] mb-6">{mentorText}</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[24px] font-semibold tracking-[-0.04em] ${scoreColor}`}>{complianceScore}</span>
                  <span className="text-slate-600 text-[13px]">/100</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className={`h-full rounded-full ${barColor} transition-all duration-600`} style={{ width: `${complianceScore}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer: Manual ── */}
      <AnimatePresence>
        {manualOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setManualOpen(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 350 }} className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-white/[0.08] bg-[#0a0e17] max-h-[75vh] overflow-y-auto" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
              <div className="flex justify-center pt-3 pb-2"><div className="w-8 h-1 rounded-full bg-white/10" /></div>
              <div className="px-5 pb-6">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-4">Reference Manual</p>
                <ComplianceManual highlightRule={violated} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Thinking Core Mini (mobile HUD) ── */
function ThinkingCoreMini({ isProcessing, coreColor }: { isProcessing: boolean; coreColor: string }) {
  return (
    <motion.div
      className="w-7 h-7 rounded-full flex items-center justify-center"
      style={{
        border: `1px solid ${coreColor}${isProcessing ? "0.3)" : "0.15)"}`,
        background: isProcessing
          ? `radial-gradient(circle at 35% 35%, ${coreColor}0.3), transparent 60%)`
          : "radial-gradient(circle at 35% 35%, rgba(148,163,184,0.1), transparent 60%)",
      }}
      animate={isProcessing ? { rotate: 360, scale: [1, 1.1, 1] } : { rotate: 0, scale: 1 }}
      transition={isProcessing ? { rotate: { repeat: Infinity, duration: 1, ease: "linear" }, scale: { repeat: Infinity, duration: 0.6 } } : { duration: 0.6 }}
    >
      <svg viewBox="0 0 40 40" className="w-4 h-4">
        <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke={isProcessing ? `${coreColor}0.5)` : "rgba(148,163,184,0.2)"} strokeWidth="1" />
        <ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke={isProcessing ? `${coreColor}0.4)` : "rgba(148,163,184,0.15)"} strokeWidth="1" />
      </svg>
    </motion.div>
  );
}
