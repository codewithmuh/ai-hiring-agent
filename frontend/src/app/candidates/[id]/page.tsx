"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, Calendar, FileText, Award, Clock, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCandidate, triggerInterview, type Candidate } from "@/lib/api";
import ScoreBadge from "@/components/ScoreBadge";
import InterviewTranscript from "@/components/InterviewTranscript";

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  new: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" },
  screening: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  interviewing: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  shortlisted: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
};

const avatarColors = [
  "from-violet-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-indigo-400 to-blue-500",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

/* ── Pipeline progress ── */
const pipelineSteps = [
  { key: "new", label: "Applied", icon: FileText },
  { key: "screening", label: "Screened", icon: Sparkles },
  { key: "interviewing", label: "Interview", icon: Phone },
  { key: "shortlisted", label: "Shortlisted", icon: CheckCircle2 },
];

function PipelineProgress({ status }: { status: string }) {
  const stepOrder = ["new", "screening", "interviewing", "shortlisted"];
  const currentIdx = stepOrder.indexOf(status);
  const isRejected = status === "rejected";

  return (
    <div className="flex items-center gap-1">
      {pipelineSteps.map((step, i) => {
        const isCompleted = !isRejected && currentIdx >= i;
        const isCurrent = !isRejected && currentIdx === i;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center gap-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                isCompleted
                  ? "bg-violet-100 text-violet-700"
                  : isRejected && i === 0
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isCurrent && "animate-pulse")} />
              <span className="hidden sm:inline">{step.label}</span>
            </motion.div>
            {i < pipelineSteps.length - 1 && (
              <div className={cn("h-0.5 w-4 rounded-full", isCompleted && currentIdx > i ? "bg-violet-300" : "bg-gray-200")} />
            )}
          </div>
        );
      })}
      {isRejected && (
        <>
          <div className="h-0.5 w-4 rounded-full bg-red-200" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Rejected</span>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ── Score donut ── */
function ScoreDonut({ score, label, delay = 0 }: { score: number; label: string; delay?: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="7" />
          <motion.circle
            cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-extrabold tabular-nums">{score}</span>
        </div>
      </div>
      <span className="mt-1.5 text-xs font-semibold text-muted-foreground">{label}</span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    getCandidate(params.id as string)
      .then(setCandidate)
      .catch(() => setError("Failed to load candidate"))
      .finally(() => setLoading(false));
  }, [params.id]);

  // Poll for updates while interview is in progress
  useEffect(() => {
    if (!candidate || !params.id) return;
    const isLive = candidate.interview_status === "in_progress";
    if (!isLive) return;

    const interval = setInterval(() => {
      getCandidate(params.id as string)
        .then((updated) => {
          setCandidate(updated);
          // Stop polling when interview completes
          if (updated.interview_status !== "in_progress") {
            clearInterval(interval);
          }
        })
        .catch(() => {});
    }, 5000); // poll every 5 seconds

    return () => clearInterval(interval);
  }, [candidate?.interview_status, params.id]);

  async function handleTriggerInterview() {
    if (!candidate) return;
    setInterviewLoading(true);
    try {
      await triggerInterview(candidate.id);
      const updated = await getCandidate(candidate.id);
      setCandidate(updated);
    } catch {
      setError("Failed to trigger interview");
    } finally {
      setInterviewLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 rounded bg-gray-100 animate-pulse" />
        <div className="rounded-2xl border bg-white p-8 shadow-sm animate-pulse">
          <div className="flex gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gray-100" />
            <div className="space-y-3 flex-1">
              <div className="h-7 w-48 rounded bg-gray-100" />
              <div className="h-4 w-72 rounded bg-gray-100" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-gray-100" />
                <div className="h-6 w-24 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
        <div className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 mb-4">
          <XCircle className="h-7 w-7 text-red-400" />
        </div>
        <p className="text-foreground font-medium">{error || "Candidate not found"}</p>
        <button onClick={() => router.push("/candidates")} className="mt-3 text-sm font-medium text-violet-600 hover:text-violet-700">
          Back to candidates
        </button>
      </div>
    );
  }

  const canInterview =
    candidate.resume_score !== null &&
    candidate.resume_score > 60 &&
    (candidate.interview_status === "pending" || candidate.interview_status === "failed" || candidate.interview_status === "scheduled");

  const status = statusConfig[candidate.final_status] || statusConfig.new;

  return (
    <div className="space-y-6">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => router.push("/candidates")}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to candidates
      </motion.button>

      {/* ── Header Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative rounded-2xl border bg-white shadow-sm overflow-hidden"
      >
        {/* Gradient bar */}
        <div className={cn("h-1.5 bg-gradient-to-r",
          candidate.final_status === "shortlisted" ? "from-emerald-400 to-teal-400" :
          candidate.final_status === "rejected" ? "from-red-400 to-orange-400" :
          "from-violet-400 to-indigo-400"
        )} />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Avatar + info */}
            <div className="flex items-start gap-5">
              <div className={cn("flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-bold text-white shadow-lg", getAvatarColor(candidate.name))}>
                {getInitials(candidate.name)}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{candidate.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {candidate.email && (
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {candidate.email}</span>
                  )}
                  {candidate.phone && (
                    <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {candidate.phone}</span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(candidate.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="mt-3">
                  <PipelineProgress status={candidate.final_status} />
                </div>
              </div>
            </div>

            {/* Right: Scores + action */}
            <div className="flex items-center gap-5 shrink-0">
              {candidate.resume_score !== null && (
                <ScoreDonut score={candidate.resume_score} label="Resume" delay={0.1} />
              )}
              {candidate.interview_score !== null && (
                <ScoreDonut score={candidate.interview_score} label="Interview" delay={0.2} />
              )}
              {candidate.overall_score !== null && (
                <ScoreDonut score={candidate.overall_score} label="Overall" delay={0.3} />
              )}
            </div>
          </div>

          {/* Action button */}
          {canInterview && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="mt-6 pt-5 border-t"
            >
              <button
                onClick={handleTriggerInterview}
                disabled={interviewLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-md disabled:opacity-50"
              >
                <Phone className="h-4 w-4" />
                {interviewLoading ? "Scheduling..." : "Start AI Voice Interview"}
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                Candidate scores above 60 — eligible for automated phone screening
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Resume Analysis ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-2xl border bg-white shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <FileText className="h-4.5 w-4.5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Resume Screening</h2>
              <p className="text-xs text-muted-foreground">Analyzed by Claude AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ScoreBadge score={candidate.resume_score} label="Score" />
            {candidate.resume_recommendation && (
              <span
                className={cn("rounded-full border px-3 py-1 text-sm font-semibold capitalize",
                  candidate.resume_recommendation === "interview"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : candidate.resume_recommendation === "maybe"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-red-50 border-red-200 text-red-700"
                )}
              >
                {candidate.resume_recommendation}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {candidate.resume_analysis && "summary" in candidate.resume_analysis && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 bg-gradient-to-r from-violet-50/60 to-indigo-50/40 rounded-xl p-4 border border-violet-100">
              {String(candidate.resume_analysis.summary)}
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {candidate.resume_strengths.length > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-50/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-emerald-700">Strengths</h3>
                </div>
                <ul className="space-y-2.5">
                  {candidate.resume_strengths.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">+</span>
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            {candidate.resume_red_flags.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-50/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <h3 className="text-sm font-semibold text-red-700">Red Flags</h3>
                </div>
                <ul className="space-y-2.5">
                  {candidate.resume_red_flags.map((f, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">!</span>
                      {f}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            {candidate.resume_red_flags.length === 0 && candidate.resume_strengths.length > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-25/30 p-5 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">No Red Flags</p>
                <p className="text-xs text-muted-foreground mt-0.5">Clean resume with no concerns identified</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Interview Section ── */}
      <InterviewTranscript
        transcript={candidate.interview_transcript}
        analysis={candidate.interview_analysis}
        interviewStatus={candidate.interview_status}
      />

      {/* ── Timeline footer ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="flex flex-wrap items-center justify-between rounded-2xl border bg-white px-6 py-4 shadow-sm text-sm"
      >
        <div className="flex items-center gap-5 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Created {new Date(candidate.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Updated {new Date(candidate.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          ID: <code className="font-mono text-[11px]">{candidate.id.slice(0, 8)}...</code>
        </span>
      </motion.div>
    </div>
  );
}
