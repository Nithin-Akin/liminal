import json
from datetime import date

from fastapi import APIRouter, HTTPException
from app.db.local_store import read_json, write_json
from app.core.auth import UserId
from app.models.schemas import AgentTaskResponse, GenerateTasksRequest, TaskCompleteRequest
from app.services.ai_runtime import allow_ai_request, generate_validated

router = APIRouter()


@router.post("/tasks/generate")
def generate_tasks(body: GenerateTasksRequest, user_id: str = UserId):
    if not allow_ai_request(f"tasks:{user_id}"):
        raise HTTPException(status_code=429, detail="Task generation rate limit reached. Try again shortly.")
    profiles = read_json("profiles.json", {})
    profile = profiles.get(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="No profile found. Complete onboarding first.")

    cache = read_json("generated_tasks.json", {})
    if not body.force and cache.get(user_id):
        payload = normalize_task_payload(cache[user_id], profile)
        AgentTaskResponse.model_validate(payload)
        cache[user_id] = payload
        write_json("generated_tasks.json", cache)
        return payload

    prompt = build_task_prompt(profile, body.location)
    try:
        payload = generate_validated(prompt, AgentTaskResponse).model_dump()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Task agent failed: {exc}") from exc

    payload = normalize_task_payload(payload, profile)
    payload = AgentTaskResponse.model_validate(payload).model_dump()
    payload["generated_at"] = str(date.today())
    payload["user_id"] = user_id
    cache[user_id] = payload
    write_json("generated_tasks.json", cache)
    return payload


@router.get("/tasks/{user_id}")
def get_tasks(user_id: str, authenticated_user_id: str = UserId):
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Cannot access another user's tasks")
    cache = read_json("generated_tasks.json", {})
    if not cache.get(user_id):
        raise HTTPException(status_code=404, detail="No generated tasks found. Run /tasks/generate first.")
    profiles = read_json("profiles.json", {})
    payload = normalize_task_payload(cache[user_id], profiles.get(user_id, {}))
    cache[user_id] = payload
    write_json("generated_tasks.json", cache)
    return payload


@router.post("/tasks/complete")
def complete_task(body: TaskCompleteRequest, user_id: str = UserId):
    task_id = body.task_id
    rewards = read_json("rewards.json", {})
    current = rewards.get(user_id, {"points": 0, "streak": 0, "completed_tasks": 0, "level": "Operator I"})
    current["points"] = current.get("points", 0) + 40
    current["completed_tasks"] = current.get("completed_tasks", 0) + 1
    current["level"] = "Operator II" if current["points"] >= 400 else current.get("level", "Operator I")
    rewards[user_id] = current
    write_json("rewards.json", rewards)
    return {"completed": True, "task_id": task_id, "rewards": current}


def build_task_prompt(profile: dict, location: dict | None):
    categories = [
        ("housing", "housing agent: prioritize rent, deposit, room type, availability, commute, and source verification"),
        ("bank", "banking agent: prioritize annual fee, joining fee, APR/interest, forex, eligibility, purpose fit, and official issuer sources"),
        ("food", "food agent: prioritize dietary preference, cuisine, meal price evidence, hours, and distance"),
        ("health", "healthcare agent: prioritize the requested service, provider type, hours, phone, location, and urgent-care caveats"),
        ("sim", "connectivity agent: prioritize plan cost, data allowance, coverage, store location, and activation requirements"),
    ]
    return f"""
You are Liiminal's relocation task agent. Generate a practical action board for a person moving to a new city.

STRICT RULES:
- Act as a category specialist for each task: {categories}.
- Return ONLY valid JSON. No markdown.
- Do not hardcode generic advice.
- Use the profile values to personalize every task.
- Do not invent exact prices, ratings, phone numbers, rankings, or addresses.
- Use model knowledge to extract plausible named local leads. Do not return generic placeholders like "Apartment rental", "Shared accommodation", "Bank branch", or "Mobile provider".
- If the user needs PG/coliving, housing options must be named candidate leads such as Stanza Living, Zolo, HelloWorld, Colive, Your-Space, Settl, Housr, or local PG names if you know them.
- For each named lead, include "review_check" and "verification_query" fields. Do not invent exact review scores.
- The search_url is only a verification fallback and must be a Google search URL using https://www.google.com/search?q=...
- For PGs, food, commute, clinics, and banks, include review intent in the verification query, for example "{{option name}} {{locality}} {{city}} reviews".
- Do not invent review scores. Put "verify reviews in source" in comparison values when needed.
- Include icons as simple category emoji strings and image_url as either null or a favicon/logo URL from a source domain.
- Each task must have details and comparison_fields with consistent keys inside that task.
- Make tasks actionable for relocation, not mental-health-first.

PROFILE:
{json.dumps(profile, ensure_ascii=False)}

BROWSER LOCATION:
{json.dumps(location, ensure_ascii=False)}

Return JSON with this shape:
{{
  "summary": "one sentence",
  "source_policy": "how data was selected",
  "tasks": [
    {{
      "id": "short-kebab-id",
      "category": "Housing | Banking | SIM | Commute | Food | Documents | Healthcare | Safety | Mental Load",
      "title": "specific task title",
      "priority": 1,
      "icon": "🏦",
      "image_url": null,
      "why_now": "specific reason tied to profile/day/city",
      "search_url": "https://...",
      "source_type": "official | search-required | user-profile",
      "last_checked": "{date.today()}",
      "comparison_fields": ["same", "keys", "for", "options"],
      "options": [
        {{
          "name": "option name or search target",
          "values": {{"same": "value", "keys": "value", "for": "value", "options": "value"}},
          "fit_reason": "one precise line"
        }}
      ],
      "next_action": "one concrete action"
    }}
  ]
}}
"""


def normalize_task_payload(payload: dict, profile: dict):
    tasks = payload.get("tasks") or []
    for task in tasks:
        category = str(task.get("category", "")).lower()
        title = str(task.get("title", "")).lower()
        if "housing" in category or "housing" in title or "pg" in title:
            normalize_housing_task(task, profile)
        ensure_visual(task)
    payload["tasks"] = tasks
    payload["source_policy"] = payload.get("source_policy") or "LLM extracted named candidate leads from saved profile; verify live reviews before booking."
    return payload


def normalize_housing_task(task: dict, profile: dict):
    city = clean(profile.get("city")) or "your city"
    locality = clean(profile.get("locality")) or clean(profile.get("destination")) or city
    destination = clean(profile.get("destination")) or locality
    generic_names = {"apartment rental", "shared accommodation", "pg", "paying guest", "hostel", "coliving"}
    options = task.get("options") or []
    has_specific = any(not is_generic_option(option.get("name", ""), generic_names) for option in options)
    if has_specific:
        for option in options:
            enrich_housing_option(option, city, locality, destination)
    else:
        task["title"] = f"Shortlist named PGs near {destination}"
        task["why_now"] = f"You need verified stays near {destination}; start with named operators and review checks instead of generic housing categories."
        task["comparison_fields"] = ["lead_type", "area_match", "budget_signal", "review_check", "verification_query"]
        task["options"] = [
            housing_option("Stanza Living", city, locality, destination, "branded PG/coliving", "usually searchable by property pages and Google reviews"),
            housing_option("Zolo", city, locality, destination, "managed PG/coliving", "good candidate for student and early-career shortlists"),
            housing_option("HelloWorld", city, locality, destination, "managed coliving", "worth comparing for amenities and move-in rules"),
            housing_option("Colive", city, locality, destination, "coliving operator", "use if properties appear near your commute corridor"),
        ]
    task["search_url"] = google_url(f"best PG near {destination} {locality} {city} reviews Stanza Zolo HelloWorld Colive")
    task["source_type"] = "llm-extracted-candidates"
    task["image_url"] = task.get("image_url") or "https://www.google.com/s2/favicons?domain=stanzaliving.com&sz=128"
    task["next_action"] = f"Open each lead, reject anything without recent reviews, then call or WhatsApp only the top 2 near {destination}."


def housing_option(name: str, city: str, locality: str, destination: str, lead_type: str, fit: str):
    query = f"{name} PG near {destination} {locality} {city} reviews"
    return {
        "name": f"{name} near {destination}",
        "values": {
            "lead_type": lead_type,
            "area_match": f"Check properties around {locality} / {destination}",
            "budget_signal": "verify rent, deposit, meals, lock-in",
            "review_check": "verify recent Google reviews before visiting",
            "verification_query": query,
        },
        "fit_reason": fit,
    }


def enrich_housing_option(option: dict, city: str, locality: str, destination: str):
    name = clean(option.get("name")) or "Named PG lead"
    values = option.setdefault("values", {})
    values.setdefault("review_check", "verify recent Google reviews before visiting")
    values.setdefault("verification_query", f"{name} {locality} {city} reviews")
    values.setdefault("area_match", f"Check commute to {destination}")
    option["fit_reason"] = option.get("fit_reason") or f"Candidate lead to verify near {destination}."


def ensure_visual(task: dict):
    category = str(task.get("category", "")).lower()
    if task.get("image_url"):
        return
    domains = {
        "housing": "stanzaliving.com",
        "banking": "hdfcbank.com",
        "sim": "airtel.in",
        "commute": "uber.com",
        "food": "swiggy.com",
        "documents": "digilocker.gov.in",
        "healthcare": "practo.com",
        "safety": "maps.google.com",
    }
    domain = next((value for key, value in domains.items() if key in category), "google.com")
    task["image_url"] = f"https://www.google.com/s2/favicons?domain={domain}&sz=128"


def is_generic_option(name: str, generic_names: set[str]):
    normalized = clean(name).lower()
    return not normalized or normalized in generic_names or any(word in normalized for word in ["generic", "option"])


def clean(value):
    return str(value or "").strip()


def google_url(query: str):
    from urllib.parse import quote_plus

    return f"https://www.google.com/search?q={quote_plus(query)}"


def parse_json(raw: str):
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        text = text.replace("json\n", "", 1)
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("Groq did not return JSON")
    return json.loads(text[start:end + 1])
