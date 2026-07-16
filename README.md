# Liminal

**Your intelligent companion for the first 90 days in a new city.**

UI-only prototype built with Next.js, Tailwind CSS, and Framer Motion.

## Screens

| Route | Description |
|---|---|
| `/onboarding` | Welcome flow — name, city, move date |
| `/` | Home dashboard — day count, phase, insights, quick actions |
| `/arc` | Arc Map — 90-day transition journey visualization |
| `/check-in` | 3-step emotional check-in flow |
| `/chat` | AI companion chat interface (mock responses) |
| `/community` | Day Feed + City Circles |
| `/scout` | Practical resource finder (banks, doctors, food, etc.) |
| `/profile` | User profile and settings |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — start at `/onboarding` for the full flow.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **Lucide React** (icons)

## Note

This is a **UI-only prototype**. No backend, no API calls, no data persistence. All content is mock data in `src/lib/mock-data.ts`.

---

*Team VANTA — Christ University, Bengaluru*
