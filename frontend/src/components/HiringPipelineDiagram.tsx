"use client";

import { motion } from "framer-motion";

/* ───── types ───── */
interface NodeProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: string;
  delay: number;
}

/* ───── reusable pieces ───── */
function DiagramNode({ icon, label, sublabel, color, delay }: NodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className="relative flex flex-col items-center"
    >
      {/* glow ring */}
      <motion.div
        className="absolute -inset-2 rounded-2xl opacity-0"
        style={{ background: `radial-gradient(circle, ${color}18, transparent 70%)` }}
        animate={{ opacity: [0.3, 0.08, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <div
        className="relative flex h-16 w-16 items-center justify-center rounded-2xl border shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${color}14, ${color}06)`,
          borderColor: `${color}30`,
        }}
      >
        {icon}
      </div>
      <p className="mt-2.5 text-sm font-semibold text-foreground">{label}</p>
      <p className="text-[11px] text-muted-foreground leading-tight text-center max-w-[100px]">{sublabel}</p>
    </motion.div>
  );
}

function HArrow({ delay, color = "#8b5cf6", label }: { delay: number; color?: string; label?: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center px-1">
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 0.3 }}
          className="absolute -top-5 text-[10px] font-medium whitespace-nowrap"
          style={{ color }}
        >
          {label}
        </motion.span>
      )}
      <motion.svg
        width="70"
        height="16"
        viewBox="0 0 70 16"
        fill="none"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.35 }}
        style={{ originX: 0 }}
      >
        <motion.path
          d="M0 8H62M62 8L55 3M62 8L55 13"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.1, duration: 0.4 }}
        />
      </motion.svg>
    </div>
  );
}

function VArrow({ delay, color = "#8b5cf6" }: { delay: number; color?: string }) {
  return (
    <motion.svg
      width="16"
      height="40"
      viewBox="0 0 16 40"
      fill="none"
      className="mx-auto"
      initial={{ opacity: 0, scaleY: 0 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.35 }}
      style={{ originY: 0 }}
    >
      <motion.path
        d="M8 0V32M8 32L3 25M8 32L13 25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.1, duration: 0.4 }}
      />
    </motion.svg>
  );
}

function StepBadge({ step, delay }: { step: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3, type: "spring", stiffness: 200 }}
      className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-md z-10"
    >
      {step}
    </motion.div>
  );
}

/* ───── icons (inline svg for crisp rendering) ───── */
const icons = {
  upload: (
    <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  django: (
    <svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
    </svg>
  ),
  claude: (
    <svg className="h-7 w-7 text-amber-500" viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
  ),
  phone: (
    <svg className="h-7 w-7 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  ),
  vapi: (
    <svg className="h-7 w-7 text-cyan-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
  db: (
    <svg className="h-7 w-7 text-pink-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  ),
  dashboard: (
    <svg className="h-7 w-7 text-violet-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  webhook: (
    <svg className="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  elevenlabs: (
    <svg className="h-7 w-7 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  ),
};

/* ───── mobile card ───── */
function MobileStepCard({ step, icon, label, sublabel, color, delay }: { step: number; icon: React.ReactNode; label: string; sublabel: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-4 rounded-xl border p-4"
      style={{ borderColor: `${color}30`, background: `linear-gradient(135deg, ${color}08, transparent)` }}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
        {step}
      </div>
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
        style={{ borderColor: `${color}30`, background: `${color}10` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
    </motion.div>
  );
}

function MobileVArrow({ delay }: { delay: number }) {
  return (
    <motion.div
      className="flex justify-center py-1"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3 }}
    >
      <svg width="12" height="24" viewBox="0 0 12 24" fill="none">
        <path d="M6 0V18M6 18L2 14M6 18L10 14" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

/* ═════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════ */
export default function HiringPipelineDiagram() {
  return (
    <div className="w-full">
      {/* ─── DESKTOP ─── */}
      <div className="hidden lg:block">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 mb-4">
            System Architecture
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            How the{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI Pipeline
            </span>{" "}
            Works
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            From resume upload to AI-powered voice interview — fully automated candidate screening
          </p>
        </motion.div>

        {/* ── Row 1: Resume screening flow ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-3"
        >
          <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
            Phase 1 — Resume Screening
          </span>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-8 rounded-2xl border bg-white/60 backdrop-blur-sm p-8 shadow-sm">
          <div className="relative">
            <StepBadge step={1} delay={0.1} />
            <DiagramNode icon={icons.upload} label="Resume Upload" sublabel="PDF file + job desc" color="#3b82f6" delay={0.1} />
          </div>
          <HArrow delay={0.25} color="#3b82f6" />
          <div className="relative">
            <StepBadge step={2} delay={0.3} />
            <DiagramNode icon={icons.django} label="Django API" sublabel="REST endpoint" color="#10b981" delay={0.3} />
          </div>
          <HArrow delay={0.45} color="#f59e0b" label="base64 PDF" />
          <div className="relative">
            <StepBadge step={3} delay={0.5} />
            <DiagramNode icon={icons.claude} label="Claude AI" sublabel="Parse & score resume" color="#f59e0b" delay={0.5} />
          </div>
          <HArrow delay={0.65} color="#10b981" label="JSON result" />
          <div className="relative">
            <StepBadge step={4} delay={0.7} />
            <DiagramNode icon={icons.db} label="PostgreSQL" sublabel="Store candidate data" color="#ec4899" delay={0.7} />
          </div>
        </div>

        {/* ── Decision point ── */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.4, type: "spring" }}
            className="relative flex items-center gap-4 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/50 px-8 py-4"
          >
            <motion.div
              className="absolute -inset-1 rounded-2xl"
              style={{ background: "radial-gradient(circle, #8b5cf618, transparent 70%)" }}
              animate={{ opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
              <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-violet-800">Decision Gate</p>
              <p className="text-xs text-violet-600">Score &gt; 60? Proceed to voice interview</p>
            </div>
            <div className="flex gap-3 ml-4">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Score &ge; 60 → Interview</span>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Score &lt; 40 → Reject</span>
            </div>
          </motion.div>
        </div>

        {/* ── Row 2: Voice interview flow ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="mb-3"
        >
          <span className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-600 uppercase tracking-wider">
            Phase 2 — AI Voice Interview
          </span>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-8 rounded-2xl border bg-white/60 backdrop-blur-sm p-8 shadow-sm">
          <div className="relative">
            <StepBadge step={5} delay={1.0} />
            <DiagramNode icon={icons.vapi} label="Vapi" sublabel="Voice AI platform" color="#06b6d4" delay={1.0} />
          </div>
          <HArrow delay={1.15} color="#06b6d4" label="phone call" />
          <div className="relative">
            <StepBadge step={6} delay={1.2} />
            <DiagramNode icon={icons.phone} label="Candidate" sublabel="Live phone screen" color="#8b5cf6" delay={1.2} />
          </div>
          <HArrow delay={1.35} color="#8b5cf6" />
          <div className="relative">
            <StepBadge step={7} delay={1.4} />
            <DiagramNode icon={icons.elevenlabs} label="ElevenLabs" sublabel="Natural TTS voice" color="#f43f5e" delay={1.4} />
          </div>
        </div>

        {/* ── Row 3: Results flow ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 0.3 }}
          className="mb-3"
        >
          <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
            Phase 3 — Analysis & Dashboard
          </span>
        </motion.div>

        <div className="flex items-center justify-center gap-2 rounded-2xl border bg-white/60 backdrop-blur-sm p-8 shadow-sm">
          <div className="relative">
            <StepBadge step={8} delay={1.6} />
            <DiagramNode icon={icons.webhook} label="Vapi Webhook" sublabel="Transcript callback" color="#f97316" delay={1.6} />
          </div>
          <HArrow delay={1.75} color="#f97316" />
          <div className="relative">
            <StepBadge step={9} delay={1.8} />
            <DiagramNode icon={icons.claude} label="Claude AI" sublabel="Analyze transcript" color="#f59e0b" delay={1.8} />
          </div>
          <HArrow delay={1.95} color="#10b981" label="score + analysis" />
          <div className="relative">
            <StepBadge step={10} delay={2.0} />
            <DiagramNode icon={icons.db} label="PostgreSQL" sublabel="Update records" color="#ec4899" delay={2.0} />
          </div>
          <HArrow delay={2.15} color="#8b5cf6" />
          <div className="relative">
            <StepBadge step={11} delay={2.2} />
            <DiagramNode icon={icons.dashboard} label="Dashboard" sublabel="View results" color="#8b5cf6" delay={2.2} />
          </div>
        </div>
      </div>

      {/* ─── MOBILE ─── */}
      <div className="lg:hidden space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
            System Architecture
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">
            How the{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI Pipeline
            </span>{" "}
            Works
          </h2>
        </motion.div>

        {/* Phase 1 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-2"
        >
          Phase 1 — Resume Screening
        </motion.p>
        <MobileStepCard step={1} icon={icons.upload} label="Resume Upload" sublabel="PDF + job description" color="#3b82f6" delay={0.1} />
        <MobileVArrow delay={0.15} />
        <MobileStepCard step={2} icon={icons.django} label="Django API" sublabel="REST endpoint" color="#10b981" delay={0.2} />
        <MobileVArrow delay={0.25} />
        <MobileStepCard step={3} icon={icons.claude} label="Claude AI" sublabel="Parse & score resume" color="#f59e0b" delay={0.3} />
        <MobileVArrow delay={0.35} />
        <MobileStepCard step={4} icon={icons.db} label="PostgreSQL" sublabel="Store candidate data" color="#ec4899" delay={0.4} />

        <div className="py-3" />

        {/* Decision */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="rounded-xl border-2 border-dashed border-violet-300 bg-violet-50/50 p-4 text-center"
        >
          <p className="text-sm font-bold text-violet-800">Decision Gate</p>
          <p className="text-xs text-violet-600 mt-1">Score &gt; 60? Proceed to interview</p>
        </motion.div>

        <div className="py-3" />

        {/* Phase 2 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider mb-2"
        >
          Phase 2 — AI Voice Interview
        </motion.p>
        <MobileStepCard step={5} icon={icons.vapi} label="Vapi" sublabel="Voice AI platform" color="#06b6d4" delay={0.5} />
        <MobileVArrow delay={0.55} />
        <MobileStepCard step={6} icon={icons.phone} label="Candidate" sublabel="Live phone screen" color="#8b5cf6" delay={0.6} />
        <MobileVArrow delay={0.65} />
        <MobileStepCard step={7} icon={icons.elevenlabs} label="ElevenLabs" sublabel="Natural TTS voice" color="#f43f5e" delay={0.7} />

        <div className="py-3" />

        {/* Phase 3 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-2"
        >
          Phase 3 — Analysis & Dashboard
        </motion.p>
        <MobileStepCard step={8} icon={icons.webhook} label="Vapi Webhook" sublabel="Transcript callback" color="#f97316" delay={0.75} />
        <MobileVArrow delay={0.8} />
        <MobileStepCard step={9} icon={icons.claude} label="Claude AI" sublabel="Analyze transcript" color="#f59e0b" delay={0.85} />
        <MobileVArrow delay={0.9} />
        <MobileStepCard step={10} icon={icons.db} label="PostgreSQL" sublabel="Update records" color="#ec4899" delay={0.95} />
        <MobileVArrow delay={1.0} />
        <MobileStepCard step={11} icon={icons.dashboard} label="Dashboard" sublabel="View results" color="#8b5cf6" delay={1.05} />
      </div>
    </div>
  );
}
