from datetime import date

from fastapi import APIRouter, HTTPException
from app.db.local_store import read_json, write_json
from app.core.auth import UserId
from app.models.schemas import AgentAnswer, AgentQuery
from app.services.claude import generate

router = APIRouter()


@router.post("/agent/query")
def query_agent(body: AgentQuery, user_id: str = UserId):
    profiles = read_json("profiles.json", {})
    tasks = read_json("generated_tasks.json", {})
    rewards = read_json("rewards.json", {})
    profile = profiles.get(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="No saved profile. Complete onboarding first.")

    prompt = f"""
You are Liiminal's practical relocation agent.
Answer the user's question using their saved profile, generated tasks, rewards/progress, and location if available.

Rules:
- Return ONLY JSON.
- No vague advice.
- If recommending options, include comparable fields, source/search links, and exact next action.
- Do not invent exact live prices, ratings, addresses, or phone numbers.
- If live verification is needed, provide search_url and say it requires verification.
- If the user asks about stress, mental health, loneliness, overload, anxiety, sleep, or routine, answer with a practical support plan and still return JSON.
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
        raw = generate(prompt)
        parsed = parse_json(raw)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Agent query failed: {exc}") from exc

    try:
        validated = AgentAnswer.model_validate(parsed)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Agent returned an invalid answer shape") from exc
    history = read_json("agent_history.json", {})
    history.setdefault(user_id, []).append({"question": body.question, "answer": validated.model_dump(), "created_at": str(date.today())})
    write_json("agent_history.json", history)
    return validated.model_dump()


def parse_json(raw: str):
    import json

    text = raw.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("Model did not return JSON")
    return json.loads(text[start:end + 1])
