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
    deterministic = grounded_plan_answer(body.question, user_id, profile, tasks)
    if deterministic:
        append_memory(user_id, "assistant", {"question": body.question, "answer": deterministic, "intent": intent})
        return deterministic
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


def grounded_plan_answer(question: str, user_id: str, profile: dict, task_state: dict):
    text = question.lower()
    if "credit card" in text or ("card" in text and "budget" in text):
        budget = profile.get("monthlyBudget", "not provided")
        return {"title": "Credit card decision", "summary": f"With a saved monthly budget of ₹{budget}, do not use a credit card to cover recurring rent or essential bills unless the full balance is already covered. First compare annual fees, joining fees, interest, and repayment capacity.", "plan": ["Write down the monthly amount you can repay in full", "Compare cards for the stated purpose using official issuer pages", "Do not apply until the fee and repayment cost fit your budget"], "recommendations": [{"name": "Delay application until repayment is certain", "comparison": {"budget": f"₹{budget}", "risk": "High if used for recurring shortfalls", "source": "Personal budget assessment"}, "source_url": "https://www.rbi.org.in/", "source_type": "financial-guidance", "fit_reason": "Protects your monthly relocation budget from revolving interest."}], "next_action": "Calculate the maximum balance you can repay in full each month before comparing cards.", "last_checked": str(date.today())}
    # Only short-circuit the explicit multi-domain planning request. Other
    # questions must reach the local model so they receive a distinct answer.
    if not ("plan" in text and any(word in text for word in ("housing", "banking", "relocation", "move"))):
        return None
    user_tasks = task_state.get(user_id, {}) if isinstance(task_state, dict) else {}
    task_list = user_tasks.get("tasks", []) if isinstance(user_tasks, dict) else []
    pending = [task for task in task_list if not task.get("completed")]
    areas = []
    for key, label in (("housingStatus", "Housing"), ("bankStatus", "Banking"), ("simStatus", "Connectivity")):
        if "need" in str(profile.get(key, "")).lower():
            areas.append(label)
    requested = [area.title() for area in ("housing", "banking", "connectivity", "healthcare", "food") if area in text]
    focus = [area for area in requested if area in areas or area in ("Housing", "Banking")]
    focus = focus or areas[:2] or ["Relocation setup"]
    steps = [task.get("next_action") or task.get("title", "Review your next relocation task") for task in sorted(pending, key=lambda item: item.get("priority", 99))[:3]]
    if not steps:
        steps = [f"Review your {area.lower()} options and verify one source before committing." for area in focus]
    recommendations = []
    for task in sorted(pending, key=lambda item: item.get("priority", 99))[:3]:
        if task.get("category", "").lower() in {area.lower() for area in focus}:
            recommendations.append({"name": task.get("title", "Priority task"), "comparison": {"priority": str(task.get("priority", "review")), "budget": f"₹{profile.get('monthlyBudget', 'not provided')}"}, "source_url": task.get("search_url") or "https://www.google.com/maps", "source_type": task.get("source_type", "saved-task"), "fit_reason": task.get("why_now", "Matches an unresolved area in your saved profile.")})
    return {"title": f"Your {', '.join(focus)} plan", "summary": f"Your saved profile shows {', '.join(areas) or 'no unresolved setup areas'} still need attention. Your monthly budget is ₹{profile.get('monthlyBudget', 'not provided')}. Start with the highest-priority action and verify live details before paying or applying.", "plan": steps, "recommendations": recommendations, "next_action": steps[0], "last_checked": str(date.today())}


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
