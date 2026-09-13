# Liminal

Liminal is an AI-native relocation operating system for people moving to a new city. It turns a traveller's profile, destination, budget, preferences, check-ins, and open tasks into a practical relocation workspace.

The product combines grounded place discovery with agent-assisted planning. Google Places supplies live location data, while Gemini and structured Pydantic schemas support planning and comparison workflows. Source verification lets users inspect and confirm important facts instead of treating generated text as truth.

## What It Does

- Creates a user-scoped relocation profile and local session.
- Tracks onboarding progress, relocation phase, tasks, rewards, and daily check-ins.
- Searches Google Places for housing, healthcare, food, banking, and connectivity.
- Displays addresses, map links, official websites, phone numbers, ratings, review counts, price levels, and opening hours when Google provides them.
- Applies user preferences such as healthcare need, food preference, cuisine, housing type, rent limit, and card purpose to searches.
- Verifies source pages and extracts structured fields such as rent, deposit, room type, availability, hours, and interest rates.
- Saves user-confirmed source values with timestamps and provenance.
- Provides Gemini-powered banking comparisons and an AI assistant grounded in saved profile and task context.
- Tracks mood history and presents daily check-in information in the workspace.

## Architecture

```text
frontend/                 Next.js + React interface
  src/app/                Dashboard, research, banking, assistant, daily, rewards
  src/components/         Shared application chrome and auth gate
  src/lib/api.ts          Typed client for the FastAPI API

backend/backend/
  main.py                 FastAPI application entry point
  app/api/routes/          Auth, research, sources, tasks, check-ins, banking, rewards
  app/agents/              Orchestration, temporal, mirror, and archivist agents
  app/services/            Google Places, Gemini, source verification, extraction
  app/models/              Pydantic request and response schemas
  app/core/                Configuration, bearer auth, and phase logic
  app/db/                  Local state and vector-store helpers
  data/                    Local development state and research cache
```

The current local development store uses SQLite for mirrored state and JSON files for some domain records and caches. It is suitable for a local prototype, not multi-instance production deployment.

## Requirements

- Python 3.11+
- Node.js 20+
- npm
- A Google Cloud project with the **Places API (New)** enabled and billing configured for live place search
- A Gemini API key for AI assistant and banking comparison features

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/Nithin-Akin/liminal.git
cd liminal

python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/backend/requirements.txt

cd frontend
npm install
cd ..
```

Create `backend/backend/.env` locally. Never commit this file or real API keys:

```env
GOOGLE_MAPS_API_KEY=your_google_places_key
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.0-flash

# Local development login only
DEV_AUTH=true
DEV_LOGIN_EMAIL=you@example.com
DEV_LOGIN_PASSWORD=choose-a-local-password
```

Start the backend in one terminal:

```bash
cd backend/backend
source ../../.venv/bin/activate
uvicorn main:app --reload --port 8000
```

Start the frontend in another:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend uses `http://localhost:8000` by default. To change it, set:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Development Commands

```bash
# Frontend type checking and production build
cd frontend
npm run typecheck
npm run build

# Backend tests
cd backend/backend
source ../../.venv/bin/activate
python -m pytest -q
```

## Data and Security

Local development data is stored under `backend/backend/data/`, including users, sessions, profiles, check-ins, tasks, rewards, source confirmations, cache entries, and the SQLite file. Do not use the checked-in development data model for production users.

Authentication currently uses local bearer sessions and PBKDF2 password hashing. CORS is restricted to local frontend origins. Production deployment still requires a real identity provider, secret management, durable database migrations, stricter rate limiting, and deployment-specific CORS configuration.

## Data Grounding Model

Liminal separates retrieved facts from generated guidance:

1. Google Places retrieves location-specific place metadata.
2. The source verifier fetches a user-provided or discovered page.
3. Structured extraction identifies supported fields without filling missing values by guesswork.
4. The user confirms extracted values before they become verified profile knowledge.
5. AI workflows use profile, task, check-in, and retrieved source context to produce recommendations.

Missing rent, availability, fees, rates, and services are intentionally shown as unknown until a source provides them. Google ratings and opening hours are signals, not guarantees.

## API Surface

The main API areas are:

- `POST /auth/login` and `POST /auth/register`
- `GET /dashboard/{user_id}`
- `GET /research/{category}`
- `GET /sources/verify`, `POST /sources/confirm`, `GET /sources/verified`
- `POST /banking/options`
- `POST /tasks/generate` and task completion endpoints
- Check-in, mood history, rewards, assistant, and routing endpoints

The interactive API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs) while the backend is running.

## Roadmap

- Complete the SQLite domain migration and remove remaining JSON persistence.
- Add field-level confidence and provenance to every research result.
- Expand category-specific retrieval and official-source discovery.
- Add stronger agent routing, retries, rate limits, background jobs, and observability.
- Add comprehensive user-isolation, retrieval, schema, and browser UI tests.
- Add production authentication, deployment configuration, and secret management.

## License

No license has been specified yet. All rights reserved until a license is added to this repository.
