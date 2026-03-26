"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Mic, CheckCircle } from "lucide-react";
import { getDashboardStats, type DashboardStats } from "@/lib/api";

const cards = [
  { label: "Total Candidates", key: "total_candidates" as const, Icon: Users, iconColor: "text-violet-600", iconBg: "bg-violet-50" },
  { label: "Average Score", key: "avg_score" as const, Icon: TrendingUp, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
  { label: "Interviewed", key: "interviewed_count" as const, Icon: Mic, iconColor: "text-amber-600", iconBg: "bg-amber-50" },
  { label: "Shortlisted", key: "shortlisted_count" as const, Icon: CheckCircle, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
];

export default function StatsOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const value = stats ? (card.key === "avg_score" ? Math.round(stats[card.key]) : stats[card.key]) : 0;
        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}>
                <card.Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-100" />
              ) : (
                <p className="text-3xl font-extrabold tracking-tight">{value}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
