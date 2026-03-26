"use client";

import { motion } from "framer-motion";
import { FileSearch, Mic, BarChart3, Zap, Shield, Brain } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "AI Resume Screening",
    desc: "Upload a PDF and Claude analyzes it against the job description, scoring candidates 0-100 with detailed strengths and red flags.",
    color: "#3b82f6",
    bg: "bg-blue-50",
  },
  {
    icon: Mic,
    title: "Voice Interviews",
    desc: "Candidates scoring above 60 get an automated phone call. Vapi + ElevenLabs conduct a natural conversational interview.",
    color: "#8b5cf6",
    bg: "bg-violet-50",
  },
  {
    icon: Brain,
    title: "Transcript Analysis",
    desc: "Claude analyzes the interview transcript, scoring communication, technical skill, enthusiasm, and experience.",
    color: "#f59e0b",
    bg: "bg-amber-50",
  },
  {
    icon: BarChart3,
    title: "Real-time Dashboard",
    desc: "Track all candidates through the pipeline with live scores, status filters, and detailed candidate profiles.",
    color: "#10b981",
    bg: "bg-emerald-50",
  },
  {
    icon: Zap,
    title: "Fully Automated",
    desc: "From resume upload to interview results — the entire screening pipeline runs without human intervention.",
    color: "#f97316",
    bg: "bg-orange-50",
  },
  {
    icon: Shield,
    title: "Fair & Objective",
    desc: "AI scoring is consistent and unbiased. No penalties for employment gaps or non-traditional backgrounds.",
    color: "#06b6d4",
    bg: "bg-cyan-50",
  },
];

export default function FeatureCards() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
          Features
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight">
          Everything You Need to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Hire Smarter
          </span>
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            className="group rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-200"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} transition-transform group-hover:scale-110`}
            >
              <f.icon className="h-6 w-6" style={{ color: f.color }} />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1.5">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
