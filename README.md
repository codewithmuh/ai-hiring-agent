# AI Hiring Agent

An AI-powered hiring pipeline that screens resumes, scores candidates, conducts automated voice interviews, and displays results in a real-time dashboard.

Built by **[codewithmuh](https://youtube.com/@codewithmuh)** as a YouTube tutorial project.

## How It Works

```
Candidate applies on /jobs
        |
        v
  Upload Resume (PDF)
        |
        v
  Django API -> Claude AI (parse + score resume)
        |
        v
  Score > 60? --yes--> Schedule AI Voice Interview (Vapi + ElevenLabs)
        |                          |
        no                         v
        |               Vapi calls candidate's phone
        v                          |
  "We'll be in touch"             v
                        Webhook receives transcript
                                   |
                                   v
                        Claude AI analyzes interview
                                   |
                                   v
                        Dashboard shows results
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Django 5, Django REST Framework, Python 3.12 |
| **AI** | Claude API (Anthropic) — resume screening + interview analysis |
| **Voice** | Vapi — outbound phone calls, ElevenLabs — text-to-speech |
| **Database** | PostgreSQL 16 (via Docker) |
| **Infrastructure** | Docker Compose |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 22+ (for local frontend dev)
- Python 3.12+ (for local backend dev)
- API keys: [Anthropic](https://console.anthropic.com/), [Vapi](https://vapi.ai/), [ElevenLabs](https://elevenlabs.io/)

### 1. Clone & Configure

```bash
git clone https://github.com/codewithmuh/ai-hiring-agent.git
cd ai-hiring-agent
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your API keys:

```env
ANTHROPIC_API_KEY=sk-ant-...
VAPI_API_KEY=your-vapi-key
VAPI_PHONE_NUMBER_ID=your-phone-number-id
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM   # Rachel voice (or pick your own)
```

### 2. Start Everything with Docker

```bash
docker compose up -d --build
```

This starts:
- **PostgreSQL** on port 5432
- **Django backend** on port 8000
- **Next.js frontend** on port 3001

### 3. Run Migrations & Seed Demo Data

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_data
```

This creates 5 demo jobs, 10 candidates, and 35 interview slots.

### 4. Open the App

- **Dashboard**: http://localhost:3001
- **Careers page**: http://localhost:3001/jobs
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/

To create an admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

## Running Locally (Without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env     # fill in API keys, set DB_HOST=localhost
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000 (or 3001 if 3000 is taken).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs/` | List open jobs |
| `GET` | `/api/jobs/{id}/` | Job detail |
| `POST` | `/api/apply/` | Public application (resume + job_id + slot) |
| `POST` | `/api/candidates/upload/` | Upload resume for screening |
| `GET` | `/api/candidates/` | List candidates (filterable) |
| `GET` | `/api/candidates/{id}/` | Candidate detail |
| `POST` | `/api/candidates/{id}/interview/` | Trigger AI voice interview |
| `POST` | `/api/webhooks/vapi/` | Vapi webhook (receives transcript) |
| `GET` | `/api/dashboard/stats/` | Dashboard summary stats |
| `GET` | `/api/slots/available/` | Available interview time slots |

## Project Structure

```
ai-hiring-agent/
├── docker-compose.yml
├── backend/
│   ├── config/              # Django project settings
│   ├── hiring/
│   │   ├── models.py        # Job, Candidate, InterviewSlot
│   │   ├── views.py         # API endpoints
│   │   ├── serializers.py   # DRF serializers
│   │   ├── urls.py          # URL routing
│   │   ├── admin.py         # Django admin
│   │   ├── services/
│   │   │   ├── claude_service.py   # Claude API integration
│   │   │   └── vapi_service.py     # Vapi call triggering
│   │   ├── prompts/                # AI system prompts
│   │   └── management/commands/
│   │       └── seed_data.py        # Demo data seeder
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Dashboard
│   │   │   ├── jobs/page.tsx        # Careers landing page
│   │   │   ├── jobs/[id]/apply/     # Job application form
│   │   │   ├── candidates/          # Candidate list & detail
│   │   │   ├── architecture/        # Architecture diagram
│   │   │   ├── terms/               # Terms & Conditions
│   │   │   └── privacy/             # Privacy Policy
│   │   ├── components/              # UI components
│   │   └── lib/
│   │       ├── api.ts               # API client
│   │       └── mock-data.ts         # Fallback demo data
│   └── package.json
└── sample-resumes/                  # Test PDFs
```

## Features

- **Resume Screening** — Upload a PDF, Claude AI scores it (0-100) against the job description
- **Job Board** — Multiple open positions with department filters and search
- **Multi-step Application** — Candidates apply, upload resume, and pick an interview slot
- **AI Voice Interview** — Vapi calls the candidate, asks screening questions
- **Transcript Analysis** — Claude scores the interview (communication, technical, enthusiasm, experience)
- **Dashboard** — Real-time stats, candidate table with scores, pipeline progress
- **Candidate Detail** — Score donuts, strengths/red flags, interview transcript with chat bubbles
- **Architecture Page** — Animated flow diagram showing the full pipeline

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key from [console.anthropic.com](https://console.anthropic.com/) |
| `VAPI_API_KEY` | Vapi API key from [vapi.ai](https://vapi.ai/) |
| `VAPI_PHONE_NUMBER_ID` | Phone number ID from Vapi dashboard |
| `ELEVENLABS_API_KEY` | ElevenLabs API key |
| `ELEVENLABS_VOICE_ID` | Voice ID (e.g., `21m00Tcm4TlvDq8ikWAM` for Rachel) |
| `DJANGO_SECRET_KEY` | Django secret key (auto-generated for dev) |
| `DB_*` | PostgreSQL connection (handled by Docker Compose) |

## License

MIT
