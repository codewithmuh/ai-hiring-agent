"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getCandidates, type Candidate } from "@/lib/api";
import StatsOverview from "@/components/StatsOverview";
import CandidateTable from "@/components/CandidateTable";
import ResumeUpload from "@/components/ResumeUpload";

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCandidates()
      .then(setCandidates)
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Candidate screening pipeline overview</p>
        </div>
        <Link
          href="/architecture"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
        >
          View Architecture <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <StatsOverview />
      </motion.div>

      {/* Two-column: Candidates + Upload sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Candidates — takes 2/3 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent Candidates</h2>
            <Link href="/candidates" className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <CandidateTable candidates={candidates.slice(0, 6)} loading={loading} />
        </motion.div>

        {/* Upload sidebar — takes 1/3 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
        >
          <ResumeUpload
            onUploadComplete={(candidate) => {
              setCandidates((prev) => [candidate, ...prev]);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
