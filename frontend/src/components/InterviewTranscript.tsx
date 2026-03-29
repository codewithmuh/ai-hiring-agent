"use client";

import { motion } from "framer-motion";
import { Mic, MicOff, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react";

interface InterviewTranscriptProps {
  transcript: string | null;
  analysis: {
    communication_score?: number;
    technical_score?: number;
    enthusiasm_score?: number;
    experience_score?: number;
    highlights?: string[];
    concerns?: string[];
    recommendation?: string;
    summary?: string;
  } | null;
  interviewStatus?: string;
}

const scoreConfig: Record<string, { bar: string; bg: string; icon: string; label: string }> = {
  communication_score: { bar: "bg-blue-500", bg: "bg-blue-100", icon: "text-blue-500", label: "Communication" },
  technical_score: { bar: "bg-violet-500", bg: "bg-violet-100", icon: "text-violet-500", label: "Technical" },
  enthusiasm_score: { bar: "bg-amber-500", bg: "bg-amber-100", icon: "text-amber-500", label: "Enthusiasm" },
  experience_score: { bar: "bg-emerald-500", bg: "bg-emerald-100", icon: "text-emerald-500", label: "Experience" },
};

function ScoreRing({ score, max = 25, color, delay }: { score: number; max?: number; color: string; delay: number }) {
  const pct = (score / max) * 100;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="relative flex items-center justify-center"
    >
      <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
        <circle cx="34" cy="34" r={radius} fill="none" stroke="currentColor" strokeWidth="5" className="text-gray-100" />
        <motion.circle
          cx="34" cy="34" r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums">{score}</span>
    </motion.div>
  );
}

const recommendationStyles: Record<string, { bg: string; text: string; border: string }> = {
  strong_yes: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  yes: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  maybe: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  no: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

function parseTranscript(raw: string) {
  const lines = raw.split("\n").filter((l) => l.trim());
  return lines.map((line) => {
    const match = line.match(/^(AI|Assistant|Interviewer|Sarah|Marcus|Priya|James|Emily|David|Ana|Alex|Candidate)[:\s]*(.+)/i);
    if (match) {
      const speaker = match[1].trim();
      const text = match[2].trim();
      const isAI = /^(ai|assistant|interviewer)/i.test(speaker);
      return { speaker, text, isAI };
    }
    return { speaker: "", text: line.trim(), isAI: false };
  });
}

export default function InterviewTranscript({ transcript, analysis, interviewStatus }: InterviewTranscriptProps) {
  // Show live call with real-time transcript
  if (interviewStatus === "in_progress") {
    const liveMessages = transcript
      ? transcript.split("\n\n").filter(Boolean).map((line, i) => {
          const colonIdx = line.indexOf(": ");
          const speaker = colonIdx > -1 ? line.slice(0, colonIdx) : "Unknown";
          const text = colonIdx > -1 ? line.slice(colonIdx + 2) : line;
          const isAI = speaker === "AI";
          return { id: i, speaker, text, isAI };
        })
      : [];

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-violet-100 bg-violet-50/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                <Mic className="h-5 w-5 text-violet-600" />
              </div>
              <motion.div
                className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-violet-900">Interview In Progress</h2>
              <p className="text-xs text-muted-foreground">Live conversation</p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-1"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        </div>

        {/* Live chat */}
        <div className="p-6 max-h-96 overflow-y-auto space-y-4">
          {liveMessages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Waiting for conversation to start...</p>
              <motion.div className="mt-3 flex items-center justify-center gap-1.5" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="h-2 w-2 rounded-full bg-violet-300" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </motion.div>
            </div>
          ) : (
            liveMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.isAI ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.isAI
                    ? "bg-white border border-gray-200 text-foreground rounded-bl-sm"
                    : "bg-violet-600 text-white rounded-br-sm"
                }`}>
                  <p className={`text-[10px] font-semibold mb-1 ${msg.isAI ? "text-violet-600" : "text-violet-200"}`}>
                    {msg.isAI ? "AI Interviewer" : msg.speaker}
                  </p>
                  {msg.text}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    );
  }

  if (!transcript && !analysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-dashed bg-white p-12 shadow-sm"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 mb-4">
            <MicOff className="h-7 w-7 text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold">No Interview Yet</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            Once the candidate completes their AI voice interview, the transcript and analysis will appear here.
          </p>
        </div>
      </motion.div>
    );
  }

  const totalScore = analysis
    ? (analysis.communication_score || 0) + (analysis.technical_score || 0) + (analysis.enthusiasm_score || 0) + (analysis.experience_score || 0)
    : 0;

  return (
    <div className="space-y-6">
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border bg-white shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
                <Mic className="h-4.5 w-4.5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Interview Analysis</h2>
                <p className="text-xs text-muted-foreground">AI-scored phone screening</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {analysis.recommendation && (() => {
                const style = recommendationStyles[analysis.recommendation] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
                return (
                  <span className={`rounded-full border px-3.5 py-1 text-sm font-semibold capitalize ${style.bg} ${style.text} ${style.border}`}>
                    {analysis.recommendation.replace("_", " ")}
                  </span>
                );
              })()}
            </div>
          </div>

          <div className="p-6">
            {/* Summary */}
            {analysis.summary && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{analysis.summary}</p>
            )}

            {/* Score Rings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
              {(["communication_score", "technical_score", "enthusiasm_score", "experience_score"] as const).map((key, i) => {
                const val = analysis[key];
                if (val === undefined) return null;
                const cfg = scoreConfig[key];
                return (
                  <div key={key} className="flex flex-col items-center gap-2">
                    <ScoreRing score={val} color={cfg.bar.replace("bg-", "").replace("-500", "") === "blue" ? "#3b82f6" : cfg.bar.includes("violet") ? "#8b5cf6" : cfg.bar.includes("amber") ? "#f59e0b" : "#10b981"} delay={i * 0.1} />
                    <span className="text-xs font-semibold text-muted-foreground">{cfg.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Total score bar */}
            <div className="rounded-xl bg-gray-50 p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Total Interview Score</span>
                <span className="text-sm font-bold tabular-nums text-violet-700">{totalScore}/100</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${totalScore}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Highlights & Concerns */}
            <div className="grid gap-6 sm:grid-cols-2">
              {analysis.highlights && analysis.highlights.length > 0 && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-emerald-700">Highlights</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {analysis.highlights.map((h, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">+</span>
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.concerns && analysis.concerns.length > 0 && (
                <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-amber-700">Concerns</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {analysis.concerns.map((c, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600">!</span>
                        {c}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Transcript */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-2xl border bg-white shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2.5 border-b px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50">
              <MessageSquare className="h-4.5 w-4.5 text-gray-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Interview Transcript</h2>
              <p className="text-xs text-muted-foreground">AI voice screening conversation</p>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto p-6 space-y-4">
            {parseTranscript(transcript).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={`flex gap-3 ${msg.isAI ? "" : "flex-row-reverse"}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${msg.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"}`}>
                  {msg.isAI ? "AI" : msg.speaker?.charAt(0) || "C"}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.isAI ? "bg-violet-50 text-violet-900 rounded-tl-md" : "bg-emerald-50 text-emerald-900 rounded-tr-md"}`}>
                  {msg.speaker && (
                    <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${msg.isAI ? "text-violet-500" : "text-emerald-500"}`}>
                      {msg.speaker}
                    </p>
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
