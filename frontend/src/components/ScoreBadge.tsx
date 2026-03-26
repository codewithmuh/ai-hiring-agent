"use client";

import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
  label?: string;
}

function getScoreStyle(score: number) {
  if (score >= 80) return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", ring: "ring-emerald-500/10" };
  if (score >= 60) return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", ring: "ring-blue-500/10" };
  if (score >= 40) return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", ring: "ring-amber-500/10" };
  return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", ring: "ring-red-500/10" };
}

const sizeClasses = {
  sm: "text-xs px-2 py-0.5 font-medium",
  md: "text-sm px-2.5 py-1 font-semibold",
  lg: "text-lg px-3.5 py-1.5 font-bold",
};

export default function ScoreBadge({ score, size = "md", label }: ScoreBadgeProps) {
  if (score === null || score === undefined) {
    return (
      <span className={cn("inline-flex items-center rounded-full border bg-gray-50 text-gray-400 ring-1 ring-gray-500/5", sizeClasses[size])}>
        {label ? `${label}: ` : ""}--
      </span>
    );
  }

  const style = getScoreStyle(score);

  return (
    <span className={cn("inline-flex items-center rounded-full border ring-1", style.bg, style.text, style.border, style.ring, sizeClasses[size])}>
      {label ? <span className="mr-1 font-medium opacity-70">{label}:</span> : null}{score}
    </span>
  );
}
