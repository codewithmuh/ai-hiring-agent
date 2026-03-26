"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Calendar, Phone, Bell, ArrowRight } from "lucide-react";
import { type ApplicationResult } from "@/lib/api";

interface ApplicationSuccessProps {
  result: ApplicationResult;
}

export default function ApplicationSuccess({ result }: ApplicationSuccessProps) {
  const isScheduled = result.interview_scheduled && result.scheduled_time;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto text-center"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto mb-6"
      >
        <div className={`inline-flex h-20 w-20 items-center justify-center rounded-full ${isScheduled ? "bg-emerald-100" : "bg-blue-100"}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <CheckCircle2 className={`h-10 w-10 ${isScheduled ? "text-emerald-600" : "text-blue-600"}`} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          {isScheduled ? "Interview Scheduled!" : "Application Received!"}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {isScheduled
            ? `Great news, ${result.name}! Your resume scored ${result.resume_score}/100 and you've been selected for an AI voice interview.`
            : `Thank you for applying, ${result.name}. We've reviewed your resume and will be in touch if there's a match for the role.`}
        </p>
      </motion.div>

      {isScheduled && result.scheduled_time && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8 space-y-3"
        >
          {/* Interview time card */}
          <div className="rounded-2xl border bg-gradient-to-br from-violet-50 to-indigo-50 p-6 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">Your Interview</span>
            </div>
            <p className="text-2xl font-extrabold tracking-tight text-foreground">
              {new Date(result.scheduled_time).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-lg font-semibold text-violet-600 mt-1">
              {new Date(result.scheduled_time).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>

          {/* What to expect */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm text-left">
            <h3 className="text-sm font-semibold mb-4">What to Expect</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <Bell className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">30-Minute Reminder</p>
                  <p className="text-xs text-muted-foreground">You&apos;ll get a notification before the call</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                  <Phone className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Voice Call</p>
                  <p className="text-xs text-muted-foreground">Our AI interviewer will call your phone at the scheduled time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">10-Minute Screening</p>
                  <p className="text-xs text-muted-foreground">The call covers your experience, a recent project, role interest, and availability</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
        >
          Back to Home <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
