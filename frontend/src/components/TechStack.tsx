"use client";

import { motion } from "framer-motion";

const stack = [
  {
    category: "Backend",
    color: "#10b981",
    items: [
      { name: "Django", desc: "REST API framework" },
      { name: "Django REST Framework", desc: "API serialization" },
      { name: "PostgreSQL", desc: "Primary database" },
    ],
  },
  {
    category: "AI & Voice",
    color: "#f59e0b",
    items: [
      { name: "Claude API", desc: "Resume parsing & scoring" },
      { name: "Vapi", desc: "Voice call infrastructure" },
      { name: "ElevenLabs", desc: "Text-to-speech voice" },
    ],
  },
  {
    category: "Frontend",
    color: "#8b5cf6",
    items: [
      { name: "Next.js 16", desc: "React framework" },
      { name: "Tailwind CSS", desc: "Utility-first styling" },
      { name: "Framer Motion", desc: "Animations" },
    ],
  },
  {
    category: "Infrastructure",
    color: "#3b82f6",
    items: [
      { name: "Docker Compose", desc: "Container orchestration" },
      { name: "Ngrok", desc: "Webhook tunneling" },
      { name: "TypeScript", desc: "Type safety" },
    ],
  },
];

export default function TechStack() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 mb-4">
          Tech Stack
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight">
          Built With{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Modern Tools
          </span>
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: gi * 0.1, duration: 0.45 }}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: group.color }}>
                {group.category}
              </h3>
            </div>
            <div className="space-y-3">
              {group.items.map((item, ii) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.1 + ii * 0.08, duration: 0.35 }}
                >
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
