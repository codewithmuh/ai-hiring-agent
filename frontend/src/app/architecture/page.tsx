"use client";

import { motion } from "framer-motion";
import HiringPipelineDiagram from "@/components/HiringPipelineDiagram";
import TechStack from "@/components/TechStack";
import FeatureCards from "@/components/FeatureCards";

export default function ArchitecturePage() {
  return (
    <div className="space-y-20 pb-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-8 py-16 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-medium text-white/90 mb-6">
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Powered by Claude AI
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              AI Hiring Agent
            </h1>
            <p className="mt-4 text-lg text-violet-200 leading-relaxed">
              An end-to-end AI-powered hiring pipeline that screens resumes, scores candidates,
              conducts automated voice interviews, and displays results in a real-time dashboard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {["Django", "Claude API", "Vapi", "Next.js", "PostgreSQL", "ElevenLabs"].map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
                className="rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-1 text-sm font-medium text-white/80"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pipeline Diagram */}
      <HiringPipelineDiagram />

      {/* Features */}
      <FeatureCards />

      {/* Tech Stack */}
      <TechStack />

      {/* API Endpoints */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 mb-4">
            API Reference
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Backend{" "}
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              API Endpoints
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { method: "POST", path: "/api/candidates/upload/", desc: "Upload resume PDF and screen with AI", color: "#10b981" },
            { method: "POST", path: "/api/candidates/{id}/interview/", desc: "Trigger AI voice interview call", color: "#8b5cf6" },
            { method: "POST", path: "/api/webhooks/vapi/", desc: "Receive interview transcript webhook", color: "#f97316" },
            { method: "GET", path: "/api/candidates/", desc: "List all candidates with filters", color: "#3b82f6" },
            { method: "GET", path: "/api/candidates/{id}/", desc: "Full candidate detail and analysis", color: "#06b6d4" },
            { method: "GET", path: "/api/dashboard/stats/", desc: "Dashboard summary statistics", color: "#ec4899" },
          ].map((ep, i) => (
            <motion.div
              key={ep.path}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="rounded-md px-2 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: ep.color }}
                >
                  {ep.method}
                </span>
                <code className="text-xs text-muted-foreground font-mono truncate">{ep.path}</code>
              </div>
              <p className="text-sm text-muted-foreground">{ep.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-12"
      >
        <p className="text-sm font-semibold text-violet-600 mb-2">codewithmuh</p>
        <h2 className="text-2xl font-extrabold tracking-tight mb-3">Build This Project</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Follow the full tutorial on YouTube to build this AI hiring agent from scratch.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="/"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 transition-all hover:shadow-md"
          >
            View Dashboard
          </a>
          <a
            href="/candidates"
            className="rounded-xl border bg-white px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-gray-50 transition-all"
          >
            Browse Candidates
          </a>
        </div>
      </motion.div>
    </div>
  );
}
