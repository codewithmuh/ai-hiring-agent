"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Candidate } from "@/lib/api";
import ScoreBadge from "./ScoreBadge";

interface CandidateTableProps {
  candidates: Candidate[];
  loading?: boolean;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  new: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" },
  screening: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  interviewing: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  shortlisted: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const avatarColors = [
  "from-violet-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-indigo-400 to-blue-500",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function CandidateTable({ candidates, loading }: CandidateTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="divide-y">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-48 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 mb-4">
            <svg className="h-7 w-7 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">No candidates yet</p>
          <p className="text-sm text-muted-foreground mt-1">Upload a resume to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50/80">
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Candidate</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resume</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interview</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overall</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Applied</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {candidates.map((candidate) => {
              const status = statusConfig[candidate.final_status] || statusConfig.new;
              return (
                <tr key={candidate.id} className="group transition-all duration-200 hover:bg-violet-50/40 hover:shadow-sm">
                  <td className="px-6 py-4">
                    <Link href={`/candidates/${candidate.id}`} className="flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white shadow-sm", getAvatarColor(candidate.name))}>
                        {getInitials(candidate.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-violet-700 transition-colors">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{candidate.email || "No email"}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ScoreBadge score={candidate.resume_score} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ScoreBadge score={candidate.interview_score} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ScoreBadge score={candidate.overall_score} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", status.bg, status.text)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                      {candidate.final_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                    {new Date(candidate.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="pr-4">
                    <Link href={`/candidates/${candidate.id}`}>
                      <ChevronRight className="h-4 w-4 text-gray-300 transition-all duration-200 group-hover:text-violet-500 group-hover:translate-x-0.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
