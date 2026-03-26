import { MOCK_CANDIDATES, MOCK_STATS, MOCK_AVAILABLE_SLOTS, MOCK_JOBS } from "./mock-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  job_type: "full_time" | "part_time" | "contract" | "internship";
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  status: "open" | "closed" | "paused";
  candidate_count: number;
  created_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  resume_file: string | null;
  job: string | null;
  job_title?: string | null;
  job_description: string | null;
  resume_score: number | null;
  resume_strengths: string[];
  resume_red_flags: string[];
  resume_recommendation: "interview" | "maybe" | "reject" | null;
  resume_analysis: Record<string, unknown> | null;
  interview_status: "pending" | "scheduled" | "in_progress" | "completed" | "failed";
  vapi_call_id: string | null;
  interview_transcript: string | null;
  interview_score: number | null;
  interview_analysis: {
    communication_score?: number;
    technical_score?: number;
    enthusiasm_score?: number;
    experience_score?: number;
    highlights?: string[];
    concerns?: string[];
    recommendation?: string;
    summary?: string;
  } | null;
  overall_score: number | null;
  final_status: "new" | "screening" | "interviewing" | "shortlisted" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_candidates: number;
  avg_score: number;
  interviewed_count: number;
  shortlisted_count: number;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/* ── Jobs ── */

export async function getJobs(): Promise<Job[]> {
  try {
    return await apiFetch<Job[]>("/api/jobs/");
  } catch {
    return MOCK_JOBS;
  }
}

export async function getJob(id: string): Promise<Job> {
  try {
    return await apiFetch<Job>(`/api/jobs/${id}/`);
  } catch {
    const job = MOCK_JOBS.find((j) => j.id === id);
    if (!job) throw new Error("Job not found");
    return job;
  }
}

/* ── Candidates ── */

export async function getCandidates(params?: {
  status?: string;
  min_score?: number;
  max_score?: number;
}): Promise<Candidate[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.min_score) searchParams.set("min_score", String(params.min_score));
    if (params?.max_score) searchParams.set("max_score", String(params.max_score));
    const query = searchParams.toString();
    return await apiFetch<Candidate[]>(`/api/candidates/${query ? `?${query}` : ""}`);
  } catch {
    let candidates = [...MOCK_CANDIDATES];
    if (params?.status) {
      candidates = candidates.filter((c) => c.final_status === params.status);
    }
    return candidates;
  }
}

export async function getCandidate(id: string): Promise<Candidate> {
  try {
    return await apiFetch<Candidate>(`/api/candidates/${id}/`);
  } catch {
    const candidate = MOCK_CANDIDATES.find((c) => c.id === id);
    if (!candidate) throw new Error("Candidate not found");
    return candidate;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    return await apiFetch<DashboardStats>("/api/dashboard/stats/");
  } catch {
    return MOCK_STATS;
  }
}

export async function uploadResume(file: File, jobDescription: string): Promise<Candidate> {
  const formData = new FormData();
  formData.append("resume_file", file);
  formData.append("job_description", jobDescription);
  return apiFetch<Candidate>("/api/candidates/upload/", {
    method: "POST",
    body: formData,
  });
}

export async function triggerInterview(candidateId: string): Promise<{ call_id: string; status: string }> {
  return apiFetch(`/api/candidates/${candidateId}/interview/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}

/* ── Interview Scheduling ── */

export interface InterviewSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export interface ApplicationResult {
  candidate_id: string;
  name: string;
  resume_score: number;
  resume_recommendation: string;
  interview_scheduled: boolean;
  scheduled_time: string | null;
}

export async function getAvailableSlots(date?: string): Promise<InterviewSlot[]> {
  try {
    const query = date ? `?date=${date}` : "";
    return await apiFetch<InterviewSlot[]>(`/api/slots/available/${query}`);
  } catch {
    let slots = MOCK_AVAILABLE_SLOTS.filter((s) => !s.is_booked);
    if (date) {
      slots = slots.filter((s) => s.start_time.startsWith(date));
    }
    return slots;
  }
}

export async function submitApplication(formData: FormData): Promise<ApplicationResult> {
  try {
    return await apiFetch<ApplicationResult>("/api/apply/", {
      method: "POST",
      body: formData,
    });
  } catch {
    await new Promise((r) => setTimeout(r, 2000));
    const score = Math.floor(Math.random() * 50) + 45;
    const name = formData.get("name") as string;
    const recommendation = score >= 60 ? "interview" : score >= 40 ? "maybe" : "reject";
    const slotId = formData.get("selected_slot_id") as string;
    const slot = MOCK_AVAILABLE_SLOTS.find((s) => s.id === slotId);

    return {
      candidate_id: crypto.randomUUID(),
      name,
      resume_score: score,
      resume_recommendation: recommendation,
      interview_scheduled: score >= 60 && !!slot,
      scheduled_time: score >= 60 && slot ? slot.start_time : null,
    };
  }
}
