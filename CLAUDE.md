# AI Hiring Agent — Project Requirements

## What This Is
An AI-powered hiring pipeline that screens resumes, scores candidates, conducts automated voice interviews, and displays results in a dashboard. Built for a YouTube tutorial (codewithmuh channel).

## Architecture

```
Resume Upload (PDF) → Django API → Claude API (parse + score) → If score > 60 → Vapi Voice Call
                                                                                      ↓
                                                              Dashboard ← PostgreSQL ← Webhook (transcript + score)
```

## Tech Stack

### Backend — Django (Python)
- **Django REST Framework** for API endpoints
- **Anthropic Python SDK** (`anthropic`) for Claude API — resume parsing + scoring + interview analysis
- **Vapi API** for triggering voice calls (REST API, no SDK needed)
- **PostgreSQL** via Docker Compose — database (Django ORM, no external DB client needed)
- **python-dotenv** for env management

### Frontend — Next.js
- **Next.js 14+ (App Router)** for the candidate dashboard
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- Fetches data from Django REST API

### Infrastructure
- **Docker Compose** — runs PostgreSQL locally (and optionally the Django app)
- No Supabase, no external DB service — everything runs locally

### External Services
- **Claude API** (Anthropic) — resume parsing, scoring, interview transcript analysis
- **Vapi** — voice call infrastructure (calls candidates on the phone)
- **ElevenLabs** — text-to-speech voice for the AI interviewer

## API Endpoints (Django Backend)

### `POST /api/candidates/upload/`
Upload a resume PDF. Claude parses it, extracts info, and scores against job description.
- Input: PDF file + job_description (text)
- Process: Send PDF to Claude API → get structured JSON back
- Output: `{ candidate_name, email, score, strengths, red_flags, recommendation }`
- Stores result in PostgreSQL `candidates` table via Django ORM

### `POST /api/candidates/{id}/interview/`
Trigger an AI voice interview for a candidate (score must be > 60).
- Input: candidate ID
- Process: Create Vapi call with Claude as LLM + ElevenLabs voice → call candidate's phone
- Output: `{ call_id, status: "initiated" }`

### `POST /api/webhooks/vapi/`
Webhook endpoint for Vapi to send interview transcripts back.
- Input: Vapi webhook payload (transcript, call duration, etc.)
- Process: Send transcript to Claude for analysis → score interview → update DB
- Output: 200 OK

### `GET /api/candidates/`
List all candidates with scores, status, and interview results.
- Filterable by: status (pending, interviewed, rejected, shortlisted), score range

### `GET /api/candidates/{id}/`
Full candidate detail — resume analysis, interview transcript, scores, AI recommendation.

### `GET /api/dashboard/stats/`
Summary stats — total candidates, avg score, interviewed count, shortlisted count.

## Database Schema (Django Model → PostgreSQL)

```python
# hiring/models.py
import uuid
from django.db import models

class Candidate(models.Model):
    class ResumeRecommendation(models.TextChoices):
        INTERVIEW = 'interview'
        REJECT = 'reject'
        MAYBE = 'maybe'

    class InterviewStatus(models.TextChoices):
        PENDING = 'pending'
        SCHEDULED = 'scheduled'
        IN_PROGRESS = 'in_progress'
        COMPLETED = 'completed'
        FAILED = 'failed'

    class FinalStatus(models.TextChoices):
        NEW = 'new'
        SCREENING = 'screening'
        INTERVIEWING = 'interviewing'
        SHORTLISTED = 'shortlisted'
        REJECTED = 'rejected'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    resume_file = models.FileField(upload_to='resumes/', blank=True, null=True)
    job_description = models.TextField(blank=True, null=True)

    # Resume screening
    resume_score = models.IntegerField(null=True, blank=True)
    resume_strengths = models.JSONField(default=list, blank=True)
    resume_red_flags = models.JSONField(default=list, blank=True)
    resume_recommendation = models.CharField(
        max_length=20, choices=ResumeRecommendation.choices, blank=True, null=True
    )
    resume_analysis = models.JSONField(null=True, blank=True)

    # Voice interview
    interview_status = models.CharField(
        max_length=20, choices=InterviewStatus.choices, default=InterviewStatus.PENDING
    )
    vapi_call_id = models.CharField(max_length=255, blank=True, null=True)
    interview_transcript = models.TextField(blank=True, null=True)
    interview_score = models.IntegerField(null=True, blank=True)
    interview_analysis = models.JSONField(null=True, blank=True)

    # Final
    overall_score = models.IntegerField(null=True, blank=True)
    final_status = models.CharField(
        max_length=20, choices=FinalStatus.choices, default=FinalStatus.NEW
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-overall_score', '-created_at']

    def __str__(self):
        return f"{self.name} (Score: {self.overall_score or 'N/A'})"
```

## Docker Compose

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: hiring_agent
      POSTGRES_USER: hiring
      POSTGRES_PASSWORD: hiring_dev_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Environment Variables

```env
# Anthropic
ANTHROPIC_API_KEY=

# Vapi
VAPI_API_KEY=
VAPI_PHONE_NUMBER_ID=

# ElevenLabs
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=

# PostgreSQL (Docker Compose)
DATABASE_URL=postgres://hiring:hiring_dev_password@localhost:5432/hiring_agent
DB_NAME=hiring_agent
DB_USER=hiring
DB_PASSWORD=hiring_dev_password
DB_HOST=localhost
DB_PORT=5432

# Django
DJANGO_SECRET_KEY=change-me-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Claude System Prompts

### Resume Screening Prompt
```
You are an expert hiring screener. Analyze the provided resume against the job description.

Return a JSON object with:
- score: integer 0-100 (how well the candidate matches)
- strengths: array of 3-5 key strengths
- red_flags: array of any concerns (empty if none)
- recommendation: "interview" (score >= 60), "maybe" (40-59), or "reject" (< 40)
- summary: 2-3 sentence assessment

Scoring criteria:
- Relevant experience: 40 points
- Skills match: 30 points
- Education fit: 15 points
- Career trajectory: 15 points

Be fair and objective. Do not penalize for gaps in employment or non-traditional backgrounds.
```

### Voice Interview System Prompt (for Vapi assistant)
```
You are a friendly but professional AI recruiter conducting a phone screening.

Instructions:
- Introduce yourself briefly: "Hi, this is the AI screening assistant from [Company]. Thanks for taking the time."
- Ask these questions one at a time, wait for the answer:
  1. Tell me about your experience with [key skill from resume]
  2. Describe a challenging project you worked on recently
  3. Why are you interested in this role?
  4. What is your availability and salary expectation?
- Keep it conversational, not robotic
- If the candidate seems confused, rephrase the question
- After all questions, thank them and let them know next steps
- Keep the total call under 10 minutes
```

### Interview Transcript Analysis Prompt
```
You are an expert interviewer. Analyze this interview transcript and score the candidate.

Return a JSON object with:
- score: integer 0-100
- communication_score: 0-25 (clarity, articulation)
- technical_score: 0-25 (domain knowledge, problem-solving)
- enthusiasm_score: 0-25 (interest, energy, cultural fit)
- experience_score: 0-25 (relevant experience depth)
- highlights: array of notable positive moments
- concerns: array of any red flags
- recommendation: "strong_yes", "yes", "maybe", or "no"
- summary: 3-4 sentence assessment
```

## Project Structure

```
ai-hiring-agent/
├── CLAUDE.md                  # This file
├── docker-compose.yml         # PostgreSQL
├── .gitignore
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── hiring/
│       ├── models.py          # Django models (Candidate)
│       ├── serializers.py     # DRF serializers
│       ├── views.py           # API views
│       ├── urls.py            # URL routing
│       ├── admin.py           # Register models for Django admin
│       ├── services/
│       │   ├── claude_service.py    # Claude API integration
│       │   └── vapi_service.py      # Vapi call triggering
│       └── prompts/
│           ├── resume_screening.txt
│           ├── interview_system.txt
│           └── transcript_analysis.txt
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── .env.local
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   └── candidates/
│   │   │       ├── page.tsx       # Candidate list
│   │   │       └── [id]/
│   │   │           └── page.tsx   # Candidate detail
│   │   ├── components/
│   │   │   ├── CandidateTable.tsx
│   │   │   ├── CandidateCard.tsx
│   │   │   ├── ScoreBadge.tsx
│   │   │   ├── ResumeUpload.tsx
│   │   │   ├── InterviewTranscript.tsx
│   │   │   └── StatsOverview.tsx
│   │   └── lib/
│   │       └── api.ts             # Django API client
│   └── tailwind.config.ts
└── sample-resumes/                # Test PDFs for demo
    ├── senior-dev-good.pdf
    ├── junior-dev-okay.pdf
    └── unqualified.pdf
```

## Running Locally

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Fill in API keys
python manage.py migrate
python manage.py createsuperuser  # Optional: for Django admin
python manage.py runserver  # http://localhost:8000

# 3. Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev  # http://localhost:3000
```

## Build Order (recommended)
1. Set up Docker Compose + Django project + PostgreSQL connection
2. Create Candidate model + migrations
3. Build resume upload + Claude screening endpoint
4. Test with sample resumes
5. Build Vapi integration + voice interview trigger
6. Build webhook handler for transcripts
7. Build Next.js dashboard (candidate list + detail views)
8. Add resume upload UI component
9. End-to-end test: upload → screen → interview → dashboard

## Important Notes
- Claude reads PDFs natively via base64 in the API — no separate parsing library needed
- Vapi webhook URL needs to be publicly accessible (use ngrok for local dev)
- ElevenLabs voice ID: pick a professional-sounding voice, not the default
- Keep the Vapi assistant system prompt concise — long prompts increase latency
- For the video demo: use your own phone number as the test candidate
- CORS: Django backend must allow requests from localhost:3000
- Django admin at http://localhost:8000/admin/ is useful for inspecting data during development
- Resume files stored locally in `backend/media/resumes/` — Django handles file uploads
 dock