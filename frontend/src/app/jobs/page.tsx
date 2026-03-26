"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Users, Briefcase, ArrowRight, Sparkles, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getJobs, type Job } from "@/lib/api";

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

function formatSalary(min: number | null, max: number | null, jobType: string) {
  if (!min && !max) return null;
  const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}/hr`);
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const departments = ["all", ...Array.from(new Set(jobs.map((j) => j.department)))];

  const filtered = jobs.filter((j) => {
    const matchSearch =
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    const matchDept = departmentFilter === "all" || j.department === departmentFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-8 py-16 text-white shadow-xl text-center"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-violet-300" />
            <span className="text-sm font-medium text-violet-200">AI-Powered Hiring</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Join Our Team
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4 text-lg text-violet-200 max-w-lg mx-auto">
            Apply in under 2 minutes. Our AI screens your resume instantly and schedules a voice interview at your preferred time.
          </motion.p>

          {/* How it works */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            {["Upload Resume", "AI Screening", "Voice Interview", "Get Results"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">{i + 1}</span>
                <span className="text-violet-100">{step}</span>
                {i < 3 && <ArrowRight className="h-3.5 w-3.5 text-violet-300 hidden sm:block" />}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap",
                departmentFilter === dept
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-white text-muted-foreground border hover:bg-gray-50"
              )}
            >
              {dept === "all" ? "All Roles" : dept}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search positions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border bg-white pl-10 pr-4 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 sm:w-72"
          />
        </div>
      </motion.div>

      {/* Job count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} open position{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Job Cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm animate-pulse">
              <div className="h-5 w-48 rounded bg-gray-100 mb-3" />
              <div className="h-4 w-32 rounded bg-gray-100 mb-4" />
              <div className="space-y-2">
                <div className="h-3 w-40 rounded bg-gray-100" />
                <div className="h-3 w-36 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-muted-foreground">
          <Briefcase className="h-12 w-12 text-gray-200 mb-4" />
          <p className="font-medium">No positions found</p>
          <p className="text-sm mt-1">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <Link
                href={`/jobs/${job.id}/apply`}
                className="group block rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-violet-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-semibold group-hover:text-violet-700 transition-colors">{job.title}</h2>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    {JOB_TYPE_LABELS[job.job_type] || job.job_type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" /> {job.location}
                  </div>
                  {formatSalary(job.salary_min, job.salary_max, job.job_type) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-3.5 w-3.5 shrink-0" /> {formatSalary(job.salary_min, job.salary_max, job.job_type)}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5 shrink-0" /> {job.candidate_count} applicant{job.candidate_count !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Posted {new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-violet-600 group-hover:text-violet-700 transition-colors">
                    Apply <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
