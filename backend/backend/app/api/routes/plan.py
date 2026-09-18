from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.auth import UserId
from app.db.local_store import read_json

router = APIRouter()


def _money(value) -> int | None:
    if isinstance(value, (int, float)):
        return int(value)
    if not isinstance(value, str):
        return None
    digits = "".join(char for char in value if char.isdigit())
    return int(digits) if digits else None


@router.get("/plan")
def relocation_plan(user_id: str = UserId):
    profile = read_json("profiles.json", {}).get(user_id, {})
    task_state = read_json("generated_tasks.json", {})
    reward_state = read_json("rewards.json", {}).get(user_id, {})
    checkins = read_json("checkins.json", {})
    verified_state = read_json("verified_sources.json", {})

    tasks = task_state.get(user_id, task_state) if isinstance(task_state, dict) else {}
    tasks = tasks.get("tasks", []) if isinstance(tasks, dict) else tasks
    sources = verified_state.get(user_id, verified_state) if isinstance(verified_state, dict) else []
    entries = checkins.get(user_id, checkins) if isinstance(checkins, dict) else checkins
    budget = _money(profile.get("monthlyBudget"))
    pending = [task for task in tasks if isinstance(task, dict) and not task.get("completed")]
    verified_facts = []
    seen_sources = set()
    for source in sources:
        if not isinstance(source, dict) or not source.get("facts"):
            continue
        identity = (source.get("url"), source.get("category"), tuple(sorted(source.get("facts", {}).items())))
        if identity not in seen_sources:
            seen_sources.add(identity)
            verified_facts.append(source)

    blockers = []
    risks = []
    recommendations = []
    next_actions = []

    if not profile:
        blockers.append({"title": "Profile is incomplete", "impact": "high", "evidence": "No saved relocation profile was found."})
        next_actions.append("Complete onboarding so Liminal can calculate a personal plan")
    else:
        for key, label in (("housingStatus", "Housing"), ("bankStatus", "Banking"), ("simStatus", "Connectivity")):
            if "need" in str(profile.get(key, "")).lower():
                blockers.append({"title": f"{label} is unresolved", "impact": "high" if label == "Housing" else "medium", "evidence": f"Saved profile says: {profile.get(key)}"})
        if budget is not None and budget < 15000:
            risks.append({"title": "Tight monthly budget", "impact": "high", "evidence": f"Saved monthly budget is ₹{budget:,}; recurring credit-card balances may increase risk."})
            next_actions.append("Compare total move-in cost before considering credit products")
        if profile.get("destination") and not profile.get("destinationAddress"):
            risks.append({"title": "Destination address is not verified", "impact": "medium", "evidence": f"The profile has a destination name but no saved street address: {profile['destination']}"})
            next_actions.append("Confirm the university or workplace address before comparing distance")

    if pending:
        top = sorted(pending, key=lambda task: task.get("priority", 99))[0]
        next_actions.insert(0, top.get("next_action") or top.get("title", "Review your highest-priority task"))
    elif profile:
        next_actions.append("Run a live research search and verify one source")

    for source in verified_facts[:3]:
        if "example.com" in str(source.get("url", "")).lower():
            continue
        facts = source.get("facts", {})
        rent = _money(facts.get("rent"))
        if rent is not None and budget is not None:
            fit = "within saved budget" if rent <= budget else "above saved budget"
            recommendations.append({"option": source.get("url", "Verified source"), "score": 0.9 if rent <= budget else 0.45, "reasons": [f"verified {source.get('category', 'source')}", fit], "tradeoffs": ["Availability and terms may still change"], "next_action": "Recheck the source before committing"})

    if not recommendations and profile:
        recommendations.append({"option": "Live, evidence-backed shortlist", "score": 0.5, "reasons": ["uses your saved destination and preferences", "does not invent missing prices or availability"], "tradeoffs": ["A source must be verified before a decision is made"], "next_action": "Open Research and verify the best matching result"})

    mood = [entry.get("mood") for entry in entries[-3:] if isinstance(entry, dict) and isinstance(entry.get("mood"), (int, float))]
    if mood and sum(mood) / len(mood) <= 2:
        risks.append({"title": "Recent check-ins show low mood", "impact": "medium", "evidence": "The last three recorded mood scores average 2 or below; this is a support signal, not a diagnosis."})
        next_actions.append("Complete a check-in and use the Mind support flow before adding more tasks")

    completed = reward_state.get("completed_tasks", 0)
    total = max(len(tasks), 1)
    if blockers:
        summary = f"Start with {blockers[0]['title'].lower()}. {next_actions[0] if next_actions else 'Review your relocation tasks.'}"
    elif risks:
        summary = f"Your move is progressing, but {risks[0]['title'].lower()} needs attention."
    else:
        summary = "Your relocation plan is on track. Complete the next action and verify the supporting source."
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "summary": summary,
        "state": {"budget": budget, "completed_tasks": completed, "total_tasks": total, "verified_sources": len(verified_facts), "recent_mood": mood[-1] if mood else None},
        "blockers": blockers,
        "risks": risks,
        "recommendations": recommendations,
        "next_actions": list(dict.fromkeys(next_actions))[:5],
    }
