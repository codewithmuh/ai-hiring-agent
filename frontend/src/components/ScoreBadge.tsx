"use client";

import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
  label?: string;
}

function getScoreStyle(score: number) {
  if (score >= 80) return { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/80", text: "text-emerald-700", border: "border-emerald-200", ring: "ring-emerald-500/15", shadow: "shadow-emerald-100" };
  if (score >= 60) return { bg: "bg-gradient-to-br from-blue-50 to-blue-100/80", text: "text-blue-700", border: "border-blue-200", ring: "ring-blue-500/15", shadow: "shadow-blue-100" };
  if (score >= 40) return { bg: "bg-gradient-to-br from-amber-50 to-amber-100/80", text: "text-amber-700", border: "border-amber-200", ring: "ring-amber-500/15", shadow: "shadow-amber-100" };
  return { bg: "bg-gradient-to-br from-red-50 to-red-100/80", text: "text-red-700", border: "border-red-200", ring: "ring-red-500/15", shadow: "shadow-red-100" };
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
    <span className={cn("inline-flex items-center rounded-full border ring-1 shadow-sm", style.bg, style.text, style.border, style.ring, style.shadow, sizeClasses[size])}>
      {label ? <span className="mr-1 font-medium opacity-70">{label}:</span> : null}{score}
    </span>
  );
}
