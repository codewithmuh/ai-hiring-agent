"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { type Candidate } from "@/lib/api";
import ScoreBadge from "./ScoreBadge";

interface CandidateCardProps {
  candidate: Candidate;
}

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

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const status = statusConfig[candidate.final_status] || statusConfig.new;

  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="group block rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-100/50 hover:border-violet-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-sm", getAvatarColor(candidate.name))}>
            {getInitials(candidate.name)}
          </div>
          <div>
            <h3 className="font-semibold group-hover:text-violet-700 transition-colors">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground">{candidate.email || "No email"}</p>
          </div>
        </div>
        <ScoreBadge score={candidate.overall_score} size="lg" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize", status.bg, status.text)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
          {candidate.final_status}
        </span>
        {candidate.resume_recommendation && (
          <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
            candidate.resume_recommendation === "interview" ? "bg-emerald-50 text-emerald-700" :
            candidate.resume_recommendation === "maybe" ? "bg-amber-50 text-amber-700" :
            "bg-red-50 text-red-700"
          )}>
            {candidate.resume_recommendation}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 px-3 py-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Resume</p>
          <div className="mt-1">
            <ScoreBadge score={candidate.resume_score} size="sm" />
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Interview</p>
          <div className="mt-1">
            <ScoreBadge score={candidate.interview_score} size="sm" />
          </div>
        </div>
      </div>

      {candidate.resume_strengths.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {candidate.resume_strengths.slice(0, 2).map((s, i) => (
            <span key={i} className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 leading-relaxed line-clamp-1">
              {s.length > 40 ? s.slice(0, 40) + "..." : s}
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Applied {new Date(candidate.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </Link>
  );
}
