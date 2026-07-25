from datetime import date

from fastapi import APIRouter

from app.db.local_store import read_json

router = APIRouter()


def phase_for_day(day_number: int):
    if day_number <= 14:
        return "Landing"
    if day_number <= 35:
        return "Reality"
    if day_number <= 65:
        return "Adjustment"
    return "Emerging"


@router.get("/dashboard/{user_id}")
def dashboard(user_id: str):
    # Local JSON files are the source of truth per spec. Supabase was previously
    # queried here too, but nothing in the app ever writes to that table (the
    # frontend never calls /transitions), so it always returned stale/hardcoded
    # fallback values (day_number=23, completed_tasks=0) and added a slow/flaky
    # network dependency on the demo's critical path. Removed.
    return local_dashboard(user_id)


@router.get("/rewards/{user_id}")
def rewards(user_id: str):
    rewards_state = read_json("rewards.json", {})
    return rewards_state.get(user_id, {
        "user_id": user_id,
        "points": 0,
        "streak": 0,
        "completed_tasks": 0,
        "level": "Operator I",
    })


def local_dashboard(user_id: str):
    profiles = read_json("profiles.json", {})
    transitions = read_json("transitions_local.json", {})
    rewards_state = read_json("rewards.json", {})
    profile = profiles.get(user_id) or None  # None (not {}) so the frontend's empty-state check works
    transition = transitions.get(user_id)
    day_number = 1
    if transition and transition.get("day_1_date"):
        day_number = max(1, min(90, (date.today() - date.fromisoformat(transition["day_1_date"])).days + 1))
    pending = []
    safe_profile = profile or {}
    if "need" in str(safe_profile.get("housingStatus", "")).lower() or "looking" in str(safe_profile.get("housingStatus", "")).lower():
        pending.append("Housing")
    if "need" in str(safe_profile.get("bankStatus", "")).lower():
        pending.append("Banking")
    if "need" in str(safe_profile.get("simStatus", "")).lower():
        pending.append("SIM")
    pending.extend(["Commute", "Documents"])

    return {
        "user_id": user_id,
        "transition": transition,
        "profile": profile,
        "day_number": day_number,
        "phase": phase_for_day(day_number),
        "checkins": [],
        "setup_progress": {
            "completed": rewards_state.get(user_id, {}).get("completed_tasks", 0),
            "total": 8,
            "percent": min(100, round((rewards_state.get(user_id, {}).get("completed_tasks", 0) / 8) * 100)),
        },
        "pending_priority_areas": list(dict.fromkeys(pending)),
        "rewards": rewards_state.get(user_id, {"points": 0, "streak": 0, "level": "Operator I"}),
    }
