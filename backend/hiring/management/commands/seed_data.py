"""Seed database with demo jobs, candidates, and interview slots."""
import uuid
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from hiring.models import Job, Candidate, InterviewSlot


DEMO_JOBS = [
    {
        "title": "Senior Full-Stack Engineer",
        "department": "Engineering",
        "location": "Remote (US timezone preferred)",
        "job_type": "full_time",
        "salary_min": 150000,
        "salary_max": 200000,
        "description": "We're looking for a Senior Full-Stack Engineer to build and maintain features across our React/Next.js frontend and Python/Django backend. You'll design scalable APIs, optimize database schemas, and mentor junior engineers.",
        "responsibilities": [
            "Build and maintain full-stack features with React and Python",
            "Design scalable APIs and database schemas",
            "Collaborate with product and design teams",
            "Mentor junior engineers and drive best practices",
            "Lead code reviews and architectural discussions",
        ],
        "requirements": [
            "5+ years of full-stack development experience",
            "Strong proficiency in React/Next.js and Python/Django",
            "Experience with PostgreSQL and REST APIs",
            "Good understanding of system design principles",
        ],
        "nice_to_have": [
            "Experience with AI/ML integrations",
            "Open source contributions",
            "Previous startup experience",
        ],
    },
    {
        "title": "Machine Learning Engineer",
        "department": "AI/ML",
        "location": "San Francisco, CA (Hybrid)",
        "job_type": "full_time",
        "salary_min": 170000,
        "salary_max": 230000,
        "description": "Join our AI team to build and deploy production ML models. You'll work on NLP, recommendation systems, and real-time inference pipelines powering our core product.",
        "responsibilities": [
            "Design and train ML models for NLP and recommendation tasks",
            "Build production inference pipelines with low latency",
            "Collaborate with data engineers on feature stores",
            "Run A/B experiments and analyze model performance",
            "Stay current with research and prototype new approaches",
        ],
        "requirements": [
            "3+ years of ML engineering experience in production",
            "Strong Python skills (PyTorch or TensorFlow)",
            "Experience with NLP models and transformer architectures",
            "Familiarity with ML infrastructure (MLflow, Kubeflow, etc.)",
        ],
        "nice_to_have": [
            "Published ML research papers",
            "Experience with LLM fine-tuning",
            "Familiarity with Claude/Anthropic APIs",
        ],
    },
    {
        "title": "Product Designer",
        "department": "Design",
        "location": "Remote (Worldwide)",
        "job_type": "full_time",
        "salary_min": 120000,
        "salary_max": 160000,
        "description": "We need a Product Designer to own the end-to-end design of our hiring platform. You'll work closely with engineers and PMs to create intuitive, beautiful experiences for recruiters and candidates.",
        "responsibilities": [
            "Own product design from research to pixel-perfect handoff",
            "Conduct user research and usability testing",
            "Create wireframes, prototypes, and design systems",
            "Collaborate with engineering on implementation feasibility",
            "Define and track design metrics",
        ],
        "requirements": [
            "4+ years of product design experience",
            "Strong Figma skills and prototyping ability",
            "Experience designing B2B SaaS products",
            "Portfolio demonstrating end-to-end design thinking",
        ],
        "nice_to_have": [
            "Experience with AI-powered products",
            "Motion design skills",
            "Basic frontend development knowledge",
        ],
    },
    {
        "title": "DevOps Engineer",
        "department": "Infrastructure",
        "location": "New York, NY (On-site)",
        "job_type": "full_time",
        "salary_min": 140000,
        "salary_max": 180000,
        "description": "We're looking for a DevOps Engineer to build and maintain our cloud infrastructure. You'll automate deployments, manage Kubernetes clusters, and ensure 99.9% uptime for our platform.",
        "responsibilities": [
            "Build and maintain CI/CD pipelines",
            "Manage Kubernetes clusters on AWS/GCP",
            "Implement infrastructure as code with Terraform",
            "Monitor system health and respond to incidents",
            "Optimize cloud costs and resource utilization",
        ],
        "requirements": [
            "3+ years of DevOps/SRE experience",
            "Strong Kubernetes and Docker skills",
            "Experience with AWS or GCP",
            "Proficiency in Terraform or Pulumi",
        ],
        "nice_to_have": [
            "Experience with GitOps (ArgoCD, Flux)",
            "Observability stack experience (Datadog, Grafana)",
            "Security certifications (CKS, AWS Security)",
        ],
    },
    {
        "title": "Frontend Developer (React)",
        "department": "Engineering",
        "location": "Remote (US/EU timezones)",
        "job_type": "contract",
        "salary_min": 80,
        "salary_max": 120,
        "description": "6-month contract for a skilled React developer to help us rebuild our dashboard UI. You'll work with our design team to implement pixel-perfect components using Next.js, Tailwind CSS, and shadcn/ui.",
        "responsibilities": [
            "Build responsive UI components with React and Next.js",
            "Implement designs from Figma with pixel-perfect accuracy",
            "Write unit and integration tests",
            "Optimize performance and accessibility",
        ],
        "requirements": [
            "3+ years of React/Next.js experience",
            "Strong TypeScript and Tailwind CSS skills",
            "Eye for design and attention to detail",
            "Experience with component libraries (shadcn/ui, Radix)",
        ],
        "nice_to_have": [
            "Experience with Framer Motion animations",
            "Storybook experience",
        ],
    },
]

DEMO_CANDIDATES = [
    {
        "name": "Sarah Chen",
        "email": "sarah.chen@email.com",
        "phone": "+1 (415) 555-0142",
        "job_index": 0,
        "resume_score": 92,
        "resume_strengths": [
            "8+ years full-stack experience with React and Python",
            "Led migration of monolith to microservices at scale",
            "Strong system design skills with distributed systems",
            "Open source contributor to major frameworks",
        ],
        "resume_red_flags": [],
        "resume_recommendation": "interview",
        "resume_analysis": {"summary": "Exceptional candidate with deep full-stack expertise. Strong track record of leading complex technical migrations. Highly recommended.", "score": 92},
        "interview_status": "completed",
        "interview_score": 88,
        "interview_analysis": {
            "communication_score": 23, "technical_score": 24, "enthusiasm_score": 21, "experience_score": 20,
            "highlights": ["Articulated complex technical decisions clearly", "Deep understanding of trade-offs in system design"],
            "concerns": [], "recommendation": "strong_yes",
            "summary": "Outstanding interview. Sarah demonstrated exceptional technical depth and communication skills.",
        },
        "interview_transcript": "AI: Hi Sarah, thanks for taking the time. Can you tell me about your experience with distributed systems?\n\nSarah: Absolutely! I led the migration of our monolithic app to microservices serving 2M daily active users using event-driven architecture with Kafka...\n\nAI: That's impressive. Describe a challenging project recently?\n\nSarah: Building a real-time analytics pipeline processing 500K events per second with sub-second latency...",
        "overall_score": 90,
        "final_status": "shortlisted",
    },
    {
        "name": "Marcus Johnson",
        "email": "marcus.j@outlook.com",
        "phone": "+1 (212) 555-0198",
        "job_index": 0,
        "resume_score": 78,
        "resume_strengths": ["5 years backend with Django and FastAPI", "Strong database optimization", "AWS certified solutions architect"],
        "resume_red_flags": ["Limited frontend framework experience"],
        "resume_recommendation": "interview",
        "resume_analysis": {"summary": "Strong backend engineer with solid cloud skills. Frontend lighter but shows willingness to learn.", "score": 78},
        "interview_status": "completed",
        "interview_score": 72,
        "interview_analysis": {
            "communication_score": 19, "technical_score": 20, "enthusiasm_score": 17, "experience_score": 16,
            "highlights": ["Strong backend architecture knowledge", "Good database optimization understanding"],
            "concerns": ["Could improve frontend skills", "Slightly nervous during behavioral questions"],
            "recommendation": "yes", "summary": "Solid foundation with room to grow on frontend.",
        },
        "interview_transcript": "AI: Hi Marcus, tell me about your backend experience.\n\nMarcus: I've been building APIs for 5 years. Recently designed a high-throughput payment processing system...",
        "overall_score": 75,
        "final_status": "interviewing",
    },
    {
        "name": "Priya Patel",
        "email": "priya.patel@gmail.com",
        "phone": "+1 (650) 555-0167",
        "job_index": 0,
        "resume_score": 85,
        "resume_strengths": ["7 years TypeScript and Node.js", "Built SaaS products 0 to 100K users", "Strong DevOps and CI/CD experience", "50K monthly reader tech blog"],
        "resume_red_flags": [],
        "resume_recommendation": "interview",
        "resume_analysis": {"summary": "Impressive full-stack profile with entrepreneurial mindset. Excellent candidate.", "score": 85},
        "interview_status": "scheduled",
        "overall_score": 85,
        "final_status": "screening",
    },
    {
        "name": "James O'Brien",
        "email": "james.obrien@proton.me",
        "phone": "+1 (312) 555-0134",
        "job_index": 0,
        "resume_score": 45,
        "resume_strengths": ["2 years web development", "Multiple bootcamp projects"],
        "resume_red_flags": ["Limited professional experience for senior role", "No system design experience", "Skills don't match seniority"],
        "resume_recommendation": "maybe",
        "resume_analysis": {"summary": "Junior developer applying for senior role. Better fit for mid-level positions.", "score": 45},
        "interview_status": "pending",
        "overall_score": 45,
        "final_status": "new",
    },
    {
        "name": "Emily Zhang",
        "email": "emily.z@company.io",
        "phone": "+1 (628) 555-0189",
        "job_index": 1,
        "resume_score": 88,
        "resume_strengths": ["PhD in Machine Learning from Stanford", "3 years at Google Brain", "Published 12 papers in top ML conferences", "Expert in transformer architectures"],
        "resume_red_flags": [],
        "resume_recommendation": "interview",
        "resume_analysis": {"summary": "Top-tier ML candidate with exceptional research background and production experience.", "score": 88},
        "interview_status": "in_progress",
        "overall_score": 88,
        "final_status": "interviewing",
    },
    {
        "name": "David Kim",
        "email": "david.kim@tech.dev",
        "phone": "+1 (408) 555-0156",
        "job_index": 1,
        "resume_score": 34,
        "resume_strengths": ["Enthusiastic about AI"],
        "resume_red_flags": ["Resume is mostly retail management", "No ML experience", "Online courses as primary qualification"],
        "resume_recommendation": "reject",
        "resume_analysis": {"summary": "Career changer with no ML background. Gap too large for this role.", "score": 34},
        "interview_status": "pending",
        "overall_score": 34,
        "final_status": "rejected",
    },
    {
        "name": "Ana Rodriguez",
        "email": "ana.r@devmail.com",
        "phone": "+1 (305) 555-0172",
        "job_index": 2,
        "resume_score": 71,
        "resume_strengths": ["4 years product design at startups", "Strong Figma prototyping skills", "Healthcare UX expertise"],
        "resume_red_flags": ["Limited B2B SaaS experience"],
        "resume_recommendation": "interview",
        "resume_analysis": {"summary": "Solid designer with good breadth. Domain expertise in regulated industries is a plus.", "score": 71},
        "interview_status": "completed",
        "interview_score": 68,
        "interview_analysis": {
            "communication_score": 18, "technical_score": 17, "enthusiasm_score": 16, "experience_score": 17,
            "highlights": ["Strong design process understanding", "Good testing practices"],
            "concerns": ["B2B SaaS experience limited", "May need mentorship on design systems at scale"],
            "recommendation": "maybe", "summary": "Competent designer with valuable domain expertise.",
        },
        "interview_transcript": "AI: Hi Ana, walk me through your design process.\n\nAna: Sure! I always start with user research. In my last role at a healthcare startup...",
        "overall_score": 70,
        "final_status": "interviewing",
    },
    {
        "name": "Alex Thompson",
        "email": "alex.t@fastmail.com",
        "phone": "+1 (206) 555-0143",
        "job_index": 3,
        "resume_score": 82,
        "resume_strengths": ["6 years DevOps at a unicorn startup", "CKS and AWS SA certified", "Built GitOps pipelines serving 200 microservices", "On-call SRE experience"],
        "resume_red_flags": [],
        "resume_recommendation": "interview",
        "resume_analysis": {"summary": "Excellent DevOps profile with strong certifications and scale experience.", "score": 82},
        "interview_status": "pending",
        "overall_score": 82,
        "final_status": "screening",
    },
    {
        "name": "Lisa Park",
        "email": "lisa.park@frontend.dev",
        "phone": "+1 (503) 555-0188",
        "job_index": 4,
        "resume_score": 79,
        "resume_strengths": ["4 years React/Next.js", "Pixel-perfect implementation from Figma", "Framer Motion animations expert", "Accessibility champion"],
        "resume_red_flags": ["No backend experience"],
        "resume_recommendation": "interview",
        "resume_analysis": {"summary": "Strong frontend specialist with excellent attention to detail. Great fit for the contract role.", "score": 79},
        "interview_status": "scheduled",
        "overall_score": 79,
        "final_status": "screening",
    },
    {
        "name": "Ryan Foster",
        "email": "ryan.foster@gmail.com",
        "phone": "+1 (720) 555-0195",
        "job_index": 4,
        "resume_score": 65,
        "resume_strengths": ["3 years React development", "Some Next.js experience", "Comfortable with TypeScript"],
        "resume_red_flags": ["Portfolio shows inconsistent quality", "No Tailwind CSS experience listed"],
        "resume_recommendation": "interview",
        "resume_analysis": {"summary": "Meets minimum requirements. Should be interviewed to assess design eye and code quality.", "score": 65},
        "interview_status": "pending",
        "overall_score": 65,
        "final_status": "new",
    },
]


class Command(BaseCommand):
    help = 'Seed database with demo jobs, candidates, and interview slots'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data before seeding')

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write("Clearing existing data...")
            Candidate.objects.all().delete()
            InterviewSlot.objects.all().delete()
            Job.objects.all().delete()

        # Create jobs
        self.stdout.write("Creating jobs...")
        jobs = []
        for job_data in DEMO_JOBS:
            job = Job.objects.create(**job_data)
            jobs.append(job)
            self.stdout.write(f"  + {job.title}")

        # Create candidates
        self.stdout.write("Creating candidates...")
        for c_data in DEMO_CANDIDATES:
            job_index = c_data.pop('job_index')
            job = jobs[job_index] if job_index < len(jobs) else None
            c_data['job'] = job
            c_data['job_description'] = job.description if job else ""
            candidate = Candidate.objects.create(**c_data)
            self.stdout.write(f"  + {candidate.name} -> {job.title if job else 'No job'}")

        # Create interview slots for next 5 business days
        self.stdout.write("Creating interview slots...")
        now = timezone.now()
        day_offset = 1
        days_created = 0
        while days_created < 5:
            day = now + timedelta(days=day_offset)
            day_offset += 1
            if day.weekday() >= 5:  # skip weekends
                continue
            days_created += 1
            for hour in [9, 10, 11, 13, 14, 15, 16]:
                start = day.replace(hour=hour, minute=0, second=0, microsecond=0)
                end = start + timedelta(minutes=30)
                InterviewSlot.objects.create(start_time=start, end_time=end)
            self.stdout.write(f"  + Slots for {day.strftime('%A %b %d')}")

        total_jobs = Job.objects.count()
        total_candidates = Candidate.objects.count()
        total_slots = InterviewSlot.objects.count()
        self.stdout.write(self.style.SUCCESS(
            f"\nDone! Created {total_jobs} jobs, {total_candidates} candidates, {total_slots} interview slots."
        ))
