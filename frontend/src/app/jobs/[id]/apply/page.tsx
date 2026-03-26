"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileCheck, User, Calendar, Send, ChevronLeft, ChevronRight, Sparkles, AlertCircle, Briefcase, MapPin, DollarSign, Clock, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getJob, submitApplication, type Job, type InterviewSlot, type ApplicationResult } from "@/lib/api";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import ApplicationSuccess from "@/components/ApplicationSuccess";

const STEPS = [
  { label: "Your Info", icon: User },
  { label: "Schedule", icon: Calendar },
  { label: "Review", icon: Send },
];

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return null;
  const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}/hr`);
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

/* ── Job sidebar ── */
function JobSidebar({ job }: { job: Job }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
            <Briefcase className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold">{job.title}</h3>
            <p className="text-xs text-muted-foreground">{job.department}</p>
          </div>
        </div>

        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" /> {job.location}
          </div>
          {formatSalary(job.salary_min, job.salary_max) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 shrink-0" /> {formatSalary(job.salary_min, job.salary_max)}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" /> {JOB_TYPE_LABELS[job.job_type] || job.job_type}
          </div>
        </div>

        {job.responsibilities.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">What you&apos;ll do</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-violet-400 shrink-0" />{r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold mb-2">Requirements</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {job.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-400 shrink-0" />{r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.nice_to_have && job.nice_to_have.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold mb-2">Nice to have</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {job.nice_to_have.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-400 shrink-0" />{r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">How It Works</h3>
        <div className="space-y-4">
          {[
            { step: "1", title: "Submit Application", desc: "Upload your resume and fill in details" },
            { step: "2", title: "AI Screening", desc: "Claude AI analyzes your resume in seconds" },
            { step: "3", title: "Voice Interview", desc: "AI calls you at your scheduled time" },
            { step: "4", title: "Results", desc: "Get your score and recommendation" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════ */
export default function JobApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [jobLoading, setJobLoading] = useState(true);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getJob(jobId)
      .then(setJob)
      .catch(() => setJob(null))
      .finally(() => setJobLoading(false));
  }, [jobId]);

  const canGoNext =
    step === 0 ? !!(name && email && phone && file) :
    step === 1 ? !!selectedSlot :
    true;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || !selectedSlot) return;

    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("resume_file", file);
      formData.append("job_id", jobId);
      formData.append("selected_slot_id", selectedSlot.id);

      const res = await submitApplication(formData);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  }

  if (jobLoading) {
    return (
      <div className="grid gap-8 lg:grid-cols-5 animate-pulse">
        <div className="lg:col-span-3 space-y-4">
          <div className="h-8 w-64 rounded bg-gray-100" />
          <div className="h-96 rounded-2xl bg-gray-100" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-foreground font-medium">Job not found</p>
        <button onClick={() => router.push("/jobs")} className="mt-3 text-sm text-violet-600 hover:text-violet-700">
          Browse all positions
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="py-8">
        <ApplicationSuccess result={result} />
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="mb-6">
          <Sparkles className="h-12 w-12 text-violet-500" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold tracking-tight text-center">Analyzing Your Resume</h2>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Our AI is reviewing your qualifications for <strong>{job.title}</strong>...
          </p>
        </motion.div>
        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5, ease: "easeInOut" }} className="mt-8 h-1.5 max-w-xs rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => router.push("/jobs")} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to all positions
      </button>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Apply for {job.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{job.department} &middot; {job.location}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form — 3/5 */}
        <div className="lg:col-span-3 space-y-6">
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === i;
              const isDone = step > i;
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: isActive ? 1 : 0.95, opacity: isActive || isDone ? 1 : 0.5 }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                      isActive ? "bg-violet-600 text-white" : isDone ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {isDone ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">{s.label}</span>
                  </motion.div>
                  {i < STEPS.length - 1 && <div className={cn("h-0.5 w-6 rounded-full", step > i ? "bg-violet-400" : "bg-gray-200")} />}
                </div>
              );
            })}
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="p-6 sm:p-8 space-y-5">
                    <div>
                      <h2 className="text-lg font-semibold">Personal Information</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">Tell us about yourself</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Email *</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Phone Number *</label>
                      <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all" />
                      <p className="text-xs text-muted-foreground mt-1">We&apos;ll call this number for the AI interview</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Resume (PDF) *</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn("group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all", file ? "border-emerald-300 bg-emerald-50/50" : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/30")}
                      >
                        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
                        {file ? (
                          <>
                            <FileCheck className="h-8 w-8 text-emerald-500 mb-2" />
                            <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mb-2 group-hover:text-violet-500 transition-colors" />
                            <p className="text-sm font-medium">Drop PDF here or click to browse</p>
                            <p className="text-xs text-muted-foreground mt-1">PDF only, max 10MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="p-6 sm:p-8 space-y-5">
                    <div>
                      <h2 className="text-lg font-semibold">Schedule Your Interview</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">Pick a 30-minute slot that works for you</p>
                    </div>
                    <TimeSlotPicker selected={selectedSlot} onSelect={setSelectedSlot} />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="p-6 sm:p-8 space-y-5">
                    <div>
                      <h2 className="text-lg font-semibold">Review Your Application</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">Make sure everything looks right</p>
                    </div>
                    <div className="space-y-3">
                      <ReviewRow label="Position" value={job.title} highlight />
                      <ReviewRow label="Name" value={name} />
                      <ReviewRow label="Email" value={email} />
                      <ReviewRow label="Phone" value={phone} />
                      <ReviewRow label="Resume" value={file?.name || ""} />
                      <ReviewRow label="Interview Time" value={selectedSlot ? `${new Date(selectedSlot.start_time).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${new Date(selectedSlot.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}` : ""} highlight />
                    </div>
                    <div className="rounded-xl bg-violet-50 border border-violet-100 p-4">
                      <p className="text-xs text-violet-700 leading-relaxed">
                        <strong>What happens next:</strong> Our AI will screen your resume against the {job.title} requirements. If you&apos;re a match (score above 60), your interview will be confirmed. You&apos;ll receive a reminder 30 minutes before.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="px-6 pb-4">
                  <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between border-t px-6 py-4">
                <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                {step < 2 ? (
                  <button type="button" onClick={() => setStep((s) => Math.min(2, s + 1))} disabled={!canGoNext} className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={!canGoNext} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 hover:shadow-md disabled:opacity-50">
                    <Send className="h-4 w-4" /> Submit Application
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar — 2/5 */}
        <div className="lg:col-span-2">
          <JobSidebar job={job} />
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", highlight ? "text-violet-700" : "text-foreground")}>{value}</span>
    </div>
  );
}
