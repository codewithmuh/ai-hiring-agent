import { type Candidate, type DashboardStats, type Job } from "./api";

export const MOCK_JOBS: Job[] = [
  {
    id: "job-001-senior-fullstack",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (US timezone preferred)",
    job_type: "full_time",
    salary_min: 150000,
    salary_max: 200000,
    description: "We're looking for a Senior Full-Stack Engineer to build and maintain features across our React/Next.js frontend and Python/Django backend.",
    responsibilities: [
      "Build and maintain full-stack features with React and Python",
      "Design scalable APIs and database schemas",
      "Collaborate with product and design teams",
      "Mentor junior engineers and drive best practices",
      "Lead code reviews and architectural discussions",
    ],
    requirements: [
      "5+ years of full-stack development experience",
      "Strong proficiency in React/Next.js and Python/Django",
      "Experience with PostgreSQL and REST APIs",
      "Good understanding of system design principles",
    ],
    nice_to_have: [
      "Experience with AI/ML integrations",
      "Open source contributions",
      "Previous startup experience",
    ],
    status: "open",
    candidate_count: 4,
    created_at: "2026-03-10T09:00:00Z",
  },
  {
    id: "job-002-ml-engineer",
    title: "Machine Learning Engineer",
    department: "AI/ML",
    location: "San Francisco, CA (Hybrid)",
    job_type: "full_time",
    salary_min: 170000,
    salary_max: 230000,
    description: "Join our AI team to build and deploy production ML models. You'll work on NLP, recommendation systems, and real-time inference pipelines.",
    responsibilities: [
      "Design and train ML models for NLP and recommendation tasks",
      "Build production inference pipelines with low latency",
      "Collaborate with data engineers on feature stores",
      "Run A/B experiments and analyze model performance",
      "Stay current with research and prototype new approaches",
    ],
    requirements: [
      "3+ years of ML engineering experience in production",
      "Strong Python skills (PyTorch or TensorFlow)",
      "Experience with NLP models and transformer architectures",
      "Familiarity with ML infrastructure (MLflow, Kubeflow, etc.)",
    ],
    nice_to_have: [
      "Published ML research papers",
      "Experience with LLM fine-tuning",
      "Familiarity with Claude/Anthropic APIs",
    ],
    status: "open",
    candidate_count: 2,
    created_at: "2026-03-12T10:00:00Z",
  },
  {
    id: "job-003-product-designer",
    title: "Product Designer",
    department: "Design",
    location: "Remote (Worldwide)",
    job_type: "full_time",
    salary_min: 120000,
    salary_max: 160000,
    description: "We need a Product Designer to own the end-to-end design of our hiring platform.",
    responsibilities: [
      "Own product design from research to pixel-perfect handoff",
      "Conduct user research and usability testing",
      "Create wireframes, prototypes, and design systems",
      "Collaborate with engineering on implementation feasibility",
      "Define and track design metrics",
    ],
    requirements: [
      "4+ years of product design experience",
      "Strong Figma skills and prototyping ability",
      "Experience designing B2B SaaS products",
      "Portfolio demonstrating end-to-end design thinking",
    ],
    nice_to_have: [
      "Experience with AI-powered products",
      "Motion design skills",
      "Basic frontend development knowledge",
    ],
    status: "open",
    candidate_count: 1,
    created_at: "2026-03-15T08:00:00Z",
  },
  {
    id: "job-004-devops",
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "New York, NY (On-site)",
    job_type: "full_time",
    salary_min: 140000,
    salary_max: 180000,
    description: "We're looking for a DevOps Engineer to build and maintain our cloud infrastructure.",
    responsibilities: [
      "Build and maintain CI/CD pipelines",
      "Manage Kubernetes clusters on AWS/GCP",
      "Implement infrastructure as code with Terraform",
      "Monitor system health and respond to incidents",
      "Optimize cloud costs and resource utilization",
    ],
    requirements: [
      "3+ years of DevOps/SRE experience",
      "Strong Kubernetes and Docker skills",
      "Experience with AWS or GCP",
      "Proficiency in Terraform or Pulumi",
    ],
    nice_to_have: [
      "Experience with GitOps (ArgoCD, Flux)",
      "Observability stack experience (Datadog, Grafana)",
    ],
    status: "open",
    candidate_count: 1,
    created_at: "2026-03-18T11:00:00Z",
  },
  {
    id: "job-005-frontend-contract",
    title: "Frontend Developer (React)",
    department: "Engineering",
    location: "Remote (US/EU timezones)",
    job_type: "contract",
    salary_min: 80,
    salary_max: 120,
    description: "6-month contract for a skilled React developer to rebuild our dashboard UI.",
    responsibilities: [
      "Build responsive UI components with React and Next.js",
      "Implement designs from Figma with pixel-perfect accuracy",
      "Write unit and integration tests",
      "Optimize performance and accessibility",
    ],
    requirements: [
      "3+ years of React/Next.js experience",
      "Strong TypeScript and Tailwind CSS skills",
      "Eye for design and attention to detail",
      "Experience with component libraries (shadcn/ui, Radix)",
    ],
    nice_to_have: [
      "Experience with Framer Motion animations",
      "Storybook experience",
    ],
    status: "open",
    candidate_count: 2,
    created_at: "2026-03-20T09:00:00Z",
  },
];

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Sarah Chen", email: "sarah.chen@email.com", phone: "+1 (415) 555-0142",
    resume_file: null, job: "job-001-senior-fullstack", job_title: "Senior Full-Stack Engineer",
    job_description: "Senior Full-Stack Engineer",
    resume_score: 92,
    resume_strengths: ["8+ years full-stack with React and Python", "Led monolith to microservices migration", "Strong system design skills", "Open source contributor"],
    resume_red_flags: [], resume_recommendation: "interview",
    resume_analysis: { summary: "Exceptional full-stack candidate. Highly recommended.", score: 92 },
    interview_status: "completed", vapi_call_id: "call_abc123",
    interview_transcript: "AI: Hi Sarah, tell me about distributed systems experience.\n\nSarah: I led migration of our monolith to microservices serving 2M DAU...\n\nAI: Describe a challenging project?\n\nSarah: Building a real-time analytics pipeline processing 500K events/sec...",
    interview_score: 88,
    interview_analysis: { communication_score: 23, technical_score: 24, enthusiasm_score: 21, experience_score: 20, highlights: ["Clear technical articulation", "Deep system design understanding"], concerns: [], recommendation: "strong_yes", summary: "Outstanding interview performance." },
    overall_score: 90, final_status: "shortlisted",
    created_at: "2026-03-20T09:15:00Z", updated_at: "2026-03-22T14:30:00Z",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    name: "Marcus Johnson", email: "marcus.j@outlook.com", phone: "+1 (212) 555-0198",
    resume_file: null, job: "job-001-senior-fullstack", job_title: "Senior Full-Stack Engineer",
    job_description: "Senior Full-Stack Engineer",
    resume_score: 78,
    resume_strengths: ["5 years backend with Django/FastAPI", "Strong DB optimization", "AWS certified"],
    resume_red_flags: ["Limited frontend experience"], resume_recommendation: "interview",
    resume_analysis: { summary: "Strong backend engineer. Frontend lighter but willing to learn.", score: 78 },
    interview_status: "completed", vapi_call_id: "call_def456",
    interview_transcript: "AI: Tell me about your backend experience.\n\nMarcus: I've been building APIs for 5 years. Recently designed a payment processing system...",
    interview_score: 72,
    interview_analysis: { communication_score: 19, technical_score: 20, enthusiasm_score: 17, experience_score: 16, highlights: ["Strong backend knowledge", "Good DB optimization"], concerns: ["Frontend skills need growth"], recommendation: "yes", summary: "Solid foundation with room to grow." },
    overall_score: 75, final_status: "interviewing",
    created_at: "2026-03-19T11:30:00Z", updated_at: "2026-03-21T16:45:00Z",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    name: "Priya Patel", email: "priya.patel@gmail.com", phone: "+1 (650) 555-0167",
    resume_file: null, job: "job-001-senior-fullstack", job_title: "Senior Full-Stack Engineer",
    job_description: "Senior Full-Stack Engineer",
    resume_score: 85,
    resume_strengths: ["7 years TypeScript/Node.js", "Built SaaS 0-100K users", "Strong DevOps", "Tech blog 50K readers"],
    resume_red_flags: [], resume_recommendation: "interview",
    resume_analysis: { summary: "Impressive profile with entrepreneurial mindset.", score: 85 },
    interview_status: "scheduled", vapi_call_id: null, interview_transcript: null, interview_score: null, interview_analysis: null,
    overall_score: 85, final_status: "screening",
    created_at: "2026-03-21T14:20:00Z", updated_at: "2026-03-21T14:20:00Z",
  },
  {
    id: "d4e5f6a7-b8c9-0123-defa-234567890123",
    name: "James O'Brien", email: "james.obrien@proton.me", phone: "+1 (312) 555-0134",
    resume_file: null, job: "job-001-senior-fullstack", job_title: "Senior Full-Stack Engineer",
    job_description: "Senior Full-Stack Engineer",
    resume_score: 45,
    resume_strengths: ["2 years web dev", "Multiple bootcamp projects"],
    resume_red_flags: ["Limited experience for senior role", "No system design experience"],
    resume_recommendation: "maybe",
    resume_analysis: { summary: "Junior applying for senior role. Better for mid-level.", score: 45 },
    interview_status: "pending", vapi_call_id: null, interview_transcript: null, interview_score: null, interview_analysis: null,
    overall_score: 45, final_status: "new",
    created_at: "2026-03-22T08:00:00Z", updated_at: "2026-03-22T08:00:00Z",
  },
  {
    id: "e5f6a7b8-c9d0-1234-efab-345678901234",
    name: "Emily Zhang", email: "emily.z@company.io", phone: "+1 (628) 555-0189",
    resume_file: null, job: "job-002-ml-engineer", job_title: "Machine Learning Engineer",
    job_description: "Machine Learning Engineer",
    resume_score: 88,
    resume_strengths: ["PhD ML from Stanford", "3 years Google Brain", "12 top-conference papers", "Transformer architecture expert"],
    resume_red_flags: [], resume_recommendation: "interview",
    resume_analysis: { summary: "Top-tier ML candidate with research and production experience.", score: 88 },
    interview_status: "in_progress", vapi_call_id: "call_ghi789", interview_transcript: null, interview_score: null, interview_analysis: null,
    overall_score: 88, final_status: "interviewing",
    created_at: "2026-03-18T10:45:00Z", updated_at: "2026-03-23T09:00:00Z",
  },
  {
    id: "f6a7b8c9-d0e1-2345-fabc-456789012345",
    name: "David Kim", email: "david.kim@tech.dev", phone: "+1 (408) 555-0156",
    resume_file: null, job: "job-002-ml-engineer", job_title: "Machine Learning Engineer",
    job_description: "Machine Learning Engineer",
    resume_score: 34,
    resume_strengths: ["Enthusiastic about AI"],
    resume_red_flags: ["Resume mostly retail management", "No ML experience", "Online courses only"],
    resume_recommendation: "reject",
    resume_analysis: { summary: "Career changer. Gap too large for this role.", score: 34 },
    interview_status: "pending", vapi_call_id: null, interview_transcript: null, interview_score: null, interview_analysis: null,
    overall_score: 34, final_status: "rejected",
    created_at: "2026-03-23T07:30:00Z", updated_at: "2026-03-23T08:15:00Z",
  },
  {
    id: "a7b8c9d0-e1f2-3456-abcd-567890123456",
    name: "Ana Rodriguez", email: "ana.r@devmail.com", phone: "+1 (305) 555-0172",
    resume_file: null, job: "job-003-product-designer", job_title: "Product Designer",
    job_description: "Product Designer",
    resume_score: 71,
    resume_strengths: ["4 years product design", "Strong Figma skills", "Healthcare UX expertise"],
    resume_red_flags: ["Limited B2B SaaS experience"], resume_recommendation: "interview",
    resume_analysis: { summary: "Solid designer with valuable domain expertise.", score: 71 },
    interview_status: "completed", vapi_call_id: "call_jkl012",
    interview_transcript: "AI: Walk me through your design process.\n\nAna: I always start with user research. At my last healthcare startup...",
    interview_score: 68,
    interview_analysis: { communication_score: 18, technical_score: 17, enthusiasm_score: 16, experience_score: 17, highlights: ["Strong design process", "Quality testing focus"], concerns: ["B2B SaaS experience limited"], recommendation: "maybe", summary: "Competent designer with domain expertise." },
    overall_score: 70, final_status: "interviewing",
    created_at: "2026-03-17T13:00:00Z", updated_at: "2026-03-20T11:30:00Z",
  },
  {
    id: "b8c9d0e1-f2a3-4567-bcde-678901234567",
    name: "Alex Thompson", email: "alex.t@fastmail.com", phone: "+1 (206) 555-0143",
    resume_file: null, job: "job-004-devops", job_title: "DevOps Engineer",
    job_description: "DevOps Engineer",
    resume_score: 82,
    resume_strengths: ["6 years DevOps at unicorn", "CKS + AWS SA certified", "GitOps for 200 microservices", "On-call SRE experience"],
    resume_red_flags: [], resume_recommendation: "interview",
    resume_analysis: { summary: "Excellent DevOps with strong certifications and scale.", score: 82 },
    interview_status: "pending", vapi_call_id: null, interview_transcript: null, interview_score: null, interview_analysis: null,
    overall_score: 82, final_status: "screening",
    created_at: "2026-03-23T10:00:00Z", updated_at: "2026-03-23T10:00:00Z",
  },
];

export const MOCK_STATS: DashboardStats = {
  total_candidates: 8,
  avg_score: 72,
  interviewed_count: 3,
  shortlisted_count: 1,
};

/* ── Available interview slots (next 5 business days) ── */
function generateMockSlots(): import("./api").InterviewSlot[] {
  const slots: import("./api").InterviewSlot[] = [];
  const now = new Date();
  let dayOffset = 1;
  let daysGenerated = 0;

  while (daysGenerated < 5) {
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);
    dayOffset++;
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    daysGenerated++;

    const slotTimes = [9, 10, 11, 13, 14, 15, 16];
    const available = slotTimes.filter(() => Math.random() > 0.25);

    for (const hour of available) {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(30);
      slots.push({
        id: `slot-${start.toISOString()}`,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        is_booked: false,
      });
    }
  }
  return slots;
}

export const MOCK_AVAILABLE_SLOTS = generateMockSlots();
