"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { getCandidates, type Candidate } from "@/lib/api";
import CandidateTable from "@/components/CandidateTable";
import CandidateCard from "@/components/CandidateCard";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "screening", label: "Screening" },
  { value: "interviewing", label: "Interviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
] as const;

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = statusFilter !== "all" ? { status: statusFilter } : undefined;
    getCandidates(params)
      .then(setCandidates)
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const filtered = search
    ? candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase())
      )
    : candidates;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Candidates</h1>
        <p className="text-muted-foreground mt-1">
          {filtered.length} candidate{filtered.length !== 1 ? "s" : ""}{" "}
          {statusFilter !== "all" ? `with status "${statusFilter}"` : "total"}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap ${
                statusFilter === status.value
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-white text-muted-foreground border hover:bg-gray-50 hover:text-foreground"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border bg-white pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all sm:w-64"
            />
          </div>
          <div className="flex rounded-lg border bg-white p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === "table" ? "bg-violet-100 text-violet-700" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === "grid" ? "bg-violet-100 text-violet-700" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <CandidateTable candidates={filtered} loading={loading} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-gray-100" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-36 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center py-16 text-muted-foreground">
              <p className="font-medium">No candidates found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filtered.map((c) => <CandidateCard key={c.id} candidate={c} />)
          )}
        </div>
      )}
    </div>
  );
}
