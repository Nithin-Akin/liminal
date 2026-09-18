from datetime import date

from fastapi import APIRouter, HTTPException
from app.db.local_store import read_json, write_json
from app.core.auth import UserId
from app.models.schemas import AgentAnswer, AgentQuery
from app.services.ai_runtime import allow_ai_request, append_memory, generate_validated, retrieve_grounding, thread_context

router = APIRouter()


@router.post("/agent/query")
def query_agent(body: AgentQuery, user_id: str = UserId):
    if not allow_ai_request(f"assistant:{user_id}"):
        raise HTTPException(status_code=429, detail="Assistant rate limit reached. Try again shortly.")
    profiles = read_json("profiles.json", {})
    tasks = read_json("generated_tasks.json", {})
    rewards = read_json("rewards.json", {})
    profile = profiles.get(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="No saved profile. Complete onboarding first.")

    intent = route_intent(body.question)
    grounding = retrieve_grounding(user_id, body.question)
    memory = thread_context(user_id, "assistant")
    prompt = f"""
You are Liiminal's practical relocation agent.
Answer the user's question using their saved profile, generated tasks, rewards/progress, and location if available.

Rules:
- Return ONLY JSON.
- No vague advice.
- If recommending options, include comparable fields, source/search links, and exact next action.
- Do not invent exact live prices, ratings, addresses, or phone numbers.
- If live verification is needed, provide search_url and say it requires verification.
- If the user asks about stress, mental health, loneliness, overload, anxiety, sleep, or routine, answer with a practical support plan and still return JSON. Route: {intent}.
- Recommendations needing live local data should use Google search URLs: https://www.google.com/search?q=...

PROFILE:
{profile}

TASK_STATE:
{tasks.get(user_id)}

REWARDS:
{rewards.get(user_id)}

LOCATION:
{body.location}

QUESTION:
{body.question}

VERIFIED_GROUNDING:
{grounding}

RECENT_THREAD_MEMORY:
{memory}

Return:
{{
  "title": "short answer title",
  "summary": "direct answer",
  "plan": ["step 1", "step 2", "step 3"],
  "recommendations": [
    {{
      "name": "option/action",
      "comparison": {{"field": "value"}},
      "source_url": "https://...",
      "source_type": "official | search-required | user-profile",
      "fit_reason": "one line"
    }}
  ],
  "next_action": "one concrete action",
  "last_checked": "{date.today()}"
}}
"""
    try:
        validated = generate_validated(prompt, AgentAnswer)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Agent query failed: {exc}") from exc

    append_memory(user_id, "assistant", {"question": body.question, "answer": validated.model_dump(), "intent": intent})
    return validated.model_dump()


def route_intent(question: str) -> str:
    text = question.lower()
    if any(word in text for word in ("stress", "anxious", "lonely", "mental health", "sleep", "overwhelmed")):
        return "mental_health_support"
    if any(word in text for word in ("rent", "pg", "housing", "room", "coliving")):
        return "housing_research"
    if any(word in text for word in ("bank", "card", "upi", "credit", "fee")):
        return "banking_research"
    if any(word in text for word in ("task", "todo", "checklist", "complete")):
        return "task_planning"
    return "relocation_rag"


def parse_json(raw: str):
    import json

    text = raw.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("Model did not return JSON")
    return json.loads(text[start:end + 1])
