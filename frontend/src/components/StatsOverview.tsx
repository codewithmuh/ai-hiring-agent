"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Mic, CheckCircle } from "lucide-react";
import { getDashboardStats, type DashboardStats } from "@/lib/api";

const cards = [
  { label: "Total Candidates", key: "total_candidates" as const, Icon: Users, gradient: "from-violet-500/10 to-violet-500/5", iconColor: "text-violet-600", iconBg: "bg-violet-100", accent: "bg-violet-500" },
  { label: "Average Score", key: "avg_score" as const, Icon: TrendingUp, gradient: "from-blue-500/10 to-blue-500/5", iconColor: "text-blue-600", iconBg: "bg-blue-100", accent: "bg-blue-500" },
  { label: "Interviewed", key: "interviewed_count" as const, Icon: Mic, gradient: "from-amber-500/10 to-amber-500/5", iconColor: "text-amber-600", iconBg: "bg-amber-100", accent: "bg-amber-500" },
  { label: "Shortlisted", key: "shortlisted_count" as const, Icon: CheckCircle, gradient: "from-emerald-500/10 to-emerald-500/5", iconColor: "text-emerald-600", iconBg: "bg-emerald-100", accent: "bg-emerald-500" },
];

function AnimatedNumber({ target, duration = 1 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || target === 0) { setCount(target); return; }
    hasAnimated.current = true;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = (now - start) / (duration * 1000);
      if (elapsed >= 1) { setCount(target); return; }
      setCount(Math.round(target * elapsed));
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

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
      {cards.map((card, i) => {
        const value = stats ? (card.key === "avg_score" ? Math.round(stats[card.key]) : stats[card.key]) : 0;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.gradient} p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
          >
            {/* Accent line */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${card.accent}`} />

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">{card.label}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} shadow-sm transition-transform group-hover:scale-110`}>
                <card.Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-100" />
              ) : (
                <p className="text-4xl font-extrabold tracking-tight">
                  <AnimatedNumber target={value} />
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
